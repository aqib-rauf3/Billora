-- Add company to Customer, and extend Estimate to mirror Invoice's shape
-- (number/customer/amount) so the Estimates page can show real data
-- instead of UI-only mock fields. All new columns are nullable / defaulted
-- so this is safe to run against an existing populated table.

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN "company" TEXT;

-- AlterTable
ALTER TABLE "Estimate"
  ADD COLUMN "number" TEXT,
  ADD COLUMN "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
  ADD COLUMN "customerId" TEXT;

-- AddForeignKey
ALTER TABLE "Estimate" ADD CONSTRAINT "Estimate_customerId_fkey"
  FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
