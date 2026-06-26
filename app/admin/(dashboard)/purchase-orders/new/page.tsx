"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus, Save, Trash2, X } from "lucide-react";
import { AdminAlert, AdminButton, AdminField, AdminInput, AdminPanel, AdminTextarea } from "../../../../../components/admin/AdminUI";
import { calcQuote } from "../../../../../lib/modules/sales/calc";

interface Supplier { id: string; name: string; }
interface Product { id: string; sku: string | null; name: string; taxRate: string | number; }
interface Line { productId: string | null; description: string; quantity: number; unitPrice: number; discountPct: number; taxRate: number; }

const emptyLine: Line = { productId: null, description: "", quantity: 1, unitPrice: 0, discountPct: 0, taxRate: 21 };

export default function NewPurchaseOrderPage() {
  const router = useRouter();
  const [supplierId, setSupplierId] = useState("");
  const [currency, setCurrency] = useState<"ARS" | "USD">("ARS");
  const [expectedDate, setExpectedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<Line[]>([{ ...emptyLine }]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/suppliers?limit=200&active=1").then((r) => r.json()).then((j) => setSuppliers(j.data || [])).catch(() => {});
    fetch("/api/admin/products?limit=200&active=1").then((r) => r.json()).then((j) => setProducts(j.data || [])).catch(() => {});
  }, []);

  const totals = useMemo(() => calcQuote(lines.map((line) => ({
    quantity: Number(line.quantity) || 0,
    unitPrice: Number(line.unitPrice) || 0,
    discountPct: Number(line.discountPct) || 0,
    taxRate: Number(line.taxRate) || 0,
  }))), [lines]);

  const setLine = useCallback((idx: number, patch: Partial<Line>) => {
    setLines((current) => current.map((line, i) => i === idx ? { ...line, ...patch } : line));
  }, []);

  function pickProduct(idx: number, productId: string) {
    const product = products.find((item) => item.id === productId);
    setLine(idx, product ? { productId, description: product.name, taxRate: Number(product.taxRate) } : { productId: null });
  }

  async function save() {
    if (!supplierId) { setError("Selecciona un proveedor."); return; }
    if (!lines.some((line) => line.description.trim())) { setError("Agrega al menos una linea."); return; }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/purchase-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplierId,
          currency,
          expectedDate: expectedDate || null,
          notes: notes || null,
          lines: lines.filter((line) => line.description.trim()),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "No pudimos crear la OC");
      router.push(`/admin/purchase-orders/${json.data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1180px]">
      <Link href="/admin/purchase-orders" className="inline-flex items-center gap-1 text-[13px] font-bold text-brand hover:underline"><ChevronLeft className="size-4" />Volver a compras</Link>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-[clamp(26px,3vw,34px)] font-bold tracking-[-0.035em] text-slate-950">Nueva orden de compra</h1>
        <div className="flex gap-2"><AdminButton variant="secondary" onClick={() => router.push("/admin/purchase-orders")}><X />Cancelar</AdminButton><AdminButton onClick={() => void save()} disabled={saving}><Save />{saving ? "Guardando..." : "Emitir OC"}</AdminButton></div>
      </div>
      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <AdminPanel className="mt-6 p-6">
        <div className="grid gap-5 sm:grid-cols-3">
          <AdminField label="Proveedor" htmlFor="po-supplier">
            <select id="po-supplier" value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
              <option value="">Seleccionar</option>
              {suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}
            </select>
          </AdminField>
          <AdminField label="Moneda" htmlFor="po-currency">
            <select id="po-currency" value={currency} onChange={(e) => setCurrency(e.target.value as "ARS" | "USD")} className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
              <option value="ARS">ARS</option><option value="USD">USD</option>
            </select>
          </AdminField>
          <AdminField label="Fecha esperada" htmlFor="po-expected"><AdminInput id="po-expected" type="date" value={expectedDate} onChange={(e) => setExpectedDate(e.target.value)} /></AdminField>
        </div>
      </AdminPanel>

      <AdminPanel className="mt-5 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-300 px-5 py-4 sm:px-6">
          <h2 className="font-display text-[17px] font-bold text-slate-950">Lineas</h2>
          <AdminButton variant="secondary" onClick={() => setLines((current) => [...current, { ...emptyLine }])}><Plus />Agregar linea</AdminButton>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-[13px]">
            <thead className="bg-slate-100 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-700"><tr><th className="px-3 py-2 text-left">Producto</th><th className="px-3 py-2 text-left">Descripcion</th><th className="px-3 py-2 text-right">Cant.</th><th className="px-3 py-2 text-right">Costo</th><th className="px-3 py-2 text-right">IVA</th><th className="px-3 py-2 text-right">Total</th><th className="w-12"></th></tr></thead>
            <tbody>{lines.map((line, idx) => (
              <tr key={idx} className="border-t border-slate-200">
                <td className="px-3 py-2"><select value={line.productId || ""} onChange={(e) => pickProduct(idx, e.target.value)} className="h-9 w-44 rounded-md border border-slate-300 bg-white px-2 text-[12.5px]"><option value="">Manual</option>{products.map((p) => <option key={p.id} value={p.id}>{p.sku ? `${p.sku} - ` : ""}{p.name}</option>)}</select></td>
                <td className="px-3 py-2"><input value={line.description} onChange={(e) => setLine(idx, { description: e.target.value })} className="h-9 w-full min-w-[220px] rounded-md border border-slate-300 px-2 text-[12.5px]" /></td>
                <td className="px-3 py-2 text-right"><input type="number" step="0.01" value={line.quantity} onChange={(e) => setLine(idx, { quantity: Number(e.target.value) })} className="h-9 w-20 rounded-md border border-slate-300 px-2 text-right text-[12.5px]" /></td>
                <td className="px-3 py-2 text-right"><input type="number" step="0.01" value={line.unitPrice} onChange={(e) => setLine(idx, { unitPrice: Number(e.target.value) })} className="h-9 w-24 rounded-md border border-slate-300 px-2 text-right text-[12.5px]" /></td>
                <td className="px-3 py-2 text-right"><input type="number" step="0.01" value={line.taxRate} onChange={(e) => setLine(idx, { taxRate: Number(e.target.value) })} className="h-9 w-20 rounded-md border border-slate-300 px-2 text-right text-[12.5px]" /></td>
                <td className="px-3 py-2 text-right font-bold">{currency} {totals.lines[idx]?.lineTotal.toLocaleString("es-AR") ?? "-"}</td>
                <td className="px-3 py-2"><button onClick={() => setLines((current) => current.filter((_, i) => i !== idx))} className="grid size-8 place-items-center rounded-md text-red-600 hover:bg-red-50" aria-label="Eliminar"><Trash2 className="size-4" /></button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <div className="border-t border-slate-300 bg-slate-50 px-5 py-4 sm:px-6">
          <div className="ml-auto grid max-w-sm gap-2 text-[13px]"><div className="flex justify-between"><span>Subtotal</span><b>{currency} {totals.totals.subtotal.toLocaleString("es-AR")}</b></div><div className="flex justify-between"><span>IVA</span><b>{currency} {totals.totals.taxTotal.toLocaleString("es-AR")}</b></div><div className="mt-2 flex justify-between border-t border-slate-300 pt-2 text-[15px]"><b>Total</b><b>{currency} {totals.totals.total.toLocaleString("es-AR")}</b></div></div>
        </div>
      </AdminPanel>
      <AdminPanel className="mt-5 p-6"><AdminField label="Notas" htmlFor="po-notes"><AdminTextarea id="po-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} /></AdminField></AdminPanel>
    </div>
  );
}
