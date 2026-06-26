import { getDb } from "../../../../lib/db.ts";
import { adminOk, adminServerError } from "../../../../lib/admin-api.ts";
import { authorizeModule, parseModulePagination } from "../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Cuentas con su saldo agregado (sum debit - sum credit por moneda) en
 * una sola query. Pensado para mostrar el panel de "Cuentas corrientes".
 */
export async function GET(request: Request) {
  const auth = await authorizeModule(request, "finanzas:account:read");
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const { page, limit, skip } = parseModulePagination(url);
  const q = url.searchParams.get("q")?.trim();

  const where: Record<string, unknown> = { organizationId: auth.orgId, deletedAt: null };
  if (q) where.name = { contains: q, mode: "insensitive" };

  try {
    const db = getDb();
    const [accounts, total] = await Promise.all([
      db.account.findMany({
        where,
        orderBy: { name: "asc" },
        skip,
        take: limit,
        select: { id: true, name: true, taxId: true, email: true },
      }),
      db.account.count({ where }),
    ]);

    // Agregamos saldos por cuenta en una sola consulta groupBy.
    const balances = accounts.length > 0
      ? await db.customerAccountEntry.groupBy({
          by: ["accountId", "currency"],
          where: { organizationId: auth.orgId, accountId: { in: accounts.map((a) => a.id) } },
          _sum: { debit: true, credit: true },
        })
      : [];

    const byAccount = new Map<string, Array<{ currency: string; balance: number }>>();
    for (const row of balances) {
      const debit = Number(row._sum.debit ?? 0);
      const credit = Number(row._sum.credit ?? 0);
      const arr = byAccount.get(row.accountId) ?? [];
      arr.push({ currency: row.currency, balance: Math.round((debit - credit) * 100) / 100 });
      byAccount.set(row.accountId, arr);
    }

    const data = accounts.map((a) => ({
      ...a,
      balances: byAccount.get(a.id) ?? [],
    }));

    return adminOk({ data, meta: { total, page, limit } });
  } catch (error) {
    return adminServerError("customerAccounts.list", error);
  }
}
