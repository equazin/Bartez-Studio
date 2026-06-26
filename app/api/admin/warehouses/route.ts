import { NextResponse } from "next/server.js";
import { getDb } from "../../../../lib/db.ts";
import { logAudit } from "../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { warehouseCreateSchema } from "../../../../lib/modules/inventory/schema.ts";
import { authorizeModule } from "../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "inventario:stock:read");
  if (!auth.ok) return auth.response;

  try {
    const warehouses = await getDb().warehouse.findMany({
      where: { organizationId: auth.orgId },
      orderBy: [{ isDefault: "desc" }, { code: "asc" }],
      include: { _count: { select: { stockItems: true } } },
    });
    return adminOk({ data: warehouses });
  } catch (error) {
    return adminServerError("warehouses.list", error);
  }
}

export async function POST(request: Request) {
  const auth = await authorizeModule(request, "inventario:warehouse:create", { mutation: true });
  if (!auth.ok) return auth.response;

  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = warehouseCreateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const db = getDb();
    const w = await db.$transaction(async (tx) => {
      if (parsed.data.isDefault) {
        await tx.warehouse.updateMany({ where: { organizationId: auth.orgId, isDefault: true }, data: { isDefault: false } });
      }
      return tx.warehouse.create({ data: { ...parsed.data, organizationId: auth.orgId } });
    });
    await logAudit("create", "warehouse", w.id, { name: w.name, code: w.code }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: w }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return adminServerError("warehouses.create", error);
  }
}
