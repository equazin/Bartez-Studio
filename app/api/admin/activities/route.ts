import { NextResponse } from "next/server.js";
import { getDb } from "../../../../lib/db.ts";
import { logAudit } from "../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { activityCreateSchema } from "../../../../lib/modules/crm/schema.ts";
import { authorizeCrm, parsePagination } from "../../../../lib/modules/crm/api-helpers.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeCrm(request, "crm:account:read");
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const { page, limit, skip } = parsePagination(url);
  const status = url.searchParams.get("status") || undefined;
  const accountId = url.searchParams.get("accountId") || undefined;
  const opportunityId = url.searchParams.get("opportunityId") || undefined;
  const contactId = url.searchParams.get("contactId") || undefined;
  const assignedToId = url.searchParams.get("assignedToId") || undefined;

  const where: Record<string, unknown> = { organizationId: auth.orgId };
  if (status) where.status = status;
  if (accountId) where.accountId = accountId;
  if (opportunityId) where.opportunityId = opportunityId;
  if (contactId) where.contactId = contactId;
  if (assignedToId) where.assignedToId = assignedToId;

  try {
    const db = getDb();
    const [data, total] = await Promise.all([
      db.activity.findMany({
        where,
        orderBy: [{ status: "asc" }, { dueAt: "asc" }, { createdAt: "desc" }],
        skip,
        take: limit,
        include: {
          account: { select: { id: true, name: true } },
          contact: { select: { id: true, firstName: true, lastName: true } },
          opportunity: { select: { id: true, title: true } },
          assignedTo: { select: { id: true, name: true } },
        },
      }),
      db.activity.count({ where }),
    ]);
    return adminOk({ data, meta: { total, page, limit } });
  } catch (error) {
    return adminServerError("activities.list", error);
  }
}

export async function POST(request: Request) {
  const auth = await authorizeCrm(request, "crm:account:create", { mutation: true });
  if (!auth.ok) return auth.response;

  const body = await readAdminJson(request);
  if (!body.ok) return body.response;

  const parsed = activityCreateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const activity = await getDb().activity.create({
      data: {
        organizationId: auth.orgId,
        type: parsed.data.type,
        subject: parsed.data.subject,
        body: parsed.data.body,
        status: parsed.data.status,
        dueAt: parsed.data.dueAt ?? null,
        assignedToId: parsed.data.assignedToId,
        accountId: parsed.data.accountId,
        contactId: parsed.data.contactId,
        opportunityId: parsed.data.opportunityId,
      },
    });
    await logAudit("create", "activity", activity.id, { type: activity.type, subject: activity.subject }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: activity }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return adminServerError("activities.create", error);
  }
}
