import Image from "next/image";
import { ContactForm } from "@/components/contact-form";
import { PageContainer } from "@/components/page-container";
import { SITE } from "@/lib/site-config";
import { CONTACT_SUBJECTS } from "@/lib/validation";
import { getT } from "@/lib/i18n-server";

const SUBJECT_PRESETS: Record<string, string> = {
  proprietaire: CONTACT_SUBJECTS[0],
  ski: CONTACT_SUBJECTS[2],
};

export default function ContactPage({
  searchParams,
}: {
  searchParams: { sujet?: string };
}) {
  const t = getT();
  const defaultSubject = searchParams.sujet
    ? SUBJECT_PRESETS[searchParams.sujet]
    : undefined;
  return (
    <PageContainer>
      <section className="py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-stretch">
          <div className="relative overflow-hidden rounded-panel border border-slate-200 bg-gradient-to-b from-glacier to-white">
            <div className="relative h-64 w-full sm:h-72 lg:h-full">
              <Image
                src="/hero/arc-1800.jpg"
                alt={t(
                  "Paysage de montagne aux Arcs",
                  "Mountain landscape in Les Arcs",
                )}
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ardoise/85 via-ardoise/60 to-transparent p-5 text-white sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
                All Services Montagne
              </p>
              <h1 className="mt-2 text-3xl leading-tight sm:text-4xl">
                Contact
              </h1>
              <p className="mt-2 max-w-xl text-sm text-white/90 sm:text-base">
                {t(
                  "Une équipe locale basée aux Arcs 1800 et 2000 pour répondre rapidement à vos demandes.",
                  "A local team based in Les Arcs 1800 and 2000, ready to answer your requests quickly.",
                )}
              </p>
            </div>
          </div>

          <div className="rounded-panel border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <p className="text-sm font-semibold tracking-wide text-sapin">
              {t("Besoin d'aide ?", "Need help?")}
            </p>
            <p className="mt-2 text-sm text-slate-700">
              {t("Appelez le", "Call")}{" "}
              <a href={SITE.phoneHref} className="font-semibold underline">
                {SITE.phone}
              </a>{" "}
              {t(
                "ou laissez-nous un message. Nous vous répondons au plus vite, 7j/7 en saison.",
                "or leave us a message. We reply as quickly as possible, 7 days a week in season.",
              )}
            </p>

            <ContactForm defaultSubject={defaultSubject} />
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
