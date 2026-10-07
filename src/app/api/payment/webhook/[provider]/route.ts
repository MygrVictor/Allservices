import { NextRequest, NextResponse } from "next/server";
import { getPaymentProviderById } from "@/lib/payment";
import { confirmOrderPayment } from "@/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Webhook générique : /api/payment/webhook/stripe ou /api/payment/webhook/payplug */
export async function POST(
  request: NextRequest,
  { params }: { params: { provider: string } },
) {
  const provider = getPaymentProviderById(params.provider);
  if (!provider) {
    return NextResponse.json(
      { error: "Prestataire inconnu." },
      { status: 404 },
    );
  }

  let event;
  try {
    event = await provider.parseWebhook(request);
  } catch (error) {
    console.error(`Webhook ${provider.id} invalide`, error);
    return NextResponse.json({ error: "Webhook invalide." }, { status: 400 });
  }

  if (event.type === "paid") {
    try {
      await confirmOrderPayment({
        bookingId: event.bookingId,
        paymentRef: event.paymentRef,
        provider: provider.id,
      });
    } catch (error) {
      console.error("Erreur lors de la confirmation de commande", error);
      // 500 => le prestataire rejouera la notification
      return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
