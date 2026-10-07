"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LOCALE_COOKIE, LOCALES, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/locale-provider";

const FLAG_MAP: Record<Locale, string> = {
  fr: "🇫🇷",
  en: "🇬🇧",
};

export function LanguageSwitch({
  className,
  variant = "desktop",
}: {
  className?: string;
  variant?: "desktop" | "mobile";
}) {
  const current = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const change = (locale: Locale) => {
    if (locale === current) return;
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  };

  if (variant === "mobile") {
    return (
      <div
        role="group"
        aria-label="Langue / Language"
        className={cn(
          "flex flex-col gap-1",
          pending && "opacity-60",
          className,
        )}
      >
        {LOCALES.map((locale) => (
          <button
            key={locale}
            type="button"
            lang={locale}
            onClick={() => change(locale)}
            aria-pressed={locale === current}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium transition-colors",
              locale === current
                ? "bg-primary-light text-white"
                : "text-ardoise hover:bg-slate-100",
            )}
          >
            <span className="text-xl">{FLAG_MAP[locale]}</span>
            <span>{locale === "fr" ? "Français" : "English"}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="Langue / Language"
      className={cn(
        "inline-flex rounded-full border border-white/40 p-0.5 text-xs font-bold",
        pending && "opacity-60",
        className,
      )}
    >
      {LOCALES.map((locale) => (
        <button
          key={locale}
          type="button"
          lang={locale}
          onClick={() => change(locale)}
          aria-pressed={locale === current}
          className={cn(
            "rounded-full px-2.5 py-1.5 text-lg transition-colors",
            locale === current
              ? "bg-white text-ardoise"
              : "text-white/85 hover:text-white",
          )}
        >
          {FLAG_MAP[locale]}
        </button>
      ))}
    </div>
  );
}
