"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, CircleDollarSign, Save } from "lucide-react";
import {
  AdminAlert,
  AdminButton,
  AdminField,
  AdminInput,
  AdminPanel,
  AdminSpinner,
  AdminTextarea,
} from "../../../../../components/admin/AdminUI";

interface Balance {
  currency: string;
  debit: number;
  credit: number;
  balance: number;
}

interface Entry {
  id: string;
  date: string;
  type: string;
  description: string;
  debit: string | number;
  credit: string | number;
  currency: string;
}

interface OpenOrder {
  id: string;
  number: string;
  issueDate: string;
  currency: string;
  total: number;
  paid: number;
  pending: number;
}

interface SupplierAccountDetail {
  supplier: { id: string; name: string; taxId: string | null };
  balances: Balance[];
  entries: Entry[];
  openOrders: OpenOrder[];
}

interface CashAccount {
  id: string;
  name: string;
  currency: string;
  balance: string | number;
}

const METHOD_LABELS: Record<string, string> = {
  cash: "Efectivo",
  transfer: "Transferencia",
  card: "Tarjeta",
  mercadopago: "MercadoPago",
  other: "Otro",
};

function money(currency: string, value: number | string) {
  return `${currency} ${Number(value).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function SupplierAccountDetailPage() {
  const params = useParams<{ id: string }>();
  const [detail, setDetail] = useState<SupplierAccountDetail | null>(null);
  const [cashAccounts, setCashAccounts] = useState<CashAccount[]>([]);
  const [cashAccountId, setCashAccountId] = useState("");
  const [method, setMethod] = useState("transfer");
  const [reference, setReference] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<"ARS" | "USD">("ARS");
  const [notes, setNotes] = useState("");
  const [allocations, setAllocations] = useState<Record<string, number>>({});
  const [exchangeRate, setExchangeRate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [detailRes, cashRes, rateRes] = await Promise.all([
        fetch(`/api/admin/supplier-accounts/${params.id}`),
        fetch("/api/admin/cash-accounts?limit=100&active=1"),
        fetch("/api/admin/exchange-rates"),
      ]);
      const detailJson = await detailRes.json();
      const cashJson = await cashRes.json();
      const rateJson = await rateRes.json();
      if (!detailRes.ok || !detailJson.ok) throw new Error(detailJson.error || "No pudimos cargar la cuenta proveedor");
      setDetail(detailJson.data);
      setCashAccounts(cashJson.data || []);
      setCashAccountId((cashJson.data || [])[0]?.id || "");
      if (rateRes.ok && rateJson.ok && rateJson.data.latest) setExchangeRate(String(Number(rateJson.data.latest.rate)));
      const firstCurrency = detailJson.data?.balances?.[0]?.currency || detailJson.data?.openOrders?.[0]?.currency || "ARS";
      setCurrency(firstCurrency === "USD" ? "USD" : "ARS");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => { void load(); }, [load]);

  const hasCrossCurrency = useMemo(
    () => detail?.openOrders.some((order) => order.currency !== currency) ?? false,
    [detail, currency],
  );

  const totalAllocated = useMemo(
    () => Object.values(allocations).reduce((sum, value) => sum + (Number(value) || 0), 0),
    [allocations],
  );

  const totalAllocatedInPaymentCurrency = useMemo(() => {
    if (!detail) return 0;
    let total = 0;
    for (const [orderId, value] of Object.entries(allocations)) {
      const order = detail.openOrders.find((o) => o.id === orderId);
      if (!order) continue;
      if (order.currency === currency) {
        total += Number(value) || 0;
      } else {
        total += (Number(value) || 0) * (Number(exchangeRate) || 1);
      }
    }
    return Math.round(total * 100) / 100;
  }, [allocations, detail, currency, exchangeRate]);

  function allocatePending() {
    if (!detail) return;
    const next: Record<string, number> = {};
    const rate = Number(exchangeRate) || 1;
    let total = 0;
    for (const order of detail.openOrders) {
      next[order.id] = order.pending;
      total += order.currency === currency ? order.pending : order.pending * rate;
    }
    setAllocations(next);
    setAmount(String(Math.round(total * 100) / 100));
  }

  async function savePayment() {
    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) { setError("Ingresa un importe de pago mayor a cero."); return; }
    setSaving(true);
    setError(null);
    try {
      const body = {
        supplierId: params.id,
        cashAccountId: cashAccountId || null,
        method,
        reference: reference || null,
        amount: parsedAmount,
        currency,
        exchangeRate: Number(exchangeRate) > 0 ? Number(exchangeRate) : 1,
        notes: notes || null,
        allocations: Object.entries(allocations)
          .filter(([, value]) => Number(value) > 0)
          .map(([purchaseOrderId, value]) => ({ purchaseOrderId, amount: Number(value) })),
      };
      const res = await fetch("/api/admin/supplier-payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "No pudimos registrar el pago");
      setReference("");
      setAmount("");
      setNotes("");
      setAllocations({});
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex items-center justify-center py-32"><AdminSpinner /></div>;
  if (!detail) return <p className="py-20 text-center text-slate-600">Proveedor no encontrado.</p>;

  const openOrdersForCurrency = detail.openOrders;

  return (
    <div className="mx-auto max-w-[1180px]">
      <Link href="/admin/supplier-accounts" className="inline-flex items-center gap-1 text-[13px] font-bold text-brand hover:underline"><ChevronLeft className="size-4" />Volver a cuentas proveedores</Link>
      <div className="mt-3">
        <h1 className="font-display text-[clamp(26px,3vw,34px)] font-bold tracking-[-0.035em] text-slate-950">{detail.supplier.name}</h1>
        <p className="mt-1 text-[13px] text-slate-600">{detail.supplier.taxId || "Sin CUIT registrado"}</p>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {detail.balances.length === 0 ? (
          <AdminPanel className="p-5"><p className="text-[13px] font-bold text-slate-700">Sin saldo proveedor.</p></AdminPanel>
        ) : detail.balances.map((balance) => (
          <AdminPanel key={balance.currency} className="p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">{balance.currency}</p>
            <p className="mt-2 font-display text-[24px] font-bold text-slate-950">{money(balance.currency, balance.balance)}</p>
            <p className="mt-1 text-[12px] text-slate-600">Compras {money(balance.currency, balance.credit)} / Pagos {money(balance.currency, balance.debit)}</p>
          </AdminPanel>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_430px]">
        <AdminPanel className="overflow-hidden">
          <div className="border-b border-slate-300 px-5 py-4">
            <h2 className="font-display text-[17px] font-bold text-slate-950">Ordenes abiertas</h2>
          </div>
          {detail.openOrders.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <CircleDollarSign className="mx-auto size-10 text-slate-400" />
              <p className="mt-4 text-[14px] font-bold text-slate-950">No hay ordenes pendientes.</p>
            </div>
          ) : (
            <div>
              <div className="hidden grid-cols-[.8fr_.6fr_.7fr_.7fr_.7fr] gap-3 border-b border-slate-300 bg-slate-100 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-700 lg:grid">
                <span>OC</span><span>Fecha</span><span>Total</span><span>Pagado</span><span>Pendiente</span>
              </div>
              {detail.openOrders.map((order) => (
                <div key={order.id} className="grid gap-2 border-b border-slate-200 px-5 py-4 last:border-0 lg:grid-cols-[.8fr_.6fr_.7fr_.7fr_.7fr] lg:items-center lg:gap-3">
                  <Link href={`/admin/purchase-orders/${order.id}`} className="font-mono text-[12.5px] font-bold text-brand hover:underline">{order.number}</Link>
                  <p className="text-[12px] text-slate-600">{new Date(order.issueDate).toLocaleDateString("es-AR")}</p>
                  <p className="text-[13px] font-bold text-slate-950">{money(order.currency, order.total)}</p>
                  <p className="text-[13px] text-slate-700">{money(order.currency, order.paid)}</p>
                  <p className="text-[13px] font-bold text-slate-950">{money(order.currency, order.pending)}</p>
                </div>
              ))}
            </div>
          )}
        </AdminPanel>

        <AdminPanel className="p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-[17px] font-bold text-slate-950">Registrar pago</h2>
            <AdminButton variant="secondary" size="sm" onClick={allocatePending} disabled={openOrdersForCurrency.length === 0}>Imputar saldo</AdminButton>
          </div>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Moneda" htmlFor="payment-currency">
                <select id="payment-currency" value={currency} onChange={(event) => { setCurrency(event.target.value as "ARS" | "USD"); setAllocations({}); }} className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px]">
                  <option value="ARS">ARS</option><option value="USD">USD</option>
                </select>
              </AdminField>
              <AdminField label="Importe" htmlFor="payment-amount">
                <AdminInput id="payment-amount" type="number" min="0" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} />
              </AdminField>
            </div>
            <AdminField label="Caja/Banco" htmlFor="payment-cash">
              <select id="payment-cash" value={cashAccountId} onChange={(event) => setCashAccountId(event.target.value)} className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px]">
                <option value="">Sin impacto en caja</option>
                {cashAccounts.filter((account) => account.currency === currency).map((account) => <option key={account.id} value={account.id}>{account.name} - {money(account.currency, account.balance)}</option>)}
              </select>
            </AdminField>
            {hasCrossCurrency && (
              <AdminField label={`Cotización ${currency === "ARS" ? "USD → ARS" : "ARS → USD"}`} htmlFor="exchange-rate">
                <AdminInput id="exchange-rate" type="number" min="0.000001" step="0.01" placeholder="Ej: 1050" value={exchangeRate} onChange={(event) => setExchangeRate(event.target.value)} />
                <p className="mt-1 text-[11px] text-slate-500">Tomada de la cotización del día (editable). Cargala en Caja y bancos.</p>
              </AdminField>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Metodo" htmlFor="payment-method">
                <select id="payment-method" value={method} onChange={(event) => setMethod(event.target.value)} className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px]">
                  {Object.entries(METHOD_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </AdminField>
              <AdminField label="Referencia" htmlFor="payment-reference">
                <AdminInput id="payment-reference" value={reference} onChange={(event) => setReference(event.target.value)} />
              </AdminField>
            </div>
            {openOrdersForCurrency.length > 0 && (
              <div className="rounded-lg border border-slate-300">
                <div className="border-b border-slate-200 px-3 py-2 text-[12px] font-bold text-slate-700">Imputaciones</div>
                <div className="grid gap-2 p-3">
                  {openOrdersForCurrency.map((order) => {
                    const isCross = order.currency !== currency;
                    const rate = Number(exchangeRate) || 1;
                    const allocationVal = Number(allocations[order.id] ?? 0);
                    const equivalent = isCross ? allocationVal * rate : null;
                    return (
                      <div key={order.id} className="grid gap-2 sm:grid-cols-[1fr_120px] sm:items-center">
                        <div>
                          <p className="truncate text-[12.5px] font-bold text-slate-950">{order.number}{isCross && <span className="ml-1 rounded bg-amber-100 px-1 py-px text-[10px] font-bold text-amber-700">{order.currency}</span>}<span className="ml-2 font-normal text-slate-500">Pendiente {money(order.currency, order.pending)}</span></p>
                          {isCross && equivalent != null && equivalent > 0 && <p className="text-[11px] text-slate-500">≈ {money(currency, equivalent)}</p>}
                        </div>
                        <AdminInput type="number" min="0" max={order.pending} step="0.01" value={allocations[order.id] ?? ""} onChange={(event) => setAllocations({ ...allocations, [order.id]: Number(event.target.value) })} />
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-slate-200 px-3 py-2 text-right text-[12.5px] font-bold text-slate-700">
                  Imputado {hasCrossCurrency ? money(currency, totalAllocatedInPaymentCurrency) : money(currency, totalAllocated)}
                </div>
              </div>
            )}
            <AdminField label="Notas" htmlFor="payment-notes">
              <AdminTextarea id="payment-notes" value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} />
            </AdminField>
            <AdminButton onClick={() => void savePayment()} disabled={saving}><Save />{saving ? "Guardando..." : "Registrar pago"}</AdminButton>
          </div>
        </AdminPanel>
      </div>

      <AdminPanel className="mt-5 overflow-hidden">
        <div className="border-b border-slate-300 px-5 py-4">
          <h2 className="font-display text-[17px] font-bold text-slate-950">Movimientos</h2>
        </div>
        {detail.entries.length === 0 ? (
          <div className="px-5 py-12 text-center text-[13px] font-bold text-slate-700">Sin movimientos.</div>
        ) : (
          <div>
            <div className="hidden grid-cols-[.55fr_.75fr_1.2fr_.65fr_.65fr] gap-3 border-b border-slate-300 bg-slate-100 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-700 lg:grid">
              <span>Fecha</span><span>Tipo</span><span>Descripcion</span><span>Debe</span><span>Haber</span>
            </div>
            {detail.entries.map((entry) => (
              <div key={entry.id} className="grid gap-2 border-b border-slate-200 px-5 py-4 last:border-0 lg:grid-cols-[.55fr_.75fr_1.2fr_.65fr_.65fr] lg:items-center lg:gap-3">
                <p className="text-[12px] text-slate-600">{new Date(entry.date).toLocaleDateString("es-AR")}</p>
                <p className="text-[12.5px] font-bold text-slate-700">{entry.type}</p>
                <p className="text-[13px] text-slate-950">{entry.description}</p>
                <p className="text-[13px] text-slate-700">{Number(entry.debit) ? money(entry.currency, entry.debit) : "-"}</p>
                <p className="text-[13px] font-bold text-slate-950">{Number(entry.credit) ? money(entry.currency, entry.credit) : "-"}</p>
              </div>
            ))}
          </div>
        )}
      </AdminPanel>
    </div>
  );
}
