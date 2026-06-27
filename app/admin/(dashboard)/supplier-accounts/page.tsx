"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Wallet } from "lucide-react";
import {
  AdminAlert,
  AdminButton,
  AdminPagination,
  AdminPanel,
  AdminSearch,
  AdminSpinner,
  useDebouncedValue,
} from "../../../../components/admin/AdminUI";

interface SupplierAccountRow {
  id: string;
  name: string;
  taxId: string | null;
  email: string | null;
  balances: Array<{ currency: string; balance: number }>;
}

function formatBalances(balances: SupplierAccountRow["balances"]) {
  if (balances.length === 0) return "-";
  return balances.map((balance) => `${balance.currency} ${balance.balance.toLocaleString("es-AR")}`).join(" / ");
}

export default function SupplierAccountsPage() {
  const [accounts, setAccounts] = useState<SupplierAccountRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const limit = 20;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (debouncedSearch) params.set("q", debouncedSearch);
      const res = await fetch(`/api/admin/supplier-accounts?${params}`);
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "No pudimos cargar las cuentas proveedor");
      setAccounts(json.data);
      setTotal(json.meta.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setPage(1); }, [debouncedSearch]);

  return (
    <div className="mx-auto max-w-[1240px]">
      <div>
        <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Cuentas proveedores</h1>
        <p className="mt-2 text-[14px] font-medium text-slate-700">Saldos por proveedor, ordenes abiertas y pagos imputados.</p>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <div className="mt-6"><AdminSearch value={search} onChange={setSearch} placeholder="Buscar proveedor..." /></div>

      <AdminPanel className="mt-5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><AdminSpinner /></div>
        ) : accounts.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <Wallet className="mx-auto size-10 text-slate-400" />
            <p className="mt-4 text-[14px] font-bold text-slate-950">No hay proveedores con movimientos.</p>
          </div>
        ) : (
          <div>
            <div className="hidden grid-cols-[1.2fr_.7fr_1fr_.3fr] gap-3 border-b border-slate-300 bg-slate-100 px-6 py-3 text-[12px] font-semibold text-slate-700 lg:grid">
              <span>Proveedor</span><span>CUIT</span><span>Saldo a pagar</span><span></span>
            </div>
            {accounts.map((account) => (
              <div key={account.id} className="grid gap-2 border-b border-slate-200 px-5 py-4 last:border-0 sm:px-6 lg:grid-cols-[1.2fr_.7fr_1fr_.3fr] lg:items-center lg:gap-3">
                <div className="min-w-0">
                  <Link href={`/admin/supplier-accounts/${account.id}`} className="truncate text-[13.5px] font-bold text-brand hover:underline">{account.name}</Link>
                  {account.email && <p className="truncate text-[12px] text-slate-600">{account.email}</p>}
                </div>
                <p className="text-[12.5px] text-slate-700">{account.taxId || "-"}</p>
                <p className="text-[13px] font-bold text-slate-950">{formatBalances(account.balances)}</p>
                <div className="flex justify-end">
                  <AdminButton variant="ghost" size="icon" asChild aria-label="Ver cuenta proveedor">
                    <Link href={`/admin/supplier-accounts/${account.id}`}><Eye className="size-4" /></Link>
                  </AdminButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminPanel>

      {total > limit && <AdminPagination page={page} total={total} limit={limit} onPageChange={setPage} />}
    </div>
  );
}
