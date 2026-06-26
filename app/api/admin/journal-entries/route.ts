import { NextResponse } from "next/server.js";
import { logAudit } from "../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { authorizeModule, parseModulePagination } from "../../../../lib/modules/admin-module.ts";
import { journalEntryCreateSchema } from "../../../../lib/modules/accounting/schema.ts";
import { AccountingValidationError, createJournalEntry, listJournalEntries } from "../../../../lib/modules/accounting/accounting-service.ts";

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
  const { page, limit, skip } = parseModulePagination(url);
  const from = parseDate(url.searchParams.get("from"));
  const to = parseDate(url.searchParams.get("to"));

  try {
    const { data, total } = await listJournalEntries({ organizationId: auth.orgId, from, to, skip, take: limit });
    return adminOk({ data, meta: { total, page, limit } });
  } catch (error) {
    return adminServerError("journalEntries.list", error);
  }
}

export async function POST(request: Request) {
  const auth = await authorizeModule(request, "finanzas:accounting:create", { mutation: true });
  if (!auth.ok) return auth.response;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = journalEntryCreateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const entry = await createJournalEntry({ organizationId: auth.orgId, data: parsed.data });
    await logAudit("create", "journal_entry", entry.id, { number: entry.number, description: entry.description }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: entry }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof AccountingValidationError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }
    return adminServerError("journalEntries.create", error);
  }
}
