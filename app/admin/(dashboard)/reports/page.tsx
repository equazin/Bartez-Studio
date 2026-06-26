"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, BarChart3, Clock, DollarSign, ShoppingCart, TrendingUp, Wallet } from "lucide-react";
import { AdminAlert, AdminPanel, AdminSpinner } from "../../../../components/admin/AdminUI";

interface Overview {
  sales: { total: number; taxTotal: number; count: number };
  receipts: { total: number; count: number };
  purchases: { total: number; count: number };
  supplierPayments: { total: number; count: number };
  accountsReceivable: { total: number; aging: { d0_30: number; d31_60: number; d61_90: number; d90_plus: number } };
  accountsPayable: { total: number };
  cashBalances: Array<{ id: string; name: string; currency: string; balance: number }>;
}

interface SalesByPeriod { period: string; totals: Array<{ currency: string; total: number }>; }
interface TopProduct { productId: string; name: string; quantity: number; total: number; }
interface TopAccount { accountId: string | null; name: string; total: number; invoiceCount: number; }
interface TicketSummary { total: number; overdue: number; byStatus: Array<{ status: string; count: number }>; byPriority: Array<{ priority: string; count: number }>; }
interface DsoResult { dso: number; totalReceivables: number; totalSales: number; }

const PERIODS = [
  { label: "7 días", days: 7 },
  { label: "30 días", days: 30 },
  { label: "90 días", days: 90 },
  { label: "1 año", days: 365 },
];

function periodFrom(days: number): Date {
  return new Date(Date.now() - days * 86400_000);
}

export default function ReportsPage() {
  const [days, setDays] = useState(30);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [series, setSeries] = useState<SalesByPeriod[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [topAccounts, setTopAccounts] = useState<TopAccount[]>([]);
  const [tickets, setTickets] = useState<TicketSummary | null>(null);
  const [dso, setDso] = useState<DsoResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const from = periodFrom(days).toISOString();
      const to = new Date().toISOString();
      const groupBy = days >= 365 ? "month" : days >= 30 ? "week" : "day";
      const [a, b, c, d, e, f] = await Promise.all([
        fetch(`/api/admin/reports?type=overview&from=${from}&to=${to}`).then((r) => r.json()),
        fetch(`/api/admin/reports?type=sales-by-period&from=${from}&to=${to}&groupBy=${groupBy}`).then((r) => r.json()),
        fetch(`/api/admin/reports?type=top-products&from=${from}&to=${to}`).then((r) => r.json()),
        fetch(`/api/admin/reports?type=top-accounts&from=${from}&to=${to}`).then((r) => r.json()),
        fetch(`/api/admin/reports?type=tickets&from=${from}&to=${to}`).then((r) => r.json()),
        fetch(`/api/admin/reports?type=dso`).then((r) => r.json()),
      ]);
      setOverview(a.data);
      setSeries(b.data || []);
      setTopProducts(c.data || []);
      setTopAccounts(d.data || []);
      setTickets(e.data);
      setDso(f.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => { void load(); }, [load]);

  if (loading && !overview) return <div className="flex items-center justify-center py-32"><AdminSpinner /></div>;
  if (!overview) return <p className="py-20 text-center text-slate-600">{error || "Sin datos."}</p>;

  const maxSeriesValue = series.length > 0 ? Math.max(1, ...series.flatMap((s) => s.totals.map((t) => t.total))) : 1;

  return (
    <div className="mx-auto max-w-[1240px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Reportes BI</h1>
          <p className="mt-2 text-[14px] font-medium text-slate-700">Métricas financieras y operativas consolidadas.</p>
        </div>
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
          {PERIODS.map((p) => (
            <button key={p.days} onClick={() => setDays(p.days)} className={`rounded-md px-3 py-1.5 text-[12px] font-bold transition-colors ${days === p.days ? "bg-white text-slate-950 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>{p.label}</button>
          ))}
        </div>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      {/* KPIs */}
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Ventas" value={`$${overview.sales.total.toLocaleString()}`} sub={`${overview.sales.count} facturas`} icon={DollarSign} color="bg-emerald-50 border-emerald-200 text-emerald-900" />
        <KpiCard label="Cobranzas" value={`$${overview.receipts.total.toLocaleString()}`} sub={`${overview.receipts.count} recibos`} icon={Wallet} color="bg-blue-50 border-blue-200 text-blue-900" />
        <KpiCard label="Compras" value={`$${overview.purchases.total.toLocaleString()}`} sub={`${overview.purchases.count} OC`} icon={ShoppingCart} color="bg-purple-50 border-purple-200 text-purple-900" />
        <KpiCard label="DSO" value={dso ? `${dso.dso} días` : "—"} sub="Días promedio de cobranza" icon={Clock} color="bg-amber-50 border-amber-200 text-amber-900" />
      </div>

      {/* Aging + AP + Cash */}
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <AdminPanel className="p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">Cuentas por cobrar</p>
          <p className="mt-1 font-display text-[26px] font-bold leading-none text-slate-950">${overview.accountsReceivable.total.toLocaleString()}</p>
          <div className="mt-4 space-y-1.5 text-[12.5px]">
            {[
              { label: "0-30 días", value: overview.accountsReceivable.aging.d0_30, color: "bg-emerald-500" },
              { label: "31-60 días", value: overview.accountsReceivable.aging.d31_60, color: "bg-amber-500" },
              { label: "61-90 días", value: overview.accountsReceivable.aging.d61_90, color: "bg-orange-500" },
              { label: "90+ días", value: overview.accountsReceivable.aging.d90_plus, color: "bg-red-500" },
            ].map((row) => {
              const pct = overview.accountsReceivable.total > 0 ? (row.value / overview.accountsReceivable.total) * 100 : 0;
              return (
                <div key={row.label} className="flex items-center gap-2">
                  <span className="w-24 text-slate-600">{row.label}</span>
                  <div className="flex-1 rounded bg-slate-100">
                    <div className={`h-2 rounded ${row.color}`} style={{ width: `${Math.max(2, pct)}%` }} />
                  </div>
                  <span className="w-24 text-right font-bold text-slate-950">${row.value.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </AdminPanel>

        <AdminPanel className="p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">Cuentas por pagar</p>
          <p className="mt-1 font-display text-[26px] font-bold leading-none text-slate-950">${overview.accountsPayable.total.toLocaleString()}</p>
          <p className="mt-4 text-[12.5px] text-slate-600">Saldo total a proveedores. Pagos del período: ${overview.supplierPayments.total.toLocaleString()}.</p>
        </AdminPanel>

        <AdminPanel className="p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">Tesorería</p>
          <div className="mt-2 space-y-1">
            {overview.cashBalances.length === 0 ? (
              <p className="text-[12.5px] text-slate-500">Sin cuentas activas.</p>
            ) : overview.cashBalances.map((acc) => (
              <div key={acc.id} className="flex items-center justify-between text-[12.5px]">
                <span className="truncate text-slate-700">{acc.name}</span>
                <span className="font-bold text-slate-950">{acc.currency} {acc.balance.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </AdminPanel>
      </div>

      {/* Ventas por período */}
      <AdminPanel className="mt-7 overflow-hidden">
        <div className="border-b border-slate-300 px-5 py-4 sm:px-6">
          <h2 className="flex items-center gap-2 font-display text-[19px] font-bold text-slate-950"><TrendingUp className="size-5 text-brand" />Ventas por período</h2>
        </div>
        <div className="p-5 sm:p-6">
          {series.length === 0 ? (
            <p className="py-10 text-center text-[13px] text-slate-600">Sin ventas en el rango seleccionado.</p>
          ) : (
            <div className="flex items-end gap-1.5" style={{ height: 160 }}>
              {series.map((row) => {
                const total = row.totals.reduce((s, t) => s + t.total, 0);
                const height = Math.max(4, (total / maxSeriesValue) * 100);
                return (
                  <div key={row.period} className="flex flex-1 flex-col items-center gap-1" title={`${row.period}: $${total.toLocaleString()}`}>
                    <div className="w-full rounded-t bg-brand/80 hover:bg-brand" style={{ height: `${height}%` }} />
                    <span className="text-[9.5px] text-slate-500 origin-bottom-left rotate-45 whitespace-nowrap">{row.period}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </AdminPanel>

      {/* Top productos + cuentas */}
      <div className="mt-7 grid gap-7 lg:grid-cols-2">
        <AdminPanel className="overflow-hidden">
          <div className="border-b border-slate-300 px-5 py-4 sm:px-6">
            <h2 className="font-display text-[17px] font-bold text-slate-950">Productos top</h2>
          </div>
          {topProducts.length === 0 ? (
            <p className="px-5 py-10 text-center text-[13px] text-slate-600">Sin ventas.</p>
          ) : (
            <div>
              {topProducts.map((p) => (
                <div key={p.productId} className="flex items-center gap-3 border-b border-slate-200 px-5 py-3 last:border-0 sm:px-6">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-bold text-slate-950">{p.name}</p>
                    <p className="text-[11.5px] text-slate-600">{p.quantity.toLocaleString()} unidades</p>
                  </div>
                  <span className="font-bold text-slate-950">${p.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </AdminPanel>

        <AdminPanel className="overflow-hidden">
          <div className="border-b border-slate-300 px-5 py-4 sm:px-6">
            <h2 className="font-display text-[17px] font-bold text-slate-950">Cuentas top</h2>
          </div>
          {topAccounts.length === 0 ? (
            <p className="px-5 py-10 text-center text-[13px] text-slate-600">Sin facturación.</p>
          ) : (
            <div>
              {topAccounts.map((acc) => (
                <div key={acc.accountId} className="flex items-center gap-3 border-b border-slate-200 px-5 py-3 last:border-0 sm:px-6">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-bold text-slate-950">{acc.name}</p>
                    <p className="text-[11.5px] text-slate-600">{acc.invoiceCount} facturas</p>
                  </div>
                  <span className="font-bold text-slate-950">${acc.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </AdminPanel>
      </div>

      {/* Tickets */}
      {tickets && (
        <AdminPanel className="mt-7 overflow-hidden">
          <div className="border-b border-slate-300 px-5 py-4 sm:px-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-[17px] font-bold text-slate-950"><BarChart3 className="size-4 text-brand" />Soporte</h2>
            {tickets.overdue > 0 && <span className="inline-flex items-center gap-1 text-[12px] font-bold text-red-700"><AlertCircle className="size-3.5" />{tickets.overdue} vencidos</span>}
          </div>
          <div className="grid grid-cols-2 gap-5 p-5 sm:grid-cols-4">
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-slate-500">Total</p>
              <p className="mt-1 font-display text-[24px] font-bold text-slate-950">{tickets.total}</p>
            </div>
            {tickets.byStatus.map((s) => (
              <div key={s.status}>
                <p className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-slate-500">{s.status}</p>
                <p className="mt-1 font-display text-[20px] font-bold text-slate-950">{s.count}</p>
              </div>
            ))}
          </div>
        </AdminPanel>
      )}
    </div>
  );
}

function KpiCard({ label, value, sub, icon: Icon, color }: { label: string; value: string; sub: string; icon: typeof DollarSign; color: string }) {
  return (
    <AdminPanel className="p-5">
      <div className="flex items-start gap-4">
        <span className={`grid size-11 flex-none place-items-center rounded-lg border ${color}`}>
          <Icon className="size-5" strokeWidth={1.8} />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-slate-800">{label}</p>
          <p className="mt-1 font-display text-[24px] font-bold leading-none tracking-[-0.035em] text-slate-950">{value}</p>
          <p className="mt-2 text-[12px] font-medium text-slate-600">{sub}</p>
        </div>
      </div>
    </AdminPanel>
  );
}
