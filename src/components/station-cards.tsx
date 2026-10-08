import Image from "next/image";
import Link from "next/link";
import { getStations } from "@/lib/site-config";
import { getLocale } from "@/lib/i18n-server";
import { makeT } from "@/lib/i18n";

const GALLERY: Record<string, { src: string; fr: string; en: string }[]> = {
  arc_1800: [
    {
      src: "/stations/arc1800/facade_arc1800.png",
      fr: "Façade de l'agence",
      en: "Office front",
    },
    {
      src: "/stations/arc1800/facade_arc1800_2.png",
      fr: "Galerie de l'agence",
      en: "Office gallery",
    },
  ],
  arc_2000: [
    {
      src: "/stations/arc2000/facade.jpg",
      fr: "Façade de l'agence",
      en: "Office front",
    },
    {
      src: "/stations/arc2000/couloir-acces.jpg",
      fr: "Couloir d'accès",
      en: "Access corridor",
    },
    {
      src: "/stations/arc2000/laverie.jpg",
      fr: "Laverie",
      en: "Launderette",
    },
  ],
};

export function StationCards({
  showGallery = false,
  linkToLaundryPage = false,
}: {
  showGallery?: boolean;
  linkToLaundryPage?: boolean;
}) {
  const locale = getLocale();
  const t = makeT(locale);
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {getStations(locale).map((station) => {
        const card = (
          <article className="flex h-full flex-col overflow-hidden rounded-panel border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
            <div className="relative aspect-[4/3] w-full bg-white">
              <Image
                src={station.photo}
                alt={t(
                  `Plan d'accès à l'agence All Services ${station.name}`,
                  `Map to the All Services ${station.name} office`,
                )}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-contain"
              />
              <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-sm font-bold text-white">
                {station.name}
              </span>
              {station.badge && (
                <span className="absolute bottom-3 left-3 right-3 rounded-lg bg-accent px-3 py-1.5 text-sm font-bold text-ardoise">
                  {station.badge}
                </span>
              )}
            </div>
            {showGallery && GALLERY[station.id] && (
              <ul className="grid grid-cols-3 gap-1.5 bg-white p-1.5">
                {GALLERY[station.id].map((g) => (
                  <li
                    key={g.src}
                    className="relative h-24 overflow-hidden rounded-lg"
                  >
                    <Image
                      src={g.src}
                      alt={`${t(g.fr, g.en)} — ${station.name}`}
                      fill
                      sizes="(min-width: 768px) 16vw, 33vw"
                      className="object-cover"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 pb-1 pt-4 text-xs font-semibold text-white">
                      {t(g.fr, g.en)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-xl text-ardoise">
                All Services {station.name}
              </h3>
              <p className="mt-2 text-sm font-semibold text-ardoise">
                {station.address}
              </p>
              <p className="mt-1 text-sm text-slate-700">
                <span className="font-semibold">
                  {t("Pour s'y rendre : ", "Getting there: ")}
                </span>
                {station.directions}
              </p>
              <ul className="mt-3 space-y-1 text-sm text-slate-700">
                {station.services.map((service) => (
                  <li key={service} className="flex gap-2">
                    <span aria-hidden className="text-primary">
                      ✓
                    </span>
                    {service}
                  </li>
                ))}
              </ul>
              {!linkToLaundryPage && (
                <a
                  href={station.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
                >
                  {t("comment venir à nous", "how to find us")}
                  <span className="sr-only">
                    {" "}
                    {t(
                      `vers ${station.name} (nouvel onglet)`,
                      `to ${station.name} (new tab)`,
                    )}
                  </span>
                  <span aria-hidden>↗</span>
                </a>
              )}
            </div>
          </article>
        );

        if (linkToLaundryPage) {
          return (
            <Link
              key={station.id}
              href="/laverie-conciergerie"
              className="block rounded-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {card}
            </Link>
          );
        }

        return <div key={station.id}>{card}</div>;
      })}
    </div>
  );
}
