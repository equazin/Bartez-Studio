import { NextResponse } from "next/server.js";
import { logAudit } from "../../../../../../lib/audit.ts";
import { adminServerError } from "../../../../../../lib/admin-api.ts";
import { authorizeModule } from "../../../../../../lib/modules/admin-module.ts";
import { PurchaseValidationError } from "../../../../../../lib/modules/purchases/purchase-service.ts";
import { issueAirPreorder } from "../../../../../../lib/integrations/air/preorder.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Emite una pre-orden de compra (preorden → issued).
 * Recién en este paso se asienta el crédito en la cta. cte. del proveedor
 * y aplica el umbral de aprobación de compras.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorizeModule(request, "compras:po:update", { mutation: true });
  if (!auth.ok) return auth.response;
  const { id } = await params;

  try {
    const order = await issueAirPreorder({ organizationId: auth.orgId, id });
    if (!order) return NextResponse.json({ ok: false, error: "Orden de compra no encontrada" }, { status: 404 });
    await logAudit("update", "purchase_order", id, { status: "issued", from: "preorden" }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: order }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof PurchaseValidationError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }
    return adminServerError("purchaseOrders.issue", error);
  }
}
