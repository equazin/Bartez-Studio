import { NextResponse } from "next/server.js";
import { getDb } from "../../../../../lib/db.ts";
import { logAudit } from "../../../../../lib/audit.ts";
import { adminOk, adminServerError } from "../../../../../lib/admin-api.ts";
import { authorizeModule } from "../../../../../lib/modules/admin-module.ts";
import { cancelPurchaseOrder, PurchaseValidationError } from "../../../../../lib/modules/purchases/purchase-service.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteParams { params: Promise<{ id: string }>; }

export async function GET(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "compras:po:read");
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;
  try {
    const po = await getDb().purchaseOrder.findFirst({
      where: { id, organizationId: auth.orgId, deletedAt: null },
      include: {
        supplier: true,
        lines: { orderBy: { position: "asc" }, include: { product: { select: { id: true, sku: true, name: true } } } },
        receipts: { orderBy: { receivedAt: "desc" }, include: { lines: true, warehouse: { select: { id: true, name: true } } } },
        allocations: { include: { payment: { select: { id: true, number: true, paidAt: true } } } },
      },
    });
    return adminOk({ data: po });
  } catch (error) {
    return adminServerError("purchaseOrders.get", error);
  }
}

export async function DELETE(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "compras:po:delete", { mutation: true });
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;
  try {
    const po = await cancelPurchaseOrder({ organizationId: auth.orgId, id });
    if (!po) return adminOk({ data: null });
    await logAudit("update", "purchase_order", id, { status: "cancelled" }, { organizationId: auth.orgId });
    return adminOk({ data: po });
  } catch (error) {
    if (error instanceof PurchaseValidationError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }
    return adminServerError("purchaseOrders.cancel", error);
  }
}
