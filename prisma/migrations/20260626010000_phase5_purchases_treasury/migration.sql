CREATE TABLE IF NOT EXISTS "Supplier" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "taxId" TEXT,
  "email" TEXT,
  "phone" TEXT,
  "address" TEXT,
  "city" TEXT,
  "country" TEXT,
  "paymentTerms" TEXT,
  "notes" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "PurchaseOrder" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "number" TEXT NOT NULL,
  "supplierId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'issued',
  "currency" TEXT NOT NULL DEFAULT 'ARS',
  "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expectedDate" TIMESTAMP(3),
  "notes" TEXT,
  "subtotal" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "discountTotal" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "taxTotal" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "total" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "issuedAt" TIMESTAMP(3),
  "receivedAt" TIMESTAMP(3),
  "cancelledAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "PurchaseOrderLine" (
  "id" TEXT NOT NULL,
  "purchaseOrderId" TEXT NOT NULL,
  "productId" TEXT,
  "position" INTEGER NOT NULL DEFAULT 0,
  "description" TEXT NOT NULL,
  "quantity" DECIMAL(14,4) NOT NULL DEFAULT 1,
  "unitPrice" DECIMAL(14,4) NOT NULL,
  "discountPct" DECIMAL(5,2) NOT NULL DEFAULT 0,
  "taxRate" DECIMAL(5,2) NOT NULL DEFAULT 21,
  "lineSubtotal" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "lineTax" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "lineTotal" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "received" DECIMAL(14,4) NOT NULL DEFAULT 0,
  CONSTRAINT "PurchaseOrderLine_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "GoodsReceipt" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "number" TEXT NOT NULL,
  "supplierId" TEXT,
  "purchaseOrderId" TEXT,
  "warehouseId" TEXT NOT NULL,
  "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "status" TEXT NOT NULL DEFAULT 'received',
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "GoodsReceipt_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "GoodsReceiptLine" (
  "id" TEXT NOT NULL,
  "goodsReceiptId" TEXT NOT NULL,
  "purchaseOrderLineId" TEXT,
  "productId" TEXT,
  "position" INTEGER NOT NULL DEFAULT 0,
  "description" TEXT NOT NULL,
  "quantity" DECIMAL(14,4) NOT NULL DEFAULT 1,
  "unitCost" DECIMAL(14,4) NOT NULL DEFAULT 0,
  CONSTRAINT "GoodsReceiptLine_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "SupplierPayment" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "number" TEXT NOT NULL,
  "supplierId" TEXT NOT NULL,
  "cashAccountId" TEXT,
  "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "method" TEXT NOT NULL DEFAULT 'transfer',
  "reference" TEXT,
  "amount" DECIMAL(14,2) NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'ARS',
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "SupplierPayment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "SupplierPaymentAllocation" (
  "id" TEXT NOT NULL,
  "paymentId" TEXT NOT NULL,
  "purchaseOrderId" TEXT NOT NULL,
  "amount" DECIMAL(14,2) NOT NULL,
  CONSTRAINT "SupplierPaymentAllocation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "SupplierAccountEntry" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "supplierId" TEXT NOT NULL,
  "purchaseOrderId" TEXT,
  "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "type" TEXT NOT NULL,
  "referenceType" TEXT,
  "referenceId" TEXT,
  "description" TEXT NOT NULL,
  "debit" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "credit" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "currency" TEXT NOT NULL DEFAULT 'ARS',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SupplierAccountEntry_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "CashAccount" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'bank',
  "currency" TEXT NOT NULL DEFAULT 'ARS',
  "balance" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "details" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "CashAccount_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "CashMovement" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "cashAccountId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "description" TEXT NOT NULL,
  "amount" DECIMAL(14,2) NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'ARS',
  "referenceType" TEXT,
  "referenceId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CashMovement_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Supplier_organizationId_active_idx" ON "Supplier"("organizationId", "active");
CREATE INDEX IF NOT EXISTS "Supplier_organizationId_name_idx" ON "Supplier"("organizationId", "name");
CREATE INDEX IF NOT EXISTS "Supplier_taxId_idx" ON "Supplier"("taxId");
CREATE UNIQUE INDEX IF NOT EXISTS "PurchaseOrder_organizationId_number_key" ON "PurchaseOrder"("organizationId", "number");
CREATE INDEX IF NOT EXISTS "PurchaseOrder_organizationId_status_idx" ON "PurchaseOrder"("organizationId", "status");
CREATE INDEX IF NOT EXISTS "PurchaseOrder_supplierId_idx" ON "PurchaseOrder"("supplierId");
CREATE INDEX IF NOT EXISTS "PurchaseOrder_issueDate_idx" ON "PurchaseOrder"("issueDate");
CREATE INDEX IF NOT EXISTS "PurchaseOrderLine_purchaseOrderId_position_idx" ON "PurchaseOrderLine"("purchaseOrderId", "position");
CREATE INDEX IF NOT EXISTS "PurchaseOrderLine_productId_idx" ON "PurchaseOrderLine"("productId");
CREATE UNIQUE INDEX IF NOT EXISTS "GoodsReceipt_organizationId_number_key" ON "GoodsReceipt"("organizationId", "number");
CREATE INDEX IF NOT EXISTS "GoodsReceipt_organizationId_receivedAt_idx" ON "GoodsReceipt"("organizationId", "receivedAt");
CREATE INDEX IF NOT EXISTS "GoodsReceipt_purchaseOrderId_idx" ON "GoodsReceipt"("purchaseOrderId");
CREATE INDEX IF NOT EXISTS "GoodsReceipt_warehouseId_idx" ON "GoodsReceipt"("warehouseId");
CREATE INDEX IF NOT EXISTS "GoodsReceiptLine_goodsReceiptId_position_idx" ON "GoodsReceiptLine"("goodsReceiptId", "position");
CREATE INDEX IF NOT EXISTS "GoodsReceiptLine_purchaseOrderLineId_idx" ON "GoodsReceiptLine"("purchaseOrderLineId");
CREATE INDEX IF NOT EXISTS "GoodsReceiptLine_productId_idx" ON "GoodsReceiptLine"("productId");
CREATE UNIQUE INDEX IF NOT EXISTS "SupplierPayment_organizationId_number_key" ON "SupplierPayment"("organizationId", "number");
CREATE INDEX IF NOT EXISTS "SupplierPayment_organizationId_supplierId_idx" ON "SupplierPayment"("organizationId", "supplierId");
CREATE INDEX IF NOT EXISTS "SupplierPayment_paidAt_idx" ON "SupplierPayment"("paidAt");
CREATE UNIQUE INDEX IF NOT EXISTS "SupplierPaymentAllocation_paymentId_purchaseOrderId_key" ON "SupplierPaymentAllocation"("paymentId", "purchaseOrderId");
CREATE INDEX IF NOT EXISTS "SupplierPaymentAllocation_purchaseOrderId_idx" ON "SupplierPaymentAllocation"("purchaseOrderId");
CREATE INDEX IF NOT EXISTS "SupplierAccountEntry_organizationId_supplierId_date_idx" ON "SupplierAccountEntry"("organizationId", "supplierId", "date");
CREATE INDEX IF NOT EXISTS "SupplierAccountEntry_purchaseOrderId_idx" ON "SupplierAccountEntry"("purchaseOrderId");
CREATE INDEX IF NOT EXISTS "SupplierAccountEntry_referenceType_referenceId_idx" ON "SupplierAccountEntry"("referenceType", "referenceId");
CREATE UNIQUE INDEX IF NOT EXISTS "CashAccount_organizationId_name_key" ON "CashAccount"("organizationId", "name");
CREATE INDEX IF NOT EXISTS "CashAccount_organizationId_active_idx" ON "CashAccount"("organizationId", "active");
CREATE INDEX IF NOT EXISTS "CashMovement_organizationId_date_idx" ON "CashMovement"("organizationId", "date");
CREATE INDEX IF NOT EXISTS "CashMovement_cashAccountId_date_idx" ON "CashMovement"("cashAccountId", "date");
CREATE INDEX IF NOT EXISTS "CashMovement_referenceType_referenceId_idx" ON "CashMovement"("referenceType", "referenceId");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PurchaseOrder_supplierId_fkey') THEN
    ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PurchaseOrderLine_purchaseOrderId_fkey') THEN
    ALTER TABLE "PurchaseOrderLine" ADD CONSTRAINT "PurchaseOrderLine_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PurchaseOrderLine_productId_fkey') THEN
    ALTER TABLE "PurchaseOrderLine" ADD CONSTRAINT "PurchaseOrderLine_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'GoodsReceipt_supplierId_fkey') THEN
    ALTER TABLE "GoodsReceipt" ADD CONSTRAINT "GoodsReceipt_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'GoodsReceipt_purchaseOrderId_fkey') THEN
    ALTER TABLE "GoodsReceipt" ADD CONSTRAINT "GoodsReceipt_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'GoodsReceipt_warehouseId_fkey') THEN
    ALTER TABLE "GoodsReceipt" ADD CONSTRAINT "GoodsReceipt_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'GoodsReceiptLine_goodsReceiptId_fkey') THEN
    ALTER TABLE "GoodsReceiptLine" ADD CONSTRAINT "GoodsReceiptLine_goodsReceiptId_fkey" FOREIGN KEY ("goodsReceiptId") REFERENCES "GoodsReceipt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'GoodsReceiptLine_purchaseOrderLineId_fkey') THEN
    ALTER TABLE "GoodsReceiptLine" ADD CONSTRAINT "GoodsReceiptLine_purchaseOrderLineId_fkey" FOREIGN KEY ("purchaseOrderLineId") REFERENCES "PurchaseOrderLine"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'GoodsReceiptLine_productId_fkey') THEN
    ALTER TABLE "GoodsReceiptLine" ADD CONSTRAINT "GoodsReceiptLine_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SupplierPayment_supplierId_fkey') THEN
    ALTER TABLE "SupplierPayment" ADD CONSTRAINT "SupplierPayment_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SupplierPayment_cashAccountId_fkey') THEN
    ALTER TABLE "SupplierPayment" ADD CONSTRAINT "SupplierPayment_cashAccountId_fkey" FOREIGN KEY ("cashAccountId") REFERENCES "CashAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SupplierPaymentAllocation_paymentId_fkey') THEN
    ALTER TABLE "SupplierPaymentAllocation" ADD CONSTRAINT "SupplierPaymentAllocation_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "SupplierPayment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SupplierPaymentAllocation_purchaseOrderId_fkey') THEN
    ALTER TABLE "SupplierPaymentAllocation" ADD CONSTRAINT "SupplierPaymentAllocation_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SupplierAccountEntry_supplierId_fkey') THEN
    ALTER TABLE "SupplierAccountEntry" ADD CONSTRAINT "SupplierAccountEntry_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SupplierAccountEntry_purchaseOrderId_fkey') THEN
    ALTER TABLE "SupplierAccountEntry" ADD CONSTRAINT "SupplierAccountEntry_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'CashMovement_cashAccountId_fkey') THEN
    ALTER TABLE "CashMovement" ADD CONSTRAINT "CashMovement_cashAccountId_fkey" FOREIGN KEY ("cashAccountId") REFERENCES "CashAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
