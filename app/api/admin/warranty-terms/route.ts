import { NextResponse } from "next/server.js";
import { getDb } from "../../../../lib/db.ts";
import { logAudit } from "../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { warrantyTermCreateSchema } from "../../../../lib/modules/warranties/schema.ts";
import { authorizeModule, parseModulePagination } from "../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "postventa:warranty:read");
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const { page, limit, skip } = parseModulePagination(url);

  try {
    const db = getDb();
    const [data, total] = await Promise.all([
      db.warrantyTerm.findMany({
        where: { organizationId: auth.orgId },
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
        include: { product: { select: { id: true, name: true, sku: true } } },
      }),
      db.warrantyTerm.count({ where: { organizationId: auth.orgId } }),
    ]);
    return adminOk({ data, meta: { total, page, limit } });
  } catch (error) {
    return adminServerError("warranties.list", error);
  }
}

export async function POST(request: Request) {
  const auth = await authorizeModule(request, "postventa:warranty:create", { mutation: true });
  if (!auth.ok) return auth.response;

  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = warrantyTermCreateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const term = await getDb().warrantyTerm.upsert({
      where: { organizationId_productId: { organizationId: auth.orgId, productId: parsed.data.productId } },
      create: { ...parsed.data, organizationId: auth.orgId },
      update: parsed.data,
    });
    await logAudit("create", "warranty_term", term.id, { productId: term.productId, durationDays: term.durationDays }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: term }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return adminServerError("warranties.create", error);
  }
}
