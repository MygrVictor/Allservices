"use client";

import Image from "next/image";
import Link from "next/link";
import { PageContainer } from "@/components/page-container";
import { ReservationForm } from "@/components/reservation-form";
import { useCart } from "@/components/cart-provider";
import { useLocale } from "@/components/locale-provider";
import { makeT } from "@/lib/i18n";
import { formatEuros } from "@/lib/catalog";
import { SITE } from "@/lib/site-config";

export default function CommandePage() {
  const locale = useLocale();
  const t = makeT(locale);
  const { quantities, setQuantities, items } = useCart();
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.priceCents * i.quantity, 0);

  const journey = [
    { label: t("Panier", "Basket"), done: true },
    { label: t("Commande", "Order"), current: true },
    { label: t("Paiement", "Payment") },
    { label: t("Bon de commande", "Order form") },
    { label: t("Bon séjour !", "Enjoy your stay!") },
  ];

  return (
    <>
      {/* En-tête coloré */}
      <section className="relative isolate overflow-hidden">
        <Image
          src="/pages/commande.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-r from-sapin/80 via-sapin/45 to-transparent"
        />
        <div
          aria-hidden
          className="absolute -right-16 -top-16 -z-10 h-64 w-64 rounded-full bg-accent/30 blur-3xl"
        />
        <PageContainer>
          <div className="py-12 text-white sm:py-16">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              🏔️ {t("Dernière étape", "Last step")}
            </p>
            <h1 className="mt-4 max-w-2xl text-3xl leading-tight sm:text-5xl">
              {t(
                "Plus qu'un pas avant un séjour tout confort !",
                "One step away from a comfy stay!",
              )}
            </h1>
            <p className="mt-4 max-w-xl text-white/90">
              {t(
                "Choisissez votre station, vos dates et votre mode de récupération. On s'occupe du reste.",
                "Choose your resort, dates and collection method. We take care of the rest.",
              )}
            </p>
            {count > 0 && (
              <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-accent px-5 py-2.5 font-bold text-ardoise shadow-lg">
                🛒 {count}{" "}
                {t(
                  count > 1 ? "articles" : "article",
                  count > 1 ? "items" : "item",
                )}
                <span className="h-4 w-px bg-ardoise/30" />
                {formatEuros(total, locale)}
              </div>
            )}
          </div>
        </PageContainer>
      </section>

      {/* Frise du parcours */}
      <section className="relative z-10 -mt-7">
        <PageContainer>
          <ol className="flex items-center gap-1 overflow-x-auto rounded-full border border-primary/10 bg-white px-3 py-3 shadow-soft sm:justify-between sm:px-6">
            {journey.map((s, i) => (
              <li key={s.label} className="flex flex-1 items-center gap-2">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    s.done
                      ? "bg-sapin text-white"
                      : s.current
                        ? "bg-accent text-ardoise ring-4 ring-accent/30"
                        : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {s.done ? "✓" : i + 1}
                </span>
                <span
                  className={`whitespace-nowrap text-sm ${
                    s.current ? "font-bold text-ardoise" : "text-slate-600"
                  }`}
                >
                  {s.label}
                </span>
                {i < journey.length - 1 && (
                  <span
                    aria-hidden
                    className={`mx-1 hidden h-0.5 min-w-4 flex-1 rounded sm:block ${
                      s.done ? "bg-sapin" : "bg-slate-200"
                    }`}
                  />
                )}
              </li>
            ))}
          </ol>
        </PageContainer>
      </section>

      {/* Formulaire + colonne d'aide */}
      <section className="bg-gradient-to-b from-neige via-primary-light/20 to-white py-12">
        <PageContainer>
          <div className="grid gap-8 lg:grid-cols-[1fr_18rem] lg:items-start">
            <div className="rounded-[28px] border-2 border-primary/15 bg-white p-5 shadow-xl sm:p-8">
              {count === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-5xl">🛒</p>
                  <h2 className="mt-4 text-2xl text-ardoise">
                    {t("Votre panier est vide", "Your basket is empty")}
                  </h2>
                  <p className="mt-2 text-slate-600">
                    {t(
                      "Ajoutez du linge ou une location de ski pour commencer.",
                      "Add linen or ski rental to get started.",
                    )}
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Link
                      href="/vacanciers#produits"
                      className="rounded-full bg-accent px-5 py-2.5 font-bold text-ardoise hover:bg-accent-dark"
                    >
                      🧺 {t("Voir le linge", "See linen")}
                    </Link>
                    <Link
                      href="/packs-ski"
                      className="rounded-full border-2 border-sapin px-5 py-2.5 font-bold text-sapin hover:bg-sapin hover:text-white"
                    >
                      ⛷️ {t("Location de ski", "Ski rental")}
                    </Link>
                  </div>
                </div>
              ) : (
                <ReservationForm
                  cart={quantities}
                  onCartChange={setQuantities}
                />
              )}
            </div>

            <aside className="space-y-4 lg:sticky lg:top-24">
              {count > 0 && (
                <div className="overflow-hidden rounded-[24px] border-2 border-accent/60 bg-white shadow-lg">
                  <div className="flex items-center justify-between bg-accent px-5 py-3 text-ardoise">
                    <p className="font-bold">
                      🛒 {t("Mon panier", "My basket")}
                    </p>
                    <span className="rounded-full bg-white/70 px-2.5 py-0.5 text-xs font-bold">
                      {count}
                    </span>
                  </div>
                  <ul className="divide-y divide-slate-100 px-5">
                    {items.map((item) => (
                      <li
                        key={item.code}
                        className="flex items-start justify-between gap-3 py-3 text-sm"
                      >
                        <span className="text-ardoise">
                          <span className="mr-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-light px-1.5 text-xs font-bold text-sapin">
                            {item.quantity}×
                          </span>
                          {item.name}
                        </span>
                        <span className="shrink-0 font-semibold text-ardoise">
                          {formatEuros(item.priceCents * item.quantity, locale)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between border-t-2 border-dashed border-accent/40 bg-accent/5 px-5 py-3">
                    <span className="font-bold text-ardoise">Total</span>
                    <span className="text-xl font-bold text-sapin">
                      {formatEuros(total, locale)}
                    </span>
                  </div>
                  <div className="flex gap-3 px-5 pb-4 pt-1 text-xs font-semibold">
                    <Link
                      href="/vacanciers#produits"
                      className="text-primary underline"
                    >
                      + {t("Linge", "Linen")}
                    </Link>
                    <Link href="/packs-ski" className="text-primary underline">
                      + {t("Ski", "Ski")}
                    </Link>
                  </div>
                </div>
              )}
              <div className="rounded-[24px] bg-sapin p-5 text-white shadow-lg">
                <p className="text-lg font-bold">
                  💬 {t("Une question ?", "Any questions?")}
                </p>
                <p className="mt-1 text-sm text-white/85">
                  {t(
                    "Notre équipe locale vous répond 7j/7 en saison.",
                    "Our local team answers 7 days a week in season.",
                  )}
                </p>
                <a
                  href={SITE.phoneHref}
                  className="mt-3 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold text-sapin"
                >
                  📞 {SITE.phone}
                </a>
              </div>

              <p className="px-2 text-xs text-slate-500">
                {t(
                  "Après paiement, votre bon de commande PDF est téléchargeable et envoyé par email.",
                  "After payment, your PDF order form (in French) is downloadable and emailed to you.",
                )}
              </p>
            </aside>
          </div>
        </PageContainer>
      </section>
    </>
  );
}
