import { PRODUCTS, type CatalogProduct } from "@/lib/catalog";
import { SITE } from "@/lib/site-config";

/** Réglages éditables depuis le back-office (utilisable client et serveur). */
export type PriceOverride = { priceCents: number; active: boolean };

export type SiteSettings = {
  /** Ancien format (tarifs seuls), conservé pour compatibilité. */
  prices: Record<string, PriceOverride>;
  /** Catalogue complet géré depuis le back-office (prioritaire sur prices). */
  catalog: CatalogProduct[];
  hours: {
    openingHours: string;
    openingHoursEn: string;
    deliveryWindow: string;
    deliveryWindowEn: string;
  };
};

// Valeurs d'origine (code) pour pouvoir réappliquer proprement.
const DEFAULT_PRODUCTS = PRODUCTS.map((p) => ({ ...p }));
const DEFAULT_HOURS = {
  openingHours: SITE.openingHours,
  openingHoursEn: SITE.openingHoursEn,
  deliveryWindow: SITE.deliveryWindow,
  deliveryWindowEn: SITE.deliveryWindowEn,
};

export function defaultSettings(): SiteSettings {
  return {
    prices: Object.fromEntries(
      DEFAULT_PRODUCTS.map((p) => [
        p.code,
        { priceCents: p.priceCents, active: p.active },
      ]),
    ),
    hours: { ...DEFAULT_HOURS },
    catalog: DEFAULT_PRODUCTS.map((p) => ({ ...p })),
  };
}

/** Applique les réglages sur le catalogue et la config du site. */
export function applySettings(settings: Partial<SiteSettings> | null) {
  // On repart toujours du catalogue d'origine (le tableau est modifié en place
  // pour que tous les imports de PRODUCTS voient les changements).
  const catalog = settings?.catalog?.length
    ? settings.catalog
    : DEFAULT_PRODUCTS.map((base) => {
        const override = settings?.prices?.[base.code];
        return {
          ...base,
          priceCents: override?.priceCents ?? base.priceCents,
          active: override?.active ?? base.active,
          // Un tarif saisi dans le back-office rend le produit commandable.
          pricePending:
            override && override.priceCents > 0 ? undefined : base.pricePending,
        };
      });
  PRODUCTS.splice(0, PRODUCTS.length, ...catalog.map((p) => ({ ...p })));

  const hours = { ...DEFAULT_HOURS, ...(settings?.hours ?? {}) };
  SITE.openingHours = hours.openingHours || DEFAULT_HOURS.openingHours;
  SITE.openingHoursEn = hours.openingHoursEn || DEFAULT_HOURS.openingHoursEn;
  SITE.deliveryWindow = hours.deliveryWindow || DEFAULT_HOURS.deliveryWindow;
  SITE.deliveryWindowEn =
    hours.deliveryWindowEn || DEFAULT_HOURS.deliveryWindowEn;
}
