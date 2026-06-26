import { NextResponse } from "next/server.js";
import { getDb } from "../../../../lib/db.ts";
import { logAudit } from "../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { accountCreateSchema } from "../../../../lib/modules/crm/schema.ts";
import { authorizeCrm, parsePagination } from "../../../../lib/modules/crm/api-helpers.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeCrm(request, "crm:account:read");
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const { page, limit, skip } = parsePagination(url);
  const q = url.searchParams.get("q")?.trim();

  const where: Record<string, unknown> = { organizationId: auth.orgId, deletedAt: null };
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { taxId: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { city: { contains: q, mode: "insensitive" } },
    ];
  }

  try {
    const db = getDb();
    const [data, total] = await Promise.all([
      db.account.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
        include: { _count: { select: { contacts: true, opportunities: true } } },
      }),
      db.account.count({ where }),
    ]);
    return adminOk({ data, meta: { total, page, limit } });
  } catch (error) {
    return adminServerError("accounts.list", error);
  }
}

export async function POST(request: Request) {
  const auth = await authorizeCrm(request, "crm:account:create", { mutation: true });
  if (!auth.ok) return auth.response;

  const body = await readAdminJson(request);
  if (!body.ok) return body.response;

  const parsed = accountCreateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const account = await getDb().account.create({
      data: { ...parsed.data, organizationId: auth.orgId },
    });
    await logAudit("create", "account", account.id, { name: account.name }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: account }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return adminServerError("accounts.create", error);
  }
}
