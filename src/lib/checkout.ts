import {
  DELIVERY_PRODUCT_CODE,
  PRODUCTS,
  isOrderable,
  type CatalogProduct,
} from "@/lib/catalog";
import type { CheckoutPayload } from "@/lib/validation";

export type CartLine = { product: CatalogProduct; quantity: number };

/**
 * Construit les lignes de commande et le total À PARTIR DU CATALOGUE SERVEUR.
 * Les prix envoyés par le navigateur ne sont jamais utilisés.
 * Renvoie null si un produit n'est pas commandable.
 */
export function buildOrderLines(
  payload: Pick<CheckoutPayload, "items" | "residence" | "modeRecuperation">,
  catalog: CatalogProduct[] = PRODUCTS,
): { lines: CartLine[]; totalCents: number } | null {
  const catalogMap = new Map(catalog.map((p) => [p.code, p]));
  const lines: CartLine[] = [];

  for (const item of payload.items) {
    const product = catalogMap.get(item.productCode);
    if (
      !product ||
      product.targetAudience !== "vacancier" ||
      product.category === "livraison" || // ajoutée automatiquement
      !isOrderable(product) ||
      (product.residence && product.residence !== payload.residence)
    ) {
      return null;
    }
    lines.push({ product, quantity: item.quantity });
  }

  if (payload.modeRecuperation === "livraison") {
    const delivery = catalogMap.get(DELIVERY_PRODUCT_CODE);
    if (delivery) lines.push({ product: delivery, quantity: 1 });
  }

  const totalCents = lines.reduce(
    (sum, line) => sum + line.product.priceCents * line.quantity,
    0,
  );
  return { lines, totalCents };
}
