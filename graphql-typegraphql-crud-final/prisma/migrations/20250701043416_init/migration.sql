-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "forecastedQuantity" TEXT,
ADD COLUMN     "internalReference" TEXT,
ADD COLUMN     "productTags" TEXT,
ADD COLUMN     "quantityOnHand" TEXT,
ADD COLUMN     "responsible" TEXT,
ADD COLUMN     "unitOfMeasure" TEXT;
