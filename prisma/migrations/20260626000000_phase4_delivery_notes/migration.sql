CREATE TABLE IF NOT EXISTS "DeliveryNote" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "number" TEXT NOT NULL,
  "pointOfSale" INTEGER NOT NULL DEFAULT 1,
  "accountId" TEXT,
  "orderId" TEXT,
  "receiverName" TEXT NOT NULL,
  "receiverTaxId" TEXT,
  "receiverAddress" TEXT,
  "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "status" TEXT NOT NULL DEFAULT 'issued',
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "DeliveryNote_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "DeliveryNoteLine" (
  "id" TEXT NOT NULL,
  "deliveryNoteId" TEXT NOT NULL,
  "productId" TEXT,
  "position" INTEGER NOT NULL DEFAULT 0,
  "description" TEXT NOT NULL,
  "quantity" DECIMAL(14,4) NOT NULL DEFAULT 1,
  CONSTRAINT "DeliveryNoteLine_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "DeliveryNote_organizationId_number_key" ON "DeliveryNote"("organizationId", "number");
CREATE INDEX IF NOT EXISTS "DeliveryNote_organizationId_status_idx" ON "DeliveryNote"("organizationId", "status");
CREATE INDEX IF NOT EXISTS "DeliveryNote_accountId_idx" ON "DeliveryNote"("accountId");
CREATE INDEX IF NOT EXISTS "DeliveryNote_orderId_idx" ON "DeliveryNote"("orderId");
CREATE INDEX IF NOT EXISTS "DeliveryNoteLine_deliveryNoteId_position_idx" ON "DeliveryNoteLine"("deliveryNoteId", "position");
CREATE INDEX IF NOT EXISTS "DeliveryNoteLine_productId_idx" ON "DeliveryNoteLine"("productId");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'DeliveryNote_accountId_fkey') THEN
    ALTER TABLE "DeliveryNote"
      ADD CONSTRAINT "DeliveryNote_accountId_fkey"
      FOREIGN KEY ("accountId") REFERENCES "Account"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'DeliveryNote_orderId_fkey') THEN
    ALTER TABLE "DeliveryNote"
      ADD CONSTRAINT "DeliveryNote_orderId_fkey"
      FOREIGN KEY ("orderId") REFERENCES "SalesOrder"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'DeliveryNoteLine_deliveryNoteId_fkey') THEN
    ALTER TABLE "DeliveryNoteLine"
      ADD CONSTRAINT "DeliveryNoteLine_deliveryNoteId_fkey"
      FOREIGN KEY ("deliveryNoteId") REFERENCES "DeliveryNote"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'DeliveryNoteLine_productId_fkey') THEN
    ALTER TABLE "DeliveryNoteLine"
      ADD CONSTRAINT "DeliveryNoteLine_productId_fkey"
      FOREIGN KEY ("productId") REFERENCES "Product"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
