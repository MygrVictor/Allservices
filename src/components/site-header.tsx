import Link from "next/link";
import Image from "next/image";
import { LanguageSwitch } from "@/components/language-switch";
import { NavDropdown, NavLink } from "@/components/nav-link";
import { getT } from "@/lib/i18n-server";

export function SiteHeader() {
  const t = getT();
  const mainLinks = [
    { href: "/", label: t("Accueil", "Home") },
    {
      label: t("Vacanciers", "Holidaymakers"),
      isDropdown: true,
    },
    { href: "/proprietaires", label: t("Propriétaires", "Owners") },
    {
      href: "/laverie-conciergerie",
      label: t("Laverie & Conciergerie", "Laundry & Concierge"),
    },
    { href: "/contact", label: "Contact" },
  ];

  const vacancierSublinks = [
    { href: "/vacanciers", label: t("Location de linges", "Linen rentals") },
    { href: "/packs-ski", label: t("Location de skis", "Ski rentals") },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-primary-dark bg-primary text-white shadow-md">
      <div className="mx-auto flex w-full max-w-[1400px] items-center gap-2 px-2 py-2 sm:gap-3 sm:px-4 sm:py-2.5 lg:px-5">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 rounded-lg bg-white/95 px-1.5 py-0.5 sm:gap-3 sm:px-2 sm:py-1"
        >
          <Image
            src="/brand/logo-allservices.png"
            alt={t(
              "All Services Montagne — accueil",
              "All Services Montagne — home",
            )}
            width={934}
            height={201}
            className="h-7 w-auto sm:h-8 lg:h-9"
            priority
          />
        </Link>
        <nav
          aria-label={t("Navigation principale", "Main navigation")}
          className="hidden flex-1 items-center justify-center gap-1 text-sm font-medium lg:flex xl:gap-2"
        >
          {mainLinks.map((link) =>
            link.isDropdown ? (
              <NavDropdown
                key="vacanciers"
                label={link.label}
                items={vacancierSublinks}
              />
            ) : (
              <NavLink key={link.href!} href={link.href!}>
                {link.label}
              </NavLink>
            ),
          )}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2 lg:ml-0">
          <Link
            href="/vacanciers"
            className="hidden lg:inline-flex items-center rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-ardoise shadow-lg ring-2 ring-white/70 transition hover:bg-accent-dark sm:px-4 sm:py-2 sm:text-sm"
          >
            {t("Réserver mon linge", "Book linen")}
          </Link>
          <LanguageSwitch className="hidden sm:inline-flex lg:ml-2" />
          <details className="relative lg:hidden">
            <summary
              className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full border border-white/40 marker:content-none sm:h-10 sm:w-10"
              aria-label={t("Ouvrir le menu", "Open menu")}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                aria-hidden
              >
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </summary>
            <nav
              aria-label={t("Navigation mobile", "Mobile navigation")}
              className="absolute right-0 top-full mt-2 w-56 rounded-panel border border-slate-200 bg-white p-2 text-ardoise shadow-xl sm:w-64"
            >
              {mainLinks.map((link) =>
                link.isDropdown ? (
                  <details key="vacanciers" className="group">
                    <summary className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-primary-light marker:content-none sm:py-3 sm:text-base">
                      {link.label}
                      <svg
                        className="h-4 w-4 transition group-open:rotate-180"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M19 8l-7 7-7-7" />
                      </svg>
                    </summary>
                    <ul className="ml-2 mt-1 space-y-1">
                      {vacancierSublinks.map((sublink) => (
                        <li key={sublink.href}>
                          <Link
                            href={sublink.href}
                            className="block rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-100 sm:text-base"
                          >
                            {sublink.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <Link
                    key={link.href!}
                    href={link.href!}
                    className="block rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-primary-light sm:py-3 sm:text-base"
                  >
                    {link.label}
                  </Link>
                ),
              )}
              <Link
                href="/vacanciers"
                className="block mt-2 rounded-lg bg-accent px-3 py-2.5 text-center text-sm font-bold text-ardoise transition hover:bg-accent-dark sm:py-3 sm:text-base"
              >
                {t("Réserver en ligne", "Book online")}
              </Link>
              <div className="border-t border-slate-200 pt-2 mt-2">
                <LanguageSwitch variant="mobile" />
              </div>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
