-- Agrega soporte de retry a DomainEvent para conversiones publicitarias.
-- status "processed" es el default para no afectar eventos existentes.

ALTER TABLE "DomainEvent" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'processed';
ALTER TABLE "DomainEvent" ADD COLUMN "attemptCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "DomainEvent" ADD COLUMN "lastAttemptAt" TIMESTAMP(3);

CREATE INDEX "DomainEvent_type_status_idx" ON "DomainEvent"("type", "status");
