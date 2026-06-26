import { getDb } from "../../../../../lib/db.ts";
import { logAudit } from "../../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../../lib/admin-api.ts";
import { ticketUpdateSchema } from "../../../../../lib/modules/support/schema.ts";
import { updateTicket } from "../../../../../lib/modules/support/ticket-service.ts";
import { authorizeModule } from "../../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteParams { params: Promise<{ id: string }>; }

export async function GET(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "postventa:ticket:read");
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  try {
    const ticket = await getDb().ticket.findFirst({
      where: { id, organizationId: auth.orgId, deletedAt: null },
      include: {
        account: { select: { id: true, name: true, email: true, phone: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
        serialNumber: { include: { product: { select: { id: true, name: true, sku: true } } } },
        messages: { orderBy: { createdAt: "asc" } },
        workOrders: { select: { id: true, number: true, status: true, scheduledFor: true } },
      },
    });
    return adminOk({ data: ticket });
  } catch (error) {
    return adminServerError("tickets.get", error);
  }
}

export async function PUT(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "postventa:ticket:update", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = ticketUpdateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const ticket = await updateTicket({ organizationId: auth.orgId, id, data: parsed.data });
    if (!ticket) return adminOk({ data: null });
    await logAudit("update", "ticket", id, parsed.data as Record<string, unknown>, { organizationId: auth.orgId });
    return adminOk({ data: ticket });
  } catch (error) {
    return adminServerError("tickets.update", error);
  }
}

export async function DELETE(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "postventa:ticket:update", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  try {
    const db = getDb();
    const existing = await db.ticket.findFirst({ where: { id, organizationId: auth.orgId, deletedAt: null } });
    if (!existing) return adminOk({ data: null });
    await db.ticket.update({ where: { id }, data: { deletedAt: new Date() } });
    await logAudit("delete", "ticket", id, undefined, { organizationId: auth.orgId });
    return adminOk();
  } catch (error) {
    return adminServerError("tickets.delete", error);
  }
}
