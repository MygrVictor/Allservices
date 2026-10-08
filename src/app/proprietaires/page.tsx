import Image from "next/image";
import Link from "next/link";
import { PageContainer } from "@/components/page-container";
import { SITE } from "@/lib/site-config";
import { localizeProduct, productsForAudience } from "@/lib/catalog";
import { getLocale } from "@/lib/i18n-server";
import { makeT } from "@/lib/i18n";

export default function ProprietairesPage() {
  const locale = getLocale();
  const t = makeT(locale);
  productsForAudience("proprietaire").map((p) => localizeProduct(p, locale));
  const steps = [
    {
      title: t("Premier contact", "First contact"),
      description: t(
        "Vous remplissez le formulaire de contact en quelques lignes : votre logement, sa station (Arc 1800 ou Arc 2000) et vos disponibilités.",
        "Fill in the contact form in a few lines: your property, its resort (Arc 1800 or Arc 2000) and your availability.",
      ),
      cta: { href: "/contact?sujet=proprietaire", label: t("Remplir le formulaire", "Fill in the form") },
    },
    {
      title: t("On échange sur vos besoins", "We discuss your needs"),
      description: t(
        "Nous vous rappelons pour définir ensemble les prestations utiles et le rythme des rotations.",
        "We call you back to define together the right services and turnover rhythm.",
      ),
    },
    {
      title: t("On s'occupe de tout sur place", "We handle everything on site"),
      description: t(
        "Remise des clés, ménage, linge propre et état des lieux de sortie, selon les prestations choisies.",
        "Key handover, cleaning, fresh linen and check-out inspection, according to the services you chose.",
      ),
    },
  ] as { title: string; description: string; cta?: { href: string; label: string } }[];

  const ownerServices = [
    {
      title: t(
        "Accueil + remise de clés illimité pendant la saison",
        "Unlimited guest welcome + key handover during the season",
      ),
      description: t(
        "Nous accueillons vos locataires et gérons toutes les remises de clés de la saison.",
        "We welcome your tenants and handle every key handover throughout the season.",
      ),
      photo: "/services/remise-cles.jpg",
      icon: <KeyIcon className="h-4 w-4" />,
    },
    {
      title: t(
        "Accueil + remise de clés + état des lieux de sortie",
        "Guest welcome + key handover + check-out inspection",
      ),
      description: t(
        "Remise des clés et état des lieux de sortie en leur présence.",
        "Key handover and check-out inspection in their presence.",
      ),
      photo: "/services/etat-des-lieux.jpg",
      icon: <ClipboardIcon className="h-4 w-4" />,
    },
    {
      title: t("Ménage de fin de séjour", "End-of-stay cleaning"),
      description: t(
        "Nettoyage complet du logement entre deux locations, prêt pour les prochains arrivants.",
        "Full cleaning of the property between lets, ready for the next guests.",
      ),
      photo: undefined as string | undefined,
      icon: <SparkleIcon className="h-4 w-4" />,
    },
    {
      title: t(
        "Services laverie / blanchisserie",
        "Launderette / laundry services",
      ),
      description: t(
        "Lavage, séchage et repassage de votre linge de lit et de toilette.",
        "Washing, drying and ironing of your bed and bath linen.",
      ),
      photo: "/services/blanchisserie.jpg",
      icon: <BriefcaseIcon className="h-4 w-4" />,
    },
  ];

  const highlights = [
    {
      label: t(
        `${SITE.yearsInBusiness} ans d'implantation sur les Arcs 1800 et 2000`,
        `${SITE.yearsInBusiness} years established in Les Arcs 1800 and 2000`,
      ),
      icon: <MapPinIcon className="h-5 w-5" />,
    },
    {
      label: t(
        "Entreprise familiale, un interlocuteur qui connaît votre bien",
        "Family business, one contact who knows your property",
      ),
      icon: <KeyIcon className="h-5 w-5" />,
    },
    {
      label: t(
        "Réactivité 7j/7 pendant la saison",
        "Available 7 days a week during the season",
      ),
      icon: <CalendarIcon className="h-5 w-5" />,
    },
  ];

  return (
    <>
      <section className="border-b border-primary/10 bg-gradient-to-b from-primary-light/35 via-neige to-white py-12 sm:py-16">
        <PageContainer>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold tracking-wide text-sapin">
                {t(
                  "All Services Montagne · Propriétaires",
                  "All Services Montagne · Owners",
                )}
              </p>
              <h1 className="mt-3 max-w-4xl text-4xl leading-tight text-ardoise sm:text-5xl">
                {t(
                  "Simplifiez vos rotations locatives sur les Arcs avec une conciergerie fiable, locale et réactive.",
                  "Simplify your rental turnovers in Les Arcs with a reliable, local and responsive concierge.",
                )}
              </h1>
              <p className="mt-5 max-w-3xl text-lg text-slate-700">
                {t(
                  "Nous prenons en charge les temps clés de vos locations saisonnières : remises de clés, ménage, blanchisserie du linge et états des lieux. Vous gagnez du temps, sans gérer de plateforme compliquée.",
                  "We take care of the key moments of your holiday lets: key handovers, cleaning, linen laundry and inspections. You save time, without managing a complicated platform.",
                )}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact?sujet=proprietaire"
                  className="inline-flex rounded-full bg-sapin px-5 py-2.5 text-sm font-semibold text-white hover:bg-sapin/90"
                >
                  {t("Demander nos prestations", "Request our services")}
                </Link>
                <a
                  href={SITE.phoneHref}
                  className="inline-flex rounded-full border border-primary/15 bg-white px-5 py-2.5 text-sm font-semibold text-ardoise hover:border-sapin"
                >
                  {t("Appeler le", "Call")} {SITE.phone}
                </a>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[30px] border border-primary/10 bg-white shadow-xl">
              <div className="relative aspect-[4/5] sm:aspect-[16/12] lg:aspect-[4/5]">
                <Image
                  src="/services/proprietaire.jpg"
                  alt={t(
                    "Service conciergerie pour propriétaires sur les Arcs",
                    "Concierge service for owners in Les Arcs",
                  )}
                  fill
                  priority
                  sizes="(min-width: 1024px) 32rem, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/45 via-transparent to-transparent" />
              </div>
            </div>
          </div>

          <ul className="mt-10 grid divide-y divide-primary/10 overflow-hidden rounded-[24px] border border-primary/10 bg-white shadow-soft sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {highlights.map((item) => (
              <li key={item.label} className="flex items-center gap-4 px-5 py-5">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-light/80 text-sapin ring-1 ring-primary/10">
                  {item.icon}
                </span>
                <span className="text-sm font-semibold leading-6 text-ardoise">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </PageContainer>
      </section>

      <section className="py-12">
        <PageContainer>
          <div className="mb-6 max-w-3xl">
            <p className="text-sm font-semibold tracking-wide text-sapin">
              {t("Comment nous travaillons", "How we work")}
            </p>
            <h2 className="mt-2 text-3xl text-ardoise">
              {t(
                "Un fonctionnement simple pour vos rotations",
                "A simple process for your turnovers",
              )}
            </h2>
          </div>

          <ol className="relative grid gap-5 md:grid-cols-3">
            <span
              aria-hidden
              className="absolute left-[16.66%] right-[16.66%] top-7 hidden h-0.5 bg-gradient-to-r from-sapin via-primary to-accent md:block"
            />
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="relative flex flex-col items-center rounded-[24px] border border-primary/10 bg-white p-6 pt-0 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg md:border-0 md:bg-transparent md:shadow-none md:hover:translate-y-0 md:hover:shadow-none"
              >
                <span
                  className={`relative z-10 -mt-0 inline-flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold shadow-lg ring-4 ring-white ${
                    index === 0
                      ? "bg-sapin text-white"
                      : index === 1
                        ? "bg-primary text-white"
                        : "bg-accent text-ardoise"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="mt-4 text-xs font-bold uppercase tracking-wide text-sapin">
                  {t("Étape", "Step")} {index + 1}
                </span>
                <h3 className="mt-1 text-xl font-semibold text-ardoise">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-slate-700">
                  {step.description}
                </p>
                {step.cta && (
                  <Link
                    href={step.cta.href}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-sapin px-4 py-2 text-sm font-semibold text-white transition hover:bg-sapin/90"
                  >
                    {step.cta.label}
                    <span aria-hidden>→</span>
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </PageContainer>
      </section>

      <section className="pb-12">
        <PageContainer>
          <div className="grid gap-6">
            <div className="space-y-6">
              <div className="rounded-panel border border-primary/10 bg-white p-6 shadow-soft sm:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div className="max-w-2xl">
                    <p className="text-sm font-semibold tracking-wide text-sapin">
                      {t("Nos prestations", "Our services")}
                    </p>
                    <h2 className="mt-2 text-3xl text-ardoise">
                      {t(
                        "Des prestations claires, adaptées à la saison",
                        "Clear services, tailored to the season",
                      )}
                    </h2>
                    <p className="mt-2 text-sm text-slate-700">
                      {t(
                        "Choisissez une ou plusieurs prestations : nous construisons un devis adapté à votre logement.",
                        "Pick one or more services: we build a quote tailored to your property.",
                      )}
                    </p>
                  </div>
                  <Link
                    href="/contact?sujet=proprietaire"
                    className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-sapin px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sapin/90 md:self-auto"
                  >
                    {t("Demander un devis", "Request a quote")}
                    <span aria-hidden>→</span>
                  </Link>
                </div>

                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {ownerServices.map((service, index) => (
                    <article
                      key={service.title}
                      className="group flex flex-col overflow-hidden rounded-[22px] border border-primary/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-primary-light/50">
                        {service.photo ? (
                          <Image
                            src={service.photo}
                            alt={service.title}
                            fill
                            sizes="(min-width: 1024px) 18rem, (min-width: 640px) 50vw, 100vw"
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sapin">
                            <SparkleIcon className="h-12 w-12" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        <span className="absolute left-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-sm font-bold text-sapin shadow">
                          {index + 1}
                        </span>
                        <span className="absolute bottom-3 left-3 inline-flex rounded-full bg-white/95 p-2 text-sapin shadow">
                          {service.icon}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <h3 className="text-base font-semibold leading-snug text-ardoise">
                          {service.title}
                        </h3>
                        <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                          {service.description}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>

                <p className="mt-6 flex items-center gap-2 rounded-lg border border-primary/15 bg-primary-light/50 px-4 py-3 text-sm text-ardoise">
                  <BriefcaseIcon className="h-4 w-4 shrink-0 text-sapin" />
                  {t(
                    "Tarifs sur devis, selon votre logement et vos besoins.",
                    "Prices on quote, depending on your property and needs.",
                  )}
                </p>
              </div>

              <div className="rounded-panel border border-primary/10 bg-white p-6 shadow-soft">
                <h2 className="flex items-center gap-2 text-2xl text-ardoise">
                  <span className="inline-flex rounded-full bg-primary-light/70 p-2 text-sapin">
                    <CalendarIcon className="h-5 w-5" />
                  </span>
                  {t("Horaires de saison", "Seasonal opening hours")}
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-panel bg-sapin p-5 text-white">
                    <p className="text-lg font-bold">
                      ❄ {t("Hiver", "Winter")}
                    </p>
                    <p className="mt-1 text-sm text-white/90">
                      {t("7j/7", "7 days a week")}
                    </p>
                    <p className="mt-3 font-semibold">
                      {t("9h – 12h", "9am – 12pm")}
                    </p>
                    <p className="font-semibold">
                      {t("15h – 19h", "3pm – 7pm")}
                    </p>
                  </div>
                  <div className="rounded-panel bg-accent p-5 text-ardoise">
                    <p className="text-lg font-bold">☀ {t("Été", "Summer")}</p>
                    <p className="mt-1 text-sm">
                      {t(
                        "Du mardi au dimanche · fermé le lundi",
                        "Tuesday to Sunday · closed on Mondays",
                      )}
                    </p>
                    <p className="mt-3 font-semibold">
                      {t("9h30 – 12h", "9:30am – 12pm")}
                    </p>
                    <p className="font-semibold">
                      {t("15h30 – 18h30", "3:30pm – 6:30pm")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      <section className="pb-14">
        <PageContainer>
          <div className="relative overflow-hidden rounded-[28px] bg-sapin px-6 py-8 text-white shadow-xl sm:px-10 sm:py-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-accent/20"
            />
            <div className="relative grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-center">
              <div>
                <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-accent">
                  <MapPinIcon className="h-4 w-4" />
                  {t("Zone desservie", "Service area")}
                </p>
                <h2 className="mt-2 text-2xl leading-tight sm:text-3xl">
                  {t(
                    "Votre logement est sur les Arc 1800 ou les Arc 2000 ?",
                    "Is your property in Arc 1800 or Arc 2000?",
                  )}
                </h2>
                <p className="mt-3 max-w-xl text-white/85">
                  {t(
                    "Avec un ancrage local dans les deux stations, nous facilitons les arrivées et départs de vos locataires.",
                    "With a local presence in both resorts, we make your tenants' arrivals and departures easier.",
                  )}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Arc 1800", "Arc 2000"].map((name) => (
                    <span
                      key={name}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-sm font-semibold"
                    >
                      <MapPinIcon className="h-3.5 w-3.5 text-accent" />
                      {name}
                    </span>
                  ))}
                  <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1 text-sm font-semibold">
                    {t("Réactifs 7j/7 en saison", "Available 7 days a week in season")}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3 md:items-end">
                <Link
                  href="/contact?sujet=proprietaire"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-ardoise shadow-lg transition hover:bg-accent-dark md:w-auto"
                >
                  {t("Demander un devis", "Request a quote")}
                  <span aria-hidden>→</span>
                </Link>
                <a
                  href={SITE.phoneHref}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 md:w-auto"
                >
                  {t("Appeler le", "Call")} {SITE.phone}
                </a>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>
    </>
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

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconBase(className)}>
      <rect
        x="3.5"
        y="5.5"
        width="17"
        height="15"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M7 3.8v3.4M17 3.8v3.4M3.5 9.5h17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
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

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconBase(className)}>
      <rect
        x="3.5"
        y="7"
        width="17"
        height="12.5"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconBase(className)}>
      <path
        d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconBase(className)}>
      <rect
        x="6"
        y="5"
        width="12"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M9 9.3h6M9 12.5h6M9 15.7h3.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect
        x="9"
        y="3.5"
        width="6"
        height="3"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}
