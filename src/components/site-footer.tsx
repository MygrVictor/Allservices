import Link from "next/link";
import Image from "next/image";
import { getT } from "@/lib/i18n-server";

export function SiteFooter() {
  const t = getT();
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
          <p className="mb-2 font-semibold text-ardoise">All Services</p>
          <p className="flex items-start gap-2">
            <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-sapin" />
            {t(
              "Arc 1800 — Galerie du Charvet (en bas de la Poste)",
              "Arc 1800 — Galerie du Charvet (below the Post Office)",
            )}
          </p>
          <p className="mt-1 flex items-start gap-2">
            <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-sapin" />
            {t(
              "Arc 2000 — Place haute, en face de Skiset",
              "Arc 2000 — Upper square, opposite Skiset",
            )}
          </p>
        </div>
        <div className="rounded-panel border border-slate-200 bg-white p-4 shadow-sm">
          <p className="mb-2 font-semibold text-ardoise">Contact</p>
          <p className="flex items-center gap-2">
            <PhoneIcon className="h-4 w-4 text-sapin" />
            {t("Tél", "Phone")} : +33 (0)4 79 07 60 17
          </p>
          <p className="mt-1 flex items-center gap-2">
            <MailIcon className="h-4 w-4 text-sapin" />
            Email : contact@allservicesmontagne.com
          </p>
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
          <p className="mt-2 text-xs text-slate-500">
            {t(
              "Saison été: mar-dim 9h30-12h / 15h30-18h30",
              "Summer season: Tue–Sun 9:30am–12pm / 3:30pm–6:30pm",
            )}
          </p>
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
