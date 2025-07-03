/*
  Warnings:

  - You are about to drop the column `startDate` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "startDate";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "startDate" TIMESTAMP(3);
