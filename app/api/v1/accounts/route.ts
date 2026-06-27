import { getDb } from "../../../../lib/db";
import { authorizeV1Request, v1Ok } from "../../../../lib/api-v1";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeV1Request(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const q = searchParams.get("q") || undefined;
  const skip = (page - 1) * limit;

  const db = getDb();
  const where = q
    ? { OR: [
        { name: { contains: q, mode: "insensitive" as const } },
        { taxId: { contains: q, mode: "insensitive" as const } },
      ] }
    : {};

  const [accounts, total] = await Promise.all([
    db.account.findMany({
      where,
      orderBy: { name: "asc" },
      skip,
      take: limit,
      select: {
        id: true, name: true, industry: true, email: true, phone: true,
        taxId: true, address: true, city: true, country: true,
        createdAt: true, updatedAt: true,
      },
    }),
    db.account.count({ where }),
  ]);

  return v1Ok(accounts, { total, page, limit, pages: Math.ceil(total / limit) });
}
