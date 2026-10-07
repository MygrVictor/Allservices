import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, makeT } from "@/lib/i18n";

/** Langue courante (composants serveur). */
export function getLocale() {
  const value = cookies().get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** Helper de traduction (composants serveur). */
export function getT() {
  return makeT(getLocale());
}
