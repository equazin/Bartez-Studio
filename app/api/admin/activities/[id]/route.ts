import { getDb } from "../../../../../lib/db.ts";
import { logAudit } from "../../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../../lib/admin-api.ts";
import { activityUpdateSchema } from "../../../../../lib/modules/crm/schema.ts";
import { authorizeCrm } from "../../../../../lib/modules/crm/api-helpers.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, ctx: RouteParams) {
  const auth = await authorizeCrm(request, "crm:account:update", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;

  const parsed = activityUpdateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const db = getDb();
    const existing = await db.activity.findFirst({ where: { id, organizationId: auth.orgId } });
    if (!existing) return adminOk({ data: null });

    const data: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.status === "done" && !existing.completedAt) data.completedAt = new Date();
    if (parsed.data.status && parsed.data.status !== "done") data.completedAt = null;

    const activity = await db.activity.update({ where: { id }, data });
    await logAudit("update", "activity", id, parsed.data as Record<string, unknown>, { organizationId: auth.orgId });
    return adminOk({ data: activity });
  } catch (error) {
    return adminServerError("activities.update", error);
  }
}

export async function DELETE(request: Request, ctx: RouteParams) {
  const auth = await authorizeCrm(request, "crm:account:delete", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  try {
    const db = getDb();
    const existing = await db.activity.findFirst({ where: { id, organizationId: auth.orgId } });
    if (!existing) return adminOk({ data: null });

    await db.activity.delete({ where: { id } });
    await logAudit("delete", "activity", id, undefined, { organizationId: auth.orgId });
    return adminOk();
  } catch (error) {
    return adminServerError("activities.delete", error);
  }
}
