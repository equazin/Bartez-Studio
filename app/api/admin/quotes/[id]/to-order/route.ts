import { NextResponse } from "next/server.js";
import { logAudit } from "../../../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../../../lib/admin-api.ts";
import { fromQuoteSchema } from "../../../../../../lib/modules/orders/schema.ts";
import { createOrderFromQuote } from "../../../../../../lib/modules/orders/order-service.ts";
import { authorizeModule } from "../../../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteParams { params: Promise<{ id: string }>; }

/**
 * Crea un SalesOrder a partir de un Quote existente.
 * El warehouseId del body define dónde se reservará al confirmar (opcional
 * para pedidos 100% bajo pedido).
 */
export async function POST(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "ventas:order:create", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = fromQuoteSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const order = await createOrderFromQuote({ organizationId: auth.orgId, quoteId: id, warehouseId: parsed.data.warehouseId });
    if (!order) return adminOk({ data: null });
    await logAudit("create", "sales_order", order.id, { number: order.number, fromQuoteId: id }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: order }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return adminServerError("quotes.toOrder", error);
  }
}
