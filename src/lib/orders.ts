import { BookingStatus } from "@prisma/client";
import { sendBookingEmails } from "@/lib/email";
import { generateOrderPdf } from "@/lib/order-pdf";
import { prisma } from "@/lib/prisma";
import { loadSettings } from "@/lib/settings";

export function appOrigin(fallback?: string) {
  return (process.env.NEXT_PUBLIC_APP_URL ?? fallback ?? "").replace(/\/$/, "");
}

export type OrderPdfKind = "linge" | "ski";

export function orderDownloadPath(downloadToken: string, kind?: OrderPdfKind) {
  return `/api/bon-de-commande/${downloadToken}${kind ? `?type=${kind}` : ""}`;
}

export function parseOrderPdfKind(
  value: string | null,
): OrderPdfKind | undefined {
  return value === "linge" || value === "ski" ? value : undefined;
}

type OrderWithItems = NonNullable<Awaited<ReturnType<typeof loadOrderForPdf>>>;

function itemKind(item: OrderWithItems["items"][number]): OrderPdfKind {
  return item.product.category === "ski" ? "ski" : "linge";
}

/** Bons disponibles pour une commande (linge et/ou ski). */
export function orderPdfKinds(booking: {
  items: { product: { category: string } }[];
}): OrderPdfKind[] {
  const kinds = new Set(
    booking.items.map((i) => (i.product.category === "ski" ? "ski" : "linge")),
  );
  return (["linge", "ski"] as const).filter((k) => kinds.has(k));
}

export function orderPdfFilename(bookingId: string, kind?: OrderPdfKind) {
  return `bon-${kind === "ski" ? "ski-skiset" : kind === "linge" ? "linge" : "de-commande"}-${bookingId}.pdf`;
}

export async function loadOrderForPdf(
  where: { id: string } | { downloadToken: string },
) {
  return prisma.booking.findUnique({
    where,
    include: { items: { include: { product: true } } },
  });
}

export async function buildOrderPdf(
  booking: OrderWithItems,
  kind?: OrderPdfKind,
) {
  await loadSettings();
  const items = kind
    ? booking.items.filter((item) => itemKind(item) === kind)
    : booking.items;
  const totalCents = kind
    ? items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0)
    : booking.montantTotalCents;
  return generateOrderPdf({
    kind,
    bookingId: booking.id,
    createdAt: booking.createdAt,
    paidAt: booking.paidAt,
    clientNom: booking.clientNom,
    clientEmail: booking.clientEmail,
    clientTelephone: booking.clientTelephone,
    residence: booking.residence,
    propertyReference: booking.propertyReference,
    dateArrivee: booking.dateArrivee,
    dateDepart: booking.dateDepart,
    creneauLivraison: booking.creneauLivraison,
    totalCents,
    items: items.map((item) => ({
      code: item.product.code,
      name: item.product.name,
      quantity: item.quantity,
      unitPriceCents: item.unitPriceCents,
    })),
  });
}

/**
 * Appelé par les webhooks après paiement confirmé. Idempotent : un webhook
 * rejoué ne renvoie pas les emails.
 */
export async function confirmOrderPayment(params: {
  bookingId: string;
  paymentRef: string;
  provider: string;
}) {
  const updated = await prisma.booking.updateMany({
    where: { id: params.bookingId, status: BookingStatus.pending },
    data: {
      status: BookingStatus.paid,
      paidAt: new Date(),
      paymentProvider: params.provider,
      paymentRef: params.paymentRef,
    },
  });

  if (updated.count === 0) {
    return; // déjà traité ou inexistant
  }

  const booking = await loadOrderForPdf({ id: params.bookingId });
  if (!booking) return;

  const origin = appOrigin();
  const kinds = orderPdfKinds(booking);
  const documents = await Promise.all(
    kinds.map(async (kind) => ({
      kind,
      filename: orderPdfFilename(booking.id, kind),
      pdf: await buildOrderPdf(booking, kind),
      url: origin
        ? `${origin}${orderDownloadPath(booking.downloadToken, kind)}`
        : undefined,
    })),
  );

  await sendBookingEmails({
    bookingId: booking.id,
    audience: booking.targetAudience,
    clientNom: booking.clientNom,
    clientEmail: booking.clientEmail,
    clientTelephone: booking.clientTelephone,
    dateArrivee: booking.dateArrivee,
    dateDepart: booking.dateDepart,
    residence: booking.residence,
    propertyReference: booking.propertyReference,
    creneauLivraison: booking.creneauLivraison,
    totalCents: booking.montantTotalCents,
    items: booking.items.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      unitPriceCents: item.unitPriceCents,
    })),
    documents,
  });
}
