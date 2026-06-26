import { NextResponse } from "next/server.js";
import { getDb } from "../../../../lib/db.ts";
import { logAudit } from "../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { authorizeModule, parseModulePagination } from "../../../../lib/modules/admin-module.ts";
import { supplierCreateSchema } from "../../../../lib/modules/purchases/schema.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "compras:supplier:read");
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const { page, limit, skip } = parseModulePagination(url);
  const q = url.searchParams.get("q")?.trim();
  const active = url.searchParams.get("active");
  const where: Record<string, unknown> = { organizationId: auth.orgId, deletedAt: null };
  if (active === "1") where.active = true;
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { taxId: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }

  try {
    const db = getDb();
    const [data, total] = await Promise.all([
      db.supplier.findMany({ where, orderBy: { name: "asc" }, skip, take: limit }),
      db.supplier.count({ where }),
    ]);
    return adminOk({ data, meta: { total, page, limit } });
  } catch (error) {
    return adminServerError("suppliers.list", error);
  }
}

export async function POST(request: Request) {
  const auth = await authorizeModule(request, "compras:supplier:create", { mutation: true });
  if (!auth.ok) return auth.response;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = supplierCreateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const supplier = await getDb().supplier.create({
      data: { organizationId: auth.orgId, ...parsed.data },
    });
    await logAudit("create", "supplier", supplier.id, { name: supplier.name }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: supplier }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return adminServerError("suppliers.create", error);
  }
}
