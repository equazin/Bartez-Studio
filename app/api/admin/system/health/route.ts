import { adminOk, adminServerError } from "../../../../../lib/admin-api.ts";
import { authorizeModule } from "../../../../../lib/modules/admin-module.ts";
import { getDb } from "../../../../../lib/db.ts";
import { isEncryptionConfigured } from "../../../../../lib/crypto/secrets.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "sistema:health:read");
  if (!auth.ok) return auth.response;

  const start = Date.now();
  let dbOk = false;
  let dbLatencyMs = 0;
  let migrationsApplied = 0;
  let lastMigrationName: string | null = null;
  let lastMigrationAt: string | null = null;

  try {
    await getDb().$queryRaw`SELECT 1`;
    dbOk = true;
    dbLatencyMs = Date.now() - start;
  } catch {
    dbOk = false;
  }

  if (dbOk) {
    try {
      const rows = await getDb().$queryRaw<Array<{ migration_name: string; finished_at: Date | null }>>`
        SELECT migration_name, finished_at FROM "_prisma_migrations"
        WHERE finished_at IS NOT NULL ORDER BY finished_at DESC LIMIT 1
      `;
      const countRows = await getDb().$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*)::bigint AS count FROM "_prisma_migrations" WHERE finished_at IS NOT NULL
      `;
      migrationsApplied = Number(countRows[0]?.count ?? 0);
      if (rows[0]) {
        lastMigrationName = rows[0].migration_name;
        lastMigrationAt = rows[0].finished_at?.toISOString() ?? null;
      }
    } catch {
      // Sin esquema migraciones (caso raro) — dejamos en 0
    }
  }

  try {
    return adminOk({ data: {
      database: { ok: dbOk, latencyMs: dbLatencyMs, migrationsApplied, lastMigrationName, lastMigrationAt },
      runtime: {
        node: process.version,
        env: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown",
        region: process.env.VERCEL_REGION ?? "unknown",
        commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
        commitBranch: process.env.VERCEL_GIT_COMMIT_REF ?? null,
        deployedAt: process.env.VERCEL_DEPLOYMENT_CREATED_AT ?? null,
      },
      encryption: { configured: isEncryptionConfigured() },
    } });
  } catch (error) {
    return adminServerError("system.health", error);
  }
}
