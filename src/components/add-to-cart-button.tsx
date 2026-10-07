"use client";

import { useCart } from "@/components/cart-provider";
import { useLocale } from "@/components/locale-provider";
import { makeT } from "@/lib/i18n";

export function AddToCartButton({
  code,
  label,
  disabled,
}: {
  code: string;
  label: string;
  disabled?: boolean;
}) {
  const { add } = useCart();
  const t = makeT(useLocale());
  return (
    <button
      type="button"
      onClick={() => !disabled && add(code)}
      disabled={disabled}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-base font-bold transition-colors ${
        disabled
          ? "cursor-not-allowed bg-slate-200 text-slate-400"
          : "bg-accent text-ardoise hover:bg-accent-dark"
      }`}
      aria-label={t(`Ajouter ${label} au panier`, `Add ${label} to basket`)}
    >
      +
    </button>
  );
}
