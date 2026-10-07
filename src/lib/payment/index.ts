import { payplugProvider } from "./payplug-provider";
import { stripeProvider } from "./stripe-provider";
import type { PaymentProvider } from "./types";

export type { PaymentProvider } from "./types";

const providers: Record<string, PaymentProvider> = {
  stripe: stripeProvider,
  payplug: payplugProvider,
};

/** Prestataire actif, choisi par la variable PAYMENT_PROVIDER (défaut : stripe). */
export function getPaymentProvider(): PaymentProvider {
  const id = (process.env.PAYMENT_PROVIDER ?? "stripe").toLowerCase();
  const provider = providers[id];
  if (!provider) {
    throw new Error(`PAYMENT_PROVIDER inconnu : « ${id} » (stripe | payplug).`);
  }
  return provider;
}

export function getPaymentProviderById(id: string): PaymentProvider | null {
  return providers[id.toLowerCase()] ?? null;
}
