import { PageContainer } from "@/components/page-container";
import { ArcsMapIllustration } from "@/components/illustrations";
import { StationCards } from "@/components/station-cards";
import { getT } from "@/lib/i18n-server";

export default function LaverieConciergeriePage() {
  const t = getT();
  return (
    <PageContainer>
      <section className="py-12">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <h1 className="text-4xl text-ardoise">
              {t("Laverie & Conciergerie", "Laundry & Concierge")}
            </h1>
            <p className="mt-3 max-w-2xl text-slate-700">
              {t(
                "Deux agences sur les Arcs pour la conciergerie, le ménage et la blanchisserie. À Arc 2000, la laverie automatique en libre-service est ouverte à l'année, 7j/7 et 24h/24.",
                "Two offices in Les Arcs for concierge, cleaning and laundry services. In Arc 2000, the self-service launderette is open all year round, 7 days a week, 24/7.",
              )}
            </p>
          </div>
          <ArcsMapIllustration className="h-36 w-full" />
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="rounded-[22px] border border-primary/10 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold tracking-wide text-sapin">
              {t("Vacanciers", "Holidaymakers")}
            </p>
            <h2 className="mt-1 text-2xl text-ardoise">
              {t(
                "Déposez votre linge, on s'en occupe",
                "Drop off your laundry, we take care of it",
              )}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {t(
                "Nos deux conciergeries, à Arc 1800 et Arc 2000, proposent un service de blanchisserie : apportez votre linge pendant les heures d'ouverture et récupérez-le propre.",
                "Both our concierge offices, in Arc 1800 and Arc 2000, offer a laundry service: bring your laundry during opening hours and collect it clean.",
              )}
            </p>
          </article>
          <article className="rounded-[22px] border border-accent/40 bg-accent/10 p-6 shadow-sm">
            <p className="text-sm font-semibold tracking-wide text-sapin">
              {t("Arc 2000", "Arc 2000")}
            </p>
            <h2 className="mt-1 text-2xl text-ardoise">
              {t(
                "Laverie automatique en libre-service",
                "Self-service launderette",
              )}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {t(
                "La laverie d'Arc 2000 est ouverte à l'année, 7j/7 et 24h/24.",
                "The Arc 2000 launderette is open all year round, 7 days a week, 24/7.",
              )}
            </p>
          </article>
        </div>
        <div className="mt-8">
          <StationCards showGallery />
        </div>
      </section>
    </PageContainer>
  );
}
