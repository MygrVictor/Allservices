export type Audience = "proprietaire" | "vacancier";

export type Residence = "arc_1800" | "arc_2000";

export type ProductCategory =
  | "remise_cles"
  | "etat_des_lieux"
  | "linge"
  | "equipement_bebe"
  | "menage"
  | "livraison"
  | "blanchisserie"
  | "ski";

export type CatalogProduct = {
  code: string;
  name: string;
  description: string;
  priceCents: number;
  /**
   * Supplément par jour de location au-delà de INCLUDED_RENTAL_DAYS
   * (le prix de base couvre 7 jours).
   */
  extraDayCents?: number;
  targetAudience: Audience;
  category: ProductCategory;
  active: boolean;
  /** Produit propre à une station (ex. packs ski). */
  residence?: Residence;
  /** Profil du pack ski. */
  skier?: "adulte" | "enfant";
  /**
   * Si renseigné : tarif non défini, le produit est affiché mais NON
   * commandable. Le texte est affiché à la place du prix.
   */
  pricePending?: string;
  /** Traductions saisies dans le back-office (prioritaires). */
  nameEn?: string;
  descriptionEn?: string;
  /** Photo de la prestation (URL, ex. /api/images/xxx). */
  photo?: string;
};

/** Nombre de jours de location couverts par le prix de base. */
export const INCLUDED_RENTAL_DAYS = 7;

/** Durée du séjour en jours (départ - arrivée). 0 si dates invalides. */
export function stayDays(dateArrivee?: string, dateDepart?: string): number {
  if (!dateArrivee || !dateDepart) return 0;
  const a = new Date(dateArrivee).getTime();
  const d = new Date(dateDepart).getTime();
  if (Number.isNaN(a) || Number.isNaN(d) || d <= a) return 0;
  return Math.round((d - a) / 86_400_000);
}

/** Prix unitaire pour la durée du séjour (base + supplément dès le 8e jour). */
export function unitPriceForStay(
  product: Pick<CatalogProduct, "priceCents" | "extraDayCents">,
  days: number,
): number {
  const extraDays = Math.max(0, days - INCLUDED_RENTAL_DAYS);
  return product.priceCents + (product.extraDayCents ?? 0) * extraDays;
}

export const PRODUCTS: CatalogProduct[] = [
  {
    code: "accueil-clefs-illimite",
    name: "Accueil et remise de clefs illimité en saison",
    description: "Remises de clés pendant la saison.",
    priceCents: 38000,
    targetAudience: "proprietaire",
    category: "remise_cles",
    active: true,
  },
  {
    code: "remise-clefs-etat-lieux",
    name: "Remise des clefs / état des lieux de sortie",
    description: "Remise des clés avec état des lieux de sortie.",
    priceCents: 6500,
    targetAudience: "proprietaire",
    category: "etat_des_lieux",
    active: true,
  },
  {
    code: "kit-draps-1p",
    extraDayCents: 200,
    name: "Kit draps 1 pers.",
    description: "Drap housse, drap plat et taie pour lit simple.",
    priceCents: 2000,
    targetAudience: "vacancier",
    category: "linge",
    active: true,
  },
  {
    code: "kit-draps-2p",
    extraDayCents: 400,
    name: "Kit draps 2 pers.",
    description: "Drap housse, drap plat et taies pour lit double.",
    priceCents: 2800,
    targetAudience: "vacancier",
    category: "linge",
    active: true,
  },
  {
    code: "kit-housse-1p",
    extraDayCents: 200,
    name: "Kit housse de couette 1 pers. sans serviettes",
    description: "Housse de couette + taie, sans linge de bain.",
    priceCents: 2000,
    targetAudience: "vacancier",
    category: "linge",
    active: true,
  },
  {
    code: "kit-housse-2p",
    extraDayCents: 400,
    name: "Kit housse de couette 2 pers. sans serviettes",
    description: "Housse de couette double + taies, sans serviettes.",
    priceCents: 2800,
    targetAudience: "vacancier",
    category: "linge",
    active: true,
  },
  {
    code: "pack-housse-1p-serviette",
    extraDayCents: 300,
    name: "Pack housse de couette + 1 serviette (1 pers.)",
    description:
      " 1 housse de couette 1 pers., 1 drap housse, 1 taie d'oreiller, 1 serviette de toilette.",
    priceCents: 3200,
    targetAudience: "vacancier",
    category: "linge",
    active: true,
  },
  {
    code: "pack-housse-2p-serviettes",
    extraDayCents: 500,
    name: "Pack housse de couette + 2 serviettes (2 pers.)",
    description:
      " 1 housse de couette 2 pers., 1 drap housse 2 pers., 2 taies d'oreiller, 2 serviettes de toilette.",
    priceCents: 3800,
    targetAudience: "vacancier",
    category: "linge",
    active: true,
  },
  {
    code: "pack-draps-plats-1p",
    extraDayCents: 300,
    name: "Pack draps plats + 1 serviette (1 pers.)",
    description:
      " 1 drap plat (dessous), 1 drap plat (dessus), 1 taie d'oreiller, 1 serviette de toilette.",
    priceCents: 3200,
    targetAudience: "vacancier",
    category: "linge",
    active: true,
  },
  {
    code: "pack-draps-plats-2p",
    extraDayCents: 500,
    name: "Pack draps plats + 2 serviettes (2 pers.)",
    description:
      "2 draps plats 2 pers. (dessous + dessus), 2 taies d'oreiller, 2 serviettes de toilette.",
    priceCents: 3800,
    targetAudience: "vacancier",
    category: "linge",
    active: true,
  },
  {
    code: "pack-serviettes",
    name: "Pack de serviettes (la paire)",
    description: "Deux serviettes de toilette.",
    priceCents: 1500,
    targetAudience: "vacancier",
    category: "linge",
    active: true,
  },
  {
    code: "torchon-tapis-bain",
    name: "Torchon cuisine + tapis de bain",
    description: "Complément linge cuisine/salle de bain.",
    priceCents: 1000,
    targetAudience: "vacancier",
    category: "linge",
    active: true,
  },
  {
    code: "kit-menage-sejour",
    name: "Kit de ménage pour le séjour",
    description: "Kit de base pour l'entretien du logement pendant le séjour.",
    priceCents: 1000,
    targetAudience: "vacancier",
    category: "menage",
    active: true,
  },
  {
    code: "chaise-haute-bebe",
    name: "Chaise haute bébé",
    description: "Mise à disposition pour la durée du séjour.",
    priceCents: 2000,
    targetAudience: "vacancier",
    category: "equipement_bebe",
    active: true,
  },
  {
    code: "lit-parapluie-bebe",
    name: "Lit parapluie bébé",
    description: "Lit bébé pliant, prêt à l'arrivée.",
    priceCents: 3500,
    targetAudience: "vacancier",
    category: "equipement_bebe",
    active: true,
  },
  {
    code: "livraison-domicile-17-19",
    name: "Livraison du linge (entre 17h et 19h)",
    description:
      "Livraison à votre hébergement le jour d'arrivée, entre 17h et 19h. Créneau planifié par nos soins.",
    priceCents: 3000,
    targetAudience: "vacancier",
    category: "livraison",
    active: true,
  },
  // --- Packs location de ski -------------------------------------------
  // Un pack = un produit valable aux deux stations (retrait à Arc 1800 et
  // Arc 2000, la station est choisie à la commande). Nom, description et
  // photo sont modifiables depuis le back-office.
  {
    code: "ski-pack-adulte",
    name: "Pack location de ski adulte",
    description:
      "Skis + chaussures + bâtons pour la durée du séjour. Bon à présenter en magasin.",
    priceCents: 0,
    targetAudience: "vacancier",
    category: "ski",
    active: true,
    skier: "adulte",
    pricePending: "TARIF À CONFIRMER",
  },
  {
    code: "ski-pack-enfant",
    name: "Pack location de ski enfant",
    description:
      "Skis + chaussures + bâtons (+ casque CONTENU À CONFIRMER). Bon à présenter en magasin.",
    priceCents: 0,
    targetAudience: "vacancier",
    category: "ski",
    active: true,
    skier: "enfant",
    pricePending: "TARIF À CONFIRMER",
  },
];

export const DELIVERY_PRODUCT_CODE = "livraison-domicile-17-19";

/**
 * La location de ski n'est pas encore activée avec le loueur : elle reste
 * grisée tant que NEXT_PUBLIC_SKI_RENTAL_ENABLED n'est pas "true".
 */
export function isSkiRentalEnabled() {
  return process.env.NEXT_PUBLIC_SKI_RENTAL_ENABLED === "true";
}

export function isOrderable(product: CatalogProduct) {
  if (product.category === "ski" && !isSkiRentalEnabled()) return false;
  return product.active && !product.pricePending && product.priceCents > 0;
}

export function skiPacks(residence?: Residence) {
  return PRODUCTS.filter(
    (product) =>
      product.category === "ski" &&
      product.active &&
      (!residence || product.residence === residence),
  );
}

export const AMBIGUOUS_PRODUCT = {
  code: "blanchisserie-domicile",
  name: "Service de blanchisserie à domicile",
  description:
    "Statut à confirmer avec le client (propriétaire en amont ou vacancier pendant le séjour).",
  variants: [
    { label: "Option simple", priceCents: 400 },
    { label: "Option renforcée", priceCents: 800 },
  ],
} as const;

export const residenceOptions = [
  { value: "arc_1800", label: "Arc 1800" },
  { value: "arc_2000", label: "Arc 2000" },
] as const;

export function productsForAudience(audience: Audience) {
  return PRODUCTS.filter(
    (product) => product.targetAudience === audience && product.active,
  );
}

export function formatEuros(cents: number, locale: "fr" | "en" = "fr") {
  return new Intl.NumberFormat(locale === "en" ? "en-GB" : "fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

/**
 * Traductions anglaises du catalogue (affichage uniquement).
 * Les commandes, bons PDF et emails restent en français.
 */
const PRODUCTS_EN: Record<
  string,
  { name: string; description: string; pricePending?: string }
> = {
  "accueil-clefs-illimite": {
    name: "Unlimited guest welcome & key handover for the season",
    description:
      "Welcoming your tenants and coordinating key handovers throughout the season.",
  },
  "remise-clefs-etat-lieux": {
    name: "Key handover / check-out inspection",
    description:
      "Key handover with a check-out inspection in the presence of the tenants.",
  },
  "kit-draps-1p": {
    name: "Sheet kit, single bed",
    description: "Fitted sheet, flat sheet and pillowcase for a single bed.",
  },
  "kit-draps-2p": {
    name: "Sheet kit, double bed",
    description: "Fitted sheet, flat sheet and pillowcases for a double bed.",
  },
  "kit-housse-1p": {
    name: "Duvet cover kit, single, without towels",
    description: "Duvet cover + pillowcase, no bath linen.",
  },
  "kit-housse-2p": {
    name: "Duvet cover kit, double, without towels",
    description: "Double duvet cover + pillowcases, no towels.",
  },
  "pack-housse-1p-serviette": {
    name: "Pack duvet cover + 1 towel (1 person)",
    description:
      "Contents: 1 single duvet cover, 1 fitted sheet, 1 pillowcase, 1 bath towel.",
  },
  "pack-housse-2p-serviettes": {
    name: "Pack duvet cover + 2 towels (2 people)",
    description:
      "Contents: 1 double duvet cover, 1 double fitted sheet, 2 pillowcases, 2 bath towels.",
  },
  "pack-draps-plats-1p": {
    name: "Pack flat sheets + 1 towel (1 person)",
    description:
      "Contents: 1 bottom flat sheet, 1 top flat sheet, 1 pillowcase, 1 bath towel.",
  },
  "pack-draps-plats-2p": {
    name: "Pack flat sheets + 2 towels (2 people)",
    description:
      "Contents: 2 double flat sheets (bottom + top), 2 pillowcases, 2 bath towels.",
  },
  "pack-serviettes": {
    name: "Pack of towels (pair)",
    description: "Two bath towels.",
  },
  "torchon-tapis-bain": {
    name: "Tea towel + bath mat",
    description: "Kitchen / bathroom linen add-on.",
  },
  "kit-menage-sejour": {
    name: "Cleaning kit for your stay",
    description: "Basic kit to keep the accommodation clean during your stay.",
  },
  "chaise-haute-bebe": {
    name: "Baby high chair",
    description: "Provided for the duration of your stay.",
  },
  "lit-parapluie-bebe": {
    name: "Baby travel cot",
    description: "Folding baby cot, ready on arrival.",
  },
  "livraison-domicile-17-19": {
    name: "Linen delivery (between 5pm and 7pm)",
    description:
      "Delivered to your accommodation on arrival day, between 5pm and 7pm. Time slot scheduled by our team.",
  },
  "ski-pack-adulte": {
    name: "Adult ski rental pack",
    description:
      "Skis + boots + poles for your stay. Voucher to present at the shop.",
    pricePending: "PRICE TO BE CONFIRMED",
  },
  "ski-pack-enfant": {
    name: "Child ski rental pack",
    description:
      "Skis + boots + poles (+ helmet TO BE CONFIRMED). Voucher to present at the shop.",
    pricePending: "PRICE TO BE CONFIRMED",
  },
};

/** Version affichable d'un produit dans la langue demandée. */
export function localizeProduct<T extends CatalogProduct>(
  product: T,
  locale: "fr" | "en",
): T {
  if (locale === "fr") return product;
  const en = englishFor(product);
  return {
    ...product,
    name: en.name,
    description: en.description,
    pricePending: product.pricePending
      ? (PRODUCTS_EN[product.code]?.pricePending ?? product.pricePending)
      : undefined,
  };
}

/** Nom / description anglais : saisie back-office, sinon traduction intégrée. */
export function englishFor(product: CatalogProduct) {
  const en = PRODUCTS_EN[product.code];
  return {
    name: product.nameEn || en?.name || product.name,
    description:
      product.descriptionEn || en?.description || product.description,
  };
}

export const AMBIGUOUS_PRODUCT_EN = {
  name: "Laundry service at your accommodation",
} as const;
