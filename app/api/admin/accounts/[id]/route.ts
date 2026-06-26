import { getDb } from "../../../../../lib/db.ts";
import { logAudit } from "../../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../../lib/admin-api.ts";
import { accountUpdateSchema } from "../../../../../lib/modules/crm/schema.ts";
import { authorizeCrm } from "../../../../../lib/modules/crm/api-helpers.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, ctx: RouteParams) {
  const auth = await authorizeCrm(request, "crm:account:read");
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  try {
    const account = await getDb().account.findFirst({
      where: { id, organizationId: auth.orgId, deletedAt: null },
      include: {
        contacts: { where: { deletedAt: null }, orderBy: { firstName: "asc" } },
        opportunities: { where: { deletedAt: null }, orderBy: { updatedAt: "desc" } },
        activities: { orderBy: { dueAt: "desc" }, take: 20 },
        leads: { orderBy: { updatedAt: "desc" }, take: 10 },
      },
    });
    if (!account) return adminOk({ data: null });
    return adminOk({ data: account });
  } catch (error) {
    return adminServerError("accounts.get", error);
  }
}

export async function PUT(request: Request, ctx: RouteParams) {
  const auth = await authorizeCrm(request, "crm:account:update", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;

  const parsed = accountUpdateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const db = getDb();
    const existing = await db.account.findFirst({ where: { id, organizationId: auth.orgId, deletedAt: null } });
    if (!existing) return adminOk({ data: null });

    const account = await db.account.update({ where: { id }, data: parsed.data });
    await logAudit("update", "account", id, parsed.data as Record<string, unknown>, { organizationId: auth.orgId });
    return adminOk({ data: account });
  } catch (error) {
    return adminServerError("accounts.update", error);
  }
}

export async function DELETE(request: Request, ctx: RouteParams) {
  const auth = await authorizeCrm(request, "crm:account:delete", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  try {
    const db = getDb();
    const existing = await db.account.findFirst({ where: { id, organizationId: auth.orgId, deletedAt: null } });
    if (!existing) return adminOk({ data: null });

    await db.account.update({ where: { id }, data: { deletedAt: new Date() } });
    await logAudit("delete", "account", id, undefined, { organizationId: auth.orgId });
    return adminOk();
  } catch (error) {
    return adminServerError("accounts.delete", error);
  }
}
