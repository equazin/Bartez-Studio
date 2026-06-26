import { getDb } from "../../../../../lib/db.ts";
import { adminOk, adminServerError } from "../../../../../lib/admin-api.ts";
import { getAccountBalances, getInvoiceBalance } from "../../../../../lib/modules/collections/receipt-service.ts";
import { authorizeModule } from "../../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteParams { params: Promise<{ id: string }>; }

/**
 * Vista cuenta corriente: saldos por moneda + asientos + facturas pendientes
 * para imputar pagos.
 */
export async function GET(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "finanzas:account:read");
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  const db = getDb();
  try {
    const account = await db.account.findFirst({
      where: { id, organizationId: auth.orgId, deletedAt: null },
      select: { id: true, name: true, taxId: true },
    });
    if (!account) return adminOk({ data: null });

    const [entries, balances, openInvoices] = await Promise.all([
      db.customerAccountEntry.findMany({
        where: { organizationId: auth.orgId, accountId: id },
        orderBy: { date: "desc" },
        take: 200,
      }),
      getAccountBalances(auth.orgId, id),
      db.invoice.findMany({
        where: { organizationId: auth.orgId, accountId: id, status: "issued", deletedAt: null, docTypeCode: { notIn: [3, 8, 13] } },
        orderBy: { issueDate: "asc" },
        select: { id: true, number: true, total: true, currency: true, issueDate: true, allocations: { select: { amount: true } } },
      }),
    ]);

    const open = await Promise.all(openInvoices.map(async (inv) => {
      const bal = await getInvoiceBalance(auth.orgId, inv.id);
      return {
        id: inv.id,
        number: inv.number,
        issueDate: inv.issueDate,
        currency: inv.currency,
        total: bal.total,
        paid: bal.paid,
        pending: bal.pending,
      };
    }));

    return adminOk({ data: { account, balances, entries, openInvoices: open.filter((o) => o.pending > 0.005) } });
  } catch (error) {
    return adminServerError("customerAccounts.get", error);
  }
}
