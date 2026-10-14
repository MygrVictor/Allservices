import { NextRequest, NextResponse } from "next/server";
import { BookingStatus, Residence, TargetAudience } from "@prisma/client";
import { buildOrderLines } from "@/lib/checkout";
import { getPaymentProvider } from "@/lib/payment";
import { appOrigin } from "@/lib/orders";
import { prisma } from "@/lib/prisma";
import { loadSettings } from "@/lib/settings";
import { SITE } from "@/lib/site-config";
import { checkoutPayloadSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const provider = getPaymentProvider();
    if (!provider.isConfigured()) {
      return NextResponse.json(
        { error: "Le paiement en ligne n'est pas encore configuré." },
        { status: 503 },
      );
    }

    const parsed = checkoutPayloadSchema.safeParse(await request.json());
    await loadSettings();
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides." },
        { status: 400 },
      );
    }
    const payload = parsed.data;

    // Les prix viennent TOUJOURS du catalogue serveur, jamais du client.
    const order = buildOrderLines(payload);
    if (!order) {
      return NextResponse.json(
        { error: "Un produit de votre panier n'est pas disponible." },
        { status: 400 },
      );
    }
    const { lines, totalCents: total } = order;

    const creneau =
      payload.modeRecuperation === "livraison"
        ? `Livraison entre ${SITE.deliveryWindow} (créneau planifié par All Services)`
        : "Retrait en magasin pendant les heures d'ouverture";

    // Synchronise la fiche produit en base (nom/prix modifiés dans le back-office)
    for (const { product } of lines) {
      const data = {
        name: product.name,
        description: product.description,
        priceCents: product.priceCents,
        targetAudience: product.targetAudience as TargetAudience,
        category: product.category,
        isActive: product.active,
      };
      await prisma.product.upsert({
        where: { code: product.code },
        create: { code: product.code, ...data },
        update: data,
      });
    }

    const booking = await prisma.booking.create({
      data: {
        targetAudience: TargetAudience.vacancier,
        residence: payload.residence as Residence,
        propertyReference:
          payload.modeRecuperation === "livraison"
            ? payload.adresseLivraison
            : undefined,
        dateArrivee: new Date(payload.dateArrivee),
        dateDepart: new Date(payload.dateDepart),
        creneauLivraison: creneau,
        status: BookingStatus.pending,
        montantTotalCents: total,
        clientNom: payload.clientNom,
        clientEmail: payload.clientEmail,
        clientTelephone: payload.clientTelephone,
        notes: payload.notes,
        paymentProvider: provider.id,
        items: {
          create: lines.map(({ product, quantity }) => ({
            quantity,
            unitPriceCents: product.priceCents,
            product: { connect: { code: product.code } },
          })),
        },
      },
    });

    const origin = appOrigin(request.nextUrl.origin);
    const [firstName, ...rest] = payload.clientNom.split(" ");

    const checkout = await provider.createCheckout({
      bookingId: booking.id,
      customerEmail: payload.clientEmail,
      customerFirstName: firstName,
      customerLastName: rest.join(" "),
      totalCents: total,
      items: lines.map(({ product, quantity }) => ({
        name: product.name,
        description: product.description,
        unitAmountCents: product.priceCents,
        quantity,
      })),
      successUrl: `${origin}/reservation/success?ref=${booking.downloadToken}`,
      cancelUrl: `${origin}/commande?annule=1`,
      notificationUrl: `${origin}/api/payment/webhook/${provider.id}`,
    });

    await prisma.booking.update({
      where: { id: booking.id },
      data: { paymentRef: checkout.paymentRef },
    });

    return NextResponse.json({ url: checkout.redirectUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur interne lors de la création du paiement." },
      { status: 500 },
    );
  }
}
