-- Redes sociales: cuentas conectadas + posts (publicados o programados)
CREATE TABLE IF NOT EXISTS "SocialAccount" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "provider" TEXT NOT NULL,           -- 'facebook' | 'instagram'
  "externalId" TEXT NOT NULL,         -- page id o IG business id
  "name" TEXT NOT NULL,               -- nombre visible
  "avatarUrl" TEXT,
  "pageId" TEXT,                      -- FB page id (necesario para publicar en IG)
  "igBusinessId" TEXT,                -- IG business account id (si aplica)
  "tokenExpiresAt" TIMESTAMP(3),
  "scopes" TEXT,
  "connectedById" TEXT,
  "connectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "disconnectedAt" TIMESTAMP(3),
  "lastError" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "SocialAccount_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "SocialAccount_organizationId_provider_externalId_key"
  ON "SocialAccount"("organizationId", "provider", "externalId");
CREATE INDEX IF NOT EXISTS "SocialAccount_organizationId_provider_idx"
  ON "SocialAccount"("organizationId", "provider");

CREATE TABLE IF NOT EXISTS "SocialPost" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "socialAccountId" TEXT NOT NULL,
  "kind" TEXT NOT NULL,               -- 'text' | 'image' | 'carousel' | 'video'
  "caption" TEXT NOT NULL DEFAULT '',
  "mediaUrls" JSONB NOT NULL DEFAULT '[]',
  "linkUrl" TEXT,
  "scheduledAt" TIMESTAMP(3),
  "publishedAt" TIMESTAMP(3),
  "externalPostId" TEXT,
  "permalink" TEXT,
  "status" TEXT NOT NULL DEFAULT 'draft', -- 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed' | 'canceled'
  "error" TEXT,
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "insights" JSONB,
  "insightsSyncedAt" TIMESTAMP(3),
  "createdById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "SocialPost_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "SocialPost_organizationId_status_idx"
  ON "SocialPost"("organizationId", "status");
CREATE INDEX IF NOT EXISTS "SocialPost_socialAccountId_idx"
  ON "SocialPost"("socialAccountId");
CREATE INDEX IF NOT EXISTS "SocialPost_scheduledAt_idx"
  ON "SocialPost"("scheduledAt");

ALTER TABLE "SocialPost"
  ADD CONSTRAINT "SocialPost_socialAccountId_fkey"
  FOREIGN KEY ("socialAccountId") REFERENCES "SocialAccount"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
