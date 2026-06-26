import { NextResponse } from "next/server.js";
import { logAudit } from "../../../../../lib/audit.ts";
import { adminServerError } from "../../../../../lib/admin-api.ts";
import { authorizeModule } from "../../../../../lib/modules/admin-module.ts";
import { voidSupplierPayment, PurchaseValidationError } from "../../../../../lib/modules/purchases/purchase-service.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorizeModule(request, "finanzas:supplier-payment:create", { mutation: true });
  if (!auth.ok) return auth.response;
  const { id } = await params;

  try {
    const payment = await voidSupplierPayment({ organizationId: auth.orgId, id });
    if (!payment) return NextResponse.json({ ok: false, error: "Pago no encontrado o ya anulado" }, { status: 404 });
    await logAudit("delete", "supplier_payment", id, { number: payment.number }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: payment }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof PurchaseValidationError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }
    return adminServerError("supplierPayments.void", error);
  }
}
