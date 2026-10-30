import { NextRequest, NextResponse } from "next/server";
import { confirmOrderPayment } from "@/lib/orders";
import { prisma } from "@/lib/prisma";
import {
  answerToEvent,
  fetchSystempayPaidEvent,
  verifySystempayHash,
} from "@/lib/payment/systempay-provider";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Retour navigateur après paiement Systempay (kr-post-url-success).
 * Vérifie la signature (clé HMAC) et confirme la commande : indispensable en
 * local où l'IPN ne peut pas joindre le site.
 */
export async function POST(request: NextRequest) {
  const success = request.nextUrl.searchParams.get("success");
  const cancel = request.nextUrl.searchParams.get("cancel") ?? "/commande";
  const origin = request.nextUrl.origin;
  const sameOrigin = (url: string | null) =>
    url && new URL(url, origin).origin === origin ? url : null;

  const form = await request.formData();
  const krAnswer = form.get("kr-answer");
  const krHash = form.get("kr-hash");

  if (
    typeof krAnswer !== "string" ||
    typeof krHash !== "string" ||
    !verifySystempayHash(krAnswer, krHash, "sha256_hmac")
  ) {
    console.error(
      "Retour Systempay : signature invalide (SYSTEMPAY_HMAC_KEY test/prod ?)",
      { hasHmacKey: Boolean(process.env.SYSTEMPAY_HMAC_KEY) },
    );
    // Repli : on retrouve la commande via le jeton du lien de succès, puis on
    // demande directement à Systempay (API authentifiée) si elle est payée.
    try {
      const ref = success
        ? new URL(success, origin).searchParams.get("ref")
        : null;
      const booking = ref
        ? await prisma.booking.findUnique({
            where: { downloadToken: ref },
            select: { id: true },
          })
        : null;
      if (booking) {
        const event = await fetchSystempayPaidEvent(booking.id);
        if (event.type === "paid") {
          await confirmOrderPayment({
            bookingId: event.bookingId,
            paymentRef: event.paymentRef,
            provider: "systempay",
          });
        }
      }
    } catch (error) {
      console.error("Confirmation par API Systempay impossible", error);
    }
    // Le client a pu payer : on ne le renvoie pas vers le formulaire.
    return NextResponse.redirect(
      new URL(sameOrigin(success) ?? "/reservation/success", origin),
      303,
    );
  }

  const event = answerToEvent(JSON.parse(krAnswer));
  if (event.type === "paid") {
    try {
      await confirmOrderPayment({
        bookingId: event.bookingId,
        paymentRef: event.paymentRef,
        provider: "systempay",
      });
    } catch (error) {
      console.error("Confirmation de commande (retour Systempay)", error);
    }
    return NextResponse.redirect(
      new URL(sameOrigin(success) ?? "/reservation/success", origin),
      303,
    );
  }

  return NextResponse.redirect(
    new URL(sameOrigin(cancel) ?? "/commande", origin),
    303,
  );
}
