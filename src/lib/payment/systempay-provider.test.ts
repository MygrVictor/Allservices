import { createHmac } from "node:crypto";
import { beforeEach, describe, expect, it } from "vitest";
import {
  answerToEvent,
  systempayProvider,
  verifySystempayHash,
} from "@/lib/payment/systempay-provider";

const PASSWORD = "testpassword_unit";
const HMAC_KEY = "hmac_unit_key";
const sign = (body: string, key: string) =>
  createHmac("sha256", key).update(body, "utf8").digest("hex");

const paidAnswer = JSON.stringify({
  orderStatus: "PAID",
  orderDetails: { orderId: "booking_123" },
  transactions: [{ uuid: "tx_abc" }],
});

function ipnRequest(fields: Record<string, string>) {
  const body = new FormData();
  for (const [k, v] of Object.entries(fields)) body.set(k, v);
  return new Request("http://localhost/api/payment/webhook/systempay", {
    method: "POST",
    body,
  });
}

beforeEach(() => {
  process.env.SYSTEMPAY_PASSWORD = PASSWORD;
  process.env.SYSTEMPAY_HMAC_KEY = HMAC_KEY;
});

describe("Signature Systempay", () => {
  it("accepte une signature valide (mot de passe et clé HMAC)", () => {
    expect(
      verifySystempayHash(paidAnswer, sign(paidAnswer, PASSWORD), "password"),
    ).toBe(true);
    expect(
      verifySystempayHash(
        paidAnswer,
        sign(paidAnswer, HMAC_KEY),
        "sha256_hmac",
      ),
    ).toBe(true);
  });

  it("rejette une signature faite avec une autre clé", () => {
    expect(
      verifySystempayHash(paidAnswer, sign(paidAnswer, "pirate"), "password"),
    ).toBe(false);
  });

  it("rejette un contenu modifié après signature", () => {
    const hash = sign(paidAnswer, PASSWORD);
    const tampered = paidAnswer.replace("booking_123", "booking_999");
    expect(verifySystempayHash(tampered, hash, "password")).toBe(false);
  });

  it("rejette si la clé n'est pas configurée", () => {
    delete process.env.SYSTEMPAY_HMAC_KEY;
    expect(
      verifySystempayHash(paidAnswer, sign(paidAnswer, ""), "sha256_hmac"),
    ).toBe(false);
  });
});

describe("Notification serveur (IPN) Systempay", () => {
  it("confirme un paiement correctement signé", async () => {
    const event = await systempayProvider.parseWebhook(
      ipnRequest({
        "kr-answer": paidAnswer,
        "kr-hash": sign(paidAnswer, PASSWORD),
        "kr-hash-key": "password",
        "kr-hash-algorithm": "sha256_hmac",
      }),
    );
    expect(event).toEqual({
      type: "paid",
      bookingId: "booking_123",
      paymentRef: "tx_abc",
    });
  });

  it("lève une erreur sur une fausse notification", async () => {
    await expect(
      systempayProvider.parseWebhook(
        ipnRequest({
          "kr-answer": paidAnswer,
          "kr-hash": "0".repeat(64),
          "kr-hash-key": "password",
          "kr-hash-algorithm": "sha256_hmac",
        }),
      ),
    ).rejects.toThrow();
  });

  it("lève une erreur si la signature est absente", async () => {
    await expect(
      systempayProvider.parseWebhook(ipnRequest({ "kr-answer": paidAnswer })),
    ).rejects.toThrow();
  });
});

describe("answerToEvent", () => {
  it("ignore un paiement refusé", () => {
    expect(
      answerToEvent({ orderStatus: "UNPAID", orderDetails: { orderId: "b1" } })
        .type,
    ).toBe("ignored");
  });

  it("ignore un paiement sans référence de commande", () => {
    expect(answerToEvent({ orderStatus: "PAID" }).type).toBe("ignored");
  });
});
