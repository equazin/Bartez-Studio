import { NextResponse } from "next/server.js";
import { getDb } from "../../../../lib/db.ts";
import { logAudit } from "../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { authorizeModule, parseModulePagination } from "../../../../lib/modules/admin-module.ts";
import { purchaseOrderCreateSchema } from "../../../../lib/modules/purchases/schema.ts";
import { createPurchaseOrder, PurchaseValidationError } from "../../../../lib/modules/purchases/purchase-service.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "compras:po:read");
  if (!auth.ok) return auth.response;
  const url = new URL(request.url);
  const { page, limit, skip } = parseModulePagination(url);
  const status = url.searchParams.get("status") || undefined;
  const supplierId = url.searchParams.get("supplierId") || undefined;
  const q = url.searchParams.get("q")?.trim();
  const where: Record<string, unknown> = { organizationId: auth.orgId, deletedAt: null };
  if (status) where.status = status;
  if (supplierId) where.supplierId = supplierId;
  if (q) where.OR = [{ number: { contains: q, mode: "insensitive" } }, { supplier: { name: { contains: q, mode: "insensitive" } } }];

  try {
    const db = getDb();
    const [data, total] = await Promise.all([
      db.purchaseOrder.findMany({
        where,
        orderBy: { issueDate: "desc" },
        skip,
        take: limit,
        include: { supplier: { select: { id: true, name: true } }, _count: { select: { lines: true, receipts: true, allocations: true } } },
      }),
      db.purchaseOrder.count({ where }),
    ]);
    return adminOk({ data, meta: { total, page, limit } });
  } catch (error) {
    return adminServerError("purchaseOrders.list", error);
  }
}

export async function POST(request: Request) {
  const auth = await authorizeModule(request, "compras:po:create", { mutation: true });
  if (!auth.ok) return auth.response;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = purchaseOrderCreateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const po = await createPurchaseOrder({ organizationId: auth.orgId, data: parsed.data });
    await logAudit("create", "purchase_order", po.id, { number: po.number }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: po }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof PurchaseValidationError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }
    return adminServerError("purchaseOrders.create", error);
  }
}
