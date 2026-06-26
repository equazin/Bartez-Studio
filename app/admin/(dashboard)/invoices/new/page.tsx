"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Plus, Save, Trash2, X } from "lucide-react";
import {
  AdminAlert,
  AdminButton,
  AdminField,
  AdminInput,
  AdminPanel,
  AdminTextarea,
} from "../../../../../components/admin/AdminUI";
import { calcQuote } from "../../../../../lib/modules/sales/calc";

interface Account { id: string; name: string; taxId: string | null; email: string | null; address: string | null; city: string | null; }
interface Product { id: string; sku: string | null; name: string; taxRate: string | number; }
interface Order { id: string; number: string; }
interface RelatedInvoice { id: string; number: string; docTypeCode: number; afipNumber: number | null; receiverName: string; }

interface Line {
  productId: string | null;
  description: string;
  quantity: number;
  unitPrice: number;
  discountPct: number;
  taxRate: number;
}

const DOC_TYPES = [
  { value: 1, label: "Factura A" },
  { value: 2, label: "Nota de Debito A" },
  { value: 6, label: "Factura B" },
  { value: 7, label: "Nota de Debito B" },
  { value: 11, label: "Factura C" },
  { value: 12, label: "Nota de Debito C" },
  { value: 3, label: "Nota de Crédito A" },
  { value: 8, label: "Nota de Crédito B" },
  { value: 13, label: "Nota de Crédito C" },
];

const RECEIVER_DOC_TYPES = [
  { value: 80, label: "CUIT" },
  { value: 86, label: "CUIL" },
  { value: 96, label: "DNI" },
  { value: 99, label: "Consumidor final" },
];

const emptyLine: Line = { productId: null, description: "", quantity: 1, unitPrice: 0, discountPct: 0, taxRate: 21 };

export default function NewInvoicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialAccountId = searchParams.get("accountId");
  const initialOrderId = searchParams.get("orderId");

  const [docTypeCode, setDocTypeCode] = useState(6);
  const [pointOfSale, setPointOfSale] = useState(1);
  const [concept, setConcept] = useState<1 | 2 | 3>(1);
  const [accountId, setAccountId] = useState<string | null>(initialAccountId);
  const [orderId, setOrderId] = useState<string | null>(initialOrderId);
  const [relatedInvoiceId, setRelatedInvoiceId] = useState<string | null>(null);
  const [receiverName, setReceiverName] = useState("");
  const [receiverTaxId, setReceiverTaxId] = useState("");
  const [receiverDocType, setReceiverDocType] = useState(99);
  const [receiverAddress, setReceiverAddress] = useState("");
  const [currency, setCurrency] = useState<"PES" | "DOL">("PES");
  const [exchangeRate, setExchangeRate] = useState("1");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<Line[]>([{ ...emptyLine }]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [relatedInvoices, setRelatedInvoices] = useState<RelatedInvoice[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/accounts?limit=100").then((r) => r.json()).then((j) => setAccounts(j.data || [])).catch(() => {});
    fetch("/api/admin/products?limit=200&active=1").then((r) => r.json()).then((j) => setProducts(j.data || [])).catch(() => {});
    fetch("/api/admin/orders?limit=50").then((r) => r.json()).then((j) => setOrders(j.data || [])).catch(() => {});
    fetch("/api/admin/invoices?limit=100&status=issued").then((r) => r.json()).then((j) => setRelatedInvoices(j.data || [])).catch(() => {});
    fetch("/api/admin/exchange-rates").then((r) => r.json()).then((j) => {
      if (j.ok && j.data.latest) setExchangeRate(String(Number(j.data.latest.rate)));
    }).catch(() => {});
  }, []);

  // Autocomplete receptor cuando se elige cuenta
  useEffect(() => {
    if (!accountId) return;
    const acc = accounts.find((a) => a.id === accountId);
    if (acc) {
      setReceiverName(acc.name);
      if (acc.taxId) setReceiverTaxId(acc.taxId);
      if (acc.taxId) setReceiverDocType(80);
      if (acc.address) setReceiverAddress(`${acc.address}${acc.city ? `, ${acc.city}` : ""}`);
    }
  }, [accountId, accounts]);

  const totals = useMemo(() => calcQuote(lines.map((l) => ({
    quantity: Number(l.quantity) || 0,
    unitPrice: Number(l.unitPrice) || 0,
    discountPct: Number(l.discountPct) || 0,
    taxRate: Number(l.taxRate) || 0,
  }))), [lines]);
  const needsRelatedInvoice = [2, 3, 7, 8, 12, 13].includes(docTypeCode);

  const setLine = useCallback((idx: number, patch: Partial<Line>) => {
    setLines((ls) => ls.map((l, i) => i === idx ? { ...l, ...patch } : l));
  }, []);
  const addLine = useCallback(() => setLines((ls) => [...ls, { ...emptyLine }]), []);
  const removeLine = useCallback((idx: number) => setLines((ls) => ls.filter((_, i) => i !== idx)), []);

  function pickProduct(idx: number, productId: string) {
    const product = products.find((p) => p.id === productId);
    if (!product) {
      setLine(idx, { productId: null });
      return;
    }
    setLine(idx, { productId, description: product.name, taxRate: Number(product.taxRate) });
  }

  async function save() {
    if (!receiverName.trim()) { setError("Falta el nombre del receptor."); return; }
    if (lines.length === 0 || !lines.some((l) => l.description.trim())) { setError("Agregá al menos una línea con descripción."); return; }
    if (needsRelatedInvoice && !relatedInvoiceId) { setError("Selecciona el comprobante asociado."); return; }
    setSaving(true);
    setError(null);

    const payload = {
      docTypeCode,
      pointOfSale,
      concept,
      accountId: accountId || null,
      orderId: orderId || null,
      relatedInvoiceId: relatedInvoiceId || null,
      receiverName,
      receiverTaxId: receiverTaxId || null,
      receiverDocType: receiverDocType || null,
      receiverAddress: receiverAddress || null,
      currency,
      exchangeRate: currency === "DOL" ? (Number(exchangeRate) > 0 ? Number(exchangeRate) : 1) : 1,
      issueDate,
      notes: notes || null,
      lines: lines.filter((l) => l.description.trim()),
    };
    try {
      const res = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al emitir");
      router.push(`/admin/invoices/${json.data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al emitir");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1240px]">
      <Link href="/admin/invoices" className="inline-flex items-center gap-1 text-[13px] font-bold text-brand hover:underline">
        <ChevronLeft className="size-4" />Volver a facturas
      </Link>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-[clamp(26px,3vw,34px)] font-bold tracking-[-0.035em] text-slate-950">Emitir factura</h1>
        <div className="flex flex-wrap gap-2">
          <AdminButton variant="secondary" onClick={() => router.push("/admin/invoices")}><X />Cancelar</AdminButton>
          <AdminButton onClick={() => void save()} disabled={saving}><Save />{saving ? "Emitiendo…" : "Emitir y solicitar CAE"}</AdminButton>
        </div>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <AdminPanel className="mt-6 p-6">
        <div className="grid gap-5 sm:grid-cols-3">
          <AdminField label="Tipo de comprobante" htmlFor="i-doc">
            <select id="i-doc" value={docTypeCode} onChange={(e) => setDocTypeCode(Number(e.target.value))}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
              {DOC_TYPES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </AdminField>
          <AdminField label="Punto de venta" htmlFor="i-pv">
            <AdminInput id="i-pv" type="number" min={1} value={pointOfSale} onChange={(e) => setPointOfSale(Number(e.target.value))} />
          </AdminField>
          <AdminField label="Concepto" htmlFor="i-concept">
            <select id="i-concept" value={concept} onChange={(e) => setConcept(Number(e.target.value) as 1 | 2 | 3)}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
              <option value={1}>Productos</option>
              <option value={2}>Servicios</option>
              <option value={3}>Productos y servicios</option>
            </select>
          </AdminField>
          <AdminField label="Cuenta" htmlFor="i-account">
            <select id="i-account" value={accountId || ""} onChange={(e) => setAccountId(e.target.value || null)}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
              <option value="">(Sin cuenta)</option>
              {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </AdminField>
          <AdminField label="Pedido relacionado" htmlFor="i-order">
            <select id="i-order" value={orderId || ""} onChange={(e) => setOrderId(e.target.value || null)}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
              <option value="">(Ninguno)</option>
              {orders.map((o) => <option key={o.id} value={o.id}>{o.number}</option>)}
            </select>
          </AdminField>
          {needsRelatedInvoice && (
            <AdminField label="Comprobante asociado" htmlFor="i-related">
              <select id="i-related" value={relatedInvoiceId || ""} onChange={(e) => setRelatedInvoiceId(e.target.value || null)}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
                <option value="">Seleccionar comprobante</option>
                {relatedInvoices.map((inv) => <option key={inv.id} value={inv.id}>{inv.number} - {inv.receiverName}</option>)}
              </select>
            </AdminField>
          )}
          <AdminField label="Moneda" htmlFor="i-currency">
            <select id="i-currency" value={currency} onChange={(e) => setCurrency(e.target.value as "PES" | "DOL")}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
              <option value="PES">Pesos (PES)</option>
              <option value="DOL">Dólares (DOL)</option>
            </select>
          </AdminField>
          {currency === "DOL" && (
            <AdminField label="Cotización USD → ARS" htmlFor="i-rate">
              <AdminInput id="i-rate" type="number" min="0" step="0.01" placeholder="Ej: 1050" value={exchangeRate} onChange={(e) => setExchangeRate(e.target.value)} />
            </AdminField>
          )}
          <AdminField label="Fecha de emisión" htmlFor="i-issue">
            <AdminInput id="i-issue" type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
          </AdminField>
        </div>
      </AdminPanel>

      <AdminPanel className="mt-5 p-6">
        <h2 className="font-display text-[17px] font-bold text-slate-950">Receptor</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <AdminField label="Razón social *" htmlFor="r-name">
              <AdminInput id="r-name" value={receiverName} onChange={(e) => setReceiverName(e.target.value)} />
            </AdminField>
          </div>
          <AdminField label="Tipo de documento" htmlFor="r-doctype">
            <select id="r-doctype" value={receiverDocType} onChange={(e) => setReceiverDocType(Number(e.target.value))}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
              {RECEIVER_DOC_TYPES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </AdminField>
          <AdminField label="Número de documento" htmlFor="r-taxid">
            <AdminInput id="r-taxid" value={receiverTaxId} onChange={(e) => setReceiverTaxId(e.target.value)} placeholder={receiverDocType === 80 ? "30-12345678-9" : ""} />
          </AdminField>
          <div className="sm:col-span-2">
            <AdminField label="Domicilio" htmlFor="r-addr">
              <AdminInput id="r-addr" value={receiverAddress} onChange={(e) => setReceiverAddress(e.target.value)} />
            </AdminField>
          </div>
        </div>
      </AdminPanel>

      <AdminPanel className="mt-5 overflow-hidden">
        <div className="border-b border-slate-300 px-5 py-4 sm:px-6 flex items-center justify-between">
          <h2 className="font-display text-[17px] font-bold text-slate-950">Líneas</h2>
          <AdminButton variant="secondary" onClick={addLine}><Plus />Agregar línea</AdminButton>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-[13px]">
            <thead className="bg-slate-100 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-700">
              <tr>
                <th className="px-3 py-2 text-left">Producto</th>
                <th className="px-3 py-2 text-left">Descripción</th>
                <th className="px-3 py-2 text-right">Cant.</th>
                <th className="px-3 py-2 text-right">Precio</th>
                <th className="px-3 py-2 text-right">Desc. %</th>
                <th className="px-3 py-2 text-right">IVA %</th>
                <th className="px-3 py-2 text-right">Total</th>
                <th className="w-12 px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="border-t border-slate-200">
                  <td className="px-3 py-2 align-top">
                    <select value={line.productId || ""} onChange={(e) => pickProduct(idx, e.target.value)}
                      className="h-9 w-44 rounded-md border border-slate-300 bg-white px-2 text-[12.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
                      <option value="">— Manual —</option>
                      {products.map((p) => <option key={p.id} value={p.id}>{p.sku ? `${p.sku} · ` : ""}{p.name}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2 align-top">
                    <input value={line.description} onChange={(e) => setLine(idx, { description: e.target.value })}
                      className="h-9 w-full min-w-[180px] rounded-md border border-slate-300 bg-white px-2 text-[12.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30" />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <input type="number" step="0.01" value={line.quantity}
                      onChange={(e) => setLine(idx, { quantity: Number(e.target.value) })}
                      className="h-9 w-20 rounded-md border border-slate-300 bg-white px-2 text-right text-[12.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30" />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <input type="number" step="0.01" value={line.unitPrice}
                      onChange={(e) => setLine(idx, { unitPrice: Number(e.target.value) })}
                      className="h-9 w-24 rounded-md border border-slate-300 bg-white px-2 text-right text-[12.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30" />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <input type="number" step="0.01" min={0} max={100} value={line.discountPct}
                      onChange={(e) => setLine(idx, { discountPct: Number(e.target.value) })}
                      className="h-9 w-20 rounded-md border border-slate-300 bg-white px-2 text-right text-[12.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30" />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <input type="number" step="0.01" min={0} max={100} value={line.taxRate}
                      onChange={(e) => setLine(idx, { taxRate: Number(e.target.value) })}
                      className="h-9 w-20 rounded-md border border-slate-300 bg-white px-2 text-right text-[12.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30" />
                  </td>
                  <td className="px-3 py-2 text-right align-top font-bold text-slate-950">
                    {totals.lines[idx]?.lineTotal.toLocaleString() ?? "—"}
                  </td>
                  <td className="px-3 py-2 align-top">
                    <button onClick={() => removeLine(idx)} className="grid size-8 place-items-center rounded-md text-red-600 hover:bg-red-50" aria-label="Eliminar línea"><Trash2 className="size-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-300 bg-slate-50 px-5 py-4 sm:px-6">
          <div className="ml-auto grid max-w-sm gap-2 text-[13px]">
            <div className="flex justify-between"><span className="text-slate-600">Subtotal</span><span className="font-bold text-slate-950">{currency} {totals.totals.subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-slate-600">Descuentos</span><span className="font-bold text-slate-950">- {currency} {totals.totals.discountTotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-slate-600">IVA</span><span className="font-bold text-slate-950">{currency} {totals.totals.taxTotal.toLocaleString()}</span></div>
            <div className="mt-2 flex justify-between border-t border-slate-300 pt-2 text-[15px]"><span className="font-bold text-slate-900">Total</span><span className="font-display font-bold text-slate-950">{currency} {totals.totals.total.toLocaleString()}</span></div>
          </div>
        </div>
      </AdminPanel>

      <AdminPanel className="mt-5 p-6">
        <AdminField label="Notas" htmlFor="i-notes">
          <AdminTextarea id="i-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
        </AdminField>
      </AdminPanel>
    </div>
  );
}
