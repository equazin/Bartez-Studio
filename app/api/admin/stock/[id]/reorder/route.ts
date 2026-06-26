import { getDb } from "../../../../../../lib/db.ts";
import { logAudit } from "../../../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../../../lib/admin-api.ts";
import { stockReorderSchema } from "../../../../../../lib/modules/inventory/schema.ts";
import { authorizeModule } from "../../../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteParams { params: Promise<{ id: string }>; }

/**
 * Actualiza el punto de reposición (reorderPoint) de un StockItem.
 */
export async function PUT(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "inventario:stock:update", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = stockReorderSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const db = getDb();
    const existing = await db.stockItem.findFirst({ where: { id, warehouse: { organizationId: auth.orgId } } });
    if (!existing) return adminOk({ data: null });

    const item = await db.stockItem.update({ where: { id }, data: { reorderPoint: parsed.data.reorderPoint } });
    await logAudit("update", "warehouse", existing.warehouseId, { reorderPoint: parsed.data.reorderPoint, productId: existing.productId }, { organizationId: auth.orgId });
    return adminOk({ data: item });
  } catch (error) {
    return adminServerError("stock.reorder", error);
  }
}
