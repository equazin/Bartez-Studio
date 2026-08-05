"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Plus, Save, Trash2 } from "lucide-react";
import {
  AdminAlert,
  AdminButton,
  AdminField,
  AdminInput,
  AdminPagination,
  AdminPanel,
  AdminSearch,
  AdminSpinner,
  AdminTextarea,
  AdminToggle,
  ConfirmDialog,
  useDebouncedValue,
} from "../../../../components/admin/AdminUI";

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  tags: string[] | null;
  published: boolean;
  views: number;
  updatedAt: string;
  author: { id: string; name: string } | null;
}

type Editing = Partial<Article> & { title: string; slug: string; body?: string };

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function KnowledgePage() {
  const [items, setItems] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const limit = 20;
  const [editing, setEditing] = useState<Editing | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (debouncedSearch) params.set("q", debouncedSearch);
      const res = await fetch(`/api/admin/knowledge?${params}`);
      if (!res.ok) throw new Error("Error al cargar");
      const json = await res.json();
      setItems(json.data);
      setTotal(json.meta.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setPage(1); }, [debouncedSearch]);

  async function loadOne(id: string) {
    const res = await fetch(`/api/admin/knowledge/${id}`);
    const json = await res.json();
    if (json.data) setEditing(json.data);
  }

  async function save() {
    if (!editing || !editing.title.trim() || !editing.slug.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const isNew = !editing.id;
      const payload = {
        title: editing.title,
        slug: editing.slug,
        body: editing.body || "",
        excerpt: editing.excerpt || null,
        category: editing.category || null,
        tags: editing.tags || [],
        published: editing.published !== false,
      };
      const res = await fetch(isNew ? "/api/admin/knowledge" : `/api/admin/knowledge/${editing.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Error al guardar");
      setEditing(null);
      void load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await fetch(`/api/admin/knowledge/${deleteTarget.id}`, { method: "DELETE" });
    setDeleteTarget(null);
    void load();
  }

  if (editing) {
    return (
      <div className="mx-auto max-w-[900px]">
        <div className="flex items-center justify-between">
          <button onClick={() => setEditing(null)} className="text-[13px] font-bold text-brand hover:underline">← Volver</button>
          <div className="flex gap-2">
            <AdminButton variant="secondary" onClick={() => setEditing(null)}>Cancelar</AdminButton>
            <AdminButton onClick={() => void save()} disabled={saving}><Save />{saving ? "Guardando…" : "Guardar"}</AdminButton>
          </div>
        </div>

        <h1 className="mt-3 font-display text-[clamp(26px,3vw,34px)] font-bold tracking-[-0.035em] text-slate-950">
          {editing.id ? "Editar artículo" : "Nuevo artículo"}
        </h1>

        {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

        <AdminPanel className="mt-6 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <AdminField label="Título *" htmlFor="k-title">
              <AdminInput id="k-title" value={editing.title} onChange={(e) => {
                const t = e.target.value;
                setEditing({ ...editing, title: t, slug: editing.id ? editing.slug : slugify(t) });
              }} />
            </AdminField>
            <AdminField label="Slug *" htmlFor="k-slug">
              <AdminInput id="k-slug" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
            </AdminField>
            <AdminField label="Categoría" htmlFor="k-cat">
              <AdminInput id="k-cat" value={editing.category || ""} onChange={(e) => setEditing({ ...editing, category: e.target.value || null })} />
            </AdminField>
            <AdminToggle id="k-pub" label="Publicado" checked={editing.published !== false} onCheckedChange={(v) => setEditing({ ...editing, published: v })} />
            <div className="sm:col-span-2">
              <AdminField label="Resumen" htmlFor="k-exc">
                <AdminTextarea id="k-exc" value={editing.excerpt || ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value || null })} rows={2} />
              </AdminField>
            </div>
            <div className="sm:col-span-2">
              <AdminField label="Contenido (markdown)" htmlFor="k-body">
                <AdminTextarea id="k-body" value={editing.body || ""} onChange={(e) => setEditing({ ...editing, body: e.target.value })} rows={14} />
              </AdminField>
            </div>
          </div>
        </AdminPanel>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Base de conocimiento</h1>
          <p className="mt-2 text-[14px] font-medium text-slate-700">Artículos de soporte reutilizables por el bot.</p>
        </div>
        <AdminButton onClick={() => setEditing({ title: "", slug: "", body: "", published: true })}><Plus />Nuevo artículo</AdminButton>
      </div>

      {error && <div className="mt-5"><AdminAlert tone="error">{error}</AdminAlert></div>}

      <div className="mt-6">
        <AdminSearch value={search} onChange={setSearch} placeholder="Buscar por título…" />
      </div>

      <AdminPanel className="mt-5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><AdminSpinner /></div>
        ) : items.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <BookOpen className="mx-auto size-10 text-slate-400" />
            <p className="mt-4 text-[14px] font-bold text-slate-950">No hay artículos.</p>
          </div>
        ) : (
          <div>
            {items.map((a) => (
              <div key={a.id} className="grid gap-2 border-b border-slate-200 px-5 py-4 last:border-0 sm:px-6 lg:grid-cols-[1.6fr_.6fr_.5fr_.4fr] lg:items-center lg:gap-3">
                <button onClick={() => void loadOne(a.id)} className="truncate text-left text-[13.5px] font-bold text-brand hover:underline">{a.title}</button>
                <p className="truncate text-[12.5px] text-slate-600">{a.category || "—"}</p>
                <p className="text-[12px] text-slate-600">{a.views} vistas {a.published ? "" : "· Borrador"}</p>
                <div className="flex gap-1">
                  <AdminButton variant="ghost" size="icon" onClick={() => setDeleteTarget(a)} aria-label="Eliminar"><Trash2 className="size-4 text-red-600" /></AdminButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminPanel>

      {total > limit && <AdminPagination page={page} total={total} limit={limit} onPageChange={setPage} />}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Eliminar artículo"
        description={`¿Eliminar "${deleteTarget?.title}"?`}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
