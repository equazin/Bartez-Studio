import { NextResponse } from "next/server.js";
import { getDb } from "../../../../lib/db.ts";
import { logAudit } from "../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { receiptCreateSchema } from "../../../../lib/modules/collections/schema.ts";
import { createReceipt, ReceiptValidationError } from "../../../../lib/modules/collections/receipt-service.ts";
import { authorizeModule, parseModulePagination } from "../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "finanzas:receipt:read");
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const { page, limit, skip } = parseModulePagination(url);
  const accountId = url.searchParams.get("accountId") || undefined;

  const where: Record<string, unknown> = { organizationId: auth.orgId, deletedAt: null };
  if (accountId) where.accountId = accountId;

  try {
    const db = getDb();
    const [data, total] = await Promise.all([
      db.receipt.findMany({
        where,
        orderBy: { receivedAt: "desc" },
        skip,
        take: limit,
        include: {
          account: { select: { id: true, name: true } },
          _count: { select: { allocations: true } },
        },
      }),
      db.receipt.count({ where }),
    ]);
    return adminOk({ data, meta: { total, page, limit } });
  } catch (error) {
    return adminServerError("receipts.list", error);
  }
}

export async function POST(request: Request) {
  const auth = await authorizeModule(request, "finanzas:receipt:create", { mutation: true });
  if (!auth.ok) return auth.response;

  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = receiptCreateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const receipt = await createReceipt({ organizationId: auth.orgId, data: parsed.data });
    await logAudit("create", "receipt", receipt.id, { number: receipt.number, amount: receipt.amount.toString() }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: receipt }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof ReceiptValidationError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }
    return adminServerError("receipts.create", error);
  }
}
