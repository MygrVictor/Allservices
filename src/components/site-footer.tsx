import Link from "next/link";
import Image from "next/image";
import { getLocale, getT } from "@/lib/i18n-server";
import { SITE, getStations } from "@/lib/site-config";

export function SiteFooter() {
  const locale = getLocale();
  const t = getT();
  const stations = getStations(locale);
  return (
    <footer className="mt-16 border-t border-sapin/15 bg-gradient-to-b from-neige to-white">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 text-sm text-slate-700 md:grid-cols-3">
        <div className="rounded-panel border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3">
            <Image
              src="/brand/logo-allservices.png"
              alt="All Services"
              width={160}
              height={44}
              className="h-9 w-auto object-contain"
            />
          </div>
          <p className="mb-2 font-semibold text-ardoise">{SITE.name}</p>
          <ul className="space-y-1.5">
            {stations.map((station) => (
              <li key={station.id} className="flex items-start gap-2">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-sapin" />
                <a
                  href={station.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ardoise hover:underline"
                >
                  <span className="font-semibold">{station.name}</span>
                  {" — "}
                  {station.address}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-panel border border-slate-200 bg-white p-4 shadow-sm">
          <p className="mb-2 font-semibold text-ardoise">Contact</p>
          <a
            href={SITE.phoneHref}
            className="flex items-center gap-2 hover:text-ardoise hover:underline"
          >
            <PhoneIcon className="h-4 w-4 text-sapin" />
            {t("Tél", "Phone")} : {SITE.phone}
          </a>
          <a
            href={`mailto:${SITE.email}`}
            className="mt-1 flex items-center gap-2 hover:text-ardoise hover:underline"
          >
            <MailIcon className="h-4 w-4 text-sapin" />
            Email : {SITE.email}
          </a>
          <div className="mt-3 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-600">
            <p className="font-semibold text-ardoise">
              {t("Horaires", "Opening hours")}
            </p>
            <p className="mt-1">
              <span className="font-semibold">{t("Hiver", "Winter")}</span>
              {t(
                " : 7j/7 · 9h–12h et 15h–19h",
                ": 7 days/week · 9am–12pm and 3pm–7pm",
              )}
            </p>
            <p className="mt-0.5">
              <span className="font-semibold">{t("Été", "Summer")}</span>
              {t(
                " : mar–dim · 9h30–12h et 15h30–18h30 (fermé lundi)",
                ": Tue–Sun · 9:30am–12pm and 3:30pm–6:30pm (closed Monday)",
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-1 rounded-panel border border-slate-200 bg-white p-4 shadow-sm">
          <Link
            href="/mentions-legales"
            className="inline-flex items-center gap-2 hover:text-ardoise"
          >
            <ChevronIcon className="h-4 w-4 text-sapin" />
            {t("Mentions légales", "Legal notice")}
          </Link>
          <Link
            href="/vacanciers"
            className="inline-flex items-center gap-2 hover:text-ardoise"
          >
            <ChevronIcon className="h-4 w-4 text-sapin" />
            {t("Réservation en ligne", "Online booking")}
          </Link>
          <Link
            href="/laverie-conciergerie"
            className="inline-flex items-center gap-2 hover:text-ardoise"
          >
            <ChevronIcon className="h-4 w-4 text-sapin" />
            {t("Nos agences", "Our offices")}
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 hover:text-ardoise"
          >
            <ChevronIcon className="h-4 w-4 text-sapin" />
            {t("Nous contacter", "Contact us")}
          </Link>
        </div>
      </div>
    </footer>
  );
}

function iconBase(className?: string) {
  return `text-current ${className ?? ""}`;
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconBase(className)}>
      <path
        d="M12 21s7-5.8 7-11a7 7 0 1 0-14 0c0 5.2 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconBase(className)}>
      <path
        d="M6.2 4.8h3l1.3 3.3-2 1.8a13.2 13.2 0 0 0 5.6 5.6l1.8-2 3.3 1.3v3a1.6 1.6 0 0 1-1.8 1.6 16.8 16.8 0 0 1-12.8-12.8 1.6 1.6 0 0 1 1.6-1.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconBase(className)}>
      <rect
        x="3.5"
        y="6"
        width="17"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m4.5 7 7.5 6 7.5-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconBase(className)}>
      <path
        d="m9 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
