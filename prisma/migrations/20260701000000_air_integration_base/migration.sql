-- Integración AIR (proveedor externo, https://api.air-intra.com/v2).
-- Solo tablas y campos aislados; el ERP base no cambia semánticamente.
-- La feature se activa con env AIR_INTEGRATION_ENABLED.

-- Catálogo cacheado desde AIR.
CREATE TABLE IF NOT EXISTS "AirProduct" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "codiart" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "rubro" TEXT,
  "grupo" TEXT,
  "categoria" TEXT,
  "price" DECIMAL(14,2),
  "stockDisp" INTEGER NOT NULL DEFAULT 0,
  "stockFisico" INTEGER NOT NULL DEFAULT 0,
  "stockEntrante" INTEGER NOT NULL DEFAULT 0,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "airUpdatedAt" TIMESTAMP(3),
  "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AirProduct_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "AirProduct_organizationId_codiart_key"
  ON "AirProduct"("organizationId", "codiart");
CREATE INDEX IF NOT EXISTS "AirProduct_organizationId_active_idx"
  ON "AirProduct"("organizationId", "active");
CREATE INDEX IF NOT EXISTS "AirProduct_organizationId_name_idx"
  ON "AirProduct"("organizationId", "name");
CREATE INDEX IF NOT EXISTS "AirProduct_rubro_grupo_idx"
  ON "AirProduct"("rubro", "grupo");

-- Credenciales / token bearer de AIR (una por org).
CREATE TABLE IF NOT EXISTS "AirCredential" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "baseUrl" TEXT NOT NULL DEFAULT 'https://api.air-intra.com/v2',
  "username" TEXT,
  "token" TEXT,
  "tokenExpiresAt" TIMESTAMP(3),
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AirCredential_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "AirCredential_organizationId_key"
  ON "AirCredential"("organizationId");

-- Historial de corridas de sincronización.
CREATE TABLE IF NOT EXISTS "AirSyncRun" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "kind" TEXT NOT NULL,
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "finishedAt" TIMESTAMP(3),
  "pageCursor" INTEGER NOT NULL DEFAULT 0,
  "itemsTouched" INTEGER NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT 'running',
  "error" TEXT,
  CONSTRAINT "AirSyncRun_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "AirSyncRun_organizationId_startedAt_idx"
  ON "AirSyncRun"("organizationId", "startedAt");
CREATE INDEX IF NOT EXISTS "AirSyncRun_status_idx"
  ON "AirSyncRun"("status");

-- Vínculos opcionales con el core del ERP (todos nullable).
ALTER TABLE "SalesOrderLine"
  ADD COLUMN IF NOT EXISTS "unitCost" DECIMAL(14,4),
  ADD COLUMN IF NOT EXISTS "markupPct" DECIMAL(6,2),
  ADD COLUMN IF NOT EXISTS "sourceSystem" TEXT,
  ADD COLUMN IF NOT EXISTS "sourceCode" TEXT;
CREATE INDEX IF NOT EXISTS "SalesOrderLine_sourceSystem_sourceCode_idx"
  ON "SalesOrderLine"("sourceSystem", "sourceCode");

ALTER TABLE "PurchaseOrder"
  ADD COLUMN IF NOT EXISTS "originSaleOrderId" TEXT,
  ADD COLUMN IF NOT EXISTS "supplierSource" TEXT;
CREATE INDEX IF NOT EXISTS "PurchaseOrder_originSaleOrderId_idx"
  ON "PurchaseOrder"("originSaleOrderId");
