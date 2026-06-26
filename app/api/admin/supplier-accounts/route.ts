import { getDb } from "../../../../lib/db.ts";
import { adminOk, adminServerError } from "../../../../lib/admin-api.ts";
import { authorizeModule, parseModulePagination } from "../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "finanzas:payable:read");
  if (!auth.ok) return auth.response;
  const url = new URL(request.url);
  const { page, limit, skip } = parseModulePagination(url);
  const q = url.searchParams.get("q")?.trim();
  const where: Record<string, unknown> = { organizationId: auth.orgId, deletedAt: null };
  if (q) where.name = { contains: q, mode: "insensitive" };

  try {
    const db = getDb();
    const [suppliers, total] = await Promise.all([
      db.supplier.findMany({ where, orderBy: { name: "asc" }, skip, take: limit, select: { id: true, name: true, taxId: true, email: true } }),
      db.supplier.count({ where }),
    ]);
    const balances = suppliers.length > 0
      ? await db.supplierAccountEntry.groupBy({
          by: ["supplierId", "currency"],
          where: { organizationId: auth.orgId, supplierId: { in: suppliers.map((supplier) => supplier.id) } },
          _sum: { debit: true, credit: true },
        })
      : [];
    const bySupplier = new Map<string, Array<{ currency: string; balance: number }>>();
    for (const row of balances) {
      const debit = Number(row._sum.debit ?? 0);
      const credit = Number(row._sum.credit ?? 0);
      const arr = bySupplier.get(row.supplierId) ?? [];
      arr.push({ currency: row.currency, balance: Math.round((credit - debit) * 100) / 100 });
      bySupplier.set(row.supplierId, arr);
    }
    return adminOk({ data: suppliers.map((supplier) => ({ ...supplier, balances: bySupplier.get(supplier.id) ?? [] })), meta: { total, page, limit } });
  } catch (error) {
    return adminServerError("supplierAccounts.list", error);
  }
}
