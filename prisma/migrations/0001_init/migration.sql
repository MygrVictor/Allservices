-- CreateEnum
CREATE TYPE "TargetAudience" AS ENUM ('proprietaire', 'vacancier');

-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('remise_cles', 'etat_des_lieux', 'linge', 'equipement_bebe', 'menage', 'livraison', 'blanchisserie');

-- CreateEnum
CREATE TYPE "Residence" AS ENUM ('arc_1800', 'arc_2000');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('pending', 'paid', 'cancelled');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priceCents" INTEGER NOT NULL,
    "targetAudience" "TargetAudience" NOT NULL,
    "category" "ProductCategory" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "targetAudience" "TargetAudience" NOT NULL,
    "residence" "Residence",
    "propertyReference" TEXT,
    "dateArrivee" TIMESTAMP(3) NOT NULL,
    "dateDepart" TIMESTAMP(3) NOT NULL,
    "creneauLivraison" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'pending',
    "montantTotalCents" INTEGER NOT NULL,
    "stripeSessionId" TEXT,
    "clientNom" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "clientTelephone" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingItem" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPriceCents" INTEGER NOT NULL,

    CONSTRAINT "BookingItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_code_key" ON "Product"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_stripeSessionId_key" ON "Booking"("stripeSessionId");

-- CreateIndex
CREATE INDEX "Booking_dateArrivee_dateDepart_idx" ON "Booking"("dateArrivee", "dateDepart");

-- CreateIndex
CREATE INDEX "Booking_targetAudience_residence_idx" ON "Booking"("targetAudience", "residence");

-- CreateIndex
CREATE INDEX "BookingItem_bookingId_idx" ON "BookingItem"("bookingId");

-- CreateIndex
CREATE INDEX "BookingItem_productId_idx" ON "BookingItem"("productId");

-- AddForeignKey
ALTER TABLE "BookingItem" ADD CONSTRAINT "BookingItem_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingItem" ADD CONSTRAINT "BookingItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

