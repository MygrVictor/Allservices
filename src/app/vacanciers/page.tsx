"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { PageContainer } from "@/components/page-container";
import { SiteCart } from "@/components/site-cart";
import { useCart } from "@/components/cart-provider";
import { siteText, SITE } from "@/lib/site-config";
import {
  formatEuros,
  localizeProduct,
  productsForAudience,
  type ProductCategory,
} from "@/lib/catalog";
import { useLocale } from "@/components/locale-provider";
import { makeT } from "@/lib/i18n";

export default function VacanciersPage() {
  const locale = useLocale();
  const t = makeT(locale);
  const site = siteText(locale);
  const { add: addToCart } = useCart();

  const products = useMemo(
    () =>
      productsForAudience("vacancier").map((p) => localizeProduct(p, locale)),
    [locale],
  );

  const productGroups = [
    {
      key: "linge",
      title: t("Linge & literie", "Linen & bedding"),
      categories: ["linge"],
      openByDefault: true,
    },
    {
      key: "equipement-bebe",
      title: t("Équipement bébé", "Baby equipment"),
      categories: ["equipement_bebe"],
      openByDefault: false,
    },
    {
      key: "menage-livraison",
      title: t("Ménage & livraison", "Cleaning & delivery"),
      categories: ["menage", "livraison"],
      openByDefault: false,
    },
  ];
  const isPack = (p: { name: string; category: string }) =>
    p.category !== "ski" && p.name.toLowerCase().startsWith("pack");
  const rank = (p: { name: string; category: string }) =>
    isPack(p) ? 0 : p.category === "ski" ? 2 : 1;
  const displayedProducts = products
    .filter((p) => p.category !== "livraison" && p.category !== "ski")
    .sort((a, b) => rank(a) - rank(b));

  const steps = [
    {
      title: t("J'ajoute mes produits", "I add my products"),
    },
    {
      title: t("Je valide mon panier", "I confirm my basket"),
    },
    {
      title: t("Je paie en ligne", "I pay online"),
    },
    {
      title: t("Retrait ou livraison", "Collection or delivery"),
    },
  ];
  const comfortPills = [
    {
      label: t(
        "Retrait simple à votre conciergerie",
        "Easy collection at our concierge",
      ),
      icon: <BagIcon className="h-5 w-5" />,
    },
    {
      label: t("Équipements adaptés aux familles", "Family-friendly equipment"),
      icon: <BabyIcon className="h-5 w-5" />,
    },
  ];

  const renderProduct = (product: (typeof products)[number]) => {
    const isSkiPack = product.category === "ski";
    const pack = isPack(product);
    return (
      <div
        key={product.code}
        className={`relative rounded-panel border-2 p-5 transition-all flex flex-col ${
          pack
            ? "border-primary bg-gradient-to-br from-primary-light to-white shadow-xl ring-2 ring-primary/20 hover:shadow-2xl"
            : isSkiPack
              ? "border-indigo-300 bg-gradient-to-br from-indigo-50 to-white shadow-md hover:border-indigo-500 hover:shadow-lg"
              : product.category === "linge"
                ? "border-sapin/50 bg-gradient-to-br from-sapin/15 via-primary-light/40 to-white shadow-md hover:border-sapin hover:shadow-lg"
                : product.category === "equipement_bebe"
                  ? "border-sky-300 bg-gradient-to-br from-sky-100 to-white shadow-md hover:border-sky-500 hover:shadow-lg"
                  : "border-accent/60 bg-gradient-to-br from-accent/25 to-white shadow-md hover:border-accent hover:shadow-lg"
        }`}
      >
        {pack && (
          <span className="absolute -top-3 left-4 rounded-full bg-primary px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-white shadow">
            ★ {t("Pack complet", "Complete pack")}
          </span>
        )}
        <div className="flex items-start gap-3 mb-3">
          <span className="inline-flex rounded-full bg-primary-light/60 p-2 text-sapin shrink-0">
            <CategoryIcon category={product.category} className="h-4 w-4" />
          </span>
          <h3 className="text-base font-bold text-ardoise">{product.name}</h3>
        </div>

        <p className="text-sm text-slate-700 mb-4 flex-1">
          {product.description}
        </p>

        <div className="border-t border-accent/20 pt-3">
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold">
              <span className="text-accent">
                {product.pricePending ??
                  formatEuros(product.priceCents, locale)}
              </span>
            </div>
            <button
              onClick={() => !isSkiPack && addToCart(product.code)}
              disabled={isSkiPack}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-base font-bold transition-colors ${
                isSkiPack
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-accent text-ardoise hover:bg-accent-dark"
              }`}
              aria-label={t(
                `Ajouter ${product.name} au panier`,
                `Add ${product.name} to basket`,
              )}
            >
              +
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-primary/10 py-12 sm:py-16">
        {/* Fond : linge (public/background_customer.jpg) */}
        <Image
          src="/background_customer.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-r from-white/75 via-white/40 to-transparent"
        />
        <PageContainer>
          <div className="max-w-3xl">
            <div>
              <p className="text-sm font-semibold tracking-wide text-sapin">
                {t(
                  "All Services Montagne · Vacanciers",
                  "All Services Montagne · Holidaymakers",
                )}
              </p>
              <h1 className="mt-3 max-w-4xl text-4xl leading-tight text-ardoise sm:text-5xl">
                {t(
                  "Réservez votre linge avant d'arriver sur les Arcs.",
                  "Book your linen easily, before you arrive in Les Arcs.",
                )}
              </h1>
              <p className="mt-5 max-w-3xl text-lg text-slate-700">
                {t(
                  "Une commande unique et rapide : choisissez votre station, vos dates, vos produits, puis retirez en magasin ou faites-vous livrer.",
                  "One single order, no account needed, designed to be quick on mobile: choose your resort, dates and products, then collect in store or get it delivered.",
                )}
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {comfortPills.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[22px] border border-primary/10 bg-white px-4 py-4 text-sm font-medium text-ardoise shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light/70 text-sapin">
                        {item.icon}
                      </span>
                      <span className="leading-6">{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="#produits"
                  className="inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-ardoise hover:bg-accent-dark"
                >
                  {t("Réserver mon séjour", "Book my stay")}
                </Link>
                <Link
                  href="/packs-ski"
                  className="inline-flex rounded-full border border-primary/15 bg-white px-5 py-2.5 text-sm font-semibold text-ardoise hover:border-sapin"
                >
                  {t("Voir les packs ski", "See ski packs")}
                </Link>
              </div>
              <p className="mt-5 text-sm text-slate-700">
                <span className="font-semibold text-ardoise">
                  Arc 1800 & Arc 2000 ·{" "}
                </span>
                {t(
                  `Livraison du linge entre ${site.deliveryWindow} ou retrait en conciergerie pendant les heures d'ouverture.`,
                  `Linen delivery between ${site.deliveryWindow} or collection at the concierge during opening hours.`,
                )}
              </p>
            </div>
          </div>
        </PageContainer>
      </section>

      <section id="produits" className="scroll-mt-20 py-12">
        <PageContainer>
          <div>
            <div>
              <div className="mb-10">
                <h2 className="flex items-center gap-2 text-2xl text-ardoise">
                  <span className="inline-flex rounded-full bg-primary-light/70 p-2 text-sapin">
                    <RouteIcon className="h-5 w-5" />
                  </span>
                  {t("Comment ça marche", "How it works")}
                </h2>
                <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {steps.map((step, index) => (
                    <li
                      key={step.title}
                      className="relative rounded-panel border border-primary/10 bg-white p-4 shadow-sm"
                    >
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                        {index + 1}
                      </span>
                      <h3 className="mt-3 font-semibold text-ardoise">
                        {step.title}
                      </h3>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mb-8">
                <h2 className="flex items-center gap-2 text-2xl text-ardoise mb-4">
                  <span className="inline-flex rounded-full bg-primary-light/70 p-2 text-sapin">
                    <SparklesIcon className="h-5 w-5" />
                  </span>
                  {t("Produits disponibles", "Available products")}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {productGroups.map((group) => (
                    <button
                      key={group.key}
                      className="rounded-full border-2 border-accent/50 bg-gradient-to-br from-accent/10 to-accent/5 px-5 py-2 text-sm font-semibold text-ardoise transition-all hover:border-accent hover:bg-accent/15 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                    >
                      {group.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {displayedProducts.map(renderProduct)}
              </div>

              <Link
                href="/packs-ski"
                className="group relative mt-10 flex flex-col gap-4 overflow-hidden rounded-[24px] bg-gradient-to-r from-primary-dark to-primary p-6 text-white shadow-lg transition hover:shadow-xl sm:flex-row sm:items-center sm:justify-between sm:p-7"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-6 -top-10 text-[8rem] leading-none opacity-15"
                >
                  ⛷
                </span>
                <div className="relative">
                  <p className="text-xs font-bold uppercase tracking-wide text-accent">
                    {t("Partenaire Skiset", "Skiset partner")}
                  </p>
                  <p className="mt-1 text-xl font-semibold">
                    {t(
                      "Besoin de skis pour votre séjour ?",
                      "Need skis for your stay?",
                    )}
                  </p>
                  <p className="mt-1 text-sm text-white/85">
                    {t(
                      "Découvrez nos packs location de ski en partenariat avec Skiset, aux Arcs 1800 et 2000.",
                      "Discover our ski rental packs with our partner Skiset, in Arc 1800 and 2000.",
                    )}
                  </p>
                </div>
                <span className="relative inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-ardoise shadow transition group-hover:bg-accent-dark sm:self-auto">
                  {t("Voir les packs ski", "See ski packs")}
                  <span
                    aria-hidden
                    className="transition group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </Link>
            </div>
          </div>
          <SiteCart />
        </PageContainer>
      </section>

      <section className="pb-14 pt-12">
        <PageContainer>
          <div className="mb-6">
            <p className="text-sm font-semibold tracking-wide text-sapin">
              {t("Récupérer votre commande", "Getting your order")}
            </p>
            <h2 className="mt-1 text-3xl text-ardoise">
              {t(
                "Retrait ou livraison, au choix",
                "Collection or delivery, your choice",
              )}
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <article className="flex flex-col rounded-[24px] border border-primary/10 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-light/80 text-sapin">
                  <BagIcon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-ardoise">
                    {t(
                      "Retrait en conciergerie",
                      "Collection at our concierge",
                    )}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {t(
                      "Arc 1800 ou Arc 2000 · gratuit",
                      "Arc 1800 or Arc 2000 · free",
                    )}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-700">
                {t(
                  "Passez quand vous voulez pendant les heures d'ouverture :",
                  "Drop by any time during opening hours:",
                )}
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-sapin p-3 text-white">
                  <p className="text-sm font-bold">❄ {t("Hiver", "Winter")}</p>
                  <p className="text-xs text-white/85">
                    {t("7j/7", "7 days a week")}
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {t("9h–12h · 15h–19h", "9am–12pm · 3pm–7pm")}
                  </p>
                </div>
                <div className="rounded-xl bg-accent p-3 text-ardoise">
                  <p className="text-sm font-bold">☀ {t("Été", "Summer")}</p>
                  <p className="text-xs">
                    {t("Mar–dim · fermé lundi", "Tue–Sun · closed Mon")}
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {t("9h30–12h · 15h30–18h30", "9:30am–12pm · 3:30pm–6:30pm")}
                  </p>
                </div>
              </div>
            </article>

            <article className="flex flex-col rounded-[24px] border border-primary/10 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-light/80 text-sapin">
                  <TruckIcon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-ardoise">
                    {t(
                      "Livraison dans votre logement",
                      "Delivery to your accommodation",
                    )}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {t(
                      "Option à ajouter au panier",
                      "Option added at checkout",
                    )}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-primary-light/50 p-4">
                <span className="text-3xl font-bold text-sapin">
                  {site.deliveryWindow}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-700">
                {t(
                  "Nous planifions le créneau de livraison et vous déposons tout sur place, prêt à l'emploi.",
                  "We schedule the delivery slot and drop everything off, ready to use.",
                )}
              </p>
            </article>
          </div>

          <div className="mt-5 flex flex-col items-start justify-between gap-3 rounded-[20px] border border-primary/10 bg-neige p-4 sm:flex-row sm:items-center">
            <p className="text-sm font-medium text-ardoise">
              {t(
                "Une question sur votre commande ?",
                "A question about your order?",
              )}
            </p>
            <a
              href={SITE.phoneHref}
              className="inline-flex items-center gap-2 rounded-full bg-sapin px-5 py-2 text-sm font-semibold text-white transition hover:bg-sapin/90"
            >
              {t("Appeler le", "Call")} {SITE.phone}
            </a>
          </div>
        </PageContainer>
      </section>
    </>
  );
}

function iconBase(className?: string) {
  return `text-current ${className ?? ""}`;
}

function BagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconBase(className)}>
      <path
        d="M7 9V7a5 5 0 0 1 10 0v2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <rect
        x="4"
        y="9"
        width="16"
        height="11"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function BabyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconBase(className)}>
      <circle cx="12" cy="10" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M7 18a5 5 0 0 1 10 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
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
      <path
        d="m18.5 14 0.8 1.8 1.7 0.7-1.7 0.8-0.8 1.7-0.8-1.7-1.7-0.8 1.7-0.7 0.8-1.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function RouteIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconBase(className)}>
      <circle cx="6" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="18" cy="18" r="2.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M8.5 6h3.7a3 3 0 0 1 3 3v1.8a3 3 0 0 1-3 3H9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CategoryIcon({
  category,
  className,
}: {
  category: ProductCategory;
  className?: string;
}) {
  if (category === "equipement_bebe") {
    return <BabyIcon className={className} />;
  }

  if (category === "menage") {
    return <BucketIcon className={className} />;
  }

  if (category === "livraison") {
    return <TruckIcon className={className} />;
  }

  return <LaundryIcon className={className} />;
}

function LaundryIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconBase(className)}>
      <rect
        x="4"
        y="4.5"
        width="16"
        height="15"
        rx="2.4"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="12"
        cy="12.5"
        r="3.2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="8" cy="8" r="0.9" fill="currentColor" />
    </svg>
  );
}

function BucketIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconBase(className)}>
      <path
        d="M7.5 9h9l-1.3 8.5a2 2 0 0 1-2 1.7h-2.4a2 2 0 0 1-2-1.7L7.5 9Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 9V7.9A2.8 2.8 0 0 1 12 5.1a2.8 2.8 0 0 1 2.8 2.8V9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconBase(className)}>
      <path d="M4 7.5h10v7H4v-7Z" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M14 10h3.2l2 2.4v2.1H14V10Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="8"
        cy="16.6"
        r="1.6"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="17"
        cy="16.6"
        r="1.6"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}
