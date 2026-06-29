import { NextResponse } from "next/server.js";
import { getDb } from "../../../../lib/db.ts";
import { logAudit } from "../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { invoiceCreateSchema } from "../../../../lib/modules/billing/schema.ts";
import { createInvoice, InvoiceValidationError } from "../../../../lib/modules/billing/invoice-service.ts";
import { authorizeModule, parseModulePagination } from "../../../../lib/modules/admin-module.ts";
import { findDocType } from "../../../../lib/modules/afip/catalog.ts";
import { sendSaleConversions } from "../../../../lib/modules/ads/conversions-service.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "ventas:invoice:read");
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const { page, limit, skip } = parseModulePagination(url);
  const status = url.searchParams.get("status") || undefined;
  const accountId = url.searchParams.get("accountId") || undefined;
  const q = url.searchParams.get("q")?.trim();

  const where: Record<string, unknown> = { organizationId: auth.orgId, deletedAt: null };
  if (status) where.status = status;
  if (accountId) where.accountId = accountId;
  if (q) where.OR = [
    { number: { contains: q, mode: "insensitive" } },
    { receiverName: { contains: q, mode: "insensitive" } },
    { cae: { contains: q } },
  ];

  try {
    const db = getDb();
    const [data, total] = await Promise.all([
      db.invoice.findMany({
        where,
        orderBy: { issueDate: "desc" },
        skip,
        take: limit,
        include: {
          account: { select: { id: true, name: true } },
          _count: { select: { lines: true, allocations: true } },
        },
      }),
      db.invoice.count({ where }),
    ]);
    return adminOk({ data, meta: { total, page, limit } });
  } catch (error) {
    return adminServerError("invoices.list", error);
  }
}

export async function POST(request: Request) {
  const auth = await authorizeModule(request, "ventas:invoice:create", { mutation: true });
  if (!auth.ok) return auth.response;

  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = invoiceCreateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const { invoice, qrUrl, simulated } = await createInvoice({ organizationId: auth.orgId, data: parsed.data });
    await logAudit("create", "invoice", invoice.id, { number: invoice.number, cae: invoice.cae }, { organizationId: auth.orgId });

    // Conversiones publicitarias (Google/Meta Ads): fire-and-forget, no bloquea
    // la respuesta y nunca rompe la facturación si falla.
    void sendSaleConversions({
      organizationId: auth.orgId,
      accountId: invoice.accountId,
      orderId: invoice.id,
      value: Number(invoice.total),
      currency: invoice.currency,
      isCreditNote: findDocType(invoice.docTypeCode)?.isCreditNote ?? false,
    });

    return NextResponse.json({ ok: true, data: invoice, qrUrl, simulated }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof InvoiceValidationError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }
    return adminServerError("invoices.create", error);
  }
}
