import { getDb } from "../../../../../../../lib/db.ts";
import { logAudit } from "../../../../../../../lib/audit.ts";
import { adminOk, adminServerError } from "../../../../../../../lib/admin-api.ts";
import { authorizeModule } from "../../../../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ id: string; itemId: string }>;
}

export async function DELETE(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "ventas:quote:update", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id: priceListId, itemId } = await ctx.params;
  const db = getDb();
  try {
    const list = await db.priceList.findFirst({ where: { id: priceListId, organizationId: auth.orgId } });
    if (!list) return adminOk({ data: null });

    await db.priceListItem.deleteMany({ where: { id: itemId, priceListId } });
    await logAudit("update", "price_list", priceListId, { removedItem: itemId }, { organizationId: auth.orgId });
    return adminOk();
  } catch (error) {
    return adminServerError("priceLists.deleteItem", error);
  }
}
