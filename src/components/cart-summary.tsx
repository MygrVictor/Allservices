"use client";

import { CatalogProduct, formatEuros } from "@/lib/catalog";
import { cn } from "@/lib/utils";

type CartItem = CatalogProduct & { quantity: number };

export function CartSummary({
  items,
  onAddItem,
  onRemoveItem,
  className,
}: {
  items: CartItem[];
  onAddItem: (code: string) => void;
  onRemoveItem: (code: string) => void;
  className?: string;
}) {
  const total = items.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0,
  );

  return (
    <div
      className={cn(
        "rounded-panel border-2 border-accent/70 bg-gradient-to-br from-accent/8 to-accent/5 p-6 shadow-lg",
        className,
      )}
    >
      <h2 className="mb-4 text-xl font-bold text-ardoise">Mon panier</h2>

      {items.length === 0 ? (
        <p className="text-sm text-slate-600">
          Votre panier est vide. Ajoutez des produits pour commencer.
        </p>
      ) : (
        <>
          <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.code}
                className="flex items-center justify-between rounded-lg bg-white/50 p-3"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ardoise">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-600">
                    {formatEuros(item.priceCents)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRemoveItem(item.code)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-300 transition-colors"
                    aria-label={`Retirer ${item.name}`}
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm font-semibold text-ardoise">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onAddItem(item.code)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent text-sm font-bold text-ardoise hover:bg-accent-dark transition-colors"
                    aria-label={`Ajouter ${item.name}`}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-accent/20 pt-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-ardoise">Total</span>
              <span className="text-2xl font-bold text-accent">
                {formatEuros(total)}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
