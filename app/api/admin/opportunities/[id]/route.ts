import { getDb } from "../../../../../lib/db.ts";
import { logAudit } from "../../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../../lib/admin-api.ts";
import { opportunityUpdateSchema } from "../../../../../lib/modules/crm/schema.ts";
import { authorizeCrm } from "../../../../../lib/modules/crm/api-helpers.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, ctx: RouteParams) {
  const auth = await authorizeCrm(request, "ventas:quote:update", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;

  const parsed = opportunityUpdateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const db = getDb();
    const existing = await db.opportunity.findFirst({ where: { id, organizationId: auth.orgId, deletedAt: null } });
    if (!existing) return adminOk({ data: null });

    // Si pasa a won/lost, cerrar la oportunidad con fecha.
    const data: Record<string, unknown> = { ...parsed.data };
    if ((parsed.data.stage === "won" || parsed.data.stage === "lost") && !existing.closedAt) {
      data.closedAt = new Date();
    }
    if (parsed.data.stage && parsed.data.stage !== "won" && parsed.data.stage !== "lost") {
      data.closedAt = null;
    }

    const opp = await db.opportunity.update({ where: { id }, data });
    await logAudit("update", "opportunity", id, parsed.data as Record<string, unknown>, { organizationId: auth.orgId });
    return adminOk({ data: opp });
  } catch (error) {
    return adminServerError("opportunities.update", error);
  }
}

export async function DELETE(request: Request, ctx: RouteParams) {
  const auth = await authorizeCrm(request, "ventas:quote:delete", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  try {
    const db = getDb();
    const existing = await db.opportunity.findFirst({ where: { id, organizationId: auth.orgId, deletedAt: null } });
    if (!existing) return adminOk({ data: null });

    await db.opportunity.update({ where: { id }, data: { deletedAt: new Date() } });
    await logAudit("delete", "opportunity", id, undefined, { organizationId: auth.orgId });
    return adminOk();
  } catch (error) {
    return adminServerError("opportunities.delete", error);
  }
}
