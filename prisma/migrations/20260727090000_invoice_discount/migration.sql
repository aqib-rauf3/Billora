-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "discountType" TEXT NOT NULL DEFAULT 'percent',
ADD COLUMN     "discountValue" DOUBLE PRECISION NOT NULL DEFAULT 0;
