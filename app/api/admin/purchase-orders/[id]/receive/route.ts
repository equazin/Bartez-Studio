import { NextResponse } from "next/server.js";
import { logAudit } from "../../../../../../lib/audit.ts";
import { adminServerError, invalidAdminInput, readAdminJson } from "../../../../../../lib/admin-api.ts";
import { authorizeModule } from "../../../../../../lib/modules/admin-module.ts";
import { goodsReceiptCreateSchema } from "../../../../../../lib/modules/purchases/schema.ts";
import { receivePurchaseOrder, PurchaseValidationError } from "../../../../../../lib/modules/purchases/purchase-service.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteParams { params: Promise<{ id: string }>; }

export async function POST(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "compras:receipt:create", { mutation: true });
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = goodsReceiptCreateSchema.safeParse({ ...(body.data as Record<string, unknown>), purchaseOrderId: id });
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const receipt = await receivePurchaseOrder({ organizationId: auth.orgId, data: parsed.data });
    await logAudit("create", "goods_receipt", receipt.id, { number: receipt.number, purchaseOrderId: id }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: receipt }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof PurchaseValidationError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }
    return adminServerError("purchaseOrders.receive", error);
  }
}
