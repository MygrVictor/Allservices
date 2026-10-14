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

  it("rend commandable un pack ski dont le prix est renseigné", () => {
    expect(isOrderable(product("ski-pack-adulte-1800"))).toBe(false);
    applySettings({
      prices: { "ski-pack-adulte-1800": { priceCents: 12900, active: true } },
    });
    expect(product("ski-pack-adulte-1800").pricePending).toBeUndefined();
    expect(isOrderable(product("ski-pack-adulte-1800"))).toBe(true);
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
    expect(product("ski-pack-adulte-1800").pricePending).toBeTruthy();
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
