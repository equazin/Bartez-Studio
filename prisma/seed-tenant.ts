/**
 * Bootstrap multi-tenant (Fase 0).
 *
 * - Crea la organización semilla "bartez" si no existe.
 * - Crea el usuario admin (rol owner) a partir de las env ADMIN_USERNAME /
 *   ADMIN_EMAIL / ADMIN_PASSWORD, idempotente.
 * - Backfillea organizationId = <org semilla> en las filas preexistentes
 *   que aún lo tienen en null.
 *
 * Ejecutar una sola vez tras aplicar el schema:
 *   npx tsx prisma/seed-tenant.ts
 */
import { getDb } from "../lib/db.ts";
import { resolveDefaultOrg } from "../lib/tenant.ts";
import { hashPassword } from "../lib/password.ts";

async function main() {
  const db = getDb();

  const org = await resolveDefaultOrg();
  console.info(`[seed] organización semilla: ${org.name} (${org.id})`);

  // ── Usuario admin (owner) ───────────────────────────────────
  const username = process.env.ADMIN_USERNAME || "admin";
  const email = process.env.ADMIN_EMAIL || `${username}@bartez.com.ar`;
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    console.warn("[seed] ADMIN_PASSWORD no configurada — se omite la creación del usuario admin.");
  } else {
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      console.info(`[seed] usuario admin ya existe: ${email}`);
    } else {
      const user = await db.user.create({
        data: { email, name: username, passwordHash: await hashPassword(password) },
      });
      await db.membership.upsert({
        where: { userId_organizationId: { userId: user.id, organizationId: org.id } },
        create: { userId: user.id, organizationId: org.id, role: "owner" },
        update: { role: "owner" },
      });
      console.info(`[seed] usuario admin creado: ${email} (owner)`);
    }
  }

  // ── Backfill de organizationId en tablas preexistentes ──────
  const backfills: Array<[string, () => Promise<{ count: number }>]> = [
    ["Lead", () => db.lead.updateMany({ where: { organizationId: null }, data: { organizationId: org.id } })],
    ["Post", () => db.post.updateMany({ where: { organizationId: null }, data: { organizationId: org.id } })],
    ["ClientLogo", () => db.clientLogo.updateMany({ where: { organizationId: null }, data: { organizationId: org.id } })],
    ["SuccessCase", () => db.successCase.updateMany({ where: { organizationId: null }, data: { organizationId: org.id } })],
    ["WaConversation", () => db.waConversation.updateMany({ where: { organizationId: null }, data: { organizationId: org.id } })],
    ["AuditLog", () => db.auditLog.updateMany({ where: { organizationId: null }, data: { organizationId: org.id } })],
  ];

  for (const [name, run] of backfills) {
    const { count } = await run();
    console.info(`[seed] backfill ${name}: ${count} filas`);
  }

  console.info("[seed] listo.");
}

main()
  .catch((error) => {
    console.error("[seed] error:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await getDb().$disconnect();
  });
