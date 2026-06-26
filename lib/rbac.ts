import type { AdminSession } from "./auth-token.ts";

/**
 * RBAC del Sistema Bartez.
 *
 * Roles jerárquicos por organización. Cada rol expande a un set de permisos
 * con formato `<modulo>:<recurso>:<accion>` (p. ej. "ventas:invoice:create").
 * El permiso comodín "*" concede todo (rol owner).
 *
 * Los permisos puntuales en `Membership.permissions` pueden ampliar el set del
 * rol; se pasan como `extraPermissions` a `can()`.
 */

export type Role = "owner" | "admin" | "member" | "viewer";

export const ROLES: readonly Role[] = ["owner", "admin", "member", "viewer"] as const;

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

/**
 * Acciones de lectura/escritura usadas para derivar permisos por defecto.
 * Las acciones de escritura: create, update, delete. Lectura: read.
 */
const WRITE_ACTIONS = ["create", "update", "delete"] as const;
const READ_ACTION = "read";

/**
 * Permisos por rol. Se modela en términos amplios; los módulos concretos
 * (ventas, compras, inventario, etc.) chequean `can(session, "<modulo>:<recurso>:<accion>")`.
 *
 * - owner: todo ("*").
 * - admin: todo salvo administración de la organización y facturación fiscal sensible.
 * - member: lectura + escritura operativa (CRM, ventas, compras, inventario), sin borrar ni configurar.
 * - viewer: solo lectura.
 */
const ROLE_PERMISSIONS: Record<Role, readonly string[]> = {
  owner: ["*"],
  admin: [
    "crm:*",
    "ventas:*",
    "compras:*",
    "inventario:*",
    "finanzas:*",
    "postventa:*",
    "contenido:*",
    "analytics:read",
    "auditoria:read",
  ],
  member: [
    "crm:lead:read",
    "crm:lead:create",
    "crm:lead:update",
    "crm:account:read",
    "crm:account:create",
    "crm:account:update",
    "ventas:quote:read",
    "ventas:quote:create",
    "ventas:quote:update",
    "ventas:order:read",
    "ventas:order:create",
    "ventas:order:update",
    "compras:po:read",
    "inventario:stock:read",
    "contenido:*",
    "analytics:read",
  ],
  viewer: [
    "crm:lead:read",
    "crm:account:read",
    "ventas:quote:read",
    "ventas:order:read",
    "compras:po:read",
    "inventario:stock:read",
    "finanzas:read",
    "analytics:read",
    "auditoria:read",
  ],
};

/**
 * ¿El permiso `granted` (que puede ser comodín) cubre al `required`?
 * "*" cubre todo. "ventas:*" cubre "ventas:quote:create". Match exacto también.
 */
function permissionCovers(granted: string, required: string): boolean {
  if (granted === "*") return true;
  if (granted === required) return true;
  if (granted.endsWith(":*")) {
    const prefix = granted.slice(0, -1); // "ventas:"
    return required.startsWith(prefix);
  }
  return false;
}

export function permissionsForRole(role: Role): readonly string[] {
  return ROLE_PERMISSIONS[role] ?? ROLE_PERMISSIONS.viewer;
}

/**
 * Evalúa si una sesión puede ejecutar una acción.
 *
 * @param session  sesión del admin (de verifyToken)
 * @param required permiso requerido, p. ej. "ventas:invoice:create"
 * @param extraPermissions permisos puntuales del Membership (override aditivo)
 */
export function can(
  session: Pick<AdminSession, "role"> | null | undefined,
  required: string,
  extraPermissions: readonly string[] = [],
): boolean {
  if (!session) return false;
  // Compatibilidad: una sesión sin rol (token previo a Fase 0) se trata como owner,
  // ya que hasta ahora el único usuario era el admin global.
  const role: Role = isRole(session.role) ? session.role : "owner";

  const granted = [...permissionsForRole(role), ...extraPermissions];
  return granted.some((perm) => permissionCovers(perm, required));
}

/** Helper de conveniencia: ¿es write la acción de este permiso? */
export function isWritePermission(required: string): boolean {
  const action = required.split(":").pop();
  return action === READ_ACTION ? false : (WRITE_ACTIONS as readonly string[]).includes(action ?? "");
}
