"use client";

import { useCart } from "@/components/cart-provider";
import { useLocale } from "@/components/locale-provider";
import {
  SKI_DEFAULT_DAYS,
  SKI_MAX_DAYS,
  SKI_MIN_DAYS,
  formatEuros,
  skiPriceForDays,
} from "@/lib/catalog";
import { makeT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Choix du nombre de jours de location de ski d'un pack (1 à 14 jours). */
export function SkiDaysStepper({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  const { skiDays, setSkiDays } = useCart();
  const t = makeT(useLocale());
  const days = skiDays[code] ?? SKI_DEFAULT_DAYS;
  const set = (value: number) => setSkiDays(code, value);
  return (
    <div
      className={cn("inline-flex items-center gap-2 text-sm", className)}
      role="group"
      aria-label={t("Nombre de jours de ski", "Number of ski days")}
    >
      <button
        type="button"
        onClick={() => set(days - 1)}
        disabled={days <= SKI_MIN_DAYS}
        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-700 hover:bg-slate-300 disabled:opacity-40"
        aria-label={t("Un jour de moins", "One day less")}
      >
        −
      </button>
      <span className="min-w-[4.5rem] text-center font-semibold text-ardoise">
        {days} {t(days > 1 ? "jours" : "jour", days > 1 ? "days" : "day")}
      </span>
      <button
        type="button"
        onClick={() => set(days + 1)}
        disabled={days >= SKI_MAX_DAYS}
        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent font-bold text-ardoise hover:bg-accent-dark disabled:opacity-40"
        aria-label={t("Un jour de plus", "One day more")}
      >
        +
      </button>
    </div>
  );
}

/** Bloc prix d'une carte pack : durée au choix, prix du pack et prix / jour. */
export function SkiPackPricing({
  code,
  priceCents,
}: {
  code: string;
  priceCents: number;
}) {
  const { skiDays } = useCart();
  const locale = useLocale();
  const t = makeT(locale);
  const days = skiDays[code] ?? SKI_DEFAULT_DAYS;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-700">
          {t("Durée de location", "Rental duration")}
        </span>
        <SkiDaysStepper code={code} />
      </div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-2xl font-bold text-accent">
          {formatEuros(skiPriceForDays(priceCents, days), locale)}
        </span>
        <span className="text-xs text-slate-600">
          {t("soit", "i.e.")}{" "}
          {formatEuros(skiPriceForDays(priceCents, 1), locale)} /{" "}
          {t("jour", "day")}
        </span>
      </div>
    </div>
  );
}
