import { NextResponse } from "next/server.js";
import { adminOk, adminServerError } from "../../../../../lib/admin-api.ts";
import { authorizeModule } from "../../../../../lib/modules/admin-module.ts";
import { getLedger } from "../../../../../lib/modules/accounting/accounting-service.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function parseDate(value: string | null): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "finanzas:accounting:read");
  if (!auth.ok) return auth.response;
  const url = new URL(request.url);
  const accountId = url.searchParams.get("accountId");
  if (!accountId) return NextResponse.json({ ok: false, error: "Falta accountId" }, { status: 400 });
  const from = parseDate(url.searchParams.get("from"));
  const to = parseDate(url.searchParams.get("to"));

  try {
    const data = await getLedger({ organizationId: auth.orgId, accountId, from, to });
    if (!data) return NextResponse.json({ ok: false, error: "Cuenta no encontrada" }, { status: 404 });
    return adminOk({ data });
  } catch (error) {
    return adminServerError("accounting.ledger", error);
  }
}
