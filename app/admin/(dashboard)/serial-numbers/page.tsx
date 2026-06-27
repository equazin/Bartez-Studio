"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Hash, Plus, X } from "lucide-react";
import {
  AdminAlert,
  AdminButton,
  AdminField,
  AdminInput,
  AdminPagination,
  AdminPanel,
  AdminSearch,
  AdminSpinner,
  useDebouncedValue,
} from "../../../../components/admin/AdminUI";

interface Serial {
  id: string;
  serial: string;
  status: string;
  deliveredAt: string | null;
  warrantyUntil: string | null;
  product: { id: string; name: string; sku: string | null };
  account: { id: string; name: string } | null;
}

interface Product { id: string; name: string; sku: string | null; }
interface Account { id: string; name: string; }

const STATUS_META: Record<string, { label: string; color: string }> = {
  in_stock: { label: "En stock", color: "border-blue-200 bg-blue-50 text-blue-900" },
  delivered: { label: "Entregado", color: "border-emerald-200 bg-emerald-50 text-emerald-900" },
  returned: { label: "Devuelto", color: "border-amber-200 bg-amber-50 text-amber-900" },
  scrapped: { label: "Baja", color: "border-slate-200 bg-slate-50 text-slate-700" },
};

interface CreateState { productId: string; serial: string; accountId: string; status: string; deliveredAt: string; warrantyUntil: string; }
const empty: CreateState = { productId: "", serial: "", accountId: "", status: "in_stock", deliveredAt: "", warrantyUntil: "" };

export default function SerialNumbersPage() {
  const [items, setItems] = useState<Serial[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Timestamp fijado al montar (evita Date.now() impuro durante el render).
  const [nowTs] = useState(() => Date.now());
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [expiringOnly, setExpiringOnly] = useState(false);
  const debouncedSearch = useDebouncedValue(search, 300);
  const limit = 20;
  const [creating, setCreating] = useState<CreateState | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (debouncedSearch) params.set("q", debouncedSearch);
      if (statusFilter) params.set("status", statusFilter);
      if (expiringOnly) params.set("expiring", "1");
      const res = await fetch(`/api/admin/serial-numbers?${params}`);
      if (!res.ok) throw new Error("Error al cargar");
      const json = await res.json();
      setItems(json.data);
      setTotal(json.meta?.total ?? json.data.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, expiringOnly]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter, expiringOnly]);

  useEffect(() => {
    fetch("/api/admin/products?limit=200&active=1").then((r) => r.json()).then((j) => setProducts(j.data || [])).catch(() => {});
    fetch("/api/admin/accounts?limit=100").then((r) => r.json()).then((j) => setAccounts(j.data || [])).catch(() => {});
  }, []);

  async function save() {
    if (!creating || !creating.productId || !creating.serial) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/serial-numbers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: creating.productId,
          serial: creating.serial,
          accountId: creating.accountId || null,
          status: creating.status,
          deliveredAt: creating.deliveredAt || null,
          warrantyUntil: creating.warrantyUntil || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al crear");
      setCreating(null);
      void load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  const statusMeta = (s: string) => STATUS_META[s] || STATUS_META.in_stock;

  return (
    <div className="mx-auto max-w-[1240px]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Números de serie</h1>
          <p className="mt-2 text-[14px] font-medium text-slate-700">Trackeo individual de unidades vendidas y garantías activas.</p>
        </div>
        <AdminButton onClick={() => setCreating({ ...empty })}><Plus />Registrar N°</AdminButton>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1"><AdminSearch value={search} onChange={setSearch} placeholder="Buscar por serie…" /></div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-[13px] font-medium text-slate-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
          <option value="">Todos los estados</option>
          {Object.entries(STATUS_META).map(([v, m]) => <option key={v} value={v}>{m.label}</option>)}
        </select>
        <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-[13px] font-bold text-slate-700">
          <input type="checkbox" checked={expiringOnly} onChange={(e) => setExpiringOnly(e.target.checked)} />
          Por vencer (30 días)
        </label>
      </div>

      <AdminPanel className="mt-5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><AdminSpinner /></div>
        ) : items.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <Hash className="mx-auto size-10 text-slate-400" />
            <p className="mt-4 text-[14px] font-bold text-slate-950">Sin números de serie.</p>
          </div>
        ) : (
          <div>
            <div className="hidden grid-cols-[1.2fr_1.2fr_.7fr_.5fr_.7fr] gap-3 border-b border-slate-300 bg-slate-100 px-6 py-3 text-[12px] font-semibold text-slate-700 lg:grid">
              <span>Serie</span><span>Producto</span><span>Cuenta</span><span>Estado</span><span>Garantía</span>
            </div>
            {items.map((s) => {
              const expiringSoon = s.warrantyUntil && (new Date(s.warrantyUntil).getTime() - nowTs) < 30 * 86400_000;
              return (
                <div key={s.id} className="grid gap-2 border-b border-slate-200 px-5 py-4 last:border-0 sm:px-6 lg:grid-cols-[1.2fr_1.2fr_.7fr_.5fr_.7fr] lg:items-center lg:gap-3">
                  <p className="truncate font-mono text-[12.5px] font-bold text-slate-950">{s.serial}</p>
                  <p className="truncate text-[13px] text-slate-700">{s.product.name}</p>
                  <p className="truncate text-[12.5px] text-slate-700">{s.account?.name || "—"}</p>
                  <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusMeta(s.status).color}`}>{statusMeta(s.status).label}</span>
                  <p className={`text-[12px] ${expiringSoon ? "font-bold text-amber-700" : "text-slate-700"}`}>
                    {s.warrantyUntil ? new Date(s.warrantyUntil).toLocaleDateString("es-AR") : "—"}
                    {expiringSoon && <AlertTriangle className="ml-1 inline size-3.5" />}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </AdminPanel>

      {total > limit && <AdminPagination page={page} total={total} limit={limit} onPageChange={setPage} />}

      {creating && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/50 p-4">
          <AdminPanel className="w-full max-w-[560px] p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-[20px] font-bold text-slate-950">Registrar N° de serie</h2>
              <AdminButton variant="ghost" size="icon" onClick={() => setCreating(null)}><X /></AdminButton>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <AdminField label="Producto *" htmlFor="s-product">
                <select id="s-product" value={creating.productId} onChange={(e) => setCreating({ ...creating, productId: e.target.value })}
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
                  <option value="">— Seleccionar —</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.sku ? `${p.sku} · ` : ""}{p.name}</option>)}
                </select>
              </AdminField>
              <AdminField label="Serie *" htmlFor="s-serial">
                <AdminInput id="s-serial" value={creating.serial} onChange={(e) => setCreating({ ...creating, serial: e.target.value })} />
              </AdminField>
              <AdminField label="Cuenta" htmlFor="s-account">
                <select id="s-account" value={creating.accountId} onChange={(e) => setCreating({ ...creating, accountId: e.target.value })}
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
                  <option value="">(Ninguna)</option>
                  {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </AdminField>
              <AdminField label="Estado" htmlFor="s-status">
                <select id="s-status" value={creating.status} onChange={(e) => setCreating({ ...creating, status: e.target.value })}
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
                  {Object.entries(STATUS_META).map(([v, m]) => <option key={v} value={v}>{m.label}</option>)}
                </select>
              </AdminField>
              <AdminField label="Entregado" htmlFor="s-delivered">
                <AdminInput id="s-delivered" type="date" value={creating.deliveredAt} onChange={(e) => setCreating({ ...creating, deliveredAt: e.target.value })} />
              </AdminField>
              <AdminField label="Garantía hasta" htmlFor="s-warranty">
                <AdminInput id="s-warranty" type="date" value={creating.warrantyUntil} onChange={(e) => setCreating({ ...creating, warrantyUntil: e.target.value })} />
              </AdminField>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <AdminButton variant="secondary" onClick={() => setCreating(null)}>Cancelar</AdminButton>
              <AdminButton onClick={() => void save()} disabled={saving}>{saving ? "Guardando…" : "Registrar"}</AdminButton>
            </div>
          </AdminPanel>
        </div>
      )}
    </div>
  );
}
