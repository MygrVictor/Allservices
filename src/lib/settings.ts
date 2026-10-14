import { cache } from "react";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  applySettings,
  type PriceOverride,
  type SiteSettings,
} from "@/lib/settings-shared";

/**
 * Charge les réglages depuis la base et les applique au catalogue / SITE.
 * À appeler (await) en tête de toute page ou route serveur utilisant les
 * prix ou les horaires. Mis en cache pour la durée d'une requête.
 */
export const loadSettings = cache(async (): Promise<Partial<SiteSettings>> => {
  let settings: Partial<SiteSettings> = {};
  try {
    const rows = await prisma.setting.findMany({
      where: { key: { in: ["prices", "hours", "catalog"] } },
    });
    for (const row of rows) {
      if (row.key === "catalog") {
        settings.catalog = row.value as unknown as SiteSettings["catalog"];
      }
      if (row.key === "prices") {
        settings.prices = row.value as Record<string, PriceOverride>;
      }
      if (row.key === "hours") {
        settings.hours = row.value as SiteSettings["hours"];
      }
    }
  } catch (error) {
    console.error(
      "Réglages indisponibles, valeurs par défaut utilisées",
      error,
    );
    settings = {};
  }
  applySettings(settings);
  return settings;
});

export async function saveSetting<K extends keyof SiteSettings>(
  key: K,
  value: SiteSettings[K],
) {
  const json = value as unknown as Prisma.InputJsonValue;
  await prisma.setting.upsert({
    where: { key },
    create: { key, value: json },
    update: { value: json },
  });
}
