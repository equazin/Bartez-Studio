CREATE TABLE IF NOT EXISTS "WaConversation" (
  "id" TEXT NOT NULL,
  "waId" TEXT NOT NULL,
  "profileName" TEXT,
  "category" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "leadCreated" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "WaConversation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "WaMessage" (
  "id" TEXT NOT NULL,
  "conversationId" TEXT NOT NULL,
  "waMessageId" TEXT NOT NULL,
  "direction" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "body" TEXT,
  "category" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WaMessage_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "WaConversation_waId_key" ON "WaConversation"("waId");
CREATE INDEX IF NOT EXISTS "WaConversation_status_updatedAt_idx" ON "WaConversation"("status", "updatedAt");
CREATE UNIQUE INDEX IF NOT EXISTS "WaMessage_waMessageId_key" ON "WaMessage"("waMessageId");
CREATE INDEX IF NOT EXISTS "WaMessage_conversationId_createdAt_idx" ON "WaMessage"("conversationId", "createdAt");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'WaMessage_conversationId_fkey'
  ) THEN
    ALTER TABLE "WaMessage"
      ADD CONSTRAINT "WaMessage_conversationId_fkey"
      FOREIGN KEY ("conversationId") REFERENCES "WaConversation"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
