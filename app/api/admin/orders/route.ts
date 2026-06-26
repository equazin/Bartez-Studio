import { NextResponse } from "next/server.js";
import { getDb } from "../../../../lib/db.ts";
import { logAudit } from "../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { orderCreateSchema } from "../../../../lib/modules/orders/schema.ts";
import { createOrder } from "../../../../lib/modules/orders/order-service.ts";
import { authorizeModule, parseModulePagination } from "../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "ventas:order:read");
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const { page, limit, skip } = parseModulePagination(url);
  const status = url.searchParams.get("status") || undefined;
  const accountId = url.searchParams.get("accountId") || undefined;
  const q = url.searchParams.get("q")?.trim();

  const where: Record<string, unknown> = { organizationId: auth.orgId, deletedAt: null };
  if (status) where.status = status;
  if (accountId) where.accountId = accountId;
  if (q) {
    where.OR = [
      { number: { contains: q, mode: "insensitive" } },
      { account: { name: { contains: q, mode: "insensitive" } } },
    ];
  }

  try {
    const db = getDb();
    const [data, total] = await Promise.all([
      db.salesOrder.findMany({
        where,
        orderBy: { orderDate: "desc" },
        skip,
        take: limit,
        include: {
          account: { select: { id: true, name: true } },
          owner: { select: { id: true, name: true } },
          _count: { select: { lines: true } },
        },
      }),
      db.salesOrder.count({ where }),
    ]);
    return adminOk({ data, meta: { total, page, limit } });
  } catch (error) {
    return adminServerError("orders.list", error);
  }
}

export async function POST(request: Request) {
  const auth = await authorizeModule(request, "ventas:order:create", { mutation: true });
  if (!auth.ok) return auth.response;

  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = orderCreateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const order = await createOrder({ organizationId: auth.orgId, data: parsed.data });
    await logAudit("create", "sales_order", order.id, { number: order.number, total: order.total.toString() }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: order }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return adminServerError("orders.create", error);
  }
}
