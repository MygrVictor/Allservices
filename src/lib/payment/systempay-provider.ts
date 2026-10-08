import { createHmac, timingSafeEqual } from "crypto";
import type { PaymentProvider } from "./types";

/**
 * Systempay (Caisse d'Épargne / Banque Populaire) — API REST V4.
 * Création d'un ordre de paiement (page hébergée) via Charge/CreatePaymentOrder,
 * puis confirmation via l'IPN (kr-answer + kr-hash signé avec le mot de passe).
 *
 * Variables : SYSTEMPAY_USER, SYSTEMPAY_PASSWORD (test ou prod),
 * SYSTEMPAY_API_URL (défaut https://api.systempay.fr),
 * SYSTEMPAY_HMAC_KEY (vérification du retour navigateur, optionnel).
 */
function apiBase() {
  return (process.env.SYSTEMPAY_API_URL ?? "https://api.systempay.fr").replace(
    /\/$/,
    "",
  );
}

function authHeader() {
  const token = Buffer.from(
    `${process.env.SYSTEMPAY_USER}:${process.env.SYSTEMPAY_PASSWORD}`,
  ).toString("base64");
  return `Basic ${token}`;
}

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

/** Vérifie kr-hash : HMAC-SHA-256(kr-answer) avec le mot de passe (IPN) ou la clé HMAC (retour navigateur). */
export function verifySystempayHash(
  krAnswer: string,
  krHash: string,
  hashKey: "password" | "sha256_hmac",
) {
  const key =
    hashKey === "password"
      ? process.env.SYSTEMPAY_PASSWORD
      : process.env.SYSTEMPAY_HMAC_KEY;
  if (!key) return false;
  const expected = createHmac("sha256", key)
    .update(krAnswer, "utf8")
    .digest("hex");
  return safeEqual(expected, krHash);
}

type SystempayResponse<T> = {
  status: "SUCCESS" | "ERROR";
  answer: T & { errorCode?: string; errorMessage?: string };
};

export const systempayProvider: PaymentProvider = {
  id: "systempay",

  isConfigured() {
    return Boolean(
      process.env.SYSTEMPAY_USER && process.env.SYSTEMPAY_PASSWORD,
    );
  },

  async createCheckout(input) {
    if (!this.isConfigured()) {
      throw new Error(
        "Systempay non configuré (SYSTEMPAY_USER / SYSTEMPAY_PASSWORD).",
      );
    }

    const response = await fetch(
      `${apiBase()}/api-payment/V4/Charge/CreatePaymentOrder`,
      {
        method: "POST",
        headers: {
          Authorization: authHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: input.totalCents,
          currency: "EUR",
          orderId: input.bookingId,
          channelOptions: { channelType: "URL" },
          customer: {
            email: input.customerEmail,
            billingDetails: {
              firstName: input.customerFirstName,
              lastName: input.customerLastName || input.customerFirstName,
              language: "fr",
            },
          },
          paymentReceiptEmail: input.customerEmail,
          merchantComment: `Commande ${input.bookingId}`,
          ipnTargetUrl: input.notificationUrl,
          returnUrl: input.successUrl,
          dataCollectionForm: false,
          metadata: { bookingId: input.bookingId },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Systempay : création du paiement impossible (${response.status}).`,
      );
    }

    const data = (await response.json()) as SystempayResponse<{
      paymentOrderId?: string;
      paymentURL?: string;
    }>;
    if (data.status !== "SUCCESS" || !data.answer.paymentURL) {
      throw new Error(
        `Systempay : ${data.answer.errorCode ?? "?"} ${data.answer.errorMessage ?? ""}`.trim(),
      );
    }

    return {
      redirectUrl: data.answer.paymentURL,
      paymentRef: data.answer.paymentOrderId ?? input.bookingId,
    };
  },

  async parseWebhook(request) {
    const form = await request.formData();
    const krAnswer = form.get("kr-answer");
    const krHash = form.get("kr-hash");
    const krHashKey = form.get("kr-hash-key");
    const krHashAlgorithm = form.get("kr-hash-algorithm");

    if (
      typeof krAnswer !== "string" ||
      typeof krHash !== "string" ||
      krHashAlgorithm !== "sha256_hmac" ||
      (krHashKey !== "password" && krHashKey !== "sha256_hmac") ||
      !verifySystempayHash(krAnswer, krHash, krHashKey)
    ) {
      throw new Error("Signature Systempay (kr-hash) invalide.");
    }

    const answer = JSON.parse(krAnswer) as {
      orderStatus?: string;
      orderDetails?: { orderId?: string };
      transactions?: { uuid?: string; metadata?: Record<string, string> }[];
    };

    const tx = answer.transactions?.[0];
    const bookingId = answer.orderDetails?.orderId ?? tx?.metadata?.bookingId;

    if (answer.orderStatus === "PAID" && bookingId) {
      return { type: "paid", bookingId, paymentRef: tx?.uuid ?? bookingId };
    }
    return { type: "ignored" };
  },
};
