import { getDb } from "../../../../lib/db.ts";
import { adminOk, adminServerError } from "../../../../lib/admin-api.ts";
import { authorizeModule, parseModulePagination } from "../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Vista de stock por depósito. Filtros opcionales por warehouseId y q (nombre/sku).
 */
export async function GET(request: Request) {
  const auth = await authorizeModule(request, "inventario:stock:read");
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const { page, limit, skip } = parseModulePagination(url);
  const warehouseId = url.searchParams.get("warehouseId") || undefined;
  const q = url.searchParams.get("q")?.trim();
  const lowStock = url.searchParams.get("lowStock") === "1";

  const where: Record<string, unknown> = {
    warehouse: { organizationId: auth.orgId },
    product: { organizationId: auth.orgId, deletedAt: null, stockTracked: true },
  };
  if (warehouseId) (where as { warehouseId: string }).warehouseId = warehouseId;
  if (q) {
    (where as { product: Record<string, unknown> }).product = {
      organizationId: auth.orgId,
      deletedAt: null,
      stockTracked: true,
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { sku: { contains: q, mode: "insensitive" } },
      ],
    };
  }

  try {
    const db = getDb();
    const [data, total] = await Promise.all([
      db.stockItem.findMany({
        where,
        orderBy: [{ product: { name: "asc" } }],
        skip,
        take: limit,
        include: {
          product: { select: { id: true, sku: true, name: true, unit: true } },
          warehouse: { select: { id: true, code: true, name: true } },
        },
      }),
      db.stockItem.count({ where }),
    ]);

    const filtered = lowStock
      ? data.filter((it) => it.reorderPoint != null && Number(it.quantity) <= Number(it.reorderPoint))
      : data;

    return adminOk({ data: filtered, meta: { total, page, limit } });
  } catch (error) {
    return adminServerError("stock.list", error);
  }
}
