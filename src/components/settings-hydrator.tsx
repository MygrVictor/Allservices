"use client";

import { applySettings, type SiteSettings } from "@/lib/settings-shared";

/**
 * Applique côté navigateur les tarifs / horaires définis dans le back-office,
 * avant le rendu des composants enfants.
 */
export function SettingsHydrator({
  settings,
  children,
}: {
  settings: Partial<SiteSettings>;
  children: React.ReactNode;
}) {
  applySettings(settings);
  return <>{children}</>;
}
