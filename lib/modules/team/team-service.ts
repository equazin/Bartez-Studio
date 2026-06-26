import { z } from "zod";
import { getDb } from "../../db.ts";
import { ROLES } from "../../rbac.ts";
import { hashPassword, verifyPassword } from "../../password.ts";
import { resolveDefaultOrg } from "../../tenant.ts";

export class TeamValidationError extends Error {}

/**
 * Autentica un usuario de la BD por email o nombre + contraseña.
 * Devuelve los datos para el token (incluye rol y org del Membership) o null.
 * Usado por el login para soportar usuarios reales además del admin global.
 */
export async function authenticateUser(identifier: string, password: string): Promise<{ userId: string; name: string; orgId: string; role: string } | null> {
  const db = getDb();
  const user = await db.user.findFirst({
    where: { active: true, OR: [{ email: identifier.toLowerCase() }, { name: identifier }] },
    include: { memberships: true },
  });
  if (!user) return null;
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return null;
  const org = await resolveDefaultOrg();
  const membership = user.memberships.find((m) => m.organizationId === org.id) ?? user.memberships[0];
  return {
    userId: user.id,
    name: user.name,
    orgId: membership?.organizationId ?? org.id,
    role: membership?.role ?? "viewer",
  };
}

/**
 * Gestión del equipo (memberships por organización).
 *
 * Cada Membership tiene un rol (owner/admin/member/viewer) y un set opcional
 * de permisos puntuales (`permissions`) que amplían el rol. Esos overrides se
 * cargan por request en authorizeModule para que el RBAC sea realmente granular.
 */

/** Permisos sensibles que un owner puede conceder individualmente. */
export const GRANTABLE_PERMISSIONS: Array<{ key: string; label: string }> = [
  { key: "ventas:invoice:create", label: "Emitir facturas" },
  { key: "ventas:invoice:read", label: "Ver facturas" },
  { key: "finanzas:receipt:create", label: "Registrar cobros" },
  { key: "compras:po:approve", label: "Aprobar órdenes de compra" },
  { key: "compras:po:delete", label: "Anular órdenes de compra" },
  { key: "finanzas:accounting:read", label: "Ver contabilidad" },
  { key: "finanzas:accounting:create", label: "Cargar asientos contables" },
  { key: "auditoria:read", label: "Ver auditoría" },
];

const GRANTABLE_SET = new Set(GRANTABLE_PERMISSIONS.map((p) => p.key));

export const membershipUpdateSchema = z.object({
  role: z.enum(ROLES as unknown as [string, ...string[]]).optional(),
  permissions: z.array(z.string()).optional(),
  password: z.string().min(8).max(256).optional(),
});
export type MembershipUpdate = z.infer<typeof membershipUpdateSchema>;

export const teamMemberCreateSchema = z.object({
  email: z.string().trim().email().max(200).transform((value) => value.toLowerCase()),
  name: z.string().trim().min(1).max(120),
  password: z.string().min(8).max(256),
  role: z.enum(ROLES as unknown as [string, ...string[]]).default("member"),
});
export type TeamMemberCreate = z.infer<typeof teamMemberCreateSchema>;

/** Permisos puntuales del usuario en la organización (para el RBAC por request). */
export async function loadMembershipPermissions(userId: string, organizationId: string): Promise<string[]> {
  const db = getDb();
  const membership = await db.membership.findUnique({
    where: { userId_organizationId: { userId, organizationId } },
    select: { permissions: true },
  });
  if (!membership?.permissions || !Array.isArray(membership.permissions)) return [];
  return (membership.permissions as unknown[]).filter((p): p is string => typeof p === "string");
}

export async function listMemberships(organizationId: string) {
  const db = getDb();
  const memberships = await db.membership.findMany({
    where: { organizationId, user: { active: true } },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { user: { name: "asc" } },
  });
  return memberships.map((m) => ({
    userId: m.user.id,
    name: m.user.name,
    email: m.user.email,
    role: m.role,
    permissions: Array.isArray(m.permissions) ? (m.permissions as unknown[]).filter((p): p is string => typeof p === "string") : [],
  }));
}

export async function updateMembership(options: { organizationId: string; userId: string; data: MembershipUpdate }) {
  const db = getDb();
  const membership = await db.membership.findUnique({
    where: { userId_organizationId: { userId: options.userId, organizationId: options.organizationId } },
  });
  if (!membership) return null;

  const patch: { role?: string; permissions?: string[] } = {};
  if (options.data.role) patch.role = options.data.role;
  if (options.data.permissions) {
    // Solo se persisten permisos de la lista blanca de concedibles.
    patch.permissions = options.data.permissions.filter((p) => GRANTABLE_SET.has(p));
  }

  // Reseteo de contraseña (opcional): se hashea con scrypt en el User.
  if (options.data.password) {
    await db.user.update({
      where: { id: options.userId },
      data: { passwordHash: await hashPassword(options.data.password) },
    });
  }

  const updated = await db.membership.update({
    where: { id: membership.id },
    data: patch as object,
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  return {
    userId: updated.user.id,
    name: updated.user.name,
    email: updated.user.email,
    role: updated.role,
    permissions: Array.isArray(updated.permissions) ? (updated.permissions as unknown[]).filter((p): p is string => typeof p === "string") : [],
  };
}

export async function createTeamMember(options: { organizationId: string; data: TeamMemberCreate }) {
  const db = getDb();
  const { email, name, password, role } = options.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) throw new TeamValidationError("Ya existe un usuario con ese email");

  const user = await db.user.create({
    data: { email, name, passwordHash: await hashPassword(password) },
  });
  await db.membership.create({
    data: { userId: user.id, organizationId: options.organizationId, role },
  });

  return { userId: user.id, name: user.name, email: user.email, role, permissions: [] as string[] };
}
