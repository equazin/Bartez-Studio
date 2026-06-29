-- Atribución publicitaria en leads (Google/Meta Ads)
ALTER TABLE "Lead" ADD COLUMN "utmSource" TEXT;
ALTER TABLE "Lead" ADD COLUMN "utmMedium" TEXT;
ALTER TABLE "Lead" ADD COLUMN "utmCampaign" TEXT;
ALTER TABLE "Lead" ADD COLUMN "utmContent" TEXT;
ALTER TABLE "Lead" ADD COLUMN "utmTerm" TEXT;
ALTER TABLE "Lead" ADD COLUMN "gclid" TEXT;
ALTER TABLE "Lead" ADD COLUMN "fbclid" TEXT;
ALTER TABLE "Lead" ADD COLUMN "landingUrl" TEXT;

CREATE INDEX "Lead_utmCampaign_idx" ON "Lead"("utmCampaign");
