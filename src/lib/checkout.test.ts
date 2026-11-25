import { describe, expect, it } from "vitest";
import { buildOrderLines } from "@/lib/checkout";
import {
  DELIVERY_PRODUCT_CODE,
  PRODUCTS,
  skiPriceForDays,
  type CatalogProduct,
} from "@/lib/catalog";

// Les packs ski se créent dans le back-office : on teste avec un pack fictif.
const SKI_PACK: CatalogProduct = {
  code: "ski-pack-adulte",
  name: "Pack ski adulte",
  description: "",
  priceCents: 11270,
  targetAudience: "vacancier",
  category: "ski",
  active: true,
  skier: "adulte",
};

const base = {
  residence: "arc_1800" as const,
  modeRecuperation: "retrait" as const,
};

const prix = (code: string) =>
  PRODUCTS.find((p) => p.code === code)!.priceCents;

describe("buildOrderLines — calcul du total au paiement", () => {
  it("calcule le total à partir des prix du catalogue serveur", () => {
    const res = buildOrderLines({
      ...base,
      items: [
        { productCode: "kit-draps-2p", quantity: 2 },
        { productCode: "kit-draps-1p", quantity: 1 },
      ],
    });
    expect(res).not.toBeNull();
    expect(res!.totalCents).toBe(
      prix("kit-draps-2p") * 2 + prix("kit-draps-1p"),
    );
  });

  it("ignore tout prix envoyé par le navigateur", () => {
    const res = buildOrderLines({
      ...base,
      // champ pirate : ne doit avoir aucun effet
      items: [
        { productCode: "kit-draps-2p", quantity: 1, priceCents: 1 } as never,
      ],
    });
    expect(res!.totalCents).toBe(prix("kit-draps-2p"));
  });

  it("ajoute la livraison une seule fois en mode livraison", () => {
    const res = buildOrderLines({
      ...base,
      modeRecuperation: "livraison",
      items: [
        { productCode: "kit-draps-2p", quantity: 3 },
        { productCode: "kit-draps-1p", quantity: 2 },
      ],
    });
    const deliveries = res!.lines.filter(
      (l) => l.product.code === DELIVERY_PRODUCT_CODE,
    );
    expect(deliveries).toHaveLength(1);
    expect(deliveries[0].quantity).toBe(1);
    expect(res!.totalCents).toBe(
      prix("kit-draps-2p") * 3 +
        prix("kit-draps-1p") * 2 +
        prix(DELIVERY_PRODUCT_CODE),
    );
  });

  it("n'ajoute pas de livraison en retrait magasin", () => {
    const res = buildOrderLines({
      ...base,
      items: [{ productCode: "kit-draps-2p", quantity: 1 }],
    });
    expect(
      res!.lines.some((l) => l.product.code === DELIVERY_PRODUCT_CODE),
    ).toBe(false);
  });

  it("refuse la livraison ajoutée manuellement au panier", () => {
    expect(
      buildOrderLines({
        ...base,
        items: [{ productCode: DELIVERY_PRODUCT_CODE, quantity: 5 }],
      }),
    ).toBeNull();
  });

  it("refuse un produit propriétaire", () => {
    expect(
      buildOrderLines({
        ...base,
        items: [{ productCode: "accueil-clefs-illimite", quantity: 1 }],
      }),
    ).toBeNull();
  });

  it("refuse un produit inconnu", () => {
    expect(
      buildOrderLines({
        ...base,
        items: [{ productCode: "nexiste-pas", quantity: 1 }],
      }),
    ).toBeNull();
  });

  it("refuse un produit désactivé ou au tarif à confirmer", () => {
    const catalog: CatalogProduct[] = [
      { ...PRODUCTS.find((p) => p.code === "kit-draps-2p")!, active: false },
      {
        ...PRODUCTS.find((p) => p.code === "kit-draps-1p")!,
        pricePending: "À confirmer",
      },
    ];
    expect(
      buildOrderLines(
        { ...base, items: [{ productCode: "kit-draps-2p", quantity: 1 }] },
        catalog,
      ),
    ).toBeNull();
    expect(
      buildOrderLines(
        { ...base, items: [{ productCode: "kit-draps-1p", quantity: 1 }] },
        catalog,
      ),
    ).toBeNull();
  });

  it("accepte un pack ski aux deux stations, refuse un pack d'une autre station", () => {
    const pack: CatalogProduct = {
      ...SKI_PACK,
      priceCents: 9900,
      pricePending: undefined,
    };
    const order = (residence: "arc_1800" | "arc_2000", p: CatalogProduct) =>
      buildOrderLines(
        {
          ...base,
          residence,
          items: [{ productCode: p.code, quantity: 1 }],
        },
        [p],
      );
    expect(order("arc_1800", pack)!.totalCents).toBe(9900);
    expect(order("arc_2000", pack)!.totalCents).toBe(9900);
    const only1800 = { ...pack, residence: "arc_1800" as const };
    expect(order("arc_2000", only1800)).toBeNull();
  });
});

describe("supplément journalier dès le 8e jour", () => {
  const total = (code: string, dateDepart: string) =>
    buildOrderLines({
      ...base,
      dateArrivee: "2026-12-01",
      dateDepart,
      items: [{ productCode: code, quantity: 1 }],
    })!.totalCents;

  it("n'ajoute rien jusqu'à 7 jours", () => {
    expect(total("pack-housse-2p-serviettes", "2026-12-08")).toBe(
      prix("pack-housse-2p-serviettes"),
    );
  });

  it.each([
    ["pack-housse-2p-serviettes", 500],
    ["pack-draps-plats-2p", 500],
    ["pack-housse-1p-serviette", 300],
    ["pack-draps-plats-1p", 300],
    ["kit-draps-2p", 400],
    ["kit-housse-2p", 400],
    ["kit-draps-1p", 200],
    ["kit-housse-1p", 200],
  ])("%s : +%i centimes par jour dès le 8e jour", (code, extra) => {
    // 10 jours = 3 jours de supplément
    expect(total(code, "2026-12-11")).toBe(prix(code) + extra * 3);
  });

  it("ne touche pas les produits sans supplément", () => {
    expect(total("pack-serviettes", "2026-12-20")).toBe(
      prix("pack-serviettes"),
    );
  });
});

describe("location de ski : durée indépendante du séjour", () => {
  const pack: CatalogProduct = {
    ...SKI_PACK,
    priceCents: 11270,
    pricePending: undefined,
  };
  const order = (rentalDays: number | undefined, dateDepart: string) =>
    buildOrderLines(
      {
        ...base,
        dateArrivee: "2026-12-01",
        dateDepart,
        items: [{ productCode: pack.code, quantity: 1, rentalDays }],
      },
      [pack],
    );

  it("prorate le tarif 6 jours au jour (tarif ÷ 6 × jours)", () => {
    expect(order(6, "2026-12-08")!.totalCents).toBe(11270);
    expect(order(3, "2026-12-08")!.totalCents).toBe(5635);
    expect(order(1, "2026-12-08")!.totalCents).toBe(1878);
  });

  it("ne dépend pas de la durée du séjour linge", () => {
    // séjour de 14 jours, ski 3 jours : pas de supplément
    expect(order(3, "2026-12-15")!.totalCents).toBe(5635);
    expect(order(3, "2026-12-15")!.lines[0].rentalDays).toBe(3);
  });

  it("borne la durée (1 à 14 jours) et applique 6 jours par défaut", () => {
    expect(order(undefined, "2026-12-08")!.totalCents).toBe(11270);
    expect(order(99, "2026-12-08")!.lines[0].rentalDays).toBe(14);
    expect(order(0, "2026-12-08")!.lines[0].rentalDays).toBe(1);
  });
});

describe("livraison : réservée au linge", () => {
  const delivery = PRODUCTS.find((p) => p.code === DELIVERY_PRODUCT_CODE)!;
  const ski: CatalogProduct = {
    ...SKI_PACK,
    priceCents: 11270,
    pricePending: undefined,
  };
  const linen = PRODUCTS.find((p) => p.category === "linge")!;
  const order = (codes: string[]) =>
    buildOrderLines(
      {
        ...base,
        modeRecuperation: "livraison",
        items: codes.map((productCode) => ({ productCode, quantity: 1 })),
      },
      [delivery, ski, linen],
    )!;

  it("n'ajoute pas de livraison à un panier 100 % ski", () => {
    const res = order([ski.code]);
    expect(res.lines.map((l) => l.product.code)).toEqual([ski.code]);
    expect(res.totalCents).toBe(skiPriceForDays(11270, 6));
  });

  it("ajoute la livraison dès qu'il y a du linge, même avec du ski", () => {
    const res = order([ski.code, linen.code]);
    expect(res.lines.map((l) => l.product.code)).toContain(
      DELIVERY_PRODUCT_CODE,
    );
  });
});
