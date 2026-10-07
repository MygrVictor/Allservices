import { NextRequest } from "next/server";
import { POST as handleProviderWebhook } from "@/app/api/payment/webhook/[provider]/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Ancienne URL de webhook Stripe, conservée pour compatibilité avec la
 * configuration existante du Dashboard Stripe.
 * Nouvelle URL recommandée : /api/payment/webhook/stripe
 */
export async function POST(request: NextRequest) {
  return handleProviderWebhook(request, { params: { provider: "stripe" } });
}
