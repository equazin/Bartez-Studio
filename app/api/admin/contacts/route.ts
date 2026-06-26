import { NextResponse } from "next/server.js";
import { getDb } from "../../../../lib/db.ts";
import { logAudit } from "../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { contactCreateSchema } from "../../../../lib/modules/crm/schema.ts";
import { authorizeCrm, parsePagination } from "../../../../lib/modules/crm/api-helpers.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeCrm(request, "crm:account:read");
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const { page, limit, skip } = parsePagination(url);
  const q = url.searchParams.get("q")?.trim();
  const accountId = url.searchParams.get("accountId") || undefined;

  const where: Record<string, unknown> = { organizationId: auth.orgId, deletedAt: null };
  if (accountId) where.accountId = accountId;
  if (q) {
    where.OR = [
      { firstName: { contains: q, mode: "insensitive" } },
      { lastName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { phone: { contains: q } },
    ];
  }

  try {
    const db = getDb();
    const [data, total] = await Promise.all([
      db.contact.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
        include: { account: { select: { id: true, name: true } } },
      }),
      db.contact.count({ where }),
    ]);
    return adminOk({ data, meta: { total, page, limit } });
  } catch (error) {
    return adminServerError("contacts.list", error);
  }
}

export async function POST(request: Request) {
  const auth = await authorizeCrm(request, "crm:account:create", { mutation: true });
  if (!auth.ok) return auth.response;

  const body = await readAdminJson(request);
  if (!body.ok) return body.response;

  const parsed = contactCreateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const contact = await getDb().contact.create({
      data: { ...parsed.data, organizationId: auth.orgId },
    });
    await logAudit("create", "contact", contact.id, { name: `${contact.firstName} ${contact.lastName ?? ""}`.trim() }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: contact }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return adminServerError("contacts.create", error);
  }
}
