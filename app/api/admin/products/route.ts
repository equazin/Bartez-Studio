import { NextResponse } from "next/server.js";
import { getDb } from "../../../../lib/db.ts";
import { logAudit } from "../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { productCreateSchema } from "../../../../lib/modules/catalog/schema.ts";
import { authorizeModule, parseModulePagination } from "../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "ventas:quote:read");
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const { page, limit, skip } = parseModulePagination(url);
  const q = url.searchParams.get("q")?.trim();
  const activeOnly = url.searchParams.get("active") === "1";

  const where: Record<string, unknown> = { organizationId: auth.orgId, deletedAt: null };
  if (activeOnly) where.active = true;
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { sku: { contains: q, mode: "insensitive" } },
      { brand: { contains: q, mode: "insensitive" } },
    ];
  }

  try {
    const db = getDb();
    const [data, total] = await Promise.all([
      db.product.findMany({ where, orderBy: { name: "asc" }, skip, take: limit }),
      db.product.count({ where }),
    ]);
    return adminOk({ data, meta: { total, page, limit } });
  } catch (error) {
    return adminServerError("products.list", error);
  }
}

export async function POST(request: Request) {
  const auth = await authorizeModule(request, "ventas:quote:create", { mutation: true });
  if (!auth.ok) return auth.response;

  const body = await readAdminJson(request);
  if (!body.ok) return body.response;

  const parsed = productCreateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const product = await getDb().product.create({
      data: { ...parsed.data, organizationId: auth.orgId },
    });
    await logAudit("create", "product", product.id, { name: product.name, sku: product.sku }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: product }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return adminServerError("products.create", error);
  }
}
