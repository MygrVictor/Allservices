import { BookingStatus } from "@prisma/client";
import { sendBookingEmails } from "@/lib/email";
import { generateOrderPdf } from "@/lib/order-pdf";
import { prisma } from "@/lib/prisma";

export function appOrigin(fallback?: string) {
  return (process.env.NEXT_PUBLIC_APP_URL ?? fallback ?? "").replace(/\/$/, "");
}

export function orderDownloadPath(downloadToken: string) {
  return `/api/bon-de-commande/${downloadToken}`;
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
  booking: NonNullable<Awaited<ReturnType<typeof loadOrderForPdf>>>,
) {
  return generateOrderPdf({
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
    totalCents: booking.montantTotalCents,
    items: booking.items.map((item) => ({
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

  const pdf = await buildOrderPdf(booking);
  const origin = appOrigin();

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
    pdf,
    downloadUrl: origin
      ? `${origin}${orderDownloadPath(booking.downloadToken)}`
      : undefined,
  });
}
