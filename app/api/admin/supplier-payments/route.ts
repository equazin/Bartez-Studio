import { NextResponse } from "next/server.js";
import { getDb } from "../../../../lib/db.ts";
import { logAudit } from "../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { authorizeModule, parseModulePagination } from "../../../../lib/modules/admin-module.ts";
import { supplierPaymentCreateSchema } from "../../../../lib/modules/purchases/schema.ts";
import { createSupplierPayment, PurchaseValidationError } from "../../../../lib/modules/purchases/purchase-service.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "finanzas:supplier-payment:read");
  if (!auth.ok) return auth.response;
  const url = new URL(request.url);
  const { page, limit, skip } = parseModulePagination(url);
  const supplierId = url.searchParams.get("supplierId") || undefined;
  const where: Record<string, unknown> = { organizationId: auth.orgId, deletedAt: null };
  if (supplierId) where.supplierId = supplierId;

  try {
    const db = getDb();
    const [data, total] = await Promise.all([
      db.supplierPayment.findMany({
        where,
        orderBy: { paidAt: "desc" },
        skip,
        take: limit,
        include: { supplier: { select: { id: true, name: true } }, cashAccount: { select: { id: true, name: true } }, _count: { select: { allocations: true } } },
      }),
      db.supplierPayment.count({ where }),
    ]);
    return adminOk({ data, meta: { total, page, limit } });
  } catch (error) {
    return adminServerError("supplierPayments.list", error);
  }
}

export async function POST(request: Request) {
  const auth = await authorizeModule(request, "finanzas:supplier-payment:create", { mutation: true });
  if (!auth.ok) return auth.response;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = supplierPaymentCreateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const payment = await createSupplierPayment({ organizationId: auth.orgId, data: parsed.data });
    await logAudit("create", "supplier_payment", payment.id, { number: payment.number, amount: payment.amount.toString() }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: payment }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof PurchaseValidationError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }
    return adminServerError("supplierPayments.create", error);
  }
}
