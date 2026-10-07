export type Locale = "fr" | "en";

export const LOCALES: Locale[] = ["fr", "en"];
export const DEFAULT_LOCALE: Locale = "fr";
/** Cookie mémorisant la langue choisie via le bouton FR / EN. */
export const LOCALE_COOKIE = "lang";

export function isLocale(value: unknown): value is Locale {
  return value === "fr" || value === "en";
}

/** Traduction inline : t("Bonjour", "Hello"). */
export type Translate = (fr: string, en: string) => string;

export function makeT(locale: Locale): Translate {
  return (fr, en) => (locale === "en" ? en : fr);
}
