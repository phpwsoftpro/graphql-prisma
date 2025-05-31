/*
  Warnings:

  - You are about to drop the column `name` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `_QuoteProducts` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `title` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPrice` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_QuoteProducts" DROP CONSTRAINT "_QuoteProducts_A_fkey";

-- DropForeignKey
ALTER TABLE "_QuoteProducts" DROP CONSTRAINT "_QuoteProducts_B_fkey";

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN "avatarUrl" TEXT;
ALTER TABLE "Contact" ADD COLUMN "timezone" TEXT;

-- AlterTable
ALTER TABLE "Product" RENAME COLUMN "name" TO "title";
ALTER TABLE "Product" RENAME COLUMN "price" TO "unitPrice";

-- DropTable
DROP TABLE "_QuoteProducts";

-- CreateTable
CREATE TABLE "QuoteProduct" (
    "id" SERIAL NOT NULL,
    "quoteId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "QuoteProduct_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuoteProduct" ADD CONSTRAINT "QuoteProduct_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteProduct" ADD CONSTRAINT "QuoteProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Update totalPrice based on existing data
UPDATE "QuoteProduct" qp
SET "totalPrice" = p."unitPrice" * qp."quantity" * (1 - qp."discount" / 100)
FROM "Product" p
WHERE qp."productId" = p."id";

-- Remove default value from totalPrice
ALTER TABLE "QuoteProduct" ALTER COLUMN "totalPrice" DROP DEFAULT;
