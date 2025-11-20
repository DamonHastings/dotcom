/*
  Warnings:

  - A unique constraint covering the columns `[providerEventId]` on the table `BlogPost` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_leadId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_userId_fkey";

-- DropIndex
DROP INDEX "Booking_providerEventId_unique";

-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "providerEventId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_providerEventId_key" ON "BlogPost"("providerEventId");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
