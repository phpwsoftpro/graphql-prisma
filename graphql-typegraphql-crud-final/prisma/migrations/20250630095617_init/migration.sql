-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "QuoteProduct" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';
