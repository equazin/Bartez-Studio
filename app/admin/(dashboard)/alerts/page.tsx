"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Boxes, CheckCircle2, Clock, Save, Send, ShieldAlert } from "lucide-react";
import { AdminAlert, AdminButton, AdminField, AdminInput, AdminPanel, AdminSpinner } from "../../../../components/admin/AdminUI";

interface OverdueInvoice { id: string; number: string; receiverName: string; currency: string; total: number; pending: number; paymentDueDate: string | null; daysOverdue: number; }
interface LowStockItem { productId: string; productName: string; sku: string | null; warehouseName: string; quantity: number; reorderPoint: number; }
interface PendingApproval { id: string; number: string; supplierName: string; currency: string; total: number; issueDate: string; }
interface AlertsResult {
  overdueInvoices: OverdueInvoice[];
  lowStock: LowStockItem[];
  pendingApprovals: PendingApproval[];
  counts: { overdueInvoices: number; lowStock: number; pendingApprovals: number; total: number };
}

function money(currency: string, value: number) {
  return `${currency} ${value.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function AlertsPage() {
  const [data, setData] = useState<AlertsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [okMessage, setOkMessage] = useState<string | null>(null);

  // Config de notificaciones
  const [waTo, setWaTo] = useState("");
  const [emailTo, setEmailTo] = useState("");
  const [savingCfg, setSavingCfg] = useState(false);
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [alertsRes, cfgRes] = await Promise.all([
        fetch("/api/admin/alerts"),
        fetch("/api/admin/settings"),
      ]);
      const json = await alertsRes.json();
      const cfgJson = await cfgRes.json();
      if (!alertsRes.ok || !json.ok) throw new Error(json.error || "No pudimos cargar las alertas");
      setData(json.data);
      if (cfgRes.ok && cfgJson.ok) {
        setWaTo(cfgJson.data.alertsWhatsappTo || "");
        setEmailTo(cfgJson.data.alertsEmailTo || "");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function saveConfig() {
    setSavingCfg(true);
    setError(null);
    setOkMessage(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertsWhatsappTo: waTo.trim(), alertsEmailTo: emailTo.trim() }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "No pudimos guardar la configuración");
      setOkMessage("Configuración de notificaciones guardada.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSavingCfg(false);
    }
  }

  async function sendNow() {
    setSending(true);
    setError(null);
    setOkMessage(null);
    try {
      const res = await fetch("/api/admin/alerts", { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "No pudimos enviar");
      const r = json.data;
      if (r.total === 0) setOkMessage("No hay alertas para enviar en este momento.");
      else setOkMessage(`Enviado (${r.total} alertas) — WhatsApp: ${r.whatsapp}, Email: ${r.email}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSending(false);
    }
  }

  if (loading) return <div className="flex items-center justify-center py-32"><AdminSpinner /></div>;

  return (
    <div className="mx-auto max-w-[1100px]">
      <div>
        <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Alertas</h1>
        <p className="mt-2 text-[14px] font-medium text-slate-700">Cobranzas vencidas, stock bajo y aprobaciones pendientes.</p>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}
      {okMessage && <div className="mt-5"><AdminAlert tone="success">{okMessage}</AdminAlert></div>}

      <AdminPanel className="mt-6 p-5">
        <div className="flex items-center gap-2"><Bell className="size-[18px] text-brand" /><h2 className="font-display text-[16px] font-bold text-slate-950">Notificaciones automáticas</h2></div>
        <p className="mt-1.5 text-[12.5px] text-slate-600">Recibí un resumen diario de estas alertas. Dejá un campo vacío para no usar ese canal. El envío automático corre cada mañana.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <AdminField label="WhatsApp (con código país, ej: 5493416684350)" htmlFor="wa-to"><AdminInput id="wa-to" value={waTo} onChange={(e) => setWaTo(e.target.value)} placeholder="5493416684350" /></AdminField>
          <AdminField label="Email" htmlFor="email-to"><AdminInput id="email-to" type="email" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} placeholder="vos@empresa.com" /></AdminField>
        </div>
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <AdminButton variant="secondary" size="sm" onClick={() => void sendNow()} disabled={sending}><Send />{sending ? "Enviando..." : "Probar ahora"}</AdminButton>
          <AdminButton size="sm" onClick={() => void saveConfig()} disabled={savingCfg}><Save />{savingCfg ? "Guardando..." : "Guardar"}</AdminButton>
        </div>
      </AdminPanel>

      {data && data.counts.total === 0 && (
        <AdminPanel className="mt-6 p-10 text-center">
          <CheckCircle2 className="mx-auto size-12 text-emerald-500" />
          <p className="mt-4 text-[16px] font-bold text-slate-950">Todo en orden</p>
          <p className="mt-1 text-[13px] text-slate-600">No hay alertas operativas en este momento.</p>
        </AdminPanel>
      )}

      {data && data.counts.total > 0 && (
        <div className="mt-6 grid gap-6">
          {/* Facturas vencidas */}
          {data.overdueInvoices.length > 0 && (
            <AdminPanel className="overflow-hidden">
              <div className="flex items-center gap-2 border-b border-slate-300 px-5 py-4">
                <Clock className="size-5 text-red-600" />
                <h2 className="font-display text-[17px] font-bold text-slate-950">Cobranzas vencidas</h2>
                <span className="ml-1 rounded-full bg-red-100 px-2 py-0.5 text-[12px] font-bold text-red-700">{data.overdueInvoices.length}</span>
              </div>
              <div>
                {data.overdueInvoices.map((inv) => (
                  <Link key={inv.id} href={`/admin/invoices/${inv.id}`} className="grid gap-2 border-b border-slate-200 px-5 py-3.5 last:border-0 hover:bg-slate-50 lg:grid-cols-[.9fr_1.3fr_.7fr_.7fr] lg:items-center">
                    <span className="font-mono text-[12.5px] font-bold text-brand">{inv.number}</span>
                    <span className="truncate text-[13px] text-slate-800">{inv.receiverName}</span>
                    <span className="text-[13px] font-bold text-slate-950">{money(inv.currency, inv.pending)}</span>
                    <span className="text-right text-[12px] font-bold text-red-600">{inv.daysOverdue} días vencida</span>
                  </Link>
                ))}
              </div>
            </AdminPanel>
          )}

          {/* Stock bajo */}
          {data.lowStock.length > 0 && (
            <AdminPanel className="overflow-hidden">
              <div className="flex items-center gap-2 border-b border-slate-300 px-5 py-4">
                <Boxes className="size-5 text-amber-600" />
                <h2 className="font-display text-[17px] font-bold text-slate-950">Stock bajo</h2>
                <span className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-[12px] font-bold text-amber-700">{data.lowStock.length}</span>
              </div>
              <div>
                {data.lowStock.map((item) => (
                  <div key={`${item.productId}-${item.warehouseName}`} className="grid gap-2 border-b border-slate-200 px-5 py-3.5 last:border-0 lg:grid-cols-[1.4fr_.9fr_.6fr_.6fr] lg:items-center">
                    <span className="truncate text-[13px] font-bold text-slate-950">{item.productName}{item.sku && <span className="ml-2 font-mono text-[11px] text-slate-500">{item.sku}</span>}</span>
                    <span className="text-[12.5px] text-slate-600">{item.warehouseName}</span>
                    <span className="text-[13px] font-bold text-amber-700">{item.quantity.toLocaleString("es-AR")} u.</span>
                    <span className="text-right text-[12px] text-slate-500">repone en {item.reorderPoint.toLocaleString("es-AR")}</span>
                  </div>
                ))}
              </div>
            </AdminPanel>
          )}

          {/* Aprobaciones pendientes */}
          {data.pendingApprovals.length > 0 && (
            <AdminPanel className="overflow-hidden">
              <div className="flex items-center gap-2 border-b border-slate-300 px-5 py-4">
                <ShieldAlert className="size-5 text-sky-600" />
                <h2 className="font-display text-[17px] font-bold text-slate-950">Órdenes de compra a aprobar</h2>
                <span className="ml-1 rounded-full bg-sky-100 px-2 py-0.5 text-[12px] font-bold text-sky-700">{data.pendingApprovals.length}</span>
              </div>
              <div>
                {data.pendingApprovals.map((po) => (
                  <Link key={po.id} href={`/admin/purchase-orders/${po.id}`} className="grid gap-2 border-b border-slate-200 px-5 py-3.5 last:border-0 hover:bg-slate-50 lg:grid-cols-[.9fr_1.3fr_.7fr]">
                    <span className="font-mono text-[12.5px] font-bold text-brand">{po.number}</span>
                    <span className="truncate text-[13px] text-slate-800">{po.supplierName}</span>
                    <span className="text-right text-[13px] font-bold text-slate-950">{money(po.currency, po.total)}</span>
                  </Link>
                ))}
              </div>
            </AdminPanel>
          )}
        </div>
      )}
    </div>
  );
}
