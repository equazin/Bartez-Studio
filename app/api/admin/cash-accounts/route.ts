import { NextResponse } from "next/server.js";
import { getDb } from "../../../../lib/db.ts";
import { logAudit } from "../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { authorizeModule, parseModulePagination } from "../../../../lib/modules/admin-module.ts";
import { cashAccountCreateSchema } from "../../../../lib/modules/treasury/schema.ts";
import { createCashAccount } from "../../../../lib/modules/treasury/treasury-service.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "finanzas:cash:read");
  if (!auth.ok) return auth.response;
  const url = new URL(request.url);
  const { page, limit, skip } = parseModulePagination(url);
  const active = url.searchParams.get("active");
  const where: Record<string, unknown> = { organizationId: auth.orgId, deletedAt: null };
  if (active === "1") where.active = true;

  try {
    const db = getDb();
    const [data, total] = await Promise.all([
      db.cashAccount.findMany({ where, orderBy: { name: "asc" }, skip, take: limit }),
      db.cashAccount.count({ where }),
    ]);
    return adminOk({ data, meta: { total, page, limit } });
  } catch (error) {
    return adminServerError("cashAccounts.list", error);
  }
}

export async function POST(request: Request) {
  const auth = await authorizeModule(request, "finanzas:cash:create", { mutation: true });
  if (!auth.ok) return auth.response;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = cashAccountCreateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const account = await createCashAccount({ organizationId: auth.orgId, data: parsed.data });
    await logAudit("create", "cash_account", account.id, { name: account.name }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: account }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return adminServerError("cashAccounts.create", error);
  }
}
