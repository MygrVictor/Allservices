"use client";

import { useEffect, useState } from "react";
import { CatalogProduct, formatEuros } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/locale-provider";
import { makeT } from "@/lib/i18n";

type CartItem = CatalogProduct & { quantity: number };

export function CartDrawer({
  items,
  onAddItem,
  onRemoveItem,
  checkoutHref = "#reserver",
}: {
  items: CartItem[];
  onAddItem: (code: string) => void;
  onRemoveItem: (code: string) => void;
  checkoutHref?: string;
}) {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const t = makeT(locale);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0,
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Bouton panier flottant en haut à droite */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-4 top-20 z-40 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 font-bold text-ardoise shadow-xl transition-colors hover:bg-accent-dark"
        aria-label={t(
          `Ouvrir le panier (${count} article${count > 1 ? "s" : ""})`,
          `Open basket (${count} item${count > 1 ? "s" : ""})`,
        )}
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path
            d="M3 4h2l2.2 11h10.6L20 7H6.2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="19.5" r="1.4" fill="currentColor" />
          <circle cx="17" cy="19.5" r="1.4" fill="currentColor" />
        </svg>
        {t("Panier", "Basket")}
        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-ardoise px-1.5 text-xs text-white">
          {count}
        </span>
      </button>

      {/* Fond assombri */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-50 bg-black/40 transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Tiroir latéral */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t("Mon panier", "My basket")}
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <h2 className="text-xl font-bold text-ardoise">
            {t("Mon panier", "My basket")}
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-xl text-slate-600 hover:bg-slate-100"
            aria-label={t("Fermer le panier", "Close basket")}
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <p className="text-sm text-slate-600">
              {t(
                "Votre panier est vide. Ajoutez des produits avec le bouton « + ».",
                "Your basket is empty. Add products with the “+” button.",
              )}
            </p>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.code}
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ardoise">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-600">
                      {formatEuros(item.priceCents, locale)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.code)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-300"
                      aria-label={t(
                        `Retirer ${item.name}`,
                        `Remove ${item.name}`,
                      )}
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-semibold text-ardoise">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onAddItem(item.code)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent text-sm font-bold text-ardoise hover:bg-accent-dark"
                      aria-label={t(`Ajouter ${item.name}`, `Add ${item.name}`)}
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-slate-200 p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-semibold text-ardoise">Total</span>
            <span className="text-2xl font-bold text-ardoise">
              {formatEuros(total, locale)}
            </span>
          </div>
          <a
            href={checkoutHref}
            onClick={() => setOpen(false)}
            aria-disabled={items.length === 0}
            className={cn(
              "block rounded-full px-5 py-3 text-center font-bold",
              items.length === 0
                ? "pointer-events-none bg-slate-200 text-slate-500"
                : "bg-primary text-white hover:bg-primary-dark",
            )}
          >
            {t("Valider mon panier", "Confirm my basket")}
          </a>
        </div>
      </aside>
    </>
  );
}
