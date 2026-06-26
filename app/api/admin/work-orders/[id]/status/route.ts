import { NextResponse } from "next/server.js";
import { logAudit } from "../../../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../../../lib/admin-api.ts";
import { workOrderStatusSchema } from "../../../../../../lib/modules/services/schema.ts";
import { transitionWorkOrderStatus, WorkOrderValidationError } from "../../../../../../lib/modules/services/work-order-service.ts";
import { authorizeModule } from "../../../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteParams { params: Promise<{ id: string }>; }

export async function POST(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "postventa:work-order:update", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = workOrderStatusSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const wo = await transitionWorkOrderStatus({
      organizationId: auth.orgId,
      id,
      target: parsed.data.status,
      resolutionNotes: parsed.data.resolutionNotes,
      durationMinutes: parsed.data.durationMinutes,
    });
    if (!wo) return adminOk({ data: null });
    await logAudit("update", "work_order", id, { status: parsed.data.status }, { organizationId: auth.orgId });
    return adminOk({ data: wo });
  } catch (error) {
    if (error instanceof WorkOrderValidationError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }
    return adminServerError("workOrders.status", error);
  }
}
