import { NextResponse } from "next/server.js";
import { logAudit } from "../../../../../lib/audit.ts";
import { adminServerError } from "../../../../../lib/admin-api.ts";
import { authorizeModule } from "../../../../../lib/modules/admin-module.ts";
import { voidCashMovement, TreasuryValidationError } from "../../../../../lib/modules/treasury/treasury-service.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorizeModule(request, "finanzas:cash:create", { mutation: true });
  if (!auth.ok) return auth.response;
  const { id } = await params;

  try {
    const movement = await voidCashMovement({ organizationId: auth.orgId, id });
    if (!movement) return NextResponse.json({ ok: false, error: "Movimiento no encontrado o ya anulado" }, { status: 404 });
    await logAudit("delete", "cash_movement", id, { amount: movement.amount.toString() }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: movement }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof TreasuryValidationError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }
    return adminServerError("cashMovements.void", error);
  }
}
