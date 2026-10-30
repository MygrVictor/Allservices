import { createHmac, timingSafeEqual } from "crypto";
import type { PaymentProvider } from "./types";

/**
 * Systempay (Caisse d'Épargne / Banque Populaire) — API REST V4.
 * Création d'un formToken via Charge/CreatePayment, affiché dans le formulaire
 * embarqué (page /paiement), puis confirmation via le retour navigateur
 * (/api/payment/return/systempay) et l'IPN (kr-answer + kr-hash).
 *
 * Variables : SYSTEMPAY_USER, SYSTEMPAY_PASSWORD (test ou prod),
 * NEXT_PUBLIC_SYSTEMPAY_PUBLIC_KEY (clé publique JavaScript),
 * SYSTEMPAY_API_URL (défaut https://api.systempay.fr),
 * SYSTEMPAY_HMAC_KEY (vérification du retour navigateur).
 */
function apiBase() {
  const raw = (process.env.SYSTEMPAY_API_URL ?? "")
    .trim()
    .replace(/^["']|["']$/g, "");
  try {
    // Ne garde que l'origine : ignore tout chemin saisi par erreur.
    return new URL(raw || "https://api.systempay.fr").origin;
  } catch {
    return "https://api.systempay.fr";
  }
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
      process.env.SYSTEMPAY_USER &&
      process.env.SYSTEMPAY_PASSWORD &&
      process.env.NEXT_PUBLIC_SYSTEMPAY_PUBLIC_KEY,
    );
  },

  async createCheckout(input) {
    if (!this.isConfigured()) {
      throw new Error(
        "Systempay non configuré (SYSTEMPAY_USER / SYSTEMPAY_PASSWORD).",
      );
    }

    const response = await fetch(
      `${apiBase()}/api-payment/V4/Charge/CreatePayment`,
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
          customer: {
            email: input.customerEmail,
            reference: input.bookingId,
            billingDetails: {
              firstName: input.customerFirstName,
              lastName: input.customerLastName || input.customerFirstName,
              language: "fr",
            },
          },
          ipnTargetUrl: input.notificationUrl,
          metadata: { bookingId: input.bookingId },
        }),
      },
    );

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(
        `Systempay : création du paiement impossible (${response.status}) sur ${apiBase()} : ${body.slice(0, 300)}`,
      );
    }

    const data = (await response.json()) as SystempayResponse<{
      formToken?: string;
    }>;
    if (data.status !== "SUCCESS" || !data.answer.formToken) {
      throw new Error(
        `Systempay : ${data.answer.errorCode ?? "?"} ${data.answer.errorMessage ?? ""}`.trim(),
      );
    }

    // Page interne affichant le formulaire de carte Systempay.
    const origin = new URL(input.successUrl).origin;
    const params = new URLSearchParams({
      formToken: data.answer.formToken,
      success: input.successUrl,
      cancel: input.cancelUrl,
      amount: String(input.totalCents),
    });
    return {
      redirectUrl: `${origin}/paiement?${params.toString()}`,
      paymentRef: `systempay_${input.bookingId}`,
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

    const answer = JSON.parse(krAnswer) as SystempayAnswer;
    return answerToEvent(answer);
  },
};

type SystempayAnswer = {
  orderStatus?: string;
  orderDetails?: { orderId?: string };
  transactions?: { uuid?: string; metadata?: Record<string, string> }[];
};

export function answerToEvent(answer: SystempayAnswer) {
  const tx = answer.transactions?.[0];
  const bookingId = answer.orderDetails?.orderId ?? tx?.metadata?.bookingId;
  if (answer.orderStatus === "PAID" && bookingId) {
    return {
      type: "paid" as const,
      bookingId,
      paymentRef: tx?.uuid ?? bookingId,
    };
  }
  return { type: "ignored" as const, bookingId };
}
