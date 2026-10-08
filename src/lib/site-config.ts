export const SITE = {
  name: "All Services Montagne",
  phone: "+33 (0)4 79 07 60 17",
  phoneHref: "tel:+33479076017",
  email: "contact@allservicesmontagne.com",
  yearsInBusiness: 13,
  /** Heures d'ouverture de la conciergerie (retrait en magasin). */
  openingHours:
    "hiver 7j/7 9h–12h et 15h–19h ; été du mardi au dimanche 9h30–12h et 15h30–18h30, fermé le lundi",
  deliveryWindow: "17h – 19h",
  /**
   * Photo de fond de l'accueil. PLACEHOLDER libre de droits (Unsplash) :
   * à remplacer par une photo des Arcs (ex. /images/hero-les-arcs.jpg).
   */
  // Photo hero locale actuelle (Arc 1800) dans public/
  heroImage: process.env.NEXT_PUBLIC_HERO_IMAGE_URL || "/hero/arc-1800.jpg",
};

export type Station = {
  id: "arc_1800" | "arc_2000";
  name: string;
  address: string;
  directions: string;
  services: string[];
  badge?: string;
  /** Plan d'accès à l'agence. */
  photo: string;
  mapsUrl: string;
};

export const STATIONS: Station[] = [
  {
    id: "arc_1800",
    name: "Arc 1800",
    address: "Galerie du Charvet 73700 Les Arcs 1800",
    directions:
      "Dans la galerie commerciale, en bas de la Poste. Accès piéton depuis le centre Charvet.",
    services: [
      "Conciergerie (remise de clés, états des lieux)",
      "Blanchisserie : déposez votre linge, on le lave pour vous",
      "Location de linge & équipement bébé",
    ],
    photo: "/stations/arc1800/plan.jpg",
    mapsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=" +
      encodeURIComponent(
        "Galerie du Charvet, Arc 1800, 73700 Bourg-Saint-Maurice",
      ),
  },
  {
    id: "arc_2000",
    name: "Arc 2000",
    address: "Place haute, en face de Skiset, 73700 Les Arcs 2000",
    directions: "Sur la place haute d'Arc 2000, face au magasin Skiset.",
    services: [
      "Laverie automatique en libre-service",
      "Conciergerie : mêmes prestations qu'à Arc 1800",
      "Location de linge & équipement bébé",
    ],
    badge: "Laverie automatique ouverte à l'année · 7j/7 · 24h/24",
    photo: "/stations/arc2000/plan.jpg",
    mapsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=" +
      encodeURIComponent("Skiset Arc 2000, 73700 Bourg-Saint-Maurice"),
  },
];

export function isSiteInStandby() {
  return process.env.NEXT_PUBLIC_SITE_STATUS === "veille";
}

/** Textes de SITE dépendant de la langue. */
export function siteText(locale: "fr" | "en") {
  return locale === "en"
    ? {
        openingHours:
          "winter 7 days a week 9am–12pm and 3pm–7pm; summer Tuesday to Sunday 9:30am–12pm and 3:30pm–6:30pm, closed Mondays",
        deliveryWindow: "5pm – 7pm",
      }
    : {
        openingHours: SITE.openingHours,
        deliveryWindow: SITE.deliveryWindow,
      };
}

const STATIONS_EN: Record<
  Station["id"],
  Pick<Station, "address" | "directions" | "services" | "badge">
> = {
  arc_1800: {
    address: "Galerie du Charvet , 73700 Les Arcs 1800",
    directions:
      "In the shopping arcade, below the Post Office. Pedestrian access from the Charvet centre.",
    services: [
      "Concierge (key handover, check-out inspections)",
      "Laundry service: drop off your laundry, we wash it for you",
      "Linen & baby equipment rental",
      "Ski rental packs (Skiset partner)",
    ],
  },
  arc_2000: {
    address: "Upper square, opposite Skiset, 73700 Les Arcs 2000",
    directions: "On the upper square of Arc 2000, facing the Skiset shop.",
    services: [
      "Self-service launderette",
      "Concierge: same services as Arc 1800",
      "Linen & baby equipment rental",
    ],
    badge: "Launderette open all year · 7 days a week · 24/7",
  },
};

/** Stations traduites selon la langue. */
export function getStations(locale: "fr" | "en"): Station[] {
  if (locale === "fr") return STATIONS;
  return STATIONS.map((s) => ({ ...s, ...STATIONS_EN[s.id] }));
}
