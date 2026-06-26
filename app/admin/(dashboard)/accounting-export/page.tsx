"use client";

import { useMemo, useState } from "react";
import { Download, FileSpreadsheet } from "lucide-react";
import { AdminButton, AdminField, AdminInput, AdminPanel } from "../../../../components/admin/AdminUI";

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default function AccountingExportPage() {
  const today = useMemo(() => new Date(), []);
  const defaultFrom = useMemo(() => {
    const date = new Date(today);
    date.setDate(date.getDate() - 30);
    return isoDate(date);
  }, [today]);

  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(isoDate(today));

  const href = useMemo(() => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    return `/api/admin/accounting-export?${params.toString()}`;
  }, [from, to]);

  return (
    <div className="mx-auto max-w-[860px]">
      <div>
        <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Export contable</h1>
        <p className="mt-2 text-[14px] font-medium text-slate-700">CSV consolidado de cuentas corrientes, proveedores y tesoreria.</p>
      </div>

      <AdminPanel className="mt-6 p-6">
        <div className="flex items-start gap-4">
          <div className="grid size-11 place-items-center rounded-lg border border-slate-300 bg-slate-50 text-brand">
            <FileSpreadsheet className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-[18px] font-bold text-slate-950">Libro de movimientos</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <AdminField label="Desde" htmlFor="export-from"><AdminInput id="export-from" type="date" value={from} onChange={(event) => setFrom(event.target.value)} /></AdminField>
              <AdminField label="Hasta" htmlFor="export-to"><AdminInput id="export-to" type="date" value={to} onChange={(event) => setTo(event.target.value)} /></AdminField>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <AdminButton asChild><a href={href} download><Download />Descargar CSV</a></AdminButton>
              <p className="text-[12.5px] font-medium text-slate-600">Incluye ventas, compras y movimientos de caja dentro del rango.</p>
            </div>
          </div>
        </div>
      </AdminPanel>
    </div>
  );
}
