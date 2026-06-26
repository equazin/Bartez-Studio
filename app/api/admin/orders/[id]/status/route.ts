import { NextResponse } from "next/server.js";
import { logAudit } from "../../../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../../../lib/admin-api.ts";
import { orderStatusSchema } from "../../../../../../lib/modules/orders/schema.ts";
import { transitionOrderStatus } from "../../../../../../lib/modules/orders/order-service.ts";
import { OutOfStockError } from "../../../../../../lib/modules/inventory/stock-service.ts";
import { authorizeModule } from "../../../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteParams { params: Promise<{ id: string }>; }

export async function POST(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "ventas:order:update", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = orderStatusSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const order = await transitionOrderStatus({ organizationId: auth.orgId, id, target: parsed.data.status });
    if (!order) return adminOk({ data: null });
    await logAudit("update", "sales_order", id, { status: parsed.data.status }, { organizationId: auth.orgId });
    return adminOk({ data: order });
  } catch (error) {
    if (error instanceof OutOfStockError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 409, headers: { "Cache-Control": "no-store" } });
    }
    if (error instanceof Error && error.message.startsWith("Transición")) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }
    return adminServerError("orders.status", error);
  }
}
