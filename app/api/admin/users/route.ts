import { getDb } from "../../../../lib/db.ts";
import { adminOk, adminServerError } from "../../../../lib/admin-api.ts";
import { authorizeCrm } from "../../../../lib/modules/crm/api-helpers.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Lista los usuarios pertenecientes a la organización del solicitante.
 * Solo expone id/name/email/role para selectores de asignación.
 */
export async function GET(request: Request) {
  const auth = await authorizeCrm(request, "crm:account:read");
  if (!auth.ok) return auth.response;

  try {
    const memberships = await getDb().membership.findMany({
      where: { organizationId: auth.orgId, user: { active: true } },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { user: { name: "asc" } },
    });

    const data = memberships.map((m) => ({
      id: m.user.id,
      name: m.user.name,
      email: m.user.email,
      role: m.role,
    }));
    return adminOk({ data });
  } catch (error) {
    return adminServerError("users.list", error);
  }
}
