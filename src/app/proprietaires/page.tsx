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
      title: t("Vous nous contactez", "You contact us"),
      description: t(
        "Via le formulaire de contact : résidence (Arc 1800/2000), contraintes d'arrivée et consignes d'accueil.",
        "Via the contact form: residence (Arc 1800/2000), arrival constraints and welcome instructions.",
      ),
    },
    {
      title: t("Validation et planning", "Approval and schedule"),
      description: t(
        "Une fois votre compte propriétaire validé, vous recevez par mail le lien de votre planning.",
        "Once your owner account is approved, you receive the link to your schedule by email.",
      ),
    },
    {
      title: t("Exécution sur place", "On-site service"),
      description: t(
        "Accueil des locataires et remise des clés, ménage complet du logement, linge de lit et de toilette propre (blanchisserie), état des lieux de sortie : tout est pris en charge selon les prestations choisies.",
        "Guest welcome and key handover, full cleaning of the property, fresh bed and bath linen (laundry service), check-out inspection: everything is handled according to the services you choose.",
      ),
    },
  ];

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
        "Accueil des locataires, remise des clés et état des lieux de sortie en leur présence.",
        "Welcoming tenants, key handover and check-out inspection in their presence.",
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
        `${SITE.yearsInBusiness} ans d'implantation aux Arcs 1800 et 2000`,
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
                  "Simplifiez vos rotations locatives aux Arcs avec une conciergerie fiable, locale et réactive.",
                  "Simplify your rental turnovers in Les Arcs with a reliable, local and responsive concierge.",
                )}
              </h1>
              <p className="mt-5 max-w-3xl text-lg text-slate-700">
                {t(
                  "Nous prenons en charge les temps clés de vos locations saisonnières : accueil des locataires, remises de clés, ménage, blanchisserie du linge et états des lieux. Vous gagnez du temps, sans gérer de plateforme compliquée.",
                  "We take care of the key moments of your holiday lets: welcoming tenants, key handovers, cleaning, linen laundry and inspections. You save time, without managing a complicated platform.",
                )}
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[22px] border border-primary/10 bg-white px-4 py-4 text-ardoise shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-light/80 text-sapin ring-1 ring-primary/10">
                        {item.icon}
                      </span>
                      <span className="text-sm font-semibold leading-6 text-ardoise">
                        {item.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

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
                    "Service conciergerie pour propriétaires aux Arcs",
                    "Concierge service for owners in Les Arcs",
                  )}
                  fill
                  priority
                  sizes="(min-width: 1024px) 32rem, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/45 via-transparent to-transparent" />
              </div>
              <div className="absolute inset-x-4 bottom-4 rounded-[22px] border border-white/25 bg-white/92 p-4 shadow-lg backdrop-blur-sm">
                <p className="text-sm font-semibold text-ardoise">
                  {t(
                    "Présents aux Arcs 1800 & 2000",
                    "Based in Les Arcs 1800 & 2000",
                  )}
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {t(
                    `${SITE.yearsInBusiness} ans d'implantation, entreprise familiale et réactivité 7j/7 en saison.`,
                    `${SITE.yearsInBusiness} years established, family business, available 7 days a week in season.`,
                  )}
                </p>
              </div>
            </div>
          </div>
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

          <ol className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className={`relative flex flex-col overflow-hidden rounded-[26px] p-6 shadow-sm ${
                  index === 0
                    ? "md:col-span-2"
                    : index === 2
                      ? "md:col-span-3"
                      : ""
                } ${
                  index === 0
                    ? "bg-sapin text-white"
                    : index === 2
                      ? "bg-accent text-ardoise"
                      : "border border-primary/10 bg-primary-light/40 text-ardoise"
                }`}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-2 -top-6 text-[7rem] font-bold leading-none opacity-15"
                >
                  {index + 1}
                </span>
                <span
                  className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                    index === 0 ? "bg-white/20" : "bg-white/70"
                  }`}
                >
                  {t("Étape", "Step")} {index + 1}
                </span>
                <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                <p
                  className={`mt-2 text-sm leading-6 ${
                    index === 0 ? "text-white/90" : "text-slate-700"
                  }`}
                >
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </PageContainer>
      </section>

      <section className="pb-12">
        <PageContainer>
          <div className="grid gap-6">
            <div className="space-y-6">
              <div className="rounded-panel border border-primary/10 bg-white p-6 shadow-soft">
                <p className="text-sm font-semibold tracking-wide text-sapin">
                  {t("Nos prestations", "Our services")}
                </p>
                <h2 className="mt-2 text-3xl text-ardoise">
                  {t(
                    "Des prestations claires, adaptées à la saison",
                    "Clear services, tailored to the season",
                  )}
                </h2>
                <p className="mt-3 rounded-lg border border-primary/20 bg-primary-light/75 p-3 text-sm text-ardoise">
                  {t(
                    "Les prestations propriétaires ne se commandent pas en ligne :",
                    "Owner services cannot be ordered online:",
                  )}{" "}
                  <Link
                    href="/contact?sujet=proprietaire"
                    className="font-semibold underline"
                  >
                    {t("contactez-nous", "contact us")}
                  </Link>
                  {t(
                    ". Après validation, le lien vers votre planning vous est envoyé par mail.",
                    ". Once approved, the link to your schedule is sent to you by email.",
                  )}
                </p>
              </div>

              <div className="rounded-panel border border-primary/10 bg-white p-6 shadow-soft">
                <h2 className="flex items-center gap-2 text-2xl text-ardoise">
                  <span className="inline-flex rounded-full bg-primary-light/70 p-2 text-sapin">
                    <BriefcaseIcon className="h-5 w-5" />
                  </span>
                  {t("Prestations disponibles", "Available services")}
                </h2>
                <p className="mt-2 text-sm text-slate-700">
                  {t(
                    "Des prestations complètes, adaptées aux besoins des propriétaires en saison.",
                    "Complete services, tailored to owners' needs during the season.",
                  )}
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {ownerServices.map((service) => (
                    <article
                      key={service.title}
                      className="overflow-hidden rounded-panel border border-primary/10 bg-primary-light/20"
                    >
                      {service.photo && (
                        <Image
                          src={service.photo}
                          alt={service.title}
                          width={672}
                          height={504}
                          sizes="(min-width: 640px) 21rem, 100vw"
                          className="h-auto w-full"
                        />
                      )}
                      <div className="p-4">
                        <div className="flex items-start gap-2.5">
                          <span className="mt-0.5 inline-flex rounded-full bg-primary-light/60 p-1.5 text-sapin">
                            {service.icon}
                          </span>
                          <h3 className="text-lg font-semibold text-ardoise">
                            {service.title}
                          </h3>
                        </div>
                        <p className="mt-2 text-sm text-slate-700/90">
                          {service.description}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
                <p className="mt-4 text-sm text-slate-600">
                  {t(
                    "Tarifs sur demande, selon votre logement et vos besoins.",
                    "Prices on request, depending on your property and needs.",
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
          <div className="grid gap-6">
            <article className="rounded-panel border border-primary/10 bg-white p-6 shadow-soft">
              <h2 className="flex items-center gap-2 text-2xl text-ardoise">
                <span className="inline-flex rounded-full bg-primary-light/70 p-2 text-sapin">
                  <MapPinIcon className="h-5 w-5" />
                </span>
                {t("Zone desservie", "Service area")}
              </h2>
              <p className="mt-2 text-slate-700/90">
                {t(
                  "Nous intervenons sur Arc 1800 et Arc 2000, avec un ancrage local pour faciliter les arrivées et départs de vos locataires.",
                  "We operate in Arc 1800 and Arc 2000, with a local presence to make your tenants' arrivals and departures easier.",
                )}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700/90">
                <li>
                  •{" "}
                  {t(
                    "Arc 1800 : galerie du Charvet en bas de la Poste",
                    "Arc 1800: Galerie du Charvet below the Post Office",
                  )}
                </li>
                <li>
                  •{" "}
                  {t(
                    "Arc 2000 : place haute, en face de Skiset",
                    "Arc 2000: upper square, opposite Skiset",
                  )}
                </li>
                <li>
                  • Contact : {SITE.phone} —{" "}
                  {t("réactifs 7j/7", "available 7 days a week")}
                </li>
              </ul>
            </article>
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
