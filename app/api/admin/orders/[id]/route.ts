import { getDb } from "../../../../../lib/db.ts";
import { logAudit } from "../../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../../lib/admin-api.ts";
import { orderUpdateSchema } from "../../../../../lib/modules/orders/schema.ts";
import { updateOrder } from "../../../../../lib/modules/orders/order-service.ts";
import { authorizeModule } from "../../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteParams { params: Promise<{ id: string }>; }

export async function GET(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "ventas:order:read");
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  try {
    const order = await getDb().salesOrder.findFirst({
      where: { id, organizationId: auth.orgId, deletedAt: null },
      include: {
        account: { select: { id: true, name: true, taxId: true, email: true, phone: true } },
        owner: { select: { id: true, name: true } },
        quote: { select: { id: true, number: true } },
        lines: {
          orderBy: { position: "asc" },
          include: { product: { select: { id: true, sku: true, name: true, unit: true, stockTracked: true } } },
        },
      },
    });
    return adminOk({ data: order });
  } catch (error) {
    return adminServerError("orders.get", error);
  }
}

export async function PUT(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "ventas:order:update", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = orderUpdateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const order = await updateOrder({ organizationId: auth.orgId, id, data: parsed.data });
    if (!order) return adminOk({ data: null });
    await logAudit("update", "sales_order", id, { number: order.number }, { organizationId: auth.orgId });
    return adminOk({ data: order });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("No se puede editar")) {
      return adminOk({ data: null, error: error.message });
    }
    return adminServerError("orders.update", error);
  }
}

export async function DELETE(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "ventas:order:delete", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  try {
    const db = getDb();
    const existing = await db.salesOrder.findFirst({ where: { id, organizationId: auth.orgId, deletedAt: null } });
    if (!existing) return adminOk({ data: null });
    if (existing.status !== "draft" && existing.status !== "cancelled") {
      return adminOk({ data: null, error: "Solo se eliminan pedidos en borrador o cancelados" });
    }
    await db.salesOrder.update({ where: { id }, data: { deletedAt: new Date() } });
    await logAudit("delete", "sales_order", id, undefined, { organizationId: auth.orgId });
    return adminOk();
  } catch (error) {
    return adminServerError("orders.delete", error);
  }
}
