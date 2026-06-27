import { getDb } from "../../../../lib/db";
import { authorizeV1Request, v1Ok } from "../../../../lib/api-v1";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeV1Request(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const status = searchParams.get("status") || undefined;
  const skip = (page - 1) * limit;

  const db = getDb();
  const where = status ? { status } : {};

  const [orders, total] = await Promise.all([
    db.salesOrder.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true, number: true, status: true, total: true, currency: true,
        notes: true, createdAt: true, updatedAt: true,
        account: { select: { id: true, name: true } },
      },
    }),
    db.salesOrder.count({ where }),
  ]);

  return v1Ok(orders, { total, page, limit, pages: Math.ceil(total / limit) });
}
