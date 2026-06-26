import { NextResponse } from "next/server.js";
import { getDb } from "../../../../lib/db.ts";
import { logAudit } from "../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { movementCreateSchema } from "../../../../lib/modules/inventory/schema.ts";
import { applyMovement, OutOfStockError } from "../../../../lib/modules/inventory/stock-service.ts";
import { authorizeModule, parseModulePagination } from "../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "inventario:stock:read");
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const { page, limit, skip } = parseModulePagination(url);
  const productId = url.searchParams.get("productId") || undefined;
  const warehouseId = url.searchParams.get("warehouseId") || undefined;
  const type = url.searchParams.get("type") || undefined;

  const where: Record<string, unknown> = { organizationId: auth.orgId };
  if (productId) where.productId = productId;
  if (warehouseId) where.warehouseId = warehouseId;
  if (type) where.type = type;

  try {
    const db = getDb();
    const [data, total] = await Promise.all([
      db.stockMovement.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          product: { select: { id: true, sku: true, name: true } },
          warehouse: { select: { id: true, code: true, name: true } },
          fromWarehouse: { select: { id: true, code: true, name: true } },
          toWarehouse: { select: { id: true, code: true, name: true } },
        },
      }),
      db.stockMovement.count({ where }),
    ]);
    return adminOk({ data, meta: { total, page, limit } });
  } catch (error) {
    return adminServerError("stockMovements.list", error);
  }
}

export async function POST(request: Request) {
  const auth = await authorizeModule(request, "inventario:stock:update", { mutation: true });
  if (!auth.ok) return auth.response;

  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = movementCreateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    await applyMovement({ organizationId: auth.orgId, data: parsed.data });
    await logAudit("create", "stock_movement", `${parsed.data.type}:${parsed.data.productId}`, parsed.data as unknown as Record<string, unknown>, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof OutOfStockError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 409, headers: { "Cache-Control": "no-store" } });
    }
    return adminServerError("stockMovements.create", error);
  }
}
