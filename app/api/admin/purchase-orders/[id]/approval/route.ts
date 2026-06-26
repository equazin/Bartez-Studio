import { NextResponse } from "next/server.js";
import { z } from "zod";
import { logAudit } from "../../../../../../lib/audit.ts";
import { adminServerError, invalidAdminInput, readAdminJson } from "../../../../../../lib/admin-api.ts";
import { authorizeModule } from "../../../../../../lib/modules/admin-module.ts";
import { decidePurchaseOrderApproval, PurchaseValidationError } from "../../../../../../lib/modules/purchases/purchase-service.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const approvalSchema = z.object({
  decision: z.enum(["approved", "rejected"]),
  note: z.string().trim().max(500).nullish().transform((value) => value || null),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorizeModule(request, "compras:po:approve", { mutation: true });
  if (!auth.ok) return auth.response;
  const { id } = await params;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = approvalSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const order = await decidePurchaseOrderApproval({
      organizationId: auth.orgId,
      id,
      decision: parsed.data.decision,
      userId: auth.session.userId,
      note: parsed.data.note,
    });
    if (!order) return NextResponse.json({ ok: false, error: "Orden de compra no encontrada" }, { status: 404 });
    await logAudit("update", "purchase_order", id, { approvalStatus: parsed.data.decision }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: order }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof PurchaseValidationError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }
    return adminServerError("purchaseOrders.approval", error);
  }
}
