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
};

export const PRODUCTS: CatalogProduct[] = [
  {
    code: "accueil-clefs-illimite",
    name: "Accueil et remise de clefs illimité en saison",
    description:
      "Accueil des locataires et coordination des remises de clés pendant la saison.",
    priceCents: 38000,
    targetAudience: "proprietaire",
    category: "remise_cles",
    active: true,
  },
  {
    code: "remise-clefs-etat-lieux",
    name: "Remise des clefs / état des lieux de sortie",
    description:
      "Remise des clés avec état des lieux de sortie en présence des locataires.",
    priceCents: 6500,
    targetAudience: "proprietaire",
    category: "etat_des_lieux",
    active: true,
  },
  {
    code: "kit-draps-1p",
    name: "Kit draps 1 pers.",
    description: "Drap housse, drap plat et taie pour lit simple.",
    priceCents: 2000,
    targetAudience: "vacancier",
    category: "linge",
    active: true,
  },
  {
    code: "kit-draps-2p",
    name: "Kit draps 2 pers.",
    description: "Drap housse, drap plat et taies pour lit double.",
    priceCents: 2800,
    targetAudience: "vacancier",
    category: "linge",
    active: true,
  },
  {
    code: "kit-housse-1p",
    name: "Kit housse de couette 1 pers. sans serviettes",
    description: "Housse de couette + taie, sans linge de bain.",
    priceCents: 2000,
    targetAudience: "vacancier",
    category: "linge",
    active: true,
  },
  {
    code: "kit-housse-2p",
    name: "Kit housse de couette 2 pers. sans serviettes",
    description: "Housse de couette double + taies, sans serviettes.",
    priceCents: 2800,
    targetAudience: "vacancier",
    category: "linge",
    active: true,
  },
  {
    code: "pack-housse-1p-serviette",
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
  // Arc 1800 : magasins Skiset — TARIFS À COMPLÉTER (renseigner priceCents
  // et retirer pricePending pour activer la commande).
  {
    code: "ski-pack-adulte-1800",
    name: "Pack location de ski adulte — Arc 1800 (Skiset)",
    description:
      "Skis + chaussures + bâtons pour la durée du séjour. Bon à présenter en magasin Skiset.",
    priceCents: 0,
    targetAudience: "vacancier",
    category: "ski",
    active: true,
    residence: "arc_1800",
    skier: "adulte",
    pricePending: "TARIF À CONFIRMER",
  },
  {
    code: "ski-pack-enfant-1800",
    name: "Pack location de ski enfant — Arc 1800 (Skiset)",
    description:
      "Skis + chaussures + bâtons (+ casque CONTENU À CONFIRMER). Bon à présenter en magasin Skiset.",
    priceCents: 0,
    targetAudience: "vacancier",
    category: "ski",
    active: true,
    residence: "arc_1800",
    skier: "enfant",
    pricePending: "TARIF À CONFIRMER",
  },
  // Arc 2000 : partenaire en cours de négociation.
  {
    code: "ski-pack-adulte-2000",
    name: "Pack location de ski adulte — Arc 2000",
    description: "Partenaire et contenu du pack en cours de finalisation.",
    priceCents: 0,
    targetAudience: "vacancier",
    category: "ski",
    active: true,
    residence: "arc_2000",
    skier: "adulte",
    pricePending: "En attente de négociation",
  },
  {
    code: "ski-pack-enfant-2000",
    name: "Pack location de ski enfant — Arc 2000",
    description: "Partenaire et contenu du pack en cours de finalisation.",
    priceCents: 0,
    targetAudience: "vacancier",
    category: "ski",
    active: true,
    residence: "arc_2000",
    skier: "enfant",
    pricePending: "En attente de négociation",
  },
];

export const DELIVERY_PRODUCT_CODE = "livraison-domicile-17-19";

export function isOrderable(product: CatalogProduct) {
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
  "ski-pack-adulte-1800": {
    name: "Adult ski rental pack — Arc 1800 (Skiset)",
    description:
      "Skis + boots + poles for your stay. Voucher to present at the Skiset shop.",
    pricePending: "PRICE TO BE CONFIRMED",
  },
  "ski-pack-enfant-1800": {
    name: "Child ski rental pack — Arc 1800 (Skiset)",
    description:
      "Skis + boots + poles (+ helmet TO BE CONFIRMED). Voucher to present at the Skiset shop.",
    pricePending: "PRICE TO BE CONFIRMED",
  },
  "ski-pack-adulte-2000": {
    name: "Adult ski rental pack — Arc 2000",
    description: "Partner and pack contents being finalised.",
    pricePending: "Pending negotiation",
  },
  "ski-pack-enfant-2000": {
    name: "Child ski rental pack — Arc 2000",
    description: "Partner and pack contents being finalised.",
    pricePending: "Pending negotiation",
  },
};

/** Version affichable d'un produit dans la langue demandée. */
export function localizeProduct<T extends CatalogProduct>(
  product: T,
  locale: "fr" | "en",
): T {
  if (locale === "fr") return product;
  const en = PRODUCTS_EN[product.code];
  if (!en) return product;
  return {
    ...product,
    name: en.name,
    description: en.description,
    pricePending: product.pricePending
      ? (en.pricePending ?? product.pricePending)
      : undefined,
  };
}

export const AMBIGUOUS_PRODUCT_EN = {
  name: "Laundry service at your accommodation",
} as const;
