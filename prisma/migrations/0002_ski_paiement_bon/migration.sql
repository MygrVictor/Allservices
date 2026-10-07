-- Packs location de ski
ALTER TYPE "ProductCategory" ADD VALUE IF NOT EXISTS 'ski';

-- Paiement multi-prestataire (Stripe / PayPlug) + bon de commande sans compte
ALTER TABLE "Booking" ADD COLUMN "paymentProvider" TEXT;
ALTER TABLE "Booking" ADD COLUMN "paymentRef" TEXT;
ALTER TABLE "Booking" ADD COLUMN "downloadToken" TEXT;
ALTER TABLE "Booking" ADD COLUMN "paidAt" TIMESTAMP(3);

UPDATE "Booking" SET "downloadToken" = md5(random()::text || id) WHERE "downloadToken" IS NULL;
ALTER TABLE "Booking" ALTER COLUMN "downloadToken" SET NOT NULL;

CREATE UNIQUE INDEX "Booking_paymentRef_key" ON "Booking"("paymentRef");
CREATE UNIQUE INDEX "Booking_downloadToken_key" ON "Booking"("downloadToken");
