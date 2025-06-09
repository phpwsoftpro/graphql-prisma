/*
  Warnings:

  - You are about to drop the column `salesOwnerId` on the `Deal` table. All the data in the column will be lost.
  - The primary key for the `_EventParticipants` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_TaskUsers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_EventParticipants` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_TaskUsers` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Deal" DROP CONSTRAINT "Deal_salesOwnerId_fkey";

-- AlterTable
ALTER TABLE "Deal" DROP COLUMN "salesOwnerId",
ADD COLUMN     "dealOwnerId" INTEGER;

-- AlterTable
ALTER TABLE "_EventParticipants" DROP CONSTRAINT "_EventParticipants_AB_pkey";

-- AlterTable
ALTER TABLE "_TaskUsers" DROP CONSTRAINT "_TaskUsers_AB_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "_EventParticipants_AB_unique" ON "_EventParticipants"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_TaskUsers_AB_unique" ON "_TaskUsers"("A", "B");

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_dealOwnerId_fkey" FOREIGN KEY ("dealOwnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
