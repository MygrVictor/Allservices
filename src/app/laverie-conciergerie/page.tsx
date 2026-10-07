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
                "Deux agences aux Arcs pour la conciergerie, le ménage et la blanchisserie. À Arc 2000, la laverie automatique en libre-service est ouverte à l'année, 7j/7 et 24h/24.",
                "Two offices in Les Arcs for concierge, cleaning and laundry services. In Arc 2000, the self-service launderette is open all year round, 7 days a week, 24/7.",
              )}
            </p>
          </div>
          <ArcsMapIllustration className="h-36 w-full" />
        </div>
        <div className="mt-8">
          <StationCards showGallery />
        </div>
      </section>
    </PageContainer>
  );
}
