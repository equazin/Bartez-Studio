-- Contabilidad de partida doble (Fase 3)

CREATE TABLE "LedgerAccount" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "parentId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "LedgerAccount_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LedgerAccount_organizationId_code_key" ON "LedgerAccount"("organizationId", "code");
CREATE INDEX "LedgerAccount_organizationId_type_idx" ON "LedgerAccount"("organizationId", "type");

ALTER TABLE "LedgerAccount" ADD CONSTRAINT "LedgerAccount_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "LedgerAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "JournalEntry" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "referenceType" TEXT,
    "referenceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "voidedAt" TIMESTAMP(3),
    CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "JournalEntry_organizationId_number_key" ON "JournalEntry"("organizationId", "number");
CREATE INDEX "JournalEntry_organizationId_date_idx" ON "JournalEntry"("organizationId", "date");
CREATE INDEX "JournalEntry_referenceType_referenceId_idx" ON "JournalEntry"("referenceType", "referenceId");

CREATE TABLE "JournalLine" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "debit" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "credit" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "description" TEXT,
    CONSTRAINT "JournalLine_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "JournalLine_entryId_idx" ON "JournalLine"("entryId");
CREATE INDEX "JournalLine_accountId_idx" ON "JournalLine"("accountId");

ALTER TABLE "JournalLine" ADD CONSTRAINT "JournalLine_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "JournalEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "JournalLine" ADD CONSTRAINT "JournalLine_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "LedgerAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
