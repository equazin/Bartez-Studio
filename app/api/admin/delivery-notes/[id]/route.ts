import { getDb } from "../../../../../lib/db.ts";
import { logAudit } from "../../../../../lib/audit.ts";
import { adminOk, adminServerError } from "../../../../../lib/admin-api.ts";
import { authorizeModule } from "../../../../../lib/modules/admin-module.ts";
import { cancelDeliveryNote } from "../../../../../lib/modules/delivery-notes/delivery-note-service.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteParams { params: Promise<{ id: string }>; }

export async function GET(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "ventas:delivery-note:read");
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  try {
    const deliveryNote = await getDb().deliveryNote.findFirst({
      where: { id, organizationId: auth.orgId, deletedAt: null },
      include: {
        account: { select: { id: true, name: true, taxId: true, email: true, address: true, city: true } },
        order: { select: { id: true, number: true } },
        lines: { orderBy: { position: "asc" } },
      },
    });
    return adminOk({ data: deliveryNote });
  } catch (error) {
    return adminServerError("deliveryNotes.get", error);
  }
}

export async function DELETE(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "ventas:delivery-note:delete", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  try {
    const deliveryNote = await cancelDeliveryNote({ organizationId: auth.orgId, id });
    if (!deliveryNote) return adminOk({ data: null });
    await logAudit("update", "delivery_note", id, { status: "cancelled" }, { organizationId: auth.orgId });
    return adminOk({ data: deliveryNote });
  } catch (error) {
    return adminServerError("deliveryNotes.cancel", error);
  }
}
