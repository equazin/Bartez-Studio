"use client";

import { useState, useEffect } from "react";
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  Check, 
  X, 
  Upload, 
  MoveUp, 
  MoveDown,
  Loader,
  AlertCircle
} from "lucide-react";

type BodyBlock = { p: string } | { h: string };

type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  cover: string;
  metaDescription: string;
  readingTime: string;
  body: any; // BodyBlock[]
  published: boolean;
};

export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form/Editor state
  const [editingPost, setEditingPost] = useState<Partial<Post> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  // Blocks for body
  const [blocks, setBlocks] = useState<BodyBlock[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/posts");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPosts(data.posts);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setIsNew(false);
    // Parse body blocks
    setBlocks(Array.isArray(post.body) ? post.body : []);
    setFormError(null);
  };

  const handleCreateNew = () => {
    setEditingPost({
      title: "",
      excerpt: "",
      date: new Date().toISOString().split("T")[0],
      cover: "/photos/products/server.jpg",
      metaDescription: "",
      readingTime: "5 min",
      published: true,
    });
    setIsNew(true);
    setBlocks([{ p: "Empezá a escribir tu artículo acá..." }]);
    setFormError(null);
  };

  const handleCancel = () => {
    setEditingPost(null);
    setBlocks([]);
    setFormError(null);
  };

  const handleSave = async () => {
    if (!editingPost) return;
    setFormError(null);
    setSaving(true);

    const payload = {
      title: editingPost.title,
      excerpt: editingPost.excerpt,
      date: editingPost.date,
      cover: editingPost.cover,
      metaDescription: editingPost.metaDescription,
      readingTime: editingPost.readingTime,
      published: editingPost.published,
      bodyContent: blocks,
    };

    try {
      const url = isNew ? "/api/admin/posts" : `/api/admin/posts/${editingPost.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setEditingPost(null);
      fetchPosts();
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que querés eliminar este artículo?")) return;
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchPosts();
    } catch (err) {
      alert(`Error al eliminar: ${(err as Error).message}`);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    setFormError(null);

    try {
      const res = await fetch(`/api/admin/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setEditingPost(curr => curr ? { ...curr, cover: data.url } : null);
    } catch (err) {
      setFormError(`Error al subir la imagen: ${(err as Error).message}`);
    } finally {
      setUploadingCover(false);
    }
  };

  // Block management
  const addBlock = (type: "p" | "h") => {
    if (type === "p") {
      setBlocks(curr => [...curr, { p: "" }]);
    } else {
      setBlocks(curr => [...curr, { h: "" }]);
    }
  };

  const updateBlock = (index: number, val: string) => {
    setBlocks(curr => curr.map((b, idx) => {
      if (idx !== index) return b;
      return "p" in b ? { p: val } : { h: val };
    }));
  };

  const removeBlock = (index: number) => {
    setBlocks(curr => curr.filter((_, idx) => idx !== index));
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === blocks.length - 1) return;

    const newBlocks = [...blocks];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIdx];
    newBlocks[targetIdx] = temp;
    setBlocks(newBlocks);
  };

  if (loading && posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader size={36} className="animate-spin text-accent" />
        <span className="text-slate-400">Cargando artículos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-5">
        <div>
          <h1 className="font-display text-[26px] font-bold text-white tracking-tight">Artículos (Recursos)</h1>
          <p className="mt-1.5 text-[14px] text-slate-400">Administrá las guías técnicas expuestas en la sección de blog/recursos.</p>
        </div>
        {!editingPost && (
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-[13.5px] font-semibold text-[#050F0A] hover:bg-sky transition-colors active:scale-95"
          >
            <Plus size={16} /> Crear Artículo
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-[14px] text-red-400">
          <AlertCircle size={16} className="shrink-0" />
          <span>Error: {error}</span>
        </div>
      )}

      {/* Editor view */}
      {editingPost ? (
        <div className="rounded-2xl border border-white/5 bg-[#0C2014] p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-[17px] font-bold text-white">
              {isNew ? "Crear nuevo artículo" : "Editar artículo"}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 hover:bg-white/5 px-4 py-2 text-[13px] font-semibold text-slate-300 transition-colors"
              >
                <X size={15} /> Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 rounded-xl bg-accent text-[#050F0A] hover:bg-sky px-4 py-2 text-[13px] font-semibold transition-colors disabled:opacity-55"
              >
                {saving ? <Loader size={15} className="animate-spin text-[#050F0A]" /> : <Check size={15} />} Guardar Cambios
              </button>
            </div>
          </div>

          {formError && (
            <div className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-[14px] text-red-400">
              <AlertCircle size={16} />
              <span>{formError}</span>
            </div>
          )}

          {/* Form fields */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-slate-300">Título del Artículo</label>
                <input
                  type="text"
                  value={editingPost.title || ""}
                  onChange={e => setEditingPost(curr => ({ ...curr, title: e.target.value }))}
                  placeholder="ej: Cómo configurar tu servidor..."
                  className="w-full rounded-xl border border-white/5 bg-[#08180E] px-4 py-2.5 text-[14px] text-white outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-medium text-slate-300">Fecha de publicación</label>
                <input
                  type="date"
                  value={editingPost.date || ""}
                  onChange={e => setEditingPost(curr => ({ ...curr, date: e.target.value }))}
                  className="w-full rounded-xl border border-white/5 bg-[#08180E] px-4 py-2.5 text-[14px] text-white outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-medium text-slate-300">Tiempo de lectura</label>
                <input
                  type="text"
                  value={editingPost.readingTime || ""}
                  onChange={e => setEditingPost(curr => ({ ...curr, readingTime: e.target.value }))}
                  placeholder="ej: 5 min"
                  className="w-full rounded-xl border border-white/5 bg-[#08180E] px-4 py-2.5 text-[14px] text-white outline-none focus:border-accent/40"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-medium text-slate-300">Meta Descripción (SEO)</label>
                <textarea
                  value={editingPost.metaDescription || ""}
                  onChange={e => setEditingPost(curr => ({ ...curr, metaDescription: e.target.value }))}
                  rows={2}
                  placeholder="Escribí una meta descripción de 150 caracteres para Google..."
                  className="w-full rounded-xl border border-white/5 bg-[#08180E] px-4 py-2.5 text-[14.5px] text-white outline-none focus:border-accent/40 resize-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-slate-300">Resumen corto (Excerpt)</label>
                <textarea
                  value={editingPost.excerpt || ""}
                  onChange={e => setEditingPost(curr => ({ ...curr, excerpt: e.target.value }))}
                  rows={2}
                  placeholder="Se muestra en las tarjetas de la grilla del blog..."
                  className="w-full rounded-xl border border-white/5 bg-[#08180E] px-4 py-2.5 text-[14.5px] text-white outline-none focus:border-accent/40 resize-none"
                />
              </div>

              {/* Cover upload */}
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-slate-300">Imagen de portada</label>
                <div className="flex gap-4 items-center">
                  <div className="relative h-20 w-32 rounded-xl bg-slate-800 overflow-hidden border border-white/10 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={editingPost.cover || ""} alt="Portada preview" className="h-full w-full object-cover" />
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="file"
                      id="cover-upload"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploadingCover}
                    />
                    <label
                      htmlFor="cover-upload"
                      className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 hover:border-accent/40 hover:bg-accent/5 p-4 text-[13.5px] text-slate-300 cursor-pointer transition-all"
                    >
                      {uploadingCover ? (
                        <>
                          <Loader size={16} className="animate-spin text-accent" />
                          <span>Subiendo imagen...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={16} className="text-slate-400" />
                          <span>Subir nueva imagen</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <input
                  type="checkbox"
                  id="published-chk"
                  checked={editingPost.published || false}
                  onChange={e => setEditingPost(curr => curr ? { ...curr, published: e.target.checked } : null)}
                  className="h-4 w-4 accent-accent rounded"
                />
                <label htmlFor="published-chk" className="text-[14.5px] font-medium text-slate-200 cursor-pointer select-none">
                  Publicado (visible en el sitio web)
                </label>
              </div>
            </div>
          </div>

          {/* Block builder for body content */}
          <div className="space-y-4 pt-6 border-t border-white/5">
            <div className="flex items-center justify-between">
              <h3 className="text-[15.5px] font-semibold text-white">Contenido del artículo</h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => addBlock("p")}
                  className="flex items-center gap-1.5 rounded-lg border border-sky/20 bg-sky/5 hover:bg-sky/15 text-[12.5px] font-semibold text-sky px-3 py-1.5 transition-colors"
                >
                  <Plus size={14} /> Párrafo
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("h")}
                  className="flex items-center gap-1.5 rounded-lg border border-accent/20 bg-accent/5 hover:bg-accent/15 text-[12.5px] font-semibold text-accent px-3 py-1.5 transition-colors"
                >
                  <Plus size={14} /> Subtítulo
                </button>
              </div>
            </div>

            {/* Block list */}
            <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-2">
              {blocks.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-white/5 rounded-xl text-slate-500 text-[13.5px]">
                  El artículo no tiene bloques de contenido. Añadí un párrafo o subtítulo arriba.
                </div>
              ) : (
                blocks.map((block, idx) => {
                  const isParagraph = "p" in block;
                  const value = isParagraph ? block.p : block.h;
                  return (
                    <div key={idx} className="flex gap-3.5 items-start p-3 bg-[#08180E] rounded-xl border border-white/5 hover:border-white/10 group">
                      <div className="flex flex-col text-[11px] font-bold px-2 py-1 rounded bg-slate-800 tracking-wide select-none">
                        {isParagraph ? "PÁRRAFO" : "SUBTÍTULO"}
                      </div>
                      
                      <div className="flex-1">
                        {isParagraph ? (
                          <textarea
                            value={value}
                            onChange={e => updateBlock(idx, e.target.value)}
                            rows={3}
                            placeholder="Escribí el texto de este párrafo..."
                            className="w-full bg-transparent text-[14.5px] leading-relaxed text-slate-200 outline-none resize-none placeholder:text-slate-700"
                          />
                        ) : (
                          <input
                            type="text"
                            value={value}
                            onChange={e => updateBlock(idx, e.target.value)}
                            placeholder="Escribí el título de esta sección..."
                            className="w-full bg-transparent text-[15.5px] font-bold text-white outline-none placeholder:text-slate-700"
                          />
                        )}
                      </div>

                      {/* Reorder and Delete controls */}
                      <div className="flex items-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => moveBlock(idx, "up")}
                          disabled={idx === 0}
                          className="p-1 hover:bg-white/5 text-slate-400 rounded disabled:opacity-20"
                        >
                          <MoveUp size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveBlock(idx, "down")}
                          disabled={idx === blocks.length - 1}
                          className="p-1 hover:bg-white/5 text-slate-400 rounded disabled:opacity-20"
                        >
                          <MoveDown size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeBlock(idx)}
                          className="p-1 hover:bg-red-500/10 text-red-400 rounded"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      ) : (
        /* List view */
        <div className="rounded-2xl border border-white/5 bg-[#0C2014] overflow-hidden shadow-soft">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FileText size={48} className="text-slate-700 mb-4" />
              <h3 className="text-[16px] font-semibold text-slate-300">No hay artículos publicados</h3>
              <p className="mt-1 text-[13.5px] text-slate-500 max-w-[32ch]">
                Creá tu primer artículo técnico para que aparezca en la sección de blog/recursos.
              </p>
              <button
                onClick={handleCreateNew}
                className="mt-5 flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-[13.5px] font-semibold text-[#050F0A] hover:bg-sky transition-colors"
              >
                <Plus size={16} /> Crear primer artículo
              </button>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {posts.map((post) => (
                <div key={post.id} className="flex items-center gap-5 p-6 hover:bg-white/[0.01] transition-colors">
                  {/* cover preview */}
                  <div className="relative h-16 w-24 rounded-lg bg-slate-800 overflow-hidden border border-white/10 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.cover} alt={post.title} className="h-full w-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3.5">
                      <span className="text-[12px] text-slate-500">{post.date}</span>
                      <span className="text-[12px] text-slate-500">• {post.readingTime}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${
                        post.published 
                          ? "bg-emerald/10 text-emerald border border-emerald/20" 
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {post.published ? "PUBLICADO" : "BORRADOR"}
                      </span>
                    </div>
                    <h3 className="mt-1.5 text-[16px] font-semibold text-white truncate">{post.title}</h3>
                    <p className="mt-1 text-[13.5px] text-slate-400 truncate">{post.excerpt}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`/recursos/${post.slug}`}
                      target="_blank"
                      className="p-2 hover:bg-white/5 text-slate-400 hover:text-slate-200 rounded-xl transition-colors"
                      title="Ver en la web"
                    >
                      <Eye size={17} />
                    </a>
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-2 hover:bg-white/5 text-slate-400 hover:text-slate-200 rounded-xl transition-colors"
                      title="Editar"
                    >
                      <Edit size={17} />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-xl transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
