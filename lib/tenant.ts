import type { PrismaClient } from "@prisma/client";
import { getDb } from "./db.ts";
import type { AdminSession } from "./auth-token.ts";

/**
 * Capa de tenancy del Sistema Bartez.
 *
 * Durante la Fase 0 el sistema opera con una única organización semilla
 * ("bartez"). Toda resolución de tenant cae a esa organización cuando la
 * sesión no trae `orgId` (tokens previos a multi-tenant). A medida que se
 * agreguen módulos, las queries de negocio se scopean con `tenantWhere`.
 */

export const DEFAULT_ORG_SLUG = "bartez";

let cachedDefaultOrgId: string | null = null;

/**
 * Devuelve la organización semilla, creándola si no existe.
 * Cachea el id en memoria (singleton de proceso) para evitar round-trips.
 */
export async function resolveDefaultOrg(): Promise<{ id: string; slug: string; name: string }> {
  const db = getDb();
  const existing = await db.organization.findUnique({ where: { slug: DEFAULT_ORG_SLUG } });
  if (existing) {
    cachedDefaultOrgId = existing.id;
    return { id: existing.id, slug: existing.slug, name: existing.name };
  }
  const created = await db.organization.create({
    data: { name: "Bartez Tecnología", slug: DEFAULT_ORG_SLUG },
  });
  cachedDefaultOrgId = created.id;
  return { id: created.id, slug: created.slug, name: created.name };
}

/**
 * Resuelve el organizationId efectivo para una sesión.
 * Si el token trae `orgId` lo usa; si no, cae a la organización semilla.
 */
export async function resolveOrgId(session: Pick<AdminSession, "orgId"> | null): Promise<string> {
  if (session?.orgId) return session.orgId;
  if (cachedDefaultOrgId) return cachedDefaultOrgId;
  const org = await resolveDefaultOrg();
  return org.id;
}

/**
 * Construye un `where` de Prisma scopeado al tenant.
 *
 * Durante la transición, las filas preexistentes tienen `organizationId = null`.
 * Para no ocultar datos históricos de la organización semilla, el filtro de la
 * org semilla incluye también las filas sin organización (`null`). Para
 * cualquier otra organización, el filtro es estricto.
 */
export function tenantWhere<T extends Record<string, unknown>>(
  orgId: string,
  extra: T = {} as T,
  options: { includeNull?: boolean } = {},
): T & { OR?: unknown[]; organizationId?: string } {
  if (options.includeNull) {
    return { ...extra, OR: [{ organizationId: orgId }, { organizationId: null }] };
  }
  return { ...extra, organizationId: orgId };
}

/**
 * Azúcar para obtener el cliente Prisma junto al orgId resuelto.
 */
export async function withTenant(session: Pick<AdminSession, "orgId"> | null): Promise<{
  db: PrismaClient;
  orgId: string;
}> {
  const orgId = await resolveOrgId(session);
  return { db: getDb(), orgId };
}
