/*
  Warnings:

  - You are about to drop the column `title` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `unitPrice` on the `Product` table. All the data in the column will be lost.
  - The `forecastedQuantity` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `quantityOnHand` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `name` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salesPrice` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "title",
DROP COLUMN "unitPrice",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "salesPrice" DOUBLE PRECISION NOT NULL,
DROP COLUMN "forecastedQuantity",
ADD COLUMN     "forecastedQuantity" INTEGER,
DROP COLUMN "quantityOnHand",
ADD COLUMN     "quantityOnHand" INTEGER;
