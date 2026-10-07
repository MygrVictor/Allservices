import type { PaymentProvider } from "./types";

/**
 * PayPlug (solution proposée par la Caisse d'Épargne).
 * API REST : https://docs.payplug.com/api/
 * Variables : PAYPLUG_SECRET_KEY (sk_test_… / sk_live_…), PAYPLUG_API_VERSION.
 *
 * Sécurité webhook : PayPlug n'envoie pas de signature ; on ne fait donc PAS
 * confiance au corps de la notification et on relit le paiement via l'API.
 */
const API_BASE = "https://api.payplug.com/v1";

type PayplugPayment = {
  id: string;
  is_paid: boolean;
  metadata?: Record<string, string>;
  hosted_payment?: { payment_url?: string };
};

function headers() {
  return {
    Authorization: `Bearer ${process.env.PAYPLUG_SECRET_KEY}`,
    "Content-Type": "application/json",
    "PayPlug-Version": process.env.PAYPLUG_API_VERSION ?? "2019-08-06",
  };
}

export const payplugProvider: PaymentProvider = {
  id: "payplug",

  isConfigured() {
    return Boolean(process.env.PAYPLUG_SECRET_KEY);
  },

  async createCheckout(input) {
    if (!this.isConfigured()) {
      throw new Error("PayPlug non configuré (PAYPLUG_SECRET_KEY manquant).");
    }

    const response = await fetch(`${API_BASE}/payments`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        amount: input.totalCents,
        currency: "EUR",
        billing: {
          email: input.customerEmail,
          first_name: input.customerFirstName,
          last_name: input.customerLastName || input.customerFirstName,
          language: "fr",
        },
        shipping: { delivery_type: "OTHER" },
        hosted_payment: {
          return_url: input.successUrl,
          cancel_url: input.cancelUrl,
        },
        notification_url: input.notificationUrl,
        metadata: { bookingId: input.bookingId },
      }),
    });

    if (!response.ok) {
      throw new Error(
        `PayPlug : création du paiement impossible (${response.status}).`,
      );
    }

    const payment = (await response.json()) as PayplugPayment;
    const url = payment.hosted_payment?.payment_url;
    if (!url) {
      throw new Error("PayPlug n'a pas renvoyé d'URL de paiement.");
    }

    return { redirectUrl: url, paymentRef: payment.id };
  },

  async parseWebhook(request) {
    const notification = (await request.json()) as {
      id?: string;
      object?: string;
    };
    if (notification.object !== "payment" || !notification.id) {
      return { type: "ignored" };
    }

    // Relecture du paiement auprès de PayPlug (source de vérité)
    const response = await fetch(
      `${API_BASE}/payments/${encodeURIComponent(notification.id)}`,
      { headers: headers(), cache: "no-store" },
    );
    if (!response.ok) {
      throw new Error("Paiement PayPlug introuvable.");
    }
    const payment = (await response.json()) as PayplugPayment;
    const bookingId = payment.metadata?.bookingId;

    if (payment.is_paid && bookingId) {
      return { type: "paid", bookingId, paymentRef: payment.id };
    }
    return { type: "ignored" };
  },
};
