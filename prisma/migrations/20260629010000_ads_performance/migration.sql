CREATE TABLE IF NOT EXISTS "AdCampaign" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "platform" TEXT NOT NULL,
  "externalCampaignId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'unknown',
  "dailyBudget" DECIMAL(14,2),
  "lastSyncedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "AdCampaign_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AdMetricDaily" (
  "id" TEXT NOT NULL,
  "campaignId" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "spend" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "impressions" INTEGER NOT NULL DEFAULT 0,
  "clicks" INTEGER NOT NULL DEFAULT 0,
  "leads" INTEGER NOT NULL DEFAULT 0,
  "conversions" INTEGER NOT NULL DEFAULT 0,
  "revenue" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "AdMetricDaily_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "AdCampaign_organizationId_platform_externalCampaignId_key"
  ON "AdCampaign"("organizationId", "platform", "externalCampaignId");

CREATE INDEX IF NOT EXISTS "AdCampaign_organizationId_platform_idx"
  ON "AdCampaign"("organizationId", "platform");

CREATE INDEX IF NOT EXISTS "AdCampaign_status_idx"
  ON "AdCampaign"("status");

CREATE UNIQUE INDEX IF NOT EXISTS "AdMetricDaily_campaignId_date_key"
  ON "AdMetricDaily"("campaignId", "date");

CREATE INDEX IF NOT EXISTS "AdMetricDaily_date_idx"
  ON "AdMetricDaily"("date");

ALTER TABLE "AdMetricDaily"
  ADD CONSTRAINT "AdMetricDaily_campaignId_fkey"
  FOREIGN KEY ("campaignId") REFERENCES "AdCampaign"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
