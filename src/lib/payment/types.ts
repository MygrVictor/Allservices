/**
 * Couche d'abstraction paiement : le reste de l'application ne dépend que de
 * cette interface. Le prestataire actif est choisi via PAYMENT_PROVIDER
 * ("stripe" par défaut, ou "payplug").
 */

export type PaymentLineItem = {
  name: string;
  description?: string;
  unitAmountCents: number;
  quantity: number;
};

export type CreateCheckoutInput = {
  bookingId: string;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  items: PaymentLineItem[];
  totalCents: number;
  successUrl: string;
  cancelUrl: string;
  notificationUrl: string;
};

export type CreateCheckoutResult = {
  /** URL de la page de paiement hébergée vers laquelle rediriger le client. */
  redirectUrl: string;
  /** Référence du paiement chez le prestataire. */
  paymentRef: string;
};

/** Événement normalisé issu d'un webhook, après vérification d'authenticité. */
export type PaymentWebhookEvent =
  | { type: "paid"; bookingId: string; paymentRef: string }
  | { type: "ignored" };

export interface PaymentProvider {
  readonly id: "stripe" | "payplug" | "systempay";
  isConfigured(): boolean;
  createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult>;
  /** Doit lever une erreur si la requête n'est pas authentique. */
  parseWebhook(request: Request): Promise<PaymentWebhookEvent>;
}
