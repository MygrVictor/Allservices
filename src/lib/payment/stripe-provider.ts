import { getStripeClient } from "@/lib/stripe";
import type { PaymentProvider } from "./types";

export const stripeProvider: PaymentProvider = {
  id: "stripe",

  isConfigured() {
    return Boolean(
      process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET,
    );
  },

  async createCheckout(input) {
    const stripe = getStripeClient();
    if (!stripe) {
      throw new Error("Stripe non configuré (STRIPE_SECRET_KEY manquant).");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: input.customerEmail,
      locale: "fr",
      metadata: { bookingId: input.bookingId },
      payment_intent_data: { metadata: { bookingId: input.bookingId } },
      line_items: input.items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "eur",
          unit_amount: item.unitAmountCents,
          product_data: {
            name: item.name,
            ...(item.description ? { description: item.description } : {}),
          },
        },
      })),
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
    });

    if (!session.url) {
      throw new Error("Stripe n'a pas renvoyé d'URL de paiement.");
    }

    return { redirectUrl: session.url, paymentRef: session.id };
  },

  async parseWebhook(request) {
    const stripe = getStripeClient();
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    const signature = request.headers.get("stripe-signature");
    if (!stripe || !secret || !signature) {
      throw new Error("Configuration webhook Stripe manquante.");
    }

    const body = await request.text();
    const event = stripe.webhooks.constructEvent(body, signature, secret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;
      if (bookingId && session.payment_status === "paid") {
        return { type: "paid", bookingId, paymentRef: session.id };
      }
    }

    return { type: "ignored" };
  },
};
