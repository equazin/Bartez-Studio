import { NextResponse } from "next/server.js";
import { logAudit } from "../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { authorizeModule } from "../../../../lib/modules/admin-module.ts";
import { ledgerAccountCreateSchema } from "../../../../lib/modules/accounting/schema.ts";
import { AccountingValidationError, createLedgerAccount, listLedgerAccounts, seedChartOfAccounts } from "../../../../lib/modules/accounting/accounting-service.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "finanzas:accounting:read");
  if (!auth.ok) return auth.response;
  try {
    // Auto-seed: si la organización no tiene plan de cuentas, lo crea.
    await seedChartOfAccounts(auth.orgId);
    const data = await listLedgerAccounts(auth.orgId);
    return adminOk({ data });
  } catch (error) {
    return adminServerError("ledgerAccounts.list", error);
  }
}

export async function POST(request: Request) {
  const auth = await authorizeModule(request, "finanzas:accounting:create", { mutation: true });
  if (!auth.ok) return auth.response;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = ledgerAccountCreateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const account = await createLedgerAccount({ organizationId: auth.orgId, data: parsed.data });
    await logAudit("create", "ledger_account", account.id, { code: account.code, name: account.name }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: account }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof AccountingValidationError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }
    return adminServerError("ledgerAccounts.create", error);
  }
}
