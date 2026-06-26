import { NextResponse } from "next/server.js";
import { getDb } from "../../../../lib/db.ts";
import { logAudit } from "../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { opportunityCreateSchema } from "../../../../lib/modules/crm/schema.ts";
import { authorizeCrm, parsePagination } from "../../../../lib/modules/crm/api-helpers.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeCrm(request, "ventas:quote:read");
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const { page, limit, skip } = parsePagination(url);
  const q = url.searchParams.get("q")?.trim();
  const stage = url.searchParams.get("stage") || undefined;

  const where: Record<string, unknown> = { organizationId: auth.orgId, deletedAt: null };
  if (stage) where.stage = stage;
  if (q) where.title = { contains: q, mode: "insensitive" };

  try {
    const db = getDb();
    const [data, total] = await Promise.all([
      db.opportunity.findMany({
        where,
        orderBy: [{ stage: "asc" }, { updatedAt: "desc" }],
        skip,
        take: limit,
        include: {
          account: { select: { id: true, name: true } },
          owner: { select: { id: true, name: true, email: true } },
        },
      }),
      db.opportunity.count({ where }),
    ]);
    return adminOk({ data, meta: { total, page, limit } });
  } catch (error) {
    return adminServerError("opportunities.list", error);
  }
}

export async function POST(request: Request) {
  const auth = await authorizeCrm(request, "ventas:quote:create", { mutation: true });
  if (!auth.ok) return auth.response;

  const body = await readAdminJson(request);
  if (!body.ok) return body.response;

  const parsed = opportunityCreateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const opp = await getDb().opportunity.create({
      data: {
        organizationId: auth.orgId,
        title: parsed.data.title,
        stage: parsed.data.stage,
        amount: parsed.data.amount,
        currency: parsed.data.currency,
        probability: parsed.data.probability,
        expectedClose: parsed.data.expectedClose ?? null,
        lostReason: parsed.data.lostReason,
        notes: parsed.data.notes,
        accountId: parsed.data.accountId,
        ownerId: parsed.data.ownerId,
      },
    });
    await logAudit("create", "opportunity", opp.id, { title: opp.title, stage: opp.stage }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: opp }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return adminServerError("opportunities.create", error);
  }
}
