"use client";

import { createContext, useContext, useMemo } from "react";
import { DEFAULT_LOCALE, makeT, type Locale } from "@/lib/i18n";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
}

/** Langue courante (composants client). */
export function useLocale() {
  return useContext(LocaleContext);
}

/** Helper de traduction (composants client). */
export function useT() {
  const locale = useLocale();
  return useMemo(() => makeT(locale), [locale]);
}
