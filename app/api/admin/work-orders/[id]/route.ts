import { getDb } from "../../../../../lib/db.ts";
import { logAudit } from "../../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../../lib/admin-api.ts";
import { workOrderUpdateSchema } from "../../../../../lib/modules/services/schema.ts";
import { updateWorkOrder, WorkOrderValidationError } from "../../../../../lib/modules/services/work-order-service.ts";
import { authorizeModule } from "../../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteParams { params: Promise<{ id: string }>; }

export async function GET(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "postventa:work-order:read");
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  try {
    const workOrder = await getDb().workOrder.findFirst({
      where: { id, organizationId: auth.orgId, deletedAt: null },
      include: {
        account: { select: { id: true, name: true } },
        ticket: { select: { id: true, number: true, subject: true } },
        serialNumber: { include: { product: { select: { id: true, name: true, sku: true } } } },
        assignedTo: { select: { id: true, name: true } },
        items: { include: { product: { select: { id: true, name: true, sku: true } } } },
      },
    });
    return adminOk({ data: workOrder });
  } catch (error) {
    return adminServerError("workOrders.get", error);
  }
}

export async function PUT(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "postventa:work-order:update", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = workOrderUpdateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const wo = await updateWorkOrder({ organizationId: auth.orgId, id, data: parsed.data });
    if (!wo) return adminOk({ data: null });
    await logAudit("update", "work_order", id, { title: wo.title }, { organizationId: auth.orgId });
    return adminOk({ data: wo });
  } catch (error) {
    if (error instanceof WorkOrderValidationError) {
      return adminOk({ data: null, error: error.message });
    }
    return adminServerError("workOrders.update", error);
  }
}
