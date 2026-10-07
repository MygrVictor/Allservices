"use client";

import { CartDrawer } from "@/components/cart-drawer";
import { useCart } from "@/components/cart-provider";

/** Bouton panier + tiroir, branché sur le panier partagé. */
export function SiteCart() {
  const { items, add, remove } = useCart();
  return (
    <CartDrawer
      items={items}
      onAddItem={add}
      onRemoveItem={remove}
      checkoutHref="/commande"
    />
  );
}
