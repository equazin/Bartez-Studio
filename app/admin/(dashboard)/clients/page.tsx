"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Pencil, Plus, Save, ShieldCheck, Trash2, X } from "lucide-react";
import { AdminAlert, AdminButton, AdminField, AdminInput, AdminPanel, AdminSpinner, AdminToggle, ConfirmDialog, StatusBadge } from "../../../../components/admin/AdminUI";
import { ImageUpload } from "../../../../components/admin/ImageUpload";

type ClientLogo = {
  id: number;
  name: string;
  logoUrl: string;
  displayOrder: number;
  active: boolean;
  updatedAt: string;
};

const emptyLogo = { name: "", logoUrl: "", displayOrder: 0, active: true };

export default function AdminClients() {
  const [items, setItems] = useState<ClientLogo[]>([]);
  const [editing, setEditing] = useState<Partial<ClientLogo> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ClientLogo | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/clients", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "No pudimos cargar los logos.");
      setItems(data.clients);
    } catch (loadError) {
      setError((loadError as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);

  function createItem() {
    setEditing(emptyLogo);
    setIsNew(true);
    setError("");
  }

  function editItem(item: ClientLogo) {
    setEditing(item);
    setIsNew(false);
    setError("");
  }

  function update<K extends keyof ClientLogo>(key: K, value: ClientLogo[K]) {
    setEditing((current) => current ? { ...current, [key]: value } : current);
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(isNew ? "/api/admin/clients" : `/api/admin/clients/${editing.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editing.name,
          logoUrl: editing.logoUrl,
          displayOrder: editing.displayOrder,
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

  async function toggle(item: ClientLogo) {
    const response = await fetch(`/api/admin/clients/${item.id}`, {
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
    const response = await fetch(`/api/admin/clients/${deleteTarget.id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      setError(data.error || "No pudimos eliminar el logo.");
      return;
    }
    setDeleteTarget(null);
    if (editing?.id === deleteTarget.id) setEditing(null);
    await load();
  }

  if (editing) {
    return (
      <div className="mx-auto max-w-[980px]">
        <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div><button onClick={() => setEditing(null)} className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brand"><ArrowLeft className="size-4" /> Logos</button><h1 className="mt-3 font-display text-[clamp(28px,4vw,38px)] font-bold tracking-[-0.04em] text-ink">{isNew ? "Nuevo logo" : "Editar logo"}</h1></div>
          <div className="flex gap-2"><AdminButton variant="secondary" onClick={() => setEditing(null)}><X />Cancelar</AdminButton><AdminButton onClick={() => void save()} disabled={saving}><Save />{saving ? "Guardando…" : "Guardar"}</AdminButton></div>
        </div>
        {error ? <div className="mt-5"><AdminAlert>{error}</AdminAlert></div> : null}
        <div className="mt-6 grid items-start gap-5 md:grid-cols-[minmax(0,1fr)_300px]">
          <AdminPanel className="p-6">
            <h2 className="font-display text-[17px] font-bold text-ink">Identidad</h2>
            <div className="mt-6 flex flex-col gap-5">
              <AdminField label="Nombre de la empresa o marca" htmlFor="client-name"><AdminInput id="client-name" value={editing.name || ""} onChange={(event) => update("name", event.target.value)} maxLength={100} /></AdminField>
              <AdminField label="Archivo del logo" htmlFor="client-logo"><ImageUpload compact value={editing.logoUrl} onChange={(url) => update("logoUrl", url)} label="Subir logo" /></AdminField>
            </div>
          </AdminPanel>
          <div className="flex flex-col gap-5">
            <AdminPanel className="p-5">
              <h2 className="font-display text-[16px] font-bold text-ink">Visibilidad</h2>
              <div className="mt-5 flex flex-col gap-4">
                <AdminToggle id="client-active" label="Visible en el sitio" checked={Boolean(editing.active)} onCheckedChange={(value) => update("active", value)} />
                <AdminField label="Orden de aparición" htmlFor="client-order" hint="Los valores menores aparecen primero."><AdminInput id="client-order" type="number" min={0} max={10000} value={editing.displayOrder ?? 0} onChange={(event) => update("displayOrder", Number(event.target.value))} /></AdminField>
              </div>
            </AdminPanel>
            {!isNew ? <AdminButton variant="danger" onClick={() => setDeleteTarget(editing as ClientLogo)}><Trash2 />Eliminar logo</AdminButton> : null}
          </div>
        </div>
        <ConfirmDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)} title="Eliminar logo" description="El logo dejará de mostrarse en el sitio y se eliminará del panel." onConfirm={() => void remove()} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1180px]">
      <div className="flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div><h1 className="font-display text-[clamp(30px,4vw,42px)] font-bold tracking-[-0.04em] text-ink">Logos</h1><p className="mt-2 text-[14.5px] text-slate-600">Clientes y marcas que acompañan la prueba de confianza.</p></div>
        <AdminButton onClick={createItem}><Plus />Nuevo logo</AdminButton>
      </div>
      {error ? <div className="mt-5"><AdminAlert>{error}</AdminAlert></div> : null}
      <AdminPanel className="mt-6 overflow-hidden">
        {loading ? <div className="grid min-h-48 place-items-center"><AdminSpinner label="Cargando logos…" /></div> : items.length === 0 ? (
          <div className="grid min-h-56 place-items-center p-8 text-center"><div><ShieldCheck className="mx-auto size-8 text-slate-300" /><p className="mt-4 text-[14px] font-semibold text-ink">No hay logos cargados.</p><AdminButton className="mt-5" onClick={createItem}><Plus />Cargar el primero</AdminButton></div></div>
        ) : items.map((item) => (
          <div key={item.id} className="grid gap-4 border-b border-slate-100 px-5 py-4 last:border-0 sm:grid-cols-[84px_minmax(0,1fr)_110px_110px] sm:items-center">
            <div className="grid h-14 w-20 place-items-center overflow-hidden rounded-lg border border-slate-200 bg-white p-2"><Image src={item.logoUrl} alt="" width={72} height={48} className="max-h-full max-w-full object-contain grayscale" /></div>
            <div><p className="text-[13.5px] font-semibold text-ink">{item.name}</p><p className="mt-1 text-[11.5px] text-slate-500">Orden {item.displayOrder}</p></div>
            <button className="justify-self-start" onClick={() => void toggle(item)}><StatusBadge active={item.active} activeLabel="Activo" inactiveLabel="Inactivo" /></button>
            <div className="flex justify-end gap-1"><AdminButton variant="ghost" size="icon" onClick={() => editItem(item)} aria-label="Editar"><Pencil /></AdminButton><AdminButton variant="ghost" size="icon" onClick={() => setDeleteTarget(item)} aria-label="Eliminar"><Trash2 /></AdminButton></div>
          </div>
        ))}
      </AdminPanel>
      <ConfirmDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)} title="Eliminar logo" description="El logo dejará de mostrarse en el sitio y se eliminará del panel." onConfirm={() => void remove()} />
    </div>
  );
}
