import sharp from "sharp";
import { prisma } from "@/lib/prisma";

const MAX_WIDTH = 1200;
const QUALITY = 80;
const URL_PREFIX = "/api/images/";

/**
 * Réduit une photo envoyée depuis le back-office : 1200 px de large max,
 * format WebP, orientation corrigée (photos de téléphone), métadonnées
 * (GPS…) retirées. Une photo de 5 Mo pèse en général ~100–250 Ko après.
 */
export async function optimizeImage(input: Buffer): Promise<Buffer> {
  return sharp(input, { failOn: "error" })
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toBuffer();
}

/** Enregistre une photo optimisée et renvoie son URL publique. */
export async function storeImage(input: Buffer): Promise<string> {
  const data = await optimizeImage(input);
  const image = await prisma.image.create({
    data: { mimeType: "image/webp", data },
  });
  return `${URL_PREFIX}${image.id}`;
}

export function imageIdFromUrl(url?: string | null) {
  return url?.startsWith(URL_PREFIX) ? url.slice(URL_PREFIX.length) : null;
}

/**
 * Supprime les photos qui ne sont plus utilisées par aucune prestation.
 * Les photos du dossier public/ (URL sans /api/images/) ne sont jamais touchées.
 */
export async function deleteUnusedImages(
  candidates: (string | null | undefined)[],
  stillUsed: (string | null | undefined)[],
) {
  const used = new Set(stillUsed.map(imageIdFromUrl).filter(Boolean));
  const ids = candidates
    .map(imageIdFromUrl)
    .filter((id): id is string => Boolean(id) && !used.has(id));
  if (ids.length === 0) return 0;
  const { count } = await prisma.image.deleteMany({
    where: { id: { in: ids } },
  });
  return count;
}
