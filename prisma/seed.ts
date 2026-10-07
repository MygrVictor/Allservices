import { PrismaClient } from "@prisma/client";
import { PRODUCTS } from "../src/lib/catalog";

const prisma = new PrismaClient();

async function main() {
  for (const product of PRODUCTS) {
    await prisma.product.upsert({
      where: { code: product.code },
      update: {
        name: product.name,
        description: product.description,
        priceCents: product.priceCents,
        targetAudience: product.targetAudience,
        category: product.category,
        isActive: product.active,
      },
      create: {
        code: product.code,
        name: product.name,
        description: product.description,
        priceCents: product.priceCents,
        targetAudience: product.targetAudience,
        category: product.category,
        isActive: product.active,
      },
    });
  }

  console.log(`Seed terminé: ${PRODUCTS.length} produits actifs.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
