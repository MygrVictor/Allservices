import { afterEach, describe, expect, it } from "vitest";
import { isOrderable, PRODUCTS } from "@/lib/catalog";
import { SITE } from "@/lib/site-config";
import { applySettings, defaultSettings } from "@/lib/settings-shared";

const product = (code: string) => PRODUCTS.find((p) => p.code === code)!;

afterEach(() => applySettings(null)); // remet les valeurs d'origine

describe("Réglages du back-office", () => {
  it("applique un nouveau prix", () => {
    applySettings({
      prices: { "kit-draps-2p": { priceCents: 3100, active: true } },
    });
    expect(product("kit-draps-2p").priceCents).toBe(3100);
  });

  it("masque un produit désactivé", () => {
    applySettings({
      prices: { "kit-draps-2p": { priceCents: 2800, active: false } },
    });
    expect(product("kit-draps-2p").active).toBe(false);
    expect(isOrderable(product("kit-draps-2p"))).toBe(false);
  });

  it("applique un tarif modifié sur un pack ski, commandable par défaut", () => {
    expect(isOrderable(product("ski-pack-adulte"))).toBe(true);
    applySettings({
      prices: { "ski-pack-adulte": { priceCents: 12900, active: true } },
    });
    expect(product("ski-pack-adulte").priceCents).toBe(12900);
    applySettings({
      prices: { "ski-pack-adulte": { priceCents: 12900, active: false } },
    });
    expect(isOrderable(product("ski-pack-adulte"))).toBe(false);
  });

  it("revient aux valeurs d'origine sans réglages", () => {
    const original = defaultSettings();
    applySettings({
      prices: { "kit-draps-2p": { priceCents: 1, active: false } },
    });
    applySettings(null);
    expect(product("kit-draps-2p").priceCents).toBe(
      original.prices["kit-draps-2p"].priceCents,
    );
    expect(product("ski-pack-adulte").priceCents).toBe(11270);
  });

  it("applique les horaires et ignore un champ vide", () => {
    const original = SITE.deliveryWindow;
    applySettings({
      hours: {
        openingHours: "9h–18h",
        openingHoursEn: "",
        deliveryWindow: "",
        deliveryWindowEn: "",
      },
    });
    expect(SITE.openingHours).toBe("9h–18h");
    expect(SITE.deliveryWindow).toBe(original);
  });
});
