import Link from "next/link";
import Image from "next/image";
import { PageContainer } from "@/components/page-container";
import { SiteCart } from "@/components/site-cart";
import { AddToCartButton } from "@/components/add-to-cart-button";
import {
  formatEuros,
  isOrderable,
  localizeProduct,
  skiPacks,
} from "@/lib/catalog";
import { STATIONS } from "@/lib/site-config";
import { getLocale } from "@/lib/i18n-server";
import { makeT } from "@/lib/i18n";

export function generateMetadata() {
  const t = makeT(getLocale());
  return {
    title: t(
      "Packs location de ski — All Services Les Arcs",
      "Ski rental packs — All Services Les Arcs",
    ),
    description: t(
      "Packs location de ski adulte et enfant à Arc 1800 et Arc 2000. Bon téléchargeable et envoyé par mail après paiement.",
      "Adult and child ski rental packs in Arc 1800 and Arc 2000. Voucher downloadable and emailed after payment.",
    ),
  };
}

export default function PacksSkiPage() {
  const locale = getLocale();
  const t = makeT(locale);
  const allPacks = skiPacks().map((p) => localizeProduct(p, locale));

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <Image
          src="/services/vacancier.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-dark/85 via-primary-dark/55 to-transparent"
        />
        <PageContainer>
          <div className="max-w-2xl py-14 sm:py-20">
            <div>
              <p className="text-sm font-semibold tracking-wide text-white/90">
                {t(
                  "All Services Montagne · Location de ski",
                  "All Services Montagne · Ski rental",
                )}
              </p>
              <h1 className="mt-3 text-4xl leading-tight text-white sm:text-5xl">
                {t(
                  "Packs location de ski adulte & enfant",
                  "Adult & child ski rental packs",
                )}
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-white/85">
                {t(
                  "Réservez votre matériel de ski adulte et enfant à Arc 1800 ou Arc 2000. Ajoutez vos packs au panier et finalisez votre commande avec votre linge.",
                  "Book adult and child ski equipment in Arc 1800 or Arc 2000. Add your packs to the basket and complete your order together with your linen.",
                )}
              </p>
              <Link
                href="#packs"
                className="mt-7 inline-flex rounded-full bg-accent px-6 py-3 font-bold text-ardoise hover:bg-accent-dark transition-colors"
              >
                {t("Réserver mon pack ski", "Book my ski pack")}
              </Link>
            </div>
          </div>
        </PageContainer>
      </section>

      <section id="packs" className="scroll-mt-20 py-12">
        <PageContainer>
          <SiteCart />
          <div className="mb-8 flex flex-wrap gap-3">
            {STATIONS.map((station) => (
              <button
                key={station.id}
                className="rounded-full border-2 border-accent/50 bg-gradient-to-br from-accent/10 to-accent/5 px-5 py-2 text-sm font-semibold text-ardoise transition-all hover:border-accent hover:bg-accent/15 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
              >
                {station.name}
              </button>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allPacks.map((pack) => {
              const station = STATIONS.find((s) => s.id === pack.residence);
              return (
                <article
                  key={pack.code}
                  className="rounded-panel border-2 border-accent/70 bg-gradient-to-br from-accent/8 to-accent/5 p-6 shadow-lg hover:shadow-xl hover:border-accent transition-all flex flex-col"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-ardoise">
                        {pack.skier === "enfant"
                          ? t("Pack Enfant", "Child pack")
                          : t("Pack Adulte", "Adult pack")}
                      </h3>
                      {station && (
                        <p className="text-sm text-slate-600 mt-1">
                          {station.name}
                        </p>
                      )}
                    </div>
                    {pack.residence === "arc_1800" && (
                      <Image
                        src="/partners/skiset.png"
                        alt={t("Magasins Skiset", "Skiset shops")}
                        width={100}
                        height={36}
                        className="h-6 w-auto object-contain"
                      />
                    )}
                  </div>

                  <p className="text-sm text-slate-700 mb-4 flex-1">
                    {pack.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-accent/20 pt-4">
                    <div className="text-2xl font-bold">
                      {isOrderable(pack) ? (
                        <span className="text-accent">
                          {formatEuros(pack.priceCents, locale)}
                        </span>
                      ) : (
                        <span className="text-sm font-semibold text-amber-700">
                          {pack.pricePending}
                        </span>
                      )}
                    </div>
                    <AddToCartButton
                      code={pack.code}
                      label={pack.name}
                      disabled={!isOrderable(pack)}
                    />
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-12">
            <h2 className="text-2xl text-ardoise sm:text-3xl">
              {t("Comment ça marche ?", "How does it work?")}
            </h2>
            <ol className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: "⛷",
                  title: t("Choisissez", "Choose"),
                  text: t(
                    "Votre station et vos packs adulte / enfant.",
                    "Your resort and your adult / child packs.",
                  ),
                },
                {
                  icon: "💳",
                  title: t("Payez en ligne", "Pay online"),
                  text: t(
                    "Paiement sécurisé.",
                    "Secure payment.",
                  ),
                },
                {
                  icon: "🎟",
                  title: t("Présentez votre bon", "Show your voucher"),
                  text: t(
                    "Téléchargez-le (aussi envoyé par mail) et présentez-le au magasin.",
                    "Download it (also emailed) and show it at the shop.",
                  ),
                },
              ].map((step, i) => (
                <li
                  key={step.title}
                  className="relative overflow-hidden rounded-[22px] border border-primary/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-2 -top-4 text-[5.5rem] font-bold leading-none text-primary/10"
                  >
                    {i + 1}
                  </span>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-2xl">
                    {step.icon}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-ardoise">
                    <span className="text-accent-dark">{i + 1}.</span>{" "}
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {step.text}
                  </p>
                </li>
              ))}
            </ol>
            <div className="mt-5 flex flex-col items-start justify-between gap-3 rounded-[20px] border border-primary/10 bg-neige p-4 sm:flex-row sm:items-center">
              <p className="text-sm font-medium text-ardoise">
                {t(
                  "Une question sur les packs ski ?",
                  "A question about ski packs?",
                )}
              </p>
              <Link
                href="/contact?sujet=ski"
                className="inline-flex items-center gap-2 rounded-full bg-sapin px-5 py-2 text-sm font-semibold text-white transition hover:bg-sapin/90"
              >
                {t("Contactez-nous", "Contact us")}
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </PageContainer>
      </section>
    </>
  );
}
