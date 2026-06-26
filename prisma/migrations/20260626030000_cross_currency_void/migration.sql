-- Add exchangeRate to SupplierPayment for cross-currency allocations
ALTER TABLE "SupplierPayment" ADD COLUMN "exchangeRate" DECIMAL(14,6) NOT NULL DEFAULT 1;

-- Add voidedAt to CashMovement for cancellation
ALTER TABLE "CashMovement" ADD COLUMN "voidedAt" TIMESTAMP(3);
