"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Save } from "lucide-react";
import {
  AdminAlert,
  AdminButton,
  AdminField,
  AdminInput,
  AdminPanel,
  AdminSpinner,
  AdminTextarea,
} from "../../../../../components/admin/AdminUI";

interface AccountDetail {
  account: { id: string; name: string; taxId: string | null };
  balances: Array<{ currency: string; debit: number; credit: number; balance: number }>;
  entries: Array<{
    id: string;
    date: string;
    type: string;
    description: string;
    debit: string | number;
    credit: string | number;
    currency: string;
  }>;
  openInvoices: Array<{
    id: string;
    number: string;
    issueDate: string;
    currency: string;
    total: number;
    paid: number;
    pending: number;
  }>;
}

export default function CustomerAccountDetailPage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<AccountDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("transfer");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/customer-accounts/${params.id}`);
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "No pudimos cargar la cuenta corriente");
      setData(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    if (!data?.openInvoices.length || selectedInvoiceId) return;
    const first = data.openInvoices[0];
    setSelectedInvoiceId(first.id);
    setAmount(String(first.pending));
  }, [data, selectedInvoiceId]);

  const selectedInvoice = useMemo(
    () => data?.openInvoices.find((invoice) => invoice.id === selectedInvoiceId) ?? null,
    [data, selectedInvoiceId],
  );

  async function saveReceipt() {
    if (!data) return;
    setSaving(true);
    setError(null);
    try {
      const numericAmount = Number(amount);
      const res = await fetch("/api/admin/receipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId: data.account.id,
          method,
          reference: reference || null,
          amount: numericAmount,
          currency: selectedInvoice?.currency ?? "ARS",
          notes: notes || null,
          allocations: selectedInvoiceId ? [{ invoiceId: selectedInvoiceId, amount: numericAmount }] : [],
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "No pudimos registrar el recibo");
      setReference("");
      setNotes("");
      setSelectedInvoiceId("");
      setAmount("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex items-center justify-center py-32"><AdminSpinner /></div>;
  if (!data) return <p className="py-20 text-center text-slate-600">Cuenta no encontrada.</p>;

  return (
    <div className="mx-auto max-w-[1180px]">
      <Link href="/admin/customer-accounts" className="inline-flex items-center gap-1 text-[13px] font-bold text-brand hover:underline">
        <ChevronLeft className="size-4" />Volver a cuentas corrientes
      </Link>

      <div className="mt-3">
        <h1 className="font-display text-[clamp(26px,3vw,34px)] font-bold tracking-[-0.035em] text-slate-950">{data.account.name}</h1>
        <p className="mt-1 text-[13px] text-slate-600">{data.account.taxId || "Sin CUIT"}</p>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_390px]">
        <div className="flex flex-col gap-5">
          <div className="grid gap-4 sm:grid-cols-3">
            {data.balances.length === 0 ? (
              <AdminPanel className="p-5 sm:col-span-3">
                <p className="text-[13px] font-bold text-slate-700">Sin saldo registrado.</p>
              </AdminPanel>
            ) : data.balances.map((balance) => (
              <AdminPanel key={balance.currency} className="p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">{balance.currency}</p>
                <p className="mt-2 font-display text-2xl font-bold text-slate-950">{balance.balance.toLocaleString("es-AR")}</p>
                <p className="mt-1 text-[11.5px] text-slate-600">Debe {balance.debit.toLocaleString("es-AR")} / Haber {balance.credit.toLocaleString("es-AR")}</p>
              </AdminPanel>
            ))}
          </div>

          <AdminPanel className="overflow-hidden">
            <div className="border-b border-slate-300 px-5 py-3.5">
              <h2 className="font-display text-[16px] font-bold text-slate-950">Movimientos</h2>
            </div>
            {data.entries.length === 0 ? (
              <p className="px-5 py-10 text-center text-[13px] text-slate-600">Sin movimientos.</p>
            ) : data.entries.map((entry) => (
              <div key={entry.id} className="grid gap-2 border-b border-slate-200 px-5 py-3 last:border-0 sm:grid-cols-[.55fr_1.4fr_.55fr_.55fr_.45fr] sm:items-center">
                <p className="text-[12px] text-slate-600">{new Date(entry.date).toLocaleDateString("es-AR")}</p>
                <p className="text-[13px] font-bold text-slate-950">{entry.description}</p>
                <p className="text-right text-[12.5px] text-slate-700">{Number(entry.debit) ? `${entry.currency} ${Number(entry.debit).toLocaleString("es-AR")}` : "-"}</p>
                <p className="text-right text-[12.5px] text-slate-700">{Number(entry.credit) ? `${entry.currency} ${Number(entry.credit).toLocaleString("es-AR")}` : "-"}</p>
                <p className="text-[11px] uppercase tracking-[0.08em] text-slate-500">{entry.type}</p>
              </div>
            ))}
          </AdminPanel>
        </div>

        <AdminPanel className="p-5">
          <h2 className="font-display text-[16px] font-bold text-slate-950">Registrar recibo</h2>
          <div className="mt-5 flex flex-col gap-4">
            <AdminField label="Factura a imputar" htmlFor="receipt-invoice">
              <select
                id="receipt-invoice"
                value={selectedInvoiceId}
                onChange={(event) => {
                  const invoice = data.openInvoices.find((item) => item.id === event.target.value);
                  setSelectedInvoiceId(event.target.value);
                  setAmount(invoice ? String(invoice.pending) : "");
                }}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30"
              >
                <option value="">Sin imputacion</option>
                {data.openInvoices.map((invoice) => (
                  <option key={invoice.id} value={invoice.id}>
                    {invoice.number} - {invoice.currency} {invoice.pending.toLocaleString("es-AR")}
                  </option>
                ))}
              </select>
            </AdminField>
            <AdminField label="Importe" htmlFor="receipt-amount">
              <AdminInput id="receipt-amount" type="number" min={0} step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} />
            </AdminField>
            <AdminField label="Metodo" htmlFor="receipt-method">
              <select id="receipt-method" value={method} onChange={(event) => setMethod(event.target.value)}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
                <option value="transfer">Transferencia</option>
                <option value="cash">Efectivo</option>
                <option value="card">Tarjeta</option>
                <option value="mercadopago">MercadoPago</option>
                <option value="other">Otro</option>
              </select>
            </AdminField>
            <AdminField label="Referencia" htmlFor="receipt-reference">
              <AdminInput id="receipt-reference" value={reference} onChange={(event) => setReference(event.target.value)} />
            </AdminField>
            <AdminField label="Notas" htmlFor="receipt-notes">
              <AdminTextarea id="receipt-notes" value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} />
            </AdminField>
            <AdminButton onClick={() => void saveReceipt()} disabled={saving || !amount}>
              <Save />{saving ? "Registrando..." : "Registrar recibo"}
            </AdminButton>
          </div>
        </AdminPanel>
      </div>
    </div>
  );
}
