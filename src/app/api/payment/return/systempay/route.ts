import { NextRequest, NextResponse } from "next/server";
import { confirmOrderPayment } from "@/lib/orders";
import {
  answerToEvent,
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
    console.error("Retour Systempay : signature invalide");
    return NextResponse.redirect(
      new URL(sameOrigin(cancel) ?? "/commande", origin),
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
