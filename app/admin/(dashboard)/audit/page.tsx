"use client";

import { useCallback, useEffect, useState } from "react";
import { ScrollText } from "lucide-react";
import { AdminAlert, AdminPagination, AdminPanel, AdminSpinner } from "../../../../components/admin/AdminUI";

interface AuditEntry {
  id: number;
  action: string;
  entity: string;
  entityId: string;
  changes: Record<string, unknown> | null;
  adminUser: string;
  createdAt: string;
}

const actionColors: Record<string, string> = {
  create: "border-green-300 bg-green-50 text-green-900",
  update: "border-blue-300 bg-blue-50 text-blue-900",
  delete: "border-red-300 bg-red-50 text-red-900",
};

const entityLabels: Record<string, string> = {
  post: "Artículo",
  client: "Cliente",
  case: "Caso",
  conversation: "Conversación",
};

export default function AdminAudit() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 30;

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/audit?page=${page}&limit=${limit}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "No pudimos cargar la auditoría.");
      setEntries(data.entries);
      setTotal(data.meta?.total ?? data.entries.length);
    } catch (loadError) {
      setError((loadError as Error).message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);

  return (
    <div className="mx-auto max-w-[1240px]">
      <div>
        <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Auditoría</h1>
        <p className="mt-2 text-[14px] font-medium text-slate-700">Registro inmutable de cambios en el panel administrativo.</p>
      </div>
      {error ? <div className="mt-5"><AdminAlert>{error}</AdminAlert></div> : null}
      <AdminPanel className="mt-6 overflow-hidden">
        {loading ? (
          <div className="grid min-h-48 place-items-center"><AdminSpinner label="Cargando registros…" /></div>
        ) : entries.length === 0 ? (
          <div className="grid min-h-56 place-items-center p-8 text-center">
            <div>
              <ScrollText className="mx-auto size-8 text-slate-300" />
              <p className="mt-4 text-[14px] font-semibold text-slate-950">Sin registros de auditoría todavía.</p>
              <p className="mt-1 text-[12.5px] text-slate-600">Las acciones aparecerán acá a medida que se editen contenidos.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="hidden grid-cols-[150px_100px_120px_minmax(0,1fr)_140px] gap-4 border-b border-slate-300 bg-slate-100 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-700 md:grid">
              <span>Fecha</span><span>Acción</span><span>Entidad</span><span>Cambios</span><span>Usuario</span>
            </div>
            {entries.map((entry) => (
              <div key={entry.id} className="grid gap-2 border-b border-slate-200 px-5 py-3 last:border-0 md:grid-cols-[150px_100px_120px_minmax(0,1fr)_140px] md:items-center md:gap-4">
                <time className="text-[12px] font-medium text-slate-700">
                  {new Date(entry.createdAt).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })}
                </time>
                <span className={`inline-flex w-fit items-center rounded-md border px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em] ${actionColors[entry.action] ?? "border-slate-300 bg-slate-50 text-slate-800"}`}>
                  {entry.action}
                </span>
                <span className="text-[12.5px] font-semibold text-slate-900">
                  {entityLabels[entry.entity] ?? entry.entity} <span className="font-mono text-[11px] text-slate-500">#{entry.entityId}</span>
                </span>
                <span className="truncate font-mono text-[11.5px] text-slate-600">
                  {entry.changes ? JSON.stringify(entry.changes) : "—"}
                </span>
                <span className="text-[12px] font-medium text-slate-700">{entry.adminUser}</span>
              </div>
            ))}
            <AdminPagination page={page} limit={limit} total={total} onPageChange={setPage} />
          </>
        )}
      </AdminPanel>
    </div>
  );
}
