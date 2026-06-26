"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus, Save, Send, Trash2, X } from "lucide-react";
import {
  AdminAlert,
  AdminButton,
  AdminField,
  AdminInput,
  AdminPanel,
  AdminSpinner,
  AdminTextarea,
} from "../../../../components/admin/AdminUI";
import { calcQuote } from "../../../../lib/modules/sales/calc";

interface Account {
  id: string;
  name: string;
}

interface Product {
  id: string;
  sku: string | null;
  name: string;
  taxRate: string | number;
}

interface PriceList {
  id: string;
  name: string;
  currency: string;
  isDefault: boolean;
}

interface PriceListDetail extends PriceList {
  items: Array<{ productId: string; unitPrice: string }>;
}

export interface QuoteEditorLine {
  productId: string | null;
  description: string;
  quantity: number;
  unitPrice: number;
  discountPct: number;
  taxRate: number;
}

export interface QuoteEditorValue {
  id?: string;
  number?: string;
  accountId: string | null;
  priceListId: string | null;
  currency: string;
  issueDate: string; // YYYY-MM-DD
  validUntil: string | null; // YYYY-MM-DD
  notes: string | null;
  terms: string | null;
  lines: QuoteEditorLine[];
}

const emptyLine: QuoteEditorLine = {
  productId: null,
  description: "",
  quantity: 1,
  unitPrice: 0,
  discountPct: 0,
  taxRate: 21,
};

export function QuoteEditor({ initial }: { initial: QuoteEditorValue }) {
  const router = useRouter();
  const [value, setValue] = useState<QuoteEditorValue>(initial);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [priceLists, setPriceLists] = useState<PriceList[]>([]);
  const [priceListDetail, setPriceListDetail] = useState<PriceListDetail | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar opciones
  useEffect(() => {
    fetch("/api/admin/accounts?limit=100").then((r) => r.json()).then((j) => setAccounts(j.data || [])).catch(() => {});
    fetch("/api/admin/products?limit=200&active=1").then((r) => r.json()).then((j) => setProducts(j.data || [])).catch(() => {});
    fetch("/api/admin/price-lists").then((r) => r.json()).then((j) => setPriceLists(j.data || [])).catch(() => {});
  }, []);

  // Cuando se elige una lista de precios, cargo el detalle (precios x producto)
  useEffect(() => {
    if (!value.priceListId) {
      setPriceListDetail(null);
      return;
    }
    fetch(`/api/admin/price-lists/${value.priceListId}`)
      .then((r) => r.json())
      .then((j) => {
        setPriceListDetail(j.data);
        // Si la lista define moneda, alinearla.
        if (j.data?.currency && j.data.currency !== value.currency) {
          setValue((v) => ({ ...v, currency: j.data.currency }));
        }
      })
      .catch(() => {});
  }, [value.priceListId]);

  // Default a lista por defecto cuando carga
  useEffect(() => {
    if (!value.id && !value.priceListId && priceLists.length > 0) {
      const def = priceLists.find((l) => l.isDefault);
      if (def) setValue((v) => ({ ...v, priceListId: def.id, currency: def.currency }));
    }
  }, [priceLists, value.id, value.priceListId]);

  const totals = useMemo(() => calcQuote(value.lines.map((l) => ({
    quantity: Number(l.quantity) || 0,
    unitPrice: Number(l.unitPrice) || 0,
    discountPct: Number(l.discountPct) || 0,
    taxRate: Number(l.taxRate) || 0,
  }))), [value.lines]);

  const setLine = useCallback((idx: number, patch: Partial<QuoteEditorLine>) => {
    setValue((v) => ({ ...v, lines: v.lines.map((l, i) => i === idx ? { ...l, ...patch } : l) }));
  }, []);

  const addLine = useCallback(() => setValue((v) => ({ ...v, lines: [...v.lines, { ...emptyLine }] })), []);
  const removeLine = useCallback((idx: number) => setValue((v) => ({ ...v, lines: v.lines.filter((_, i) => i !== idx) })), []);

  function pickProduct(idx: number, productId: string) {
    const product = products.find((p) => p.id === productId);
    if (!product) {
      setLine(idx, { productId: null });
      return;
    }
    const priceRow = priceListDetail?.items.find((it) => it.productId === productId);
    setLine(idx, {
      productId,
      description: product.name,
      unitPrice: priceRow ? Number(priceRow.unitPrice) : 0,
      taxRate: Number(product.taxRate),
    });
  }

  async function save(targetStatus?: string) {
    if (value.lines.length === 0 || !value.lines.some((l) => l.description.trim())) {
      setError("Agregá al menos una línea con descripción.");
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      accountId: value.accountId || null,
      priceListId: value.priceListId || null,
      currency: value.currency,
      issueDate: value.issueDate || undefined,
      validUntil: value.validUntil || null,
      notes: value.notes,
      terms: value.terms,
      lines: value.lines.filter((l) => l.description.trim()),
    };
    try {
      const isNew = !value.id;
      const res = await fetch(isNew ? "/api/admin/quotes" : `/api/admin/quotes/${value.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Error al guardar");
      const json = await res.json();
      const id = json.data?.id || value.id;
      if (targetStatus && id) {
        await fetch(`/api/admin/quotes/${id}/status`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: targetStatus }),
        });
      }
      router.push(`/admin/quotes/${id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1240px]">
      <Link href="/admin/quotes" className="inline-flex items-center gap-1 text-[13px] font-bold text-brand hover:underline">
        <ChevronLeft className="size-4" />Volver a presupuestos
      </Link>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[clamp(26px,3vw,34px)] font-bold tracking-[-0.035em] text-slate-950">
            {value.id ? `Presupuesto ${value.number}` : "Nuevo presupuesto"}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <AdminButton variant="secondary" onClick={() => router.push("/admin/quotes")}><X />Cancelar</AdminButton>
          <AdminButton onClick={() => void save()} disabled={saving}><Save />{saving ? "Guardando…" : "Guardar"}</AdminButton>
          {!value.id && <AdminButton variant="secondary" onClick={() => void save("sent")} disabled={saving}><Send />Guardar y marcar enviado</AdminButton>}
        </div>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <AdminPanel className="mt-6 p-6">
        <div className="grid gap-5 sm:grid-cols-3">
          <AdminField label="Cuenta" htmlFor="q-account">
            <select id="q-account" value={value.accountId || ""} onChange={(e) => setValue({ ...value, accountId: e.target.value || null })}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
              <option value="">(Sin cuenta)</option>
              {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </AdminField>
          <AdminField label="Lista de precios" htmlFor="q-pl">
            <select id="q-pl" value={value.priceListId || ""} onChange={(e) => setValue({ ...value, priceListId: e.target.value || null })}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
              <option value="">(Sin lista)</option>
              {priceLists.map((l) => <option key={l.id} value={l.id}>{l.name} ({l.currency})</option>)}
            </select>
          </AdminField>
          <AdminField label="Moneda" htmlFor="q-currency">
            <select id="q-currency" value={value.currency} onChange={(e) => setValue({ ...value, currency: e.target.value })}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
              <option value="USD">USD</option>
              <option value="ARS">ARS</option>
              <option value="EUR">EUR</option>
            </select>
          </AdminField>
          <AdminField label="Fecha de emisión" htmlFor="q-issue">
            <AdminInput id="q-issue" type="date" value={value.issueDate} onChange={(e) => setValue({ ...value, issueDate: e.target.value })} />
          </AdminField>
          <AdminField label="Válido hasta" htmlFor="q-valid">
            <AdminInput id="q-valid" type="date" value={value.validUntil || ""} onChange={(e) => setValue({ ...value, validUntil: e.target.value || null })} />
          </AdminField>
        </div>
      </AdminPanel>

      <AdminPanel className="mt-5 overflow-hidden">
        <div className="border-b border-slate-300 px-5 py-4 sm:px-6 flex items-center justify-between">
          <h2 className="font-display text-[17px] font-bold text-slate-950">Líneas</h2>
          <AdminButton variant="secondary" onClick={addLine}><Plus />Agregar línea</AdminButton>
        </div>

        {value.lines.length === 0 ? (
          <p className="px-5 py-12 text-center text-[13px] text-slate-600">Sin líneas. Agregá la primera arriba.</p>
        ) : (
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
                {value.lines.map((line, idx) => (
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
        )}

        {/* Totales */}
        <div className="border-t border-slate-300 bg-slate-50 px-5 py-4 sm:px-6">
          <div className="ml-auto grid max-w-sm gap-2 text-[13px]">
            <div className="flex justify-between"><span className="text-slate-600">Subtotal</span><span className="font-bold text-slate-950">{value.currency} {totals.totals.subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-slate-600">Descuentos</span><span className="font-bold text-slate-950">- {value.currency} {totals.totals.discountTotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-slate-600">IVA</span><span className="font-bold text-slate-950">{value.currency} {totals.totals.taxTotal.toLocaleString()}</span></div>
            <div className="mt-2 flex justify-between border-t border-slate-300 pt-2 text-[15px]"><span className="font-bold text-slate-900">Total</span><span className="font-display font-bold text-slate-950">{value.currency} {totals.totals.total.toLocaleString()}</span></div>
          </div>
        </div>
      </AdminPanel>

      <AdminPanel className="mt-5 p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminField label="Notas (visibles al cliente)" htmlFor="q-notes">
            <AdminTextarea id="q-notes" value={value.notes || ""} onChange={(e) => setValue({ ...value, notes: e.target.value || null })} rows={4} />
          </AdminField>
          <AdminField label="Términos y condiciones" htmlFor="q-terms">
            <AdminTextarea id="q-terms" value={value.terms || ""} onChange={(e) => setValue({ ...value, terms: e.target.value || null })} rows={4} />
          </AdminField>
        </div>
      </AdminPanel>
    </div>
  );
}

export const newQuoteDefaults: QuoteEditorValue = {
  accountId: null,
  priceListId: null,
  currency: "USD",
  issueDate: new Date().toISOString().slice(0, 10),
  validUntil: null,
  notes: null,
  terms: null,
  lines: [{ ...emptyLine }],
};
