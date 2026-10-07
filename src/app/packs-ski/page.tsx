import Link from "next/link";
import Image from "next/image";
import { PageContainer } from "@/components/page-container";
import { SkiersIllustration } from "@/components/illustrations";
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
      <section className="bg-gradient-to-b from-primary via-primary-light to-accent/10">
        <PageContainer>
          <div className="grid gap-6 py-12 sm:py-16 lg:grid-cols-[1.3fr_1fr] lg:items-center">
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
            <SkiersIllustration className="h-48 w-full" />
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

          <div className="mt-8 rounded-panel border-2 border-accent/50 bg-gradient-to-br from-accent/15 to-accent/5 p-5 text-ardoise">
            <h2 className="text-xl font-bold">
              {t("Comment ça marche ?", "How does it work?")}
            </h2>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm">
              <li>
                {t(
                  "Choisissez votre station et vos packs (adulte / enfant).",
                  "Choose your resort and your packs (adult / child).",
                )}
              </li>
              <li>
                {t(
                  "Payez en ligne, sans créer de compte.",
                  "Pay online, no account needed.",
                )}
              </li>
              <li>
                {t(
                  "Téléchargez votre bon (aussi envoyé par mail) et présentez-le au magasin.",
                  "Download your voucher (also emailed) and show it at the shop.",
                )}
              </li>
            </ol>
            <p className="mt-3 text-sm">
              {t("Une question ?", "Any questions?")}{" "}
              <Link
                href="/contact?sujet=ski"
                className="font-semibold text-accent hover:text-accent-dark underline"
              >
                {t("Contactez-nous", "Contact us")}
              </Link>
              .
            </p>
          </div>
        </PageContainer>
      </section>
    </>
  );
}
