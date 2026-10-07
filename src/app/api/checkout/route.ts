import { NextRequest, NextResponse } from "next/server";
import { BookingStatus, Residence, TargetAudience } from "@prisma/client";
import {
  DELIVERY_PRODUCT_CODE,
  PRODUCTS,
  isOrderable,
  type CatalogProduct,
} from "@/lib/catalog";
import { getPaymentProvider } from "@/lib/payment";
import { appOrigin } from "@/lib/orders";
import { prisma } from "@/lib/prisma";
import { SITE, isSiteInStandby } from "@/lib/site-config";
import { checkoutPayloadSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    if (isSiteInStandby()) {
      return NextResponse.json(
        { error: "Le paiement en ligne est désactivé hors saison." },
        { status: 403 },
      );
    }

    const provider = getPaymentProvider();
    if (!provider.isConfigured()) {
      return NextResponse.json(
        { error: "Le paiement en ligne n'est pas encore configuré." },
        { status: 503 },
      );
    }

    const parsed = checkoutPayloadSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides." },
        { status: 400 },
      );
    }
    const payload = parsed.data;

    // Les prix viennent TOUJOURS du catalogue serveur, jamais du client.
    const catalogMap = new Map(PRODUCTS.map((p) => [p.code, p]));
    const lines: { product: CatalogProduct; quantity: number }[] = [];
    for (const item of payload.items) {
      const product = catalogMap.get(item.productCode);
      if (
        !product ||
        product.targetAudience !== "vacancier" ||
        product.category === "livraison" || // ajoutée automatiquement
        !isOrderable(product) ||
        (product.residence && product.residence !== payload.residence)
      ) {
        return NextResponse.json(
          { error: "Un produit de votre panier n'est pas disponible." },
          { status: 400 },
        );
      }
      lines.push({ product, quantity: item.quantity });
    }

    if (payload.modeRecuperation === "livraison") {
      const delivery = catalogMap.get(DELIVERY_PRODUCT_CODE);
      if (delivery) lines.push({ product: delivery, quantity: 1 });
    }

    const total = lines.reduce(
      (sum, line) => sum + line.product.priceCents * line.quantity,
      0,
    );

    const creneau =
      payload.modeRecuperation === "livraison"
        ? `Livraison entre ${SITE.deliveryWindow} (créneau planifié par All Services)`
        : "Retrait en magasin pendant les heures d'ouverture";

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
            product: {
              connectOrCreate: {
                where: { code: product.code },
                create: {
                  code: product.code,
                  name: product.name,
                  description: product.description,
                  priceCents: product.priceCents,
                  targetAudience: product.targetAudience as TargetAudience,
                  category: product.category,
                  isActive: product.active,
                },
              },
            },
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
