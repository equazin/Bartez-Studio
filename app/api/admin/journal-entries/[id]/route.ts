import { NextResponse } from "next/server.js";
import { logAudit } from "../../../../../lib/audit.ts";
import { adminServerError } from "../../../../../lib/admin-api.ts";
import { authorizeModule } from "../../../../../lib/modules/admin-module.ts";
import { voidJournalEntry } from "../../../../../lib/modules/accounting/accounting-service.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorizeModule(request, "finanzas:accounting:create", { mutation: true });
  if (!auth.ok) return auth.response;
  const { id } = await params;

  try {
    const entry = await voidJournalEntry({ organizationId: auth.orgId, id });
    if (!entry) return NextResponse.json({ ok: false, error: "Asiento no encontrado o ya anulado" }, { status: 404 });
    await logAudit("delete", "journal_entry", id, { number: entry.number }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: entry }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return adminServerError("journalEntries.void", error);
  }
}
