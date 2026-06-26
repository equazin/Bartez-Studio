"use client";

import { useCallback, useEffect, useState } from "react";
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

interface Account { id: string; name: string; taxId: string | null; address: string | null; city: string | null; }
interface Product { id: string; sku: string | null; name: string; }
interface Order { id: string; number: string; accountId: string | null; }
interface Line { productId: string | null; description: string; quantity: number; }

const emptyLine: Line = { productId: null, description: "", quantity: 1 };

export default function NewDeliveryNotePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pointOfSale, setPointOfSale] = useState(1);
  const [accountId, setAccountId] = useState<string | null>(searchParams.get("accountId"));
  const [orderId, setOrderId] = useState<string | null>(searchParams.get("orderId"));
  const [receiverName, setReceiverName] = useState("");
  const [receiverTaxId, setReceiverTaxId] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<Line[]>([{ ...emptyLine }]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/accounts?limit=100").then((r) => r.json()).then((j) => setAccounts(j.data || [])).catch(() => {});
    fetch("/api/admin/products?limit=200&active=1").then((r) => r.json()).then((j) => setProducts(j.data || [])).catch(() => {});
    fetch("/api/admin/orders?limit=50").then((r) => r.json()).then((j) => setOrders(j.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!accountId) return;
    const account = accounts.find((item) => item.id === accountId);
    if (!account) return;
    setReceiverName(account.name);
    setReceiverTaxId(account.taxId || "");
    setReceiverAddress(`${account.address || ""}${account.city ? `, ${account.city}` : ""}`.trim());
  }, [accountId, accounts]);

  const setLine = useCallback((idx: number, patch: Partial<Line>) => {
    setLines((current) => current.map((line, i) => i === idx ? { ...line, ...patch } : line));
  }, []);

  function pickProduct(idx: number, productId: string) {
    const product = products.find((item) => item.id === productId);
    setLine(idx, product ? { productId, description: product.name } : { productId: null });
  }

  async function save() {
    if (!receiverName.trim()) { setError("Falta el receptor."); return; }
    if (!lines.some((line) => line.description.trim())) { setError("Agrega al menos una linea."); return; }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/delivery-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pointOfSale,
          accountId,
          orderId,
          receiverName,
          receiverTaxId: receiverTaxId || null,
          receiverAddress: receiverAddress || null,
          issueDate,
          notes: notes || null,
          lines: lines.filter((line) => line.description.trim()),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "No pudimos emitir el remito");
      router.push(`/admin/delivery-notes/${json.data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1100px]">
      <Link href="/admin/delivery-notes" className="inline-flex items-center gap-1 text-[13px] font-bold text-brand hover:underline">
        <ChevronLeft className="size-4" />Volver a remitos
      </Link>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-[clamp(26px,3vw,34px)] font-bold tracking-[-0.035em] text-slate-950">Nuevo remito</h1>
        <div className="flex flex-wrap gap-2">
          <AdminButton variant="secondary" onClick={() => router.push("/admin/delivery-notes")}><X />Cancelar</AdminButton>
          <AdminButton onClick={() => void save()} disabled={saving}><Save />{saving ? "Emitiendo..." : "Emitir remito"}</AdminButton>
        </div>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <AdminPanel className="mt-6 p-6">
        <div className="grid gap-5 sm:grid-cols-3">
          <AdminField label="Punto de venta" htmlFor="dn-pv">
            <AdminInput id="dn-pv" type="number" min={1} value={pointOfSale} onChange={(event) => setPointOfSale(Number(event.target.value))} />
          </AdminField>
          <AdminField label="Cuenta" htmlFor="dn-account">
            <select id="dn-account" value={accountId || ""} onChange={(event) => setAccountId(event.target.value || null)}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
              <option value="">(Sin cuenta)</option>
              {accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}
            </select>
          </AdminField>
          <AdminField label="Pedido" htmlFor="dn-order">
            <select id="dn-order" value={orderId || ""} onChange={(event) => setOrderId(event.target.value || null)}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
              <option value="">(Ninguno)</option>
              {orders.map((order) => <option key={order.id} value={order.id}>{order.number}</option>)}
            </select>
          </AdminField>
          <AdminField label="Fecha" htmlFor="dn-date">
            <AdminInput id="dn-date" type="date" value={issueDate} onChange={(event) => setIssueDate(event.target.value)} />
          </AdminField>
        </div>
      </AdminPanel>

      <AdminPanel className="mt-5 p-6">
        <h2 className="font-display text-[17px] font-bold text-slate-950">Receptor</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <AdminField label="Razon social *" htmlFor="dn-name">
              <AdminInput id="dn-name" value={receiverName} onChange={(event) => setReceiverName(event.target.value)} />
            </AdminField>
          </div>
          <AdminField label="CUIT / Documento" htmlFor="dn-taxid">
            <AdminInput id="dn-taxid" value={receiverTaxId} onChange={(event) => setReceiverTaxId(event.target.value)} />
          </AdminField>
          <div className="sm:col-span-3">
            <AdminField label="Domicilio de entrega" htmlFor="dn-address">
              <AdminInput id="dn-address" value={receiverAddress} onChange={(event) => setReceiverAddress(event.target.value)} />
            </AdminField>
          </div>
        </div>
      </AdminPanel>

      <AdminPanel className="mt-5 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-300 px-5 py-4 sm:px-6">
          <h2 className="font-display text-[17px] font-bold text-slate-950">Lineas</h2>
          <AdminButton variant="secondary" onClick={() => setLines((current) => [...current, { ...emptyLine }])}><Plus />Agregar linea</AdminButton>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-[13px]">
            <thead className="bg-slate-100 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-700">
              <tr><th className="px-3 py-2 text-left">Producto</th><th className="px-3 py-2 text-left">Descripcion</th><th className="px-3 py-2 text-right">Cantidad</th><th className="w-12 px-3 py-2"></th></tr>
            </thead>
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="border-t border-slate-200">
                  <td className="px-3 py-2">
                    <select value={line.productId || ""} onChange={(event) => pickProduct(idx, event.target.value)}
                      className="h-9 w-44 rounded-md border border-slate-300 bg-white px-2 text-[12.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
                      <option value="">Manual</option>
                      {products.map((product) => <option key={product.id} value={product.id}>{product.sku ? `${product.sku} - ` : ""}{product.name}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2"><input value={line.description} onChange={(event) => setLine(idx, { description: event.target.value })} className="h-9 w-full min-w-[240px] rounded-md border border-slate-300 bg-white px-2 text-[12.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30" /></td>
                  <td className="px-3 py-2 text-right"><input type="number" step="0.01" min={0} value={line.quantity} onChange={(event) => setLine(idx, { quantity: Number(event.target.value) })} className="h-9 w-24 rounded-md border border-slate-300 bg-white px-2 text-right text-[12.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30" /></td>
                  <td className="px-3 py-2"><button onClick={() => setLines((current) => current.filter((_, i) => i !== idx))} className="grid size-8 place-items-center rounded-md text-red-600 hover:bg-red-50" aria-label="Eliminar linea"><Trash2 className="size-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminPanel>

      <AdminPanel className="mt-5 p-6">
        <AdminField label="Notas" htmlFor="dn-notes">
          <AdminTextarea id="dn-notes" value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} />
        </AdminField>
      </AdminPanel>
    </div>
  );
}
