import sharp from "sharp";
import { beforeEach, describe, expect, it, vi } from "vitest";

const deleteMany = vi.fn(async () => ({ count: 1 }));
vi.mock("@/lib/prisma", () => ({ prisma: { image: { deleteMany } } }));

const { deleteUnusedImages, imageIdFromUrl, optimizeImage } =
  await import("@/lib/images");

beforeEach(() => vi.clearAllMocks());

describe("optimizeImage", () => {
  it("réduit une grande photo à 1200 px de large en WebP, bien plus léger", async () => {
    // Photo « bruitée » 4000×3000, comparable à une photo de téléphone
    const big = await sharp(
      Buffer.alloc(4000 * 3000 * 3).map(() => Math.random() * 255),
      {
        raw: { width: 4000, height: 3000, channels: 3 },
      },
    )
      .jpeg({ quality: 95 })
      .toBuffer();

    const out = await optimizeImage(big);
    const meta = await sharp(out).metadata();
    expect(meta.format).toBe("webp");
    expect(meta.width).toBe(1200);
    expect(meta.height).toBe(900);
    expect(out.length).toBeLessThan(big.length / 3);
  });

  it("n'agrandit pas une petite photo", async () => {
    const small = await sharp({
      create: { width: 400, height: 300, channels: 3, background: "#4a5233" },
    })
      .png()
      .toBuffer();
    expect((await sharp(await optimizeImage(small)).metadata()).width).toBe(
      400,
    );
  });

  it("refuse un fichier qui n'est pas une image", async () => {
    await expect(optimizeImage(Buffer.from("pas une image"))).rejects.toThrow();
  });
});

describe("deleteUnusedImages", () => {
  it("supprime l'ancienne photo si plus aucune prestation ne l'utilise", async () => {
    await deleteUnusedImages(["/api/images/old123"], ["/api/images/new456"]);
    expect(deleteMany).toHaveBeenCalledWith({
      where: { id: { in: ["old123"] } },
    });
  });

  it("garde une photo encore utilisée par une autre prestation", async () => {
    await deleteUnusedImages(["/api/images/shared1"], ["/api/images/shared1"]);
    expect(deleteMany).not.toHaveBeenCalled();
  });

  it("ne touche jamais aux photos du dossier public", async () => {
    await deleteUnusedImages(["/services/blanchisserie.jpg", undefined], []);
    expect(deleteMany).not.toHaveBeenCalled();
  });

  it("extrait l'identifiant uniquement des URL /api/images/", () => {
    expect(imageIdFromUrl("/api/images/abc")).toBe("abc");
    expect(imageIdFromUrl("/hero/arc-1800.jpg")).toBeNull();
  });
});
