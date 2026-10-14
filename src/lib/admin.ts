import type { Residence } from "@prisma/client";
import type { ProductCategory } from "@/lib/catalog";

export const CATEGORY_LABEL: Record<ProductCategory, string> = {
  linge: "Linge de lit / toilette",
  equipement_bebe: "Équipement bébé",
  menage: "Ménage",
  blanchisserie: "Blanchisserie",
  remise_cles: "Remise de clés",
  etat_des_lieux: "État des lieux",
  ski: "Pack ski",
  livraison: "Livraison",
};

export function residenceLabel(residence: Residence | null) {
  if (residence === "arc_1800") return "Arc 1800";
  if (residence === "arc_2000") return "Arc 2000";
  return "—";
}
