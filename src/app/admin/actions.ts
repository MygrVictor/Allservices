"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-session";
import { redirect } from "next/navigation";
import {
  DELIVERY_PRODUCT_CODE,
  PRODUCTS,
  type Audience,
  type CatalogProduct,
  type ProductCategory,
} from "@/lib/catalog";
import { loadSettings, saveSetting } from "@/lib/settings";
import { deleteUnusedImages, storeImage } from "@/lib/images";

/** Défense en profondeur : revérifie la session admin. */
async function assertAdmin() {
  if (!(await verifySessionToken(cookies().get(ADMIN_COOKIE)?.value))) {
    throw new Error("Non autorisé");
  }
}

function eurosToCents(value: FormDataEntryValue | null) {
  const n = Number(
    String(value ?? "")
      .replace(",", ".")
      .replace(/\s/g, ""),
  );
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) : null;
}

export async function savePrices(formData: FormData) {
  await assertAdmin();
  await loadSettings();
  const catalog = PRODUCTS.map((product) => {
    // Seules les prestations vacanciers sont gérées ici.
    if (product.targetAudience !== "vacancier") return product;
    const cents = eurosToCents(formData.get(`price:${product.code}`));
    const priceCents = cents ?? product.priceCents;
    return {
      ...product,
      priceCents,
      active: formData.get(`active:${product.code}`) === "on",
      pricePending: priceCents > 0 ? undefined : product.pricePending,
    };
  });
  await saveSetting("catalog", catalog);
  revalidatePath("/", "layout");
  redirect("/admin/tarifs?ok=1");
}

const CATEGORIES = [
  "remise_cles",
  "etat_des_lieux",
  "linge",
  "equipement_bebe",
  "menage",
  "livraison",
  "blanchisserie",
  "ski",
] as const satisfies readonly ProductCategory[];

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

/** Crée ou modifie une prestation (nom, contenu FR/EN, prix, catégorie…). */
export async function saveProduct(formData: FormData) {
  await assertAdmin();
  await loadSettings();
  const text = (k: string) => String(formData.get(k) ?? "").trim();

  const name = text("name");
  const category = text("category") as ProductCategory;
  // Le back-office ne gère que les prestations vacanciers (commande en ligne).
  const targetAudience: Audience = "vacancier";
  const priceCents = eurosToCents(formData.get("price"));
  const existingCode = text("code");

  if (
    name.length < 2 ||
    !CATEGORIES.includes(category as (typeof CATEGORIES)[number]) ||
    priceCents === null
  ) {
    redirect(`/admin/prestations/${existingCode || "nouvelle"}?erreur=1`);
  }

  const residence = text("residence");
  const skier = text("skier");
  const pricePending = text("pricePending");
  const existing = PRODUCTS.find(
    (p) => p.code === existingCode && p.targetAudience === "vacancier",
  );

  // Photo : nouvelle image envoyée, suppression, ou photo actuelle conservée.
  let photo = existing?.photo;
  if (formData.get("removePhoto") === "on") photo = undefined;
  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 5_000_000) {
      redirect(`/admin/prestations/${existingCode || "nouvelle"}?erreur=photo`);
    }
    try {
      photo = await storeImage(Buffer.from(await file.arrayBuffer()));
    } catch (error) {
      console.error("Photo illisible", error);
      redirect(`/admin/prestations/${existingCode || "nouvelle"}?erreur=photo`);
    }
  }

  let code = existing?.code;
  if (!code) {
    const base = slugify(name) || "prestation";
    code = base;
    let i = 2;
    while (code === "nouvelle" || PRODUCTS.some((p) => p.code === code)) {
      code = `${base}-${i++}`;
    }
  }

  const product: CatalogProduct = {
    code,
    name,
    description: text("description"),
    nameEn: text("nameEn") || undefined,
    descriptionEn: text("descriptionEn") || undefined,
    priceCents,
    targetAudience,
    category,
    active: formData.get("active") === "on",
    residence:
      residence === "arc_1800" || residence === "arc_2000"
        ? residence
        : undefined,
    skier: skier === "adulte" || skier === "enfant" ? skier : undefined,
    pricePending: pricePending || undefined,
    photo,
  };

  const catalog = existing
    ? PRODUCTS.map((p) => (p.code === code ? product : p))
    : [...PRODUCTS, product];
  await saveSetting("catalog", catalog);
  // Photo remplacée ou retirée : on supprime l'ancienne si plus utilisée.
  if (existing?.photo && existing.photo !== photo) {
    await deleteUnusedImages(
      [existing.photo],
      catalog.map((p) => p.photo),
    );
  }
  revalidatePath("/", "layout");
  redirect("/admin/prestations?ok=1");
}

/** Retire une prestation du site (les anciennes commandes restent intactes). */
export async function deleteProduct(formData: FormData) {
  await assertAdmin();
  await loadSettings();
  const code = String(formData.get("code") ?? "");
  if (code === DELIVERY_PRODUCT_CODE) {
    redirect("/admin/prestations?erreur=livraison");
  }
  const removed = PRODUCTS.find(
    (p) => p.code === code && p.targetAudience === "vacancier",
  );
  const catalog = PRODUCTS.filter((p) => p !== removed);
  await saveSetting("catalog", catalog);
  await deleteUnusedImages(
    [removed?.photo],
    catalog.map((p) => p.photo),
  );
  revalidatePath("/", "layout");
  redirect("/admin/prestations?supprime=1");
}

export async function saveHours(formData: FormData) {
  await assertAdmin();
  const text = (k: string) => String(formData.get(k) ?? "").trim();
  await saveSetting("hours", {
    openingHours: text("openingHours"),
    openingHoursEn: text("openingHoursEn"),
    deliveryWindow: text("deliveryWindow"),
    deliveryWindowEn: text("deliveryWindowEn"),
  });
  revalidatePath("/", "layout");
  redirect("/admin/horaires?ok=1");
}
