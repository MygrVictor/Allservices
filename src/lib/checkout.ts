import {
  DELIVERY_PRODUCT_CODE,
  PRODUCTS,
  isOrderable,
  clampSkiDays,
  stayDays,
  unitPriceForItem,
  type CatalogProduct,
} from "@/lib/catalog";
import type { CheckoutPayload } from "@/lib/validation";

export type CartLine = {
  product: CatalogProduct;
  quantity: number;
  /** Jours de location de ski (lignes ski uniquement). */
  rentalDays?: number;
  /** Prix unitaire pour la durée du séjour (supplément jours inclus). */
  unitPriceCents: number;
};

/**
 * Construit les lignes de commande et le total À PARTIR DU CATALOGUE SERVEUR.
 * Les prix envoyés par le navigateur ne sont jamais utilisés.
 * Renvoie null si un produit n'est pas commandable.
 */
export function buildOrderLines(
  payload: Pick<CheckoutPayload, "items" | "residence" | "modeRecuperation"> &
    Partial<Pick<CheckoutPayload, "dateArrivee" | "dateDepart">>,
  catalog: CatalogProduct[] = PRODUCTS,
): { lines: CartLine[]; totalCents: number } | null {
  const catalogMap = new Map(catalog.map((p) => [p.code, p]));
  const lines: CartLine[] = [];
  const days = stayDays(payload.dateArrivee, payload.dateDepart);

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
    const rentalDays =
      product.category === "ski" ? clampSkiDays(item.rentalDays) : undefined;
    lines.push({
      product,
      quantity: item.quantity,
      rentalDays,
      unitPriceCents: unitPriceForItem({ ...product, rentalDays }, days),
    });
  }

  if (payload.modeRecuperation === "livraison") {
    const delivery = catalogMap.get(DELIVERY_PRODUCT_CODE);
    if (delivery) {
      lines.push({
        product: delivery,
        quantity: 1,
        unitPriceCents: delivery.priceCents,
      });
    }
  }

  const totalCents = lines.reduce(
    (sum, line) => sum + line.unitPriceCents * line.quantity,
    0,
  );
  return { lines, totalCents };
}
