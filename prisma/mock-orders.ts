/**
 * Génère des commandes fictives (payées) pour tester le back-office.
 * Usage : npx tsx prisma/mock-orders.ts [nombre]   (défaut : 40)
 * Supprimer : npx tsx prisma/mock-orders.ts --clean
 */
import { BookingStatus, PrismaClient, Residence } from "@prisma/client";

const prisma = new PrismaClient();
const MOCK_TAG = "[MOCK]";

const NOMS = [
  "Camille Martin",
  "Lucas Bernard",
  "Emma Dubois",
  "Hugo Thomas",
  "Léa Robert",
  "Louis Richard",
  "Chloé Petit",
  "Gabriel Durand",
  "Manon Leroy",
  "Jules Moreau",
  "Sarah Simon",
  "Tom Laurent",
  "James Smith",
  "Olivia Brown",
  "Pieter de Vries",
  "Sophie Janssens",
  "Anna Müller",
  "Marco Rossi",
];
const ADRESSES = [
  "Résidence Les Ecrins, apt 312",
  "Chalet Le Lys, n°4",
  "Résidence Pierre Blanche, apt B21",
  "Hameau du Glacier, chalet 7",
  "Résidence Les Belles Challes, apt 105",
];
const NOTES = [
  null,
  null,
  null,
  "Arrivée tardive vers 21h",
  "Lit bébé à installer si possible",
  "Merci de laisser le linge à l'accueil",
  "Nous sommes 2 adultes et 2 enfants",
];

const rand = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

async function main() {
  if (process.argv.includes("--clean")) {
    const { count } = await prisma.booking.deleteMany({
      where: { notes: { startsWith: MOCK_TAG } },
    });
    console.log(`${count} commandes fictives supprimées.`);
    return;
  }

  const n = Number(process.argv[2]) || 40;
  const products = await prisma.product.findMany({
    where: { isActive: true, priceCents: { gt: 0 } },
  });
  const vacancier = products.filter(
    (p) => p.targetAudience === "vacancier" && p.category !== "livraison",
  );
  const livraison = products.find((p) => p.category === "livraison");
  if (vacancier.length === 0) throw new Error("Lancez d'abord le seed.");

  for (let i = 0; i < n; i++) {
    // Seuls les vacanciers commandent en ligne.
    const isProprio = false;
    const pool = vacancier;

    // 1 à 5 produits différents
    const chosen = [...pool]
      .sort(() => Math.random() - 0.5)
      .slice(0, randInt(1, Math.min(5, pool.length)));
    const lines = chosen.map((p) => ({ product: p, quantity: randInt(1, 4) }));

    const delivery = !isProprio && livraison && Math.random() < 0.4;
    if (delivery) lines.push({ product: livraison, quantity: 1 });

    // Commandes passées sur les 60 derniers jours, séjours de -20 à +60 jours
    const createdAt = new Date(
      Date.now() - randInt(0, 60) * 86400000 - randInt(0, 86400000),
    );
    const arrivee = new Date();
    arrivee.setHours(0, 0, 0, 0);
    arrivee.setDate(arrivee.getDate() + randInt(-20, 60));
    const depart = new Date(arrivee);
    depart.setDate(depart.getDate() + rand([3, 5, 7, 7, 7, 10, 14]));

    const nom = rand(NOMS);
    const note = rand(NOTES);
    const total = lines.reduce(
      (s, l) => s + l.product.priceCents * l.quantity,
      0,
    );

    await prisma.booking.create({
      data: {
        targetAudience: isProprio ? "proprietaire" : "vacancier",
        residence: rand([Residence.arc_1800, Residence.arc_2000]),
        propertyReference: isProprio || delivery ? rand(ADRESSES) : null,
        dateArrivee: arrivee,
        dateDepart: depart,
        creneauLivraison: isProprio
          ? null
          : delivery
            ? "Livraison entre 17h – 19h (créneau planifié par All Services)"
            : "Retrait en magasin pendant les heures d'ouverture",
        status: BookingStatus.paid,
        montantTotalCents: total,
        paymentProvider: "mock",
        paymentRef: `mock_${createdAt.getTime()}_${i}`,
        paidAt: new Date(createdAt.getTime() + 60000),
        createdAt,
        clientNom: nom,
        clientEmail: `${nom
          .toLowerCase()
          .normalize("NFD")
          .replace(/[^a-z ]/g, "")
          .replace(/ /g, ".")}@example.com`,
        clientTelephone:
          Math.random() < 0.85
            ? `+33 6 ${randInt(10, 99)} ${randInt(10, 99)} ${randInt(10, 99)} ${randInt(10, 99)}`
            : null,
        notes: note ? `${MOCK_TAG} ${note}` : MOCK_TAG,
        items: {
          create: lines.map((l) => ({
            productId: l.product.id,
            quantity: l.quantity,
            unitPriceCents: l.product.priceCents,
          })),
        },
      },
    });
  }
  console.log(`${n} commandes fictives créées.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
