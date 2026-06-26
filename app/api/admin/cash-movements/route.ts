import { NextResponse } from "next/server.js";
import { getDb } from "../../../../lib/db.ts";
import { logAudit } from "../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { authorizeModule, parseModulePagination } from "../../../../lib/modules/admin-module.ts";
import { cashMovementCreateSchema } from "../../../../lib/modules/treasury/schema.ts";
import { createCashMovement, TreasuryValidationError } from "../../../../lib/modules/treasury/treasury-service.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "finanzas:cash:read");
  if (!auth.ok) return auth.response;
  const url = new URL(request.url);
  const { page, limit, skip } = parseModulePagination(url);
  const cashAccountId = url.searchParams.get("cashAccountId") || undefined;
  const where: Record<string, unknown> = { organizationId: auth.orgId };
  if (cashAccountId) where.cashAccountId = cashAccountId;

  try {
    const db = getDb();
    const [data, total] = await Promise.all([
      db.cashMovement.findMany({
        where,
        orderBy: { date: "desc" },
        skip,
        take: limit,
        include: { cashAccount: { select: { id: true, name: true } } },
      }),
      db.cashMovement.count({ where }),
    ]);
    return adminOk({ data, meta: { total, page, limit } });
  } catch (error) {
    return adminServerError("cashMovements.list", error);
  }
}

export async function POST(request: Request) {
  const auth = await authorizeModule(request, "finanzas:cash:create", { mutation: true });
  if (!auth.ok) return auth.response;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = cashMovementCreateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const movement = await createCashMovement({ organizationId: auth.orgId, data: parsed.data });
    await logAudit("create", "cash_movement", movement.id, { amount: movement.amount.toString() }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: movement }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof TreasuryValidationError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }
    return adminServerError("cashMovements.create", error);
  }
}
