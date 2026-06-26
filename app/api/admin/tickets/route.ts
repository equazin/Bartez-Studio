import { NextResponse } from "next/server.js";
import { getDb } from "../../../../lib/db.ts";
import { logAudit } from "../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { ticketCreateSchema } from "../../../../lib/modules/support/schema.ts";
import { createTicket } from "../../../../lib/modules/support/ticket-service.ts";
import { authorizeModule, parseModulePagination } from "../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "postventa:ticket:read");
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const { page, limit, skip } = parseModulePagination(url);
  const status = url.searchParams.get("status") || undefined;
  const priority = url.searchParams.get("priority") || undefined;
  const accountId = url.searchParams.get("accountId") || undefined;
  const assignedToId = url.searchParams.get("assignedToId") || undefined;
  const q = url.searchParams.get("q")?.trim();

  const where: Record<string, unknown> = { organizationId: auth.orgId, deletedAt: null };
  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (accountId) where.accountId = accountId;
  if (assignedToId) where.assignedToId = assignedToId;
  if (q) {
    where.OR = [
      { number: { contains: q, mode: "insensitive" } },
      { subject: { contains: q, mode: "insensitive" } },
    ];
  }

  try {
    const db = getDb();
    const [data, total] = await Promise.all([
      db.ticket.findMany({
        where,
        orderBy: [{ status: "asc" }, { priority: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
        include: {
          account: { select: { id: true, name: true } },
          assignedTo: { select: { id: true, name: true } },
          _count: { select: { messages: true } },
        },
      }),
      db.ticket.count({ where }),
    ]);
    return adminOk({ data, meta: { total, page, limit } });
  } catch (error) {
    return adminServerError("tickets.list", error);
  }
}

export async function POST(request: Request) {
  const auth = await authorizeModule(request, "postventa:ticket:create", { mutation: true });
  if (!auth.ok) return auth.response;

  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = ticketCreateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const ticket = await createTicket({ organizationId: auth.orgId, data: parsed.data });
    await logAudit("create", "ticket", ticket.id, { number: ticket.number, subject: ticket.subject }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: ticket }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return adminServerError("tickets.create", error);
  }
}
