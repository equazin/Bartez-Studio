import { getDb } from "../../../../../lib/db.ts";
import { logAudit } from "../../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../../lib/admin-api.ts";
import { contactUpdateSchema } from "../../../../../lib/modules/crm/schema.ts";
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

  const parsed = contactUpdateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const db = getDb();
    const existing = await db.contact.findFirst({ where: { id, organizationId: auth.orgId, deletedAt: null } });
    if (!existing) return adminOk({ data: null });

    const contact = await db.contact.update({ where: { id }, data: parsed.data });
    await logAudit("update", "contact", id, parsed.data as Record<string, unknown>, { organizationId: auth.orgId });
    return adminOk({ data: contact });
  } catch (error) {
    return adminServerError("contacts.update", error);
  }
}

export async function DELETE(request: Request, ctx: RouteParams) {
  const auth = await authorizeCrm(request, "crm:account:delete", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  try {
    const db = getDb();
    const existing = await db.contact.findFirst({ where: { id, organizationId: auth.orgId, deletedAt: null } });
    if (!existing) return adminOk({ data: null });

    await db.contact.update({ where: { id }, data: { deletedAt: new Date() } });
    await logAudit("delete", "contact", id, undefined, { organizationId: auth.orgId });
    return adminOk();
  } catch (error) {
    return adminServerError("contacts.delete", error);
  }
}
