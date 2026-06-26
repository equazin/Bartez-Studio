-- Workflow de aprobación de órdenes de compra (Fase 4)

ALTER TABLE "Organization" ADD COLUMN "settings" JSONB;

ALTER TABLE "PurchaseOrder" ADD COLUMN "approvalStatus" TEXT NOT NULL DEFAULT 'not_required';
ALTER TABLE "PurchaseOrder" ADD COLUMN "approvedById" TEXT;
ALTER TABLE "PurchaseOrder" ADD COLUMN "approvedAt" TIMESTAMP(3);
ALTER TABLE "PurchaseOrder" ADD COLUMN "approvalNote" TEXT;
