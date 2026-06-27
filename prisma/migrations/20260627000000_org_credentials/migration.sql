-- Credenciales de integraciones cifradas por organización
CREATE TABLE "OrgCredential" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "valueCiphertext" TEXT NOT NULL,
    "iv" TEXT NOT NULL,
    "authTag" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OrgCredential_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "OrgCredential_organizationId_provider_key_key" ON "OrgCredential"("organizationId", "provider", "key");
CREATE INDEX "OrgCredential_organizationId_provider_idx" ON "OrgCredential"("organizationId", "provider");
