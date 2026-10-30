import { afterEach, describe, expect, it, vi } from "vitest";
import { buildOrderLines } from "@/lib/checkout";
import {
  DELIVERY_PRODUCT_CODE,
  PRODUCTS,
  type CatalogProduct,
} from "@/lib/catalog";

const base = {
  residence: "arc_1800" as const,
  modeRecuperation: "retrait" as const,
};

afterEach(() => vi.unstubAllEnvs());

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

  it("refuse un pack ski d'une autre station", () => {
    vi.stubEnv("NEXT_PUBLIC_SKI_RENTAL_ENABLED", "true");
    const pack: CatalogProduct = {
      ...PRODUCTS.find((p) => p.code === "ski-pack-adulte-2000")!,
      priceCents: 9900,
      pricePending: undefined,
    };
    expect(
      buildOrderLines(
        {
          ...base,
          residence: "arc_1800",
          items: [{ productCode: pack.code, quantity: 1 }],
        },
        [pack],
      ),
    ).toBeNull();
    expect(
      buildOrderLines(
        {
          ...base,
          residence: "arc_2000",
          items: [{ productCode: pack.code, quantity: 1 }],
        },
        [pack],
      )!.totalCents,
    ).toBe(9900);
  });
});
