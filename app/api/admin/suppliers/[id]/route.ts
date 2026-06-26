import { getDb } from "../../../../../lib/db.ts";
import { logAudit } from "../../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../../lib/admin-api.ts";
import { authorizeModule } from "../../../../../lib/modules/admin-module.ts";
import { supplierUpdateSchema } from "../../../../../lib/modules/purchases/schema.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteParams { params: Promise<{ id: string }>; }

export async function GET(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "compras:supplier:read");
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;
  try {
    const supplier = await getDb().supplier.findFirst({ where: { id, organizationId: auth.orgId, deletedAt: null } });
    return adminOk({ data: supplier });
  } catch (error) {
    return adminServerError("suppliers.get", error);
  }
}

export async function PUT(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "compras:supplier:update", { mutation: true });
  if (!auth.ok) return auth.response;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = supplierUpdateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);
  const { id } = await ctx.params;
  try {
    const existing = await getDb().supplier.findFirst({ where: { id, organizationId: auth.orgId, deletedAt: null } });
    if (!existing) return adminOk({ data: null });
    const supplier = await getDb().supplier.update({ where: { id }, data: parsed.data });
    await logAudit("update", "supplier", id, parsed.data, { organizationId: auth.orgId });
    return adminOk({ data: supplier });
  } catch (error) {
    return adminServerError("suppliers.update", error);
  }
}

export async function DELETE(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "compras:supplier:delete", { mutation: true });
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;
  try {
    const existing = await getDb().supplier.findFirst({ where: { id, organizationId: auth.orgId, deletedAt: null } });
    if (!existing) return adminOk({ data: null });
    const supplier = await getDb().supplier.update({ where: { id }, data: { deletedAt: new Date(), active: false } });
    await logAudit("delete", "supplier", id, {}, { organizationId: auth.orgId });
    return adminOk({ data: supplier });
  } catch (error) {
    return adminServerError("suppliers.delete", error);
  }
}
