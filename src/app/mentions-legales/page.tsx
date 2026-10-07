import { PageContainer } from "@/components/page-container";
import { getT } from "@/lib/i18n-server";

export default function MentionsLegalesPage() {
  const t = getT();
  return (
    <PageContainer>
      <section className="py-12">
        <h1 className="text-4xl text-ardoise">
          {t("Mentions légales", "Legal notice")}
        </h1>
        <div className="mt-6 space-y-4 rounded-panel border border-slate-200 bg-white p-5 text-sm text-slate-700">
          <p>
            All Services — Galerie Commerciale Le Charvet, Arc 1800, 73700
            Bourg-Saint-Maurice.
          </p>
          <p>
            {t("Téléphone", "Phone")} : +33 (0)4 79 07 60 17 · Email :
            contact@allservicesmontagne.com
          </p>
          <p>
            {t("Hébergement", "Hosting")} : OVH SAS, 2 rue Kellermann, 59100
            Roubaix, France.
          </p>
          <p>
            {t(
              "Conformément à la loi Informatique et Libertés, vous disposez d'un droit d'accès, rectification et suppression des données vous concernant.",
              "In accordance with the French Data Protection Act, you have the right to access, correct and delete your personal data.",
            )}
          </p>
        </div>
      </section>
    </PageContainer>
  );
}
