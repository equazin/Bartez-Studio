"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, Eye, FileText, GripVertical, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import type { BodyBlock } from "../../../../lib/admin-schema";
import { AdminAlert, AdminButton, AdminField, AdminInput, AdminPagination, AdminPanel, AdminSearch, AdminSpinner, AdminTextarea, AdminToggle, ConfirmDialog, StatusBadge, useDebouncedValue } from "../../../../components/admin/AdminUI";
import { ImageUpload } from "../../../../components/admin/ImageUpload";

type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  cover: string;
  metaDescription: string;
  readingTime: string;
  body: BodyBlock[];
  published: boolean;
  updatedAt: string;
};

const emptyPost: Omit<Post, "id" | "slug" | "updatedAt"> = {
  title: "",
  excerpt: "",
  date: new Date().toISOString().slice(0, 10),
  cover: "/photos/products/server.jpg",
  metaDescription: "",
  readingTime: "5 min",
  body: [{ p: "" }],
  published: true,
};

export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Partial<Post> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [blocks, setBlocks] = useState<BodyBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;
  const debouncedSearch = useDebouncedValue(search, 300);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (debouncedSearch) params.set("q", debouncedSearch);
      const response = await fetch(`/api/admin/posts?${params.toString()}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "No pudimos cargar los artículos.");
      setPosts(data.posts);
      setTotal(data.meta?.total ?? data.posts.length);
    } catch (loadError) {
      setError((loadError as Error).message);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);
  useEffect(() => { setPage(1); }, [debouncedSearch]);

  function createPost() {
    setEditing(emptyPost);
    setBlocks(emptyPost.body);
    setIsNew(true);
    setError("");
  }

  function editPost(post: Post) {
    setEditing(post);
    setBlocks(Array.isArray(post.body) ? post.body : []);
    setIsNew(false);
    setError("");
  }

  function cancel() {
    setEditing(null);
    setBlocks([]);
    setError("");
  }

  function update<K extends keyof Post>(key: K, value: Post[K]) {
    setEditing((current) => current ? { ...current, [key]: value } : current);
  }

  function updateBlock(index: number, value: string) {
    setBlocks((current) => current.map((block, blockIndex) =>
      blockIndex !== index ? block : "p" in block ? { p: value } : { h: value }
    ));
  }

  function moveBlock(index: number, offset: -1 | 1) {
    setBlocks((current) => {
      const target = index + offset;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(isNew ? "/api/admin/posts" : `/api/admin/posts/${editing.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editing.title,
          excerpt: editing.excerpt,
          date: editing.date,
          cover: editing.cover,
          metaDescription: editing.metaDescription,
          readingTime: editing.readingTime,
          published: editing.published,
          bodyContent: blocks,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.issues?.[0]?.message || data.error || "No pudimos guardar.");
      cancel();
      await load();
    } catch (saveError) {
      setError((saveError as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!deleteTarget) return;
    const response = await fetch(`/api/admin/posts/${deleteTarget.id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      setError(data.error || "No pudimos eliminar el artículo.");
      return;
    }
    setDeleteTarget(null);
    if (editing?.id === deleteTarget.id) cancel();
    await load();
  }

  if (editing) {
    return (
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col gap-5 border-b border-slate-300 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <button onClick={cancel} className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-brand hover:text-brand-bright"><ArrowLeft className="size-4" /> Volver a artículos</button>
            <h1 className="mt-2 font-display text-[clamp(26px,3vw,34px)] font-bold tracking-[-0.035em] text-slate-950">{isNew ? "Nuevo artículo" : "Editar artículo"}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {!isNew && editing.slug ? (
              <AdminButton asChild variant="secondary"><Link href={`/recursos/${editing.slug}${editing.published ? "" : "?preview=1"}`} target="_blank"><Eye />Vista previa</Link></AdminButton>
            ) : null}
            <AdminButton variant="secondary" onClick={cancel}><X />Cancelar</AdminButton>
            <AdminButton onClick={() => void save()} disabled={saving}><Save />{saving ? "Guardando…" : "Guardar cambios"}</AdminButton>
          </div>
        </div>

        {error ? <div className="mt-5"><AdminAlert>{error}</AdminAlert></div> : null}

        <div className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <AdminPanel className="p-5 sm:p-6">
            <div className="flex flex-col gap-5">
              <AdminField label="Título" htmlFor="post-title" hint={`${editing.title?.length || 0} / 120`}>
                <AdminInput id="post-title" value={editing.title || ""} onChange={(event) => update("title", event.target.value)} maxLength={120} />
              </AdminField>
              <AdminField label="Resumen" htmlFor="post-excerpt" hint={`${editing.excerpt?.length || 0} / 320`}>
                <AdminTextarea id="post-excerpt" value={editing.excerpt || ""} onChange={(event) => update("excerpt", event.target.value)} maxLength={320} rows={3} />
              </AdminField>

              <div className="border-t border-slate-300 pt-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div><h2 className="text-[14px] font-bold text-slate-950">Contenido</h2><p className="mt-1 text-[12px] text-slate-600">Ordená párrafos y subtítulos.</p></div>
                  <div className="flex gap-2">
                    <AdminButton variant="secondary" size="sm" onClick={() => setBlocks((current) => [...current, { p: "" }])}><Plus />Párrafo</AdminButton>
                    <AdminButton variant="secondary" size="sm" onClick={() => setBlocks((current) => [...current, { h: "" }])}><Plus />Subtítulo</AdminButton>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  {blocks.map((block, index) => {
                    const paragraph = "p" in block;
                    return (
                      <div key={index} className="grid grid-cols-[32px_minmax(0,1fr)_auto] items-start gap-2 rounded-lg border border-slate-300 bg-white p-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/10">
                        <span className="grid size-8 place-items-center text-slate-400"><GripVertical className="size-4" /></span>
                        {paragraph ? (
                          <AdminTextarea aria-label={`Párrafo ${index + 1}`} value={block.p} onChange={(event) => updateBlock(index, event.target.value)} className="min-h-20 border-0 bg-transparent p-2 shadow-none focus:ring-0" placeholder="Escribí el párrafo…" />
                        ) : (
                          <AdminInput aria-label={`Subtítulo ${index + 1}`} value={block.h} onChange={(event) => updateBlock(index, event.target.value)} className="border-0 bg-transparent shadow-none focus:ring-0" placeholder="Escribí el subtítulo…" />
                        )}
                        <div className="flex flex-col">
                          <button className="grid size-7 place-items-center rounded text-slate-600 hover:bg-white" onClick={() => moveBlock(index, -1)} disabled={index === 0} aria-label="Mover arriba"><ArrowUp className="size-3.5" /></button>
                          <button className="grid size-7 place-items-center rounded text-slate-600 hover:bg-white" onClick={() => moveBlock(index, 1)} disabled={index === blocks.length - 1} aria-label="Mover abajo"><ArrowDown className="size-3.5" /></button>
                          <button className="grid size-7 place-items-center rounded text-red-600 hover:bg-red-50" onClick={() => setBlocks((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label="Eliminar bloque"><Trash2 className="size-3.5" /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="border-t border-slate-300 pt-5">
                <AdminField label="Imagen de portada" htmlFor="post-cover" hint="Formato recomendado: 1200 × 630 px."><ImageUpload value={editing.cover} onChange={(url) => update("cover", url)} label="Cambiar portada" /></AdminField>
              </div>
            </div>
          </AdminPanel>

          <div className="flex flex-col gap-5">
            <AdminPanel className="p-5">
              <h2 className="font-display text-[16px] font-bold text-slate-950">Publicación</h2>
              <div className="mt-5 flex flex-col gap-4">
                <AdminToggle id="post-published" label="Visible en el sitio" checked={Boolean(editing.published)} onCheckedChange={(value) => update("published", value)} />
                <AdminField label="Fecha" htmlFor="post-date"><AdminInput id="post-date" type="date" value={editing.date || ""} onChange={(event) => update("date", event.target.value)} /></AdminField>
                <AdminField label="Tiempo de lectura" htmlFor="post-reading"><AdminInput id="post-reading" value={editing.readingTime || ""} onChange={(event) => update("readingTime", event.target.value)} maxLength={30} /></AdminField>
              </div>
            </AdminPanel>
            <AdminPanel className="p-5">
              <h2 className="font-display text-[16px] font-bold text-slate-950">SEO</h2>
              <div className="mt-5 flex flex-col gap-4">
                <AdminField label="Meta descripción" htmlFor="post-meta" hint={`${editing.metaDescription?.length || 0} / 180`}><AdminTextarea id="post-meta" value={editing.metaDescription || ""} onChange={(event) => update("metaDescription", event.target.value)} maxLength={180} rows={4} /></AdminField>
              </div>
            </AdminPanel>
            {!isNew ? <AdminButton variant="danger" onClick={() => setDeleteTarget(editing as Post)}><Trash2 />Eliminar artículo</AdminButton> : null}
          </div>
        </div>
        <ConfirmDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)} title="Eliminar artículo" description="Esta acción elimina el artículo de forma permanente y lo retira del sitio público." onConfirm={() => void remove()} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1240px]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="font-display text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.035em] text-slate-950">Artículos</h1><p className="mt-2 text-[14px] font-medium text-slate-700">Guías y recursos publicados en el sitio.</p></div>
        <AdminButton onClick={createPost}><Plus />Nuevo artículo</AdminButton>
      </div>
      {error ? <div className="mt-5"><AdminAlert>{error}</AdminAlert></div> : null}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <AdminSearch value={search} onChange={setSearch} placeholder="Buscar por título…" />
      </div>
      <AdminPanel className="mt-4 overflow-hidden">
        {loading ? <div className="grid min-h-48 place-items-center"><AdminSpinner label="Cargando artículos…" /></div> : posts.length === 0 ? (
          <div className="grid min-h-56 place-items-center p-8 text-center"><div><FileText className="mx-auto size-8 text-slate-300" /><p className="mt-4 text-[14px] font-semibold text-slate-950">{debouncedSearch ? "No encontramos artículos para esa búsqueda." : "No hay artículos todavía."}</p>{!debouncedSearch ? <AdminButton className="mt-5" onClick={createPost}><Plus />Crear el primero</AdminButton> : null}</div></div>
        ) : (
          <div>
            <div className="hidden grid-cols-[minmax(0,1fr)_150px_120px_90px] gap-4 border-b border-slate-300 bg-slate-100 px-5 py-3 text-[12px] font-semibold text-slate-700 md:grid"><span>Contenido</span><span>Fecha</span><span>Estado</span><span className="text-right">Acciones</span></div>
            {posts.map((post) => (
              <div key={post.id} className="grid gap-3 border-b border-slate-200 px-5 py-4 last:border-0 md:grid-cols-[minmax(0,1fr)_150px_120px_90px] md:items-center md:gap-4">
                <div className="min-w-0"><p className="truncate text-[13.5px] font-bold text-slate-950">{post.title}</p><p className="mt-1 truncate text-[12px] text-slate-600">/recursos/{post.slug}</p></div>
                <time className="text-[12px] font-medium text-slate-700">{new Date(post.date).toLocaleDateString("es-AR")}</time>
                <div><StatusBadge active={post.published} /></div>
                <div className="flex justify-end gap-1">
                  <AdminButton variant="ghost" size="icon" onClick={() => editPost(post)} aria-label="Editar"><Pencil /></AdminButton>
                  <AdminButton variant="ghost" size="icon" onClick={() => setDeleteTarget(post)} aria-label="Eliminar"><Trash2 /></AdminButton>
                </div>
              </div>
            ))}
            <AdminPagination page={page} limit={limit} total={total} onPageChange={setPage} />
          </div>
        )}
      </AdminPanel>
      <ConfirmDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)} title="Eliminar artículo" description="Esta acción elimina el artículo de forma permanente." onConfirm={() => void remove()} />
    </div>
  );
}
