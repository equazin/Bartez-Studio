import { getDb } from "../../../../../../lib/db.ts";
import { logAudit } from "../../../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../../../lib/admin-api.ts";
import { leadAssignSchema } from "../../../../../../lib/modules/crm/schema.ts";
import { authorizeCrm } from "../../../../../../lib/modules/crm/api-helpers.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Asigna (o desasigna con assignedToId=null) un lead a un usuario de la
 * organización. El usuario debe pertenecer a la misma org del lead.
 */
export async function POST(request: Request, ctx: RouteParams) {
  const auth = await authorizeCrm(request, "crm:lead:update", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  const leadId = Number(id);
  if (!Number.isFinite(leadId)) {
    return adminOk({ data: null });
  }

  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = leadAssignSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  const db = getDb();
  try {
    const existing = await db.lead.findFirst({
      where: { id: leadId, OR: [{ organizationId: auth.orgId }, { organizationId: null }] },
    });
    if (!existing) return adminOk({ data: null });

    if (parsed.data.assignedToId) {
      const membership = await db.membership.findFirst({
        where: { userId: parsed.data.assignedToId, organizationId: auth.orgId },
      });
      if (!membership) {
        return invalidAdminInput([{ path: ["assignedToId"], message: "Usuario no pertenece a la organización", code: "custom" } as never]);
      }
    }

    const lead = await db.lead.update({
      where: { id: leadId },
      data: { assignedToId: parsed.data.assignedToId, organizationId: existing.organizationId ?? auth.orgId },
    });
    await logAudit("update", "lead", String(leadId), { assignedToId: parsed.data.assignedToId }, { organizationId: auth.orgId });
    return adminOk({ data: lead });
  } catch (error) {
    return adminServerError("leads.assign", error);
  }
}
