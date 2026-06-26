import { getDb } from "../../../../../lib/db.ts";
import { adminOk, adminServerError } from "../../../../../lib/admin-api.ts";
import { authorizeModule } from "../../../../../lib/modules/admin-module.ts";
import { getSupplierBalances } from "../../../../../lib/modules/purchases/purchase-service.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteParams { params: Promise<{ id: string }>; }

export async function GET(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "finanzas:payable:read");
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;
  const db = getDb();
  try {
    const supplier = await db.supplier.findFirst({
      where: { id, organizationId: auth.orgId, deletedAt: null },
      select: { id: true, name: true, taxId: true },
    });
    if (!supplier) return adminOk({ data: null });

    const [entries, balances, orders] = await Promise.all([
      db.supplierAccountEntry.findMany({ where: { organizationId: auth.orgId, supplierId: id }, orderBy: { date: "desc" }, take: 200 }),
      getSupplierBalances(auth.orgId, id),
      db.purchaseOrder.findMany({
        where: { organizationId: auth.orgId, supplierId: id, status: { not: "cancelled" }, deletedAt: null },
        orderBy: { issueDate: "asc" },
        select: { id: true, number: true, total: true, currency: true, issueDate: true, allocations: { select: { amount: true } } },
      }),
    ]);

    const openOrders = orders.map((order) => {
      const paid = order.allocations.reduce((sum, allocation) => sum + Number(allocation.amount), 0);
      const total = Number(order.total);
      return {
        id: order.id,
        number: order.number,
        issueDate: order.issueDate,
        currency: order.currency,
        total,
        paid: Math.round(paid * 100) / 100,
        pending: Math.round((total - paid) * 100) / 100,
      };
    }).filter((order) => order.pending > 0.005);

    return adminOk({ data: { supplier, balances, entries, openOrders } });
  } catch (error) {
    return adminServerError("supplierAccounts.get", error);
  }
}
