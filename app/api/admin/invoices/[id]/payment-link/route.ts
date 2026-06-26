import { NextResponse } from "next/server.js";
import { logAudit } from "../../../../../../lib/audit.ts";
import { adminServerError } from "../../../../../../lib/admin-api.ts";
import { createInvoicePaymentLink } from "../../../../../../lib/modules/billing/payment-link-service.ts";
import { authorizeModule } from "../../../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteParams { params: Promise<{ id: string }>; }

/**
 * Genera (o reutiliza) un link de pago MercadoPago para la factura.
 * Devuelve la URL del checkout.
 */
export async function POST(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "ventas:invoice:update", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  try {
    const result = await createInvoicePaymentLink({ organizationId: auth.orgId, invoiceId: id });
    if (!result) return NextResponse.json({ ok: false, error: "La factura no tiene saldo pendiente" }, { status: 400 });
    await logAudit("create", "payment_link", result.link.id, { invoiceId: id, simulated: result.simulated }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: result.link, simulated: result.simulated }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return adminServerError("invoices.paymentLink", error);
  }
}
