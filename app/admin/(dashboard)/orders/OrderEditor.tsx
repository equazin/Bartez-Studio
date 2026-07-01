"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus, Save, Search, Trash2, X } from "lucide-react";
import {
  AdminAlert,
  AdminButton,
  AdminField,
  AdminInput,
  AdminPanel,
  AdminTextarea,
} from "../../../../components/admin/AdminUI";
import { calcQuote } from "../../../../lib/modules/sales/calc";

interface Account { id: string; name: string; }
interface Product { id: string; sku: string | null; name: string; taxRate: string | number; stockTracked: boolean; }
interface Warehouse { id: string; code: string; name: string; isDefault: boolean; }
interface AirProduct {
  id: string;
  codiart: string;
  name: string;
  rubro: string | null;
  grupo: string | null;
  price: number | null;
  stockDisp: number;
}

export interface OrderEditorLine {
  productId: string | null;
  sourceSystem: "air" | null;
  sourceCode: string | null;
  description: string;
  quantity: number;
  unitCost: number | null;
  markupPct: number | null;
  unitPrice: number;
  discountPct: number;
  taxRate: number;
}

export interface OrderEditorValue {
  id?: string;
  number?: string;
  accountId: string | null;
  warehouseId: string | null;
  currency: string;
  orderDate: string;
  expectedDate: string | null;
  notes: string | null;
  lines: OrderEditorLine[];
}

const emptyLine: OrderEditorLine = {
  productId: null,
  sourceSystem: null,
  sourceCode: null,
  description: "",
  quantity: 1,
  unitCost: null,
  markupPct: null,
  unitPrice: 0,
  discountPct: 0,
  taxRate: 21,
};

export function OrderEditor({ initial }: { initial: OrderEditorValue }) {
  const router = useRouter();
  const [value, setValue] = useState<OrderEditorValue>(initial);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [airOpenLine, setAirOpenLine] = useState<number | null>(null);
  const [airQuery, setAirQuery] = useState("");
  const [airProducts, setAirProducts] = useState<AirProduct[]>([]);
  const [airLoading, setAirLoading] = useState(false);
  const [airError, setAirError] = useState<string | null>(null);
  const [airEnabled, setAirEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/admin/accounts?limit=100").then((r) => r.json()).then((j) => setAccounts(j.data || [])).catch(() => {});
    fetch("/api/admin/products?limit=200&active=1").then((r) => r.json()).then((j) => setProducts(j.data || [])).catch(() => {});
    fetch("/api/admin/warehouses").then((r) => r.json()).then((j) => setWarehouses((j.data || []).filter((w: Warehouse & { active?: boolean }) => w.active !== false))).catch(() => {});
  }, []);

  // Default a depósito por defecto al cargar
  useEffect(() => {
    if (!value.id && !value.warehouseId && warehouses.length > 0) {
      const def = warehouses.find((w) => w.isDefault);
      if (def) setValue((v) => ({ ...v, warehouseId: def.id }));
    }
  }, [warehouses, value.id, value.warehouseId]);

  const totals = useMemo(() => calcQuote(value.lines.map((l) => ({
    quantity: Number(l.quantity) || 0,
    unitPrice: Number(l.unitPrice) || 0,
    discountPct: Number(l.discountPct) || 0,
    taxRate: Number(l.taxRate) || 0,
  }))), [value.lines]);

  const setLine = useCallback((idx: number, patch: Partial<OrderEditorLine>) => {
    setValue((v) => ({ ...v, lines: v.lines.map((l, i) => i === idx ? { ...l, ...patch } : l) }));
  }, []);

  const addLine = useCallback(() => setValue((v) => ({ ...v, lines: [...v.lines, { ...emptyLine }] })), []);
  const removeLine = useCallback((idx: number) => setValue((v) => ({ ...v, lines: v.lines.filter((_, i) => i !== idx) })), []);

  function pickProduct(idx: number, productId: string) {
    const product = products.find((p) => p.id === productId);
    if (!product) {
      setLine(idx, { productId: null, sourceSystem: null, sourceCode: null, unitCost: null, markupPct: null });
      return;
    }
    setLine(idx, {
      productId,
      sourceSystem: null,
      sourceCode: null,
      description: product.name,
      unitCost: null,
      markupPct: null,
      taxRate: Number(product.taxRate),
    });
  }

  const searchAirProducts = useCallback(async (query: string) => {
    setAirLoading(true);
    setAirError(null);
    try {
      const params = new URLSearchParams({ q: query, limit: "12" });
      const res = await fetch(`/api/admin/air/products?${params.toString()}`, { cache: "no-store" });
      const json = (await res.json()) as {
        ok: boolean;
        data?: { enabled: boolean; products: AirProduct[] };
        error?: string;
      };
      if (!res.ok || !json.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
      setAirEnabled(json.data?.enabled ?? false);
      setAirProducts(json.data?.products ?? []);
      if (json.data && !json.data.enabled) setAirError("La integración AIR está deshabilitada.");
    } catch (err) {
      setAirProducts([]);
      setAirError(err instanceof Error ? err.message : "No se pudo buscar en AIR.");
    } finally {
      setAirLoading(false);
    }
  }, []);

  function openAirPicker(idx: number) {
    const query = value.lines[idx]?.description ?? "";
    setAirOpenLine(idx);
    setAirQuery(query);
    void searchAirProducts(query);
  }

  function pickAirProduct(idx: number, product: AirProduct) {
    const price = product.price ?? value.lines[idx]?.unitPrice ?? 0;
    setLine(idx, {
      productId: null,
      sourceSystem: "air",
      sourceCode: product.codiart,
      description: product.name,
      unitCost: product.price,
      markupPct: null,
      unitPrice: price,
      taxRate: value.lines[idx]?.taxRate ?? 21,
    });
    setAirOpenLine(null);
  }

  async function save() {
    if (value.lines.length === 0 || !value.lines.some((l) => l.description.trim())) {
      setError("Agregá al menos una línea con descripción.");
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      accountId: value.accountId || null,
      warehouseId: value.warehouseId || null,
      currency: value.currency,
      orderDate: value.orderDate || undefined,
      expectedDate: value.expectedDate || null,
      notes: value.notes,
      lines: value.lines.filter((l) => l.description.trim()),
    };
    try {
      const isNew = !value.id;
      const res = await fetch(isNew ? "/api/admin/orders" : `/api/admin/orders/${value.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Error al guardar");
      const json = await res.json();
      const id = json.data?.id || value.id;
      router.push(`/admin/orders/${id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1240px]">
      <Link href="/admin/orders" className="inline-flex items-center gap-1 text-[13px] font-bold text-brand hover:underline">
        <ChevronLeft className="size-4" />Volver a pedidos
      </Link>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-[clamp(26px,3vw,34px)] font-bold tracking-[-0.035em] text-slate-950">
          {value.id ? `Pedido ${value.number}` : "Nuevo pedido"}
        </h1>
        <div className="flex flex-wrap gap-2">
          <AdminButton variant="secondary" onClick={() => router.push("/admin/orders")}><X />Cancelar</AdminButton>
          <AdminButton onClick={() => void save()} disabled={saving}><Save />{saving ? "Guardando…" : "Guardar"}</AdminButton>
        </div>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <AdminPanel className="mt-6 p-6">
        <div className="grid gap-5 sm:grid-cols-3">
          <AdminField label="Cuenta" htmlFor="o-account">
            <select id="o-account" value={value.accountId || ""} onChange={(e) => setValue({ ...value, accountId: e.target.value || null })}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
              <option value="">(Sin cuenta)</option>
              {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </AdminField>
          <AdminField label="Depósito" htmlFor="o-wh">
            <select id="o-wh" value={value.warehouseId || ""} onChange={(e) => setValue({ ...value, warehouseId: e.target.value || null })}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
              <option value="">(Sin depósito — todo bajo pedido)</option>
              {warehouses.map((w) => <option key={w.id} value={w.id}>{w.code} · {w.name}</option>)}
            </select>
          </AdminField>
          <AdminField label="Moneda" htmlFor="o-currency">
            <select id="o-currency" value={value.currency} onChange={(e) => setValue({ ...value, currency: e.target.value })}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
              <option value="USD">USD</option>
              <option value="ARS">ARS</option>
              <option value="EUR">EUR</option>
            </select>
          </AdminField>
          <AdminField label="Fecha del pedido" htmlFor="o-date">
            <AdminInput id="o-date" type="date" value={value.orderDate} onChange={(e) => setValue({ ...value, orderDate: e.target.value })} />
          </AdminField>
          <AdminField label="Entrega esperada" htmlFor="o-expected">
            <AdminInput id="o-expected" type="date" value={value.expectedDate || ""} onChange={(e) => setValue({ ...value, expectedDate: e.target.value || null })} />
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
              <thead className="bg-slate-100 text-[12px] font-semibold text-slate-700">
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
                {value.lines.map((line, idx) => {
                  const product = line.productId ? products.find((p) => p.id === line.productId) : null;
                  const isBackorder = product && !product.stockTracked;
                  const isAirLine = line.sourceSystem === "air" && line.sourceCode;
                  return (
                    <tr key={idx} className="border-t border-slate-200">
                      <td className="px-3 py-2 align-top">
                        <div className="flex gap-1.5">
                          <select value={line.productId || ""} onChange={(e) => pickProduct(idx, e.target.value)}
                            className="h-9 w-44 rounded-md border border-slate-300 bg-white px-2 text-[12.5px] font-medium text-slate-950 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30">
                            <option value="">— Manual —</option>
                            {products.map((p) => <option key={p.id} value={p.id}>{p.sku ? `${p.sku} · ` : ""}{p.name}</option>)}
                          </select>
                          <button
                            type="button"
                            onClick={() => openAirPicker(idx)}
                            className="inline-flex h-9 items-center gap-1 rounded-md border border-slate-300 bg-white px-2 text-[12px] font-bold text-slate-700 hover:border-brand hover:text-brand"
                          >
                            <Search className="size-3.5" /> AIR
                          </button>
                        </div>
                        {isAirLine && (
                          <p className="mt-1 text-[10.5px] font-bold text-sky-700">
                            AIR {line.sourceCode}{line.unitCost !== null ? ` · costo ${Number(line.unitCost).toLocaleString("es-AR")}` : ""}
                          </p>
                        )}
                        {isBackorder && <p className="mt-1 text-[10.5px] font-bold text-amber-700">Bajo pedido</p>}
                        {airOpenLine === idx && (
                          <div className="mt-2 w-[360px] rounded-lg border border-slate-300 bg-white p-2 shadow-lg">
                            <div className="flex gap-2">
                              <input
                                value={airQuery}
                                onChange={(e) => setAirQuery(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    void searchAirProducts(airQuery);
                                  }
                                  if (e.key === "Escape") setAirOpenLine(null);
                                }}
                                placeholder="Código o descripción AIR"
                                className="h-8 flex-1 rounded-md border border-slate-300 px-2 text-[12.5px] text-slate-950 outline-none focus:border-brand"
                              />
                              <button
                                type="button"
                                onClick={() => void searchAirProducts(airQuery)}
                                className="rounded-md bg-slate-950 px-2 text-[12px] font-bold text-white disabled:opacity-50"
                                disabled={airLoading}
                              >
                                {airLoading ? "..." : "Buscar"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setAirOpenLine(null)}
                                className="grid size-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100"
                                aria-label="Cerrar picker AIR"
                              >
                                <X className="size-4" />
                              </button>
                            </div>
                            {airError && <p className="mt-2 text-[12px] font-semibold text-red-600">{airError}</p>}
                            {!airError && airEnabled === true && airProducts.length === 0 && !airLoading && (
                              <p className="mt-2 text-[12px] text-slate-500">Sin resultados.</p>
                            )}
                            {airProducts.length > 0 && (
                              <div className="mt-2 max-h-64 overflow-y-auto">
                                {airProducts.map((p) => (
                                  <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => pickAirProduct(idx, p)}
                                    className="block w-full rounded-md px-2 py-2 text-left hover:bg-slate-100"
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="min-w-0">
                                        <p className="truncate text-[12.5px] font-bold text-slate-950">{p.codiart} · {p.name}</p>
                                        <p className="text-[11px] text-slate-500">{[p.rubro, p.grupo].filter(Boolean).join(" / ") || "Sin rubro"}</p>
                                      </div>
                                      <div className="shrink-0 text-right">
                                        <p className="text-[12px] font-bold text-slate-950">{p.price !== null ? p.price.toLocaleString("es-AR") : "s/precio"}</p>
                                        <p className="text-[11px] text-slate-500">Stock {p.stockDisp}</p>
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

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
        <AdminField label="Notas internas" htmlFor="o-notes">
          <AdminTextarea id="o-notes" value={value.notes || ""} onChange={(e) => setValue({ ...value, notes: e.target.value || null })} rows={4} />
        </AdminField>
      </AdminPanel>
    </div>
  );
}

export const newOrderDefaults: OrderEditorValue = {
  accountId: null,
  warehouseId: null,
  currency: "USD",
  orderDate: new Date().toISOString().slice(0, 10),
  expectedDate: null,
  notes: null,
  lines: [{ ...emptyLine }],
};
