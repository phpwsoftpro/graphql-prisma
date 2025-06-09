/*
  Warnings:

  - You are about to drop the column `contactId` on the `Deal` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Deal" DROP CONSTRAINT "Deal_contactId_fkey";

-- AlterTable
ALTER TABLE "Deal" DROP COLUMN "contactId",
ADD COLUMN     "dealContactId" INTEGER;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_dealContactId_fkey" FOREIGN KEY ("dealContactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;
