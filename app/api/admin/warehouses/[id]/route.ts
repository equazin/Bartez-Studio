import { getDb } from "../../../../../lib/db.ts";
import { logAudit } from "../../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../../lib/admin-api.ts";
import { warehouseUpdateSchema } from "../../../../../lib/modules/inventory/schema.ts";
import { authorizeModule } from "../../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteParams { params: Promise<{ id: string }>; }

export async function PUT(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "inventario:warehouse:update", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = warehouseUpdateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const db = getDb();
    const existing = await db.warehouse.findFirst({ where: { id, organizationId: auth.orgId } });
    if (!existing) return adminOk({ data: null });

    const w = await db.$transaction(async (tx) => {
      if (parsed.data.isDefault === true) {
        await tx.warehouse.updateMany({ where: { organizationId: auth.orgId, isDefault: true, NOT: { id } }, data: { isDefault: false } });
      }
      return tx.warehouse.update({ where: { id }, data: parsed.data });
    });
    await logAudit("update", "warehouse", id, parsed.data as Record<string, unknown>, { organizationId: auth.orgId });
    return adminOk({ data: w });
  } catch (error) {
    return adminServerError("warehouses.update", error);
  }
}

export async function DELETE(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "inventario:warehouse:delete", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  try {
    const db = getDb();
    const existing = await db.warehouse.findFirst({ where: { id, organizationId: auth.orgId } });
    if (!existing) return adminOk({ data: null });
    await db.warehouse.delete({ where: { id } });
    await logAudit("delete", "warehouse", id, undefined, { organizationId: auth.orgId });
    return adminOk();
  } catch (error) {
    return adminServerError("warehouses.delete", error);
  }
}
