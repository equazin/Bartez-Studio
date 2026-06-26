import { NextResponse } from "next/server.js";
import { getDb } from "../../../../lib/db.ts";
import { logAudit } from "../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { workOrderCreateSchema } from "../../../../lib/modules/services/schema.ts";
import { createWorkOrder } from "../../../../lib/modules/services/work-order-service.ts";
import { authorizeModule, parseModulePagination } from "../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "postventa:work-order:read");
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const { page, limit, skip } = parseModulePagination(url);
  const status = url.searchParams.get("status") || undefined;
  const assignedToId = url.searchParams.get("assignedToId") || undefined;
  const q = url.searchParams.get("q")?.trim();

  const where: Record<string, unknown> = { organizationId: auth.orgId, deletedAt: null };
  if (status) where.status = status;
  if (assignedToId) where.assignedToId = assignedToId;
  if (q) {
    where.OR = [
      { number: { contains: q, mode: "insensitive" } },
      { title: { contains: q, mode: "insensitive" } },
    ];
  }

  try {
    const db = getDb();
    const [data, total] = await Promise.all([
      db.workOrder.findMany({
        where,
        orderBy: [{ status: "asc" }, { scheduledFor: "asc" }, { createdAt: "desc" }],
        skip,
        take: limit,
        include: {
          account: { select: { id: true, name: true } },
          assignedTo: { select: { id: true, name: true } },
          _count: { select: { items: true } },
        },
      }),
      db.workOrder.count({ where }),
    ]);
    return adminOk({ data, meta: { total, page, limit } });
  } catch (error) {
    return adminServerError("workOrders.list", error);
  }
}

export async function POST(request: Request) {
  const auth = await authorizeModule(request, "postventa:work-order:create", { mutation: true });
  if (!auth.ok) return auth.response;

  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = workOrderCreateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const workOrder = await createWorkOrder({ organizationId: auth.orgId, data: parsed.data });
    await logAudit("create", "work_order", workOrder.id, { number: workOrder.number, title: workOrder.title }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: workOrder }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return adminServerError("workOrders.create", error);
  }
}
