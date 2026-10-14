import { afterEach, describe, expect, it } from "vitest";
import {
  isOrderable,
  localizeProduct,
  PRODUCTS,
  type CatalogProduct,
} from "@/lib/catalog";
import { buildOrderLines } from "@/lib/checkout";
import { applySettings, defaultSettings } from "@/lib/settings-shared";

afterEach(() => applySettings(null));

const newProduct: CatalogProduct = {
  code: "kit-serviettes-luxe",
  name: "Kit serviettes luxe",
  description: "2 grandes serviettes + 1 tapis de bain",
  nameEn: "Luxury towel kit",
  priceCents: 1800,
  targetAudience: "vacancier",
  category: "linge",
  active: true,
};

describe("Catalogue géré depuis le back-office", () => {
  it("ajoute une nouvelle prestation commandable", () => {
    applySettings({ catalog: [...defaultSettings().catalog, newProduct] });
    const p = PRODUCTS.find((x) => x.code === newProduct.code);
    expect(p).toBeDefined();
    expect(isOrderable(p!)).toBe(true);
    expect(
      buildOrderLines({
        residence: "arc_1800",
        modeRecuperation: "retrait",
        items: [{ productCode: newProduct.code, quantity: 2 }],
      })!.totalCents,
    ).toBe(3600);
  });

  it("modifie le nom et le contenu d'une prestation existante", () => {
    const catalog = defaultSettings().catalog.map((p) =>
      p.code === "kit-draps-2p"
        ? { ...p, name: "Kit draps double", description: "Nouveau contenu" }
        : p,
    );
    applySettings({ catalog });
    const p = PRODUCTS.find((x) => x.code === "kit-draps-2p")!;
    expect(p.name).toBe("Kit draps double");
    expect(p.description).toBe("Nouveau contenu");
  });

  it("utilise la traduction anglaise saisie, sinon le nom français", () => {
    applySettings({
      catalog: [
        newProduct,
        { ...newProduct, code: "sans-en", nameEn: undefined },
      ],
    });
    expect(localizeProduct(PRODUCTS[0], "en").name).toBe("Luxury towel kit");
    expect(localizeProduct(PRODUCTS[1], "en").name).toBe("Kit serviettes luxe");
  });

  it("une prestation supprimée n'est plus commandable", () => {
    applySettings({
      catalog: defaultSettings().catalog.filter(
        (p) => p.code !== "kit-draps-2p",
      ),
    });
    expect(
      buildOrderLines({
        residence: "arc_1800",
        modeRecuperation: "retrait",
        items: [{ productCode: "kit-draps-2p", quantity: 1 }],
      }),
    ).toBeNull();
  });

  it("le catalogue complet est prioritaire sur l'ancien réglage des tarifs", () => {
    applySettings({
      prices: { "kit-draps-2p": { priceCents: 1, active: true } },
      catalog: defaultSettings().catalog,
    });
    expect(PRODUCTS.find((x) => x.code === "kit-draps-2p")!.priceCents).toBe(
      defaultSettings().catalog.find((x) => x.code === "kit-draps-2p")!
        .priceCents,
    );
  });
});
