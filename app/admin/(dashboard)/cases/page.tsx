"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, BriefcaseBusiness, Eye, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { AdminAlert, AdminButton, AdminField, AdminInput, AdminPanel, AdminSpinner, AdminTextarea, AdminToggle, ConfirmDialog, StatusBadge } from "../../../../components/admin/AdminUI";
import { ImageUpload } from "../../../../components/admin/ImageUpload";

type SuccessCase = {
  id: number;
  title: string;
  clientName: string;
  logoUrl: string | null;
  coverImage: string;
  description: string;
  metrics: string[];
  content: string;
  active: boolean;
  updatedAt: string;
};

const emptyCase = {
  title: "",
  clientName: "",
  logoUrl: "",
  coverImage: "/photos/datacenter.jpg",
  description: "",
  metrics: [] as string[],
  content: "",
  active: true,
};

export default function AdminCases() {
  const [items, setItems] = useState<SuccessCase[]>([]);
  const [editing, setEditing] = useState<Partial<SuccessCase> | null>(null);
  const [metrics, setMetrics] = useState<string[]>([]);
  const [metric, setMetric] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<SuccessCase | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/cases", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "No pudimos cargar los casos.");
      setItems(data.cases);
    } catch (loadError) {
      setError((loadError as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);

  function createItem() {
    setEditing(emptyCase);
    setMetrics([]);
    setIsNew(true);
    setError("");
  }

  function editItem(item: SuccessCase) {
    setEditing(item);
    setMetrics(Array.isArray(item.metrics) ? item.metrics : []);
    setIsNew(false);
    setError("");
  }

  function update<K extends keyof SuccessCase>(key: K, value: SuccessCase[K]) {
    setEditing((current) => current ? { ...current, [key]: value } : current);
  }

  function addMetric() {
    const clean = metric.trim();
    if (!clean || metrics.length >= 8) return;
    setMetrics((current) => [...current, clean]);
    setMetric("");
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(isNew ? "/api/admin/cases" : `/api/admin/cases/${editing.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editing.title,
          clientName: editing.clientName,
          logoUrl: editing.logoUrl || null,
          coverImage: editing.coverImage,
          description: editing.description,
          metrics,
          content: editing.content,
          active: editing.active,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.issues?.[0]?.message || data.error || "No pudimos guardar.");
      setEditing(null);
      await load();
    } catch (saveError) {
      setError((saveError as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function toggle(item: SuccessCase) {
    const response = await fetch(`/api/admin/cases/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !item.active }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) setError(data.error || "No pudimos actualizar el estado.");
    else await load();
  }

  async function remove() {
    if (!deleteTarget) return;
    const response = await fetch(`/api/admin/cases/${deleteTarget.id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      setError(data.error || "No pudimos eliminar el caso.");
      return;
    }
    setDeleteTarget(null);
    if (editing?.id === deleteTarget.id) setEditing(null);
    await load();
  }

  if (editing) {
    return (
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col gap-5 border-b border-slate-300 pb-5 md:flex-row md:items-center md:justify-between">
          <div><button onClick={() => setEditing(null)} className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-green-800 hover:text-green-950"><ArrowLeft className="size-4" /> Volver a casos</button><h1 className="mt-2 font-display text-[clamp(26px,3vw,34px)] font-bold tracking-[-0.035em] text-slate-950">{isNew ? "Nuevo caso" : "Editar caso"}</h1></div>
          <div className="flex flex-wrap gap-2">
            {!isNew && editing.id && editing.active ? <AdminButton asChild variant="secondary"><Link href={`/casos/${editing.id}`} target="_blank"><Eye />Vista previa</Link></AdminButton> : null}
            <AdminButton variant="secondary" onClick={() => setEditing(null)}><X />Cancelar</AdminButton>
            <AdminButton onClick={() => void save()} disabled={saving}><Save />{saving ? "Guardando…" : "Guardar cambios"}</AdminButton>
          </div>
        </div>
        {error ? <div className="mt-5"><AdminAlert>{error}</AdminAlert></div> : null}
        <div className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <AdminPanel className="p-5 sm:p-6">
            <div className="flex flex-col gap-5">
              <AdminField label="Título del caso" htmlFor="case-title"><AdminInput id="case-title" value={editing.title || ""} onChange={(event) => update("title", event.target.value)} maxLength={140} /></AdminField>
              <AdminField label="Cliente" htmlFor="case-client"><AdminInput id="case-client" value={editing.clientName || ""} onChange={(event) => update("clientName", event.target.value)} maxLength={100} /></AdminField>
              <AdminField label="Resumen" htmlFor="case-description" hint={`${editing.description?.length || 0} / 500`}><AdminTextarea id="case-description" value={editing.description || ""} onChange={(event) => update("description", event.target.value)} maxLength={500} rows={4} /></AdminField>
              <AdminField label="Desarrollo del caso" htmlFor="case-content" hint="Separá párrafos con una línea en blanco."><AdminTextarea id="case-content" value={editing.content || ""} onChange={(event) => update("content", event.target.value)} maxLength={12000} rows={12} /></AdminField>
              <AdminField label="Métricas verificadas" htmlFor="case-metric" hint="Máximo 8. Publicá únicamente resultados autorizados.">
                <div className="flex gap-2"><AdminInput id="case-metric" value={metric} onChange={(event) => setMetric(event.target.value)} maxLength={100} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addMetric(); } }} /><AdminButton type="button" variant="secondary" onClick={addMetric}><Plus />Agregar</AdminButton></div>
              </AdminField>
              {metrics.length > 0 ? <div className="flex flex-wrap gap-2">{metrics.map((item, index) => <button key={`${item}-${index}`} onClick={() => setMetrics((current) => current.filter((_, metricIndex) => metricIndex !== index))} className="inline-flex items-center gap-1.5 rounded-md border border-green-200 bg-green-50 px-2.5 py-1.5 text-[12px] font-semibold text-brand">{item}<X className="size-3.5" /></button>)}</div> : null}
            </div>
          </AdminPanel>
          <div className="flex flex-col gap-5">
            <AdminPanel className="p-5">
              <h2 className="font-display text-[16px] font-bold text-slate-950">Publicación</h2>
              <div className="mt-5"><AdminToggle id="case-active" label="Visible en el sitio" checked={Boolean(editing.active)} onCheckedChange={(value) => update("active", value)} /></div>
            </AdminPanel>
            <AdminPanel className="p-5">
              <h2 className="font-display text-[16px] font-bold text-slate-950">Imágenes</h2>
              <div className="mt-5 flex flex-col gap-5">
                <AdminField label="Portada" htmlFor="case-cover"><ImageUpload value={editing.coverImage} onChange={(url) => update("coverImage", url)} label="Subir portada" /></AdminField>
                <AdminField label="Logo del cliente (opcional)" htmlFor="case-logo"><ImageUpload compact value={editing.logoUrl} onChange={(url) => update("logoUrl", url)} label="Subir logo" /></AdminField>
              </div>
            </AdminPanel>
            {!isNew ? <AdminButton variant="danger" onClick={() => setDeleteTarget(editing as SuccessCase)}><Trash2 />Eliminar caso</AdminButton> : null}
          </div>
        </div>
        <ConfirmDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)} title="Eliminar caso" description="El caso se eliminará de forma permanente y dejará de estar disponible públicamente." onConfirm={() => void remove()} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1240px]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Casos de éxito</h1><p className="mt-2 text-[14px] font-medium text-slate-700">Experiencias reales publicadas únicamente con autorización.</p></div>
        <AdminButton onClick={createItem}><Plus />Nuevo caso</AdminButton>
      </div>
      {error ? <div className="mt-5"><AdminAlert>{error}</AdminAlert></div> : null}
      <AdminPanel className="mt-6 overflow-hidden">
        {loading ? <div className="grid min-h-48 place-items-center"><AdminSpinner label="Cargando casos…" /></div> : items.length === 0 ? (
          <div className="grid min-h-56 place-items-center p-8 text-center"><div><BriefcaseBusiness className="mx-auto size-8 text-slate-300" /><p className="mt-4 text-[14px] font-semibold text-slate-950">No hay casos cargados.</p><AdminButton className="mt-5" onClick={createItem}><Plus />Crear el primero</AdminButton></div></div>
        ) : items.map((item) => (
          <div key={item.id} className="grid gap-4 border-b border-slate-200 px-5 py-4 last:border-0 sm:grid-cols-[96px_minmax(0,1fr)_120px_110px] sm:items-center">
            <div className="h-16 w-24 overflow-hidden rounded-lg border border-slate-300 bg-slate-100"><Image src={item.coverImage} alt="" width={96} height={64} className="size-full object-cover" /></div>
            <div className="min-w-0"><p className="text-[11.5px] font-bold uppercase tracking-[0.08em] text-green-800">{item.clientName}</p><p className="mt-1 truncate text-[13.5px] font-bold text-slate-950">{item.title}</p><p className="mt-1 truncate text-[11.5px] font-medium text-slate-600">{item.description}</p></div>
            <button className="justify-self-start" onClick={() => void toggle(item)}><StatusBadge active={item.active} activeLabel="Publicado" inactiveLabel="Oculto" /></button>
            <div className="flex justify-end gap-1"><AdminButton variant="ghost" size="icon" onClick={() => editItem(item)} aria-label="Editar"><Pencil /></AdminButton><AdminButton variant="ghost" size="icon" onClick={() => setDeleteTarget(item)} aria-label="Eliminar"><Trash2 /></AdminButton></div>
          </div>
        ))}
      </AdminPanel>
      <ConfirmDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)} title="Eliminar caso" description="El caso se eliminará de forma permanente." onConfirm={() => void remove()} />
    </div>
  );
}
