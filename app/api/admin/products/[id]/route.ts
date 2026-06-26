import { getDb } from "../../../../../lib/db.ts";
import { logAudit } from "../../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../../lib/admin-api.ts";
import { productUpdateSchema } from "../../../../../lib/modules/catalog/schema.ts";
import { authorizeModule } from "../../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "ventas:quote:update", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;

  const parsed = productUpdateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const db = getDb();
    const existing = await db.product.findFirst({ where: { id, organizationId: auth.orgId, deletedAt: null } });
    if (!existing) return adminOk({ data: null });

    const product = await db.product.update({ where: { id }, data: parsed.data });
    await logAudit("update", "product", id, parsed.data as Record<string, unknown>, { organizationId: auth.orgId });
    return adminOk({ data: product });
  } catch (error) {
    return adminServerError("products.update", error);
  }
}

export async function DELETE(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "ventas:quote:delete", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  try {
    const db = getDb();
    const existing = await db.product.findFirst({ where: { id, organizationId: auth.orgId, deletedAt: null } });
    if (!existing) return adminOk({ data: null });

    await db.product.update({ where: { id }, data: { deletedAt: new Date(), active: false } });
    await logAudit("delete", "product", id, undefined, { organizationId: auth.orgId });
    return adminOk();
  } catch (error) {
    return adminServerError("products.delete", error);
  }
}
