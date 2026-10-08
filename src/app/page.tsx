import Link from "next/link";
import Image from "next/image";
import { PageContainer } from "@/components/page-container";
import { StationCards } from "@/components/station-cards";
import { SITE, isSiteInStandby } from "@/lib/site-config";
import { getT } from "@/lib/i18n-server";

export default function HomePage() {
  const standby = isSiteInStandby();
  const t = getT();
  const serviceCards = [
    {
      title: t("Propriétaires", "Owners"),
      href: "/proprietaires",
      ctaLabel: t("Découvrir l'accompagnement", "Discover our support"),
      description: t(
        "Remise de clés, ménage, blanchisserie et état des lieux de sortie.",
        "Key handover, cleaning, laundry and check-out inspections.",
      ),
      icon: <KeyIcon className="h-5 w-5" />,
      illustration: (
        <div className="relative h-full w-full overflow-hidden">
          <Image
            src="/services/proprietaire.jpg"
            alt={t("Propriétaires sur les Arcs", "Owners in Les Arcs")}
            fill
            sizes="(min-width: 768px) 20rem, 100vw"
            className="object-cover"
          />
        </div>
      ),
    },
    {
      title: t("Vacanciers", "Holidaymakers"),
      href: "/vacanciers",
      ctaLabel: t("Réserver mon linge", "Book my stay"),
      description: t(
        "Location de linge, service de blanchisserie, location de ski réservés en quelques clics.",
        "Linen, baby equipment and ski rental packs booked in a few clicks.",
      ),
      icon: <BedIcon className="h-5 w-5" />,
      illustration: (
        <div className="relative h-full w-full overflow-hidden">
          <Image
            src="/background_customer.jpg"
            alt={t("Linge propre et plié", "Clean folded linen")}
            fill
            sizes="(min-width: 768px) 20rem, 100vw"
            className="object-cover"
          />
        </div>
      ),
    },
    {
      title: t("Infos pratiques", "Practical info"),
      href: "#nos-agences",
      ctaLabel: t("Voir nos agences", "See our offices"),
      description: t(
        `Arc 1800 : galerie du Charvet · Arc 2000 : place haute, face à Skiset · Tél ${SITE.phone}.`,
        `Arc 1800: Galerie du Charvet · Arc 2000: upper square, opposite Skiset · Phone ${SITE.phone}.`,
      ),
      icon: <MapPinIcon className="h-5 w-5" />,
      illustration: (
        <div className="relative h-full w-full overflow-hidden">
          <Image
            src="/services/infos-pratiques.jpg"
            alt={t(
              "Infos pratiques sur les Arcs",
              "Practical info in Les Arcs",
            )}
            fill
            sizes="(min-width: 768px) 20rem, 100vw"
            className="object-cover"
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <section className="relative isolate overflow-hidden">
        {/* Fond : photo de montagne (PLACEHOLDER libre de droits, voir SITE.heroImage) */}
        <Image
          src={SITE.heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-center"
        />
        {/* Overlay pour la lisibilité du texte */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-dark/85 via-primary-dark/60 to-primary-dark/85"
        />
        <PageContainer>
          <div className="py-14 text-white sm:py-20 lg:py-24">
            <p className="inline-flex rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide">
              {t(
                `Les Arcs 1800 & 2000 · Savoie · Entreprise familiale depuis ${SITE.yearsInBusiness} ans`,
                `Les Arcs 1800 & 2000 · Savoie · Family business for ${SITE.yearsInBusiness} years`,
              )}
            </p>
            <h1 className="mt-4 max-w-3xl text-3xl leading-tight drop-shadow sm:text-5xl">
              {t(
                "Conciergerie, ménage, blanchisserie et location de linge sur les Arcs.",
                "Concierge, cleaning, laundry service and linen rental in Les Arcs.",
              )}
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-white/95">
              {t(
                "Une équipe locale, réactive 7j/7, pour les vacanciers comme pour les propriétaires.",
                "A local team, available 7 days a week, for holidaymakers and owners alike.",
              )}
            </p>

            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
              <Link
                href={standby ? "/contact" : "/vacanciers"}
                className="rounded-panel bg-accent p-4 text-ardoise shadow-lg transition hover:bg-accent-dark sm:col-span-2"
              >
                <p className="text-lg font-bold">
                  {standby
                    ? t("Demander un devis", "Request a quote")
                    : t("Réserver mon linge en ligne", "Book my linen online")}
                </p>
                <p className="mt-1 text-sm">
                  {standby
                    ? t(
                        "Le paiement en ligne est désactivé hors saison.",
                        "Online payment is disabled off-season.",
                      )
                    : t(
                        "Priorité au linge, avec option location de skis.",
                        "Linen first, with optional ski rental.",
                      )}
                </p>
              </Link>
              <Link
                href="/vacanciers"
                className="rounded-panel border border-white/40 bg-white/95 p-4 text-ardoise transition hover:-translate-y-0.5"
              >
                <p className="font-semibold">
                  {t("Vous êtes vacancier", "I'm on holiday")}
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {t(
                    "Location de linge, Blanchisserie, location de skis.",
                    "Linen rental, laundry service, ski rental.",
                  )}
                </p>
              </Link>
              <Link
                href="/proprietaires"
                className="rounded-panel border border-white/40 bg-white/95 p-4 text-ardoise transition hover:-translate-y-0.5"
              >
                <p className="font-semibold">
                  {t("Vous êtes propriétaire", "I'm an owner")}
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {t(
                    "Remise de clés, ménage, blanchisserie, état des lieux.",
                    "Key handover, cleaning, laundry, inspection.",
                  )}
                </p>
              </Link>
            </div>
          </div>
        </PageContainer>
      </section>

      <section className="bg-gradient-to-b from-white via-neige to-primary-light/30 py-14 sm:py-16">
        <PageContainer>
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sapin/80">
              {t("Nos services", "Our services")}
            </p>
            <h2 className="mt-3 text-3xl text-ardoise sm:text-4xl">
              {t(
                "Une offre claire pour les propriétaires comme pour les vacanciers",
                "A clear offer for owners and holidaymakers alike",
              )}
            </h2>
            <p className="mt-3 text-base text-slate-600 sm:text-lg">
              {t(
                "Conciergerie, ménage, blanchisserie, location de linge, ski et informations pratiques : tout est réuni pour préparer un séjour fluide sur les Arcs.",
                "Concierge, cleaning, laundry service, linen and ski rental, practical information: everything you need for a smooth stay in Les Arcs.",
              )}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {serviceCards.map((card) => (
              <article
                key={card.title}
                className="group overflow-hidden rounded-[26px] border border-primary/10 bg-white/95 shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden border-b border-slate-200 bg-gradient-to-br from-glacier via-white to-amber-50">
                  {card.illustration}
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent" />
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 text-xl text-ardoise">
                    <span className="inline-flex rounded-full bg-primary-light/70 p-2 text-sapin ring-1 ring-primary/10">
                      {card.icon}
                    </span>
                    <Link
                      href={card.href}
                      className="font-semibold hover:underline"
                    >
                      {card.title}
                    </Link>
                  </div>
                  <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-700">
                    {card.description}
                  </p>
                  <div className="mt-4">
                    <Link
                      href={card.href}
                      className="inline-flex items-center gap-2 rounded-full bg-primary-light px-4 py-2 text-sm font-semibold text-ardoise transition group-hover:bg-primary-light/80"
                    >
                      {card.ctaLabel}
                      <span aria-hidden>→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Bandeau Partenaires (ex-page /bons-plans) */}
      <section
        id="partenaires"
        aria-labelledby="partenaires-titre"
        className="border-y border-accent-dark/40 bg-accent/90"
      >
        <PageContainer>
          <div className="flex flex-col gap-4 py-5 text-ardoise lg:flex-row lg:items-center">
            <h2
              id="partenaires-titre"
              className="flex shrink-0 items-center gap-2 text-xl font-bold"
            >
              <SparklesIcon className="h-5 w-5" />
              {t("Partenaires", "Partners")}
            </h2>
            <ul className="grid flex-1 gap-3 text-sm sm:grid-cols-2">
              <li className="flex items-center gap-3 rounded-lg bg-white/95 p-3 shadow-sm ring-1 ring-primary/10">
                <Image
                  src="/partners/skiset.png"
                  alt="Skiset"
                  width={80}
                  height={30}
                  className="h-7 w-auto object-contain"
                />
                <span>
                  {t(
                    "Code réduction Skiset sur demande (magasin + web).",
                    "Skiset discount code on request (in-store + web).",
                  )}{" "}
                  <Link
                    href="/contact?sujet=code-reduction-skiset"
                    className="font-semibold underline"
                  >
                    {t("Découvrir le code", "Request the code")}
                  </Link>
                </span>
              </li>
              <li className="flex items-center gap-3 rounded-lg bg-white/95 p-3 shadow-sm ring-1 ring-primary/10">
                <Image
                  src="/partners/esf.png"
                  alt="ESF Arc 1800"
                  width={80}
                  height={40}
                  className="h-8 w-auto object-contain"
                />
                <span>
                  {t(
                    "10% sur les cours collectifs ESF Arc 1800 (code sur demande).",
                    "10% off ESF Arc 1800 group lessons (code on request).",
                  )}{" "}
                  <Link
                    href="/contact?sujet=code-reduction-esf"
                    className="font-semibold underline"
                  >
                    {t("Demander le code", "Request the code")}
                  </Link>
                </span>
              </li>
            </ul>
          </div>
        </PageContainer>
      </section>

      <section className="py-8">
        <PageContainer>
          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-[24px] border border-primary/12 bg-white p-5 shadow-soft">
              <div className="flex items-center justify-center gap-3 text-center">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-light/70 text-sapin ring-1 ring-primary/10">
                  <ClockIcon className="h-5 w-5" />
                </span>
                <p className="text-base font-semibold text-ardoise">
                  {t("Process simple", "Simple process")}
                </p>
              </div>
            </article>
            <article className="rounded-[24px] border border-primary/12 bg-white p-5 shadow-soft">
              <div className="flex items-center justify-center gap-3 text-center">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-light/70 text-sapin ring-1 ring-primary/10">
                  <UsersIcon className="h-5 w-5" />
                </span>
                <p className="text-base font-semibold text-ardoise">
                  {t("Entreprise familiale", "Family business")}
                </p>
              </div>
            </article>
            <article className="rounded-[24px] border border-primary/12 bg-white p-5 shadow-soft">
              <div className="flex items-center justify-center gap-3 text-center">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-light/70 text-sapin ring-1 ring-primary/10">
                  <ShieldIcon className="h-5 w-5" />
                </span>
                <p className="text-base font-semibold text-ardoise">
                  {t("Organisation fiable", "Reliable organisation")}
                </p>
              </div>
            </article>
          </div>
        </PageContainer>
      </section>

      <section id="nos-agences" className="scroll-mt-20 py-12">
        <PageContainer>
          <h2 className="text-3xl text-ardoise">
            {t("Nos agences sur les Arcs", "Our offices in Les Arcs")}
          </h2>
          <p className="mt-2 max-w-2xl text-slate-700">
            {t(
              "Deux points d'accueil pour retirer vos commandes, déposer vos clés ou faire votre lessive.",
              "Two locations to collect your orders, drop off your keys or do your laundry.",
            )}
          </p>
          <div className="mt-6">
            <StationCards linkToLaundryPage />
          </div>
        </PageContainer>
      </section>
    </>
  );
}

function iconBase(className?: string) {
  return `text-current ${className ?? ""}`;
}

function KeyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconBase(className)}>
      <circle cx="8" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M11.5 12H21m-3 0v2m-3-2v2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BedIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconBase(className)}>
      <path
        d="M3.5 12.5h17v5h-17v-5Zm2-4h5.5a2.5 2.5 0 0 1 2.5 2.5v1.5h-8v-4Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M3.5 17.5v2M20.5 17.5v2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
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

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconBase(className)}>
      <path
        d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconBase(className)}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 7.8v4.6l3 1.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconBase(className)}>
      <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M3.8 18a5.2 5.2 0 0 1 10.4 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle
        cx="16.8"
        cy="9.5"
        r="2.4"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M14.8 18a4.6 4.6 0 0 1 5.4-3.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconBase(className)}>
      <path
        d="M12 3.8 5.5 6.2v5.9c0 4.5 2.9 7.3 6.5 8.9 3.6-1.6 6.5-4.4 6.5-8.9V6.2L12 3.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m9.3 12.1 1.9 1.9 3.7-3.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
