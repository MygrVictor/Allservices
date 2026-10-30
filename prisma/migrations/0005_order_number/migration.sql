-- AlterTable : numéro de commande séquentiel (1, 2, 3…)
ALTER TABLE "Booking" ADD COLUMN "orderNumber" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_orderNumber_key" ON "Booking"("orderNumber");
