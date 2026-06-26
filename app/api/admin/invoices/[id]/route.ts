import { getDb } from "../../../../../lib/db.ts";
import { logAudit } from "../../../../../lib/audit.ts";
import { adminOk, adminServerError } from "../../../../../lib/admin-api.ts";
import { cancelInvoice } from "../../../../../lib/modules/billing/invoice-service.ts";
import { getInvoiceBalance } from "../../../../../lib/modules/collections/receipt-service.ts";
import { buildAfipQrUrl } from "../../../../../lib/modules/afip/qr.ts";
import { getAfipConfig } from "../../../../../lib/modules/afip/config.ts";
import { authorizeModule } from "../../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteParams { params: Promise<{ id: string }>; }

export async function GET(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "ventas:invoice:read");
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  try {
    const invoice = await getDb().invoice.findFirst({
      where: { id, organizationId: auth.orgId, deletedAt: null },
      include: {
        account: { select: { id: true, name: true, taxId: true, email: true, address: true, city: true } },
        order: { select: { id: true, number: true } },
        relatedInvoice: { select: { id: true, number: true } },
        lines: { orderBy: { position: "asc" } },
        allocations: { include: { receipt: { select: { id: true, number: true, receivedAt: true } } } },
        paymentLinks: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!invoice) return adminOk({ data: null });

    const cfg = getAfipConfig();
    const qrUrl = invoice.cae && invoice.afipNumber ? buildAfipQrUrl({
      fecha: invoice.issueDate.toISOString().slice(0, 10),
      cuit: cfg.cuit || "00000000000",
      ptoVta: invoice.pointOfSale,
      tipoCmp: invoice.docTypeCode,
      nroCmp: invoice.afipNumber,
      importe: Number(invoice.total),
      moneda: invoice.currency === "USD" ? "DOL" : "PES",
      ctz: Number(invoice.exchangeRate),
      tipoDocRec: invoice.receiverDocType ?? 99,
      nroDocRec: invoice.receiverTaxId ?? "0",
      codAut: invoice.cae,
    }) : null;
    const balance = await getInvoiceBalance(auth.orgId, invoice.id);
    return adminOk({ data: invoice, qrUrl, balance });
  } catch (error) {
    return adminServerError("invoices.get", error);
  }
}

export async function DELETE(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "ventas:invoice:delete", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  try {
    const invoice = await cancelInvoice({ organizationId: auth.orgId, id });
    if (!invoice) return adminOk({ data: null });
    await logAudit("update", "invoice", id, { status: "cancelled" }, { organizationId: auth.orgId });
    return adminOk({ data: invoice });
  } catch (error) {
    return adminServerError("invoices.cancel", error);
  }
}
