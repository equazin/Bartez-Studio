import { getDb } from "../../../../lib/db.ts";
import { adminOk, adminServerError } from "../../../../lib/admin-api.ts";
import { authorizeModule, parseModulePagination } from "../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "compras:receipt:read");
  if (!auth.ok) return auth.response;
  const url = new URL(request.url);
  const { page, limit, skip } = parseModulePagination(url);
  const purchaseOrderId = url.searchParams.get("purchaseOrderId") || undefined;
  const where: Record<string, unknown> = { organizationId: auth.orgId, deletedAt: null };
  if (purchaseOrderId) where.purchaseOrderId = purchaseOrderId;

  try {
    const db = getDb();
    const [data, total] = await Promise.all([
      db.goodsReceipt.findMany({
        where,
        orderBy: { receivedAt: "desc" },
        skip,
        take: limit,
        include: {
          supplier: { select: { id: true, name: true } },
          purchaseOrder: { select: { id: true, number: true } },
          warehouse: { select: { id: true, name: true } },
          _count: { select: { lines: true } },
        },
      }),
      db.goodsReceipt.count({ where }),
    ]);
    return adminOk({ data, meta: { total, page, limit } });
  } catch (error) {
    return adminServerError("goodsReceipts.list", error);
  }
}
