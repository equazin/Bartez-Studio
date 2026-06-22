"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  Check, 
  X, 
  Upload, 
  Loader, 
  AlertCircle,
  EyeOff
} from "lucide-react";

type SuccessCase = {
  id: number;
  title: string;
  clientName: string;
  logoUrl: string | null;
  coverImage: string;
  description: string;
  metrics: any; // string[]
  content: string;
  active: boolean;
};

export default function AdminCases() {
  const [cases, setCases] = useState<SuccessCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [editingCase, setEditingCase] = useState<Partial<SuccessCase> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Metrics list state
  const [metrics, setMetrics] = useState<string[]>([]);
  const [newMetric, setNewMetric] = useState("");

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/cases");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCases(data.cases);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (c: SuccessCase) => {
    setEditingCase(c);
    setIsNew(false);
    setMetrics(Array.isArray(c.metrics) ? c.metrics : []);
    setFormError(null);
  };

  const handleCreateNew = () => {
    setEditingCase({
      title: "",
      clientName: "",
      logoUrl: "",
      coverImage: "/photos/products/server.jpg",
      description: "",
      content: "",
      active: true,
    });
    setIsNew(true);
    setMetrics([]);
    setFormError(null);
  };

  const handleCancel = () => {
    setEditingCase(null);
    setMetrics([]);
    setFormError(null);
  };

  const handleSave = async () => {
    if (!editingCase) return;
    setFormError(null);
    setSaving(true);

    const payload = {
      title: editingCase.title,
      clientName: editingCase.clientName,
      logoUrl: editingCase.logoUrl || null,
      coverImage: editingCase.coverImage,
      description: editingCase.description,
      metrics,
      content: editingCase.content,
      active: editingCase.active,
    };

    try {
      const url = isNew ? "/api/admin/cases" : `/api/admin/cases/${editingCase.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setEditingCase(null);
      fetchCases();
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que querés eliminar este caso de éxito?")) return;
    try {
      const res = await fetch(`/api/admin/cases/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchCases();
    } catch (err) {
      alert(`Error al eliminar: ${(err as Error).message}`);
    }
  };

  const handleToggleActive = async (c: SuccessCase) => {
    try {
      const res = await fetch(`/api/admin/cases/${c.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !c.active }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchCases();
    } catch (err) {
      alert(`Error al actualizar estado: ${(err as Error).message}`);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "cover" | "logo") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "cover") setUploadingCover(true);
    else setUploadingLogo(true);
    
    setFormError(null);

    try {
      const res = await fetch(`/api/admin/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setEditingCase(curr => {
        if (!curr) return null;
        return type === "cover" ? { ...curr, coverImage: data.url } : { ...curr, logoUrl: data.url };
      });
    } catch (err) {
      setFormError(`Error al subir imagen: ${(err as Error).message}`);
    } finally {
      if (type === "cover") setUploadingCover(false);
      else setUploadingLogo(false);
    }
  };

  // Metrics management
  const addMetric = () => {
    if (!newMetric.trim()) return;
    setMetrics(curr => [...curr, newMetric.trim()]);
    setNewMetric("");
  };

  const removeMetric = (index: number) => {
    setMetrics(curr => curr.filter((_, idx) => idx !== index));
  };

  if (loading && cases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader size={36} className="animate-spin text-accent" />
        <span className="text-slate-400">Cargando casos de éxito...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-5">
        <div>
          <h1 className="font-display text-[26px] font-bold text-white tracking-tight">Casos de Éxito</h1>
          <p className="mt-1.5 text-[14px] text-slate-400">Administrá las historias reales de transformación IT y sus métricas.</p>
        </div>
        {!editingCase && (
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-[13.5px] font-semibold text-[#050F0A] hover:bg-sky transition-colors active:scale-95"
          >
            <Plus size={16} /> Crear Caso de Éxito
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
      {editingCase ? (
        <div className="rounded-2xl border border-white/5 bg-[#0C2014] p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-[17px] font-bold text-white">
              {isNew ? "Crear nuevo caso" : "Editar caso de éxito"}
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
                <label className="text-[13px] font-medium text-slate-300">Título del Caso de Éxito</label>
                <input
                  type="text"
                  value={editingCase.title || ""}
                  onChange={e => setEditingCase(curr => ({ ...curr, title: e.target.value }))}
                  placeholder="ej: Renovación de Datacenter de Alta Disponibilidad"
                  className="w-full rounded-xl border border-white/5 bg-[#08180E] px-4 py-2.5 text-[14px] text-white outline-none focus:border-accent/40"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-medium text-slate-300">Nombre de la empresa cliente</label>
                <input
                  type="text"
                  value={editingCase.clientName || ""}
                  onChange={e => setEditingCase(curr => ({ ...curr, clientName: e.target.value }))}
                  placeholder="ej: Transportes Unidos SA"
                  className="w-full rounded-xl border border-white/5 bg-[#08180E] px-4 py-2.5 text-[14px] text-white outline-none focus:border-accent/40"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-medium text-slate-300">Descripción corta (Resumen)</label>
                <textarea
                  value={editingCase.description || ""}
                  onChange={e => setEditingCase(curr => ({ ...curr, description: e.target.value }))}
                  rows={3}
                  placeholder="Se muestra en la tarjeta resumen del caso de éxito..."
                  className="w-full rounded-xl border border-white/5 bg-[#08180E] px-4 py-2.5 text-[14.5px] text-white outline-none focus:border-accent/40 resize-none"
                />
              </div>

              {/* Cover upload */}
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-slate-300">Imagen de portada del proyecto</label>
                <div className="flex gap-4 items-center">
                  <div className="relative h-20 w-32 rounded-xl bg-slate-800 overflow-hidden border border-white/10 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={editingCase.coverImage || ""} alt="Portada preview" className="h-full w-full object-cover" />
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="file"
                      id="case-cover-upload"
                      accept="image/*"
                      onChange={e => handleFileUpload(e, "cover")}
                      className="hidden"
                      disabled={uploadingCover}
                    />
                    <label
                      htmlFor="case-cover-upload"
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
                          <span>Subir portada</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Client logo upload */}
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-slate-300">Logo del cliente (Opcional)</label>
                <div className="flex gap-4 items-center">
                  <div className="relative h-16 w-24 bg-white rounded-xl p-1.5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                    {editingCase.logoUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={editingCase.logoUrl} alt="Logo preview" className="max-h-full max-w-full object-contain filter grayscale" />
                    ) : (
                      <span className="text-[11px] text-slate-400">Sin logo</span>
                    )}
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="file"
                      id="case-logo-upload"
                      accept="image/*"
                      onChange={e => handleFileUpload(e, "logo")}
                      className="hidden"
                      disabled={uploadingLogo}
                    />
                    <label
                      htmlFor="case-logo-upload"
                      className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 hover:border-accent/40 hover:bg-accent/5 p-4 text-[13.5px] text-slate-300 cursor-pointer transition-all"
                    >
                      {uploadingLogo ? (
                        <>
                          <Loader size={16} className="animate-spin text-accent" />
                          <span>Subiendo logo...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={16} className="text-slate-400" />
                          <span>Subir logo</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Metrics builder */}
              <div className="space-y-3">
                <label className="text-[13px] font-medium text-slate-300">Métricas clave destacadas</label>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMetric}
                    onChange={e => setNewMetric(e.target.value)}
                    placeholder="ej: +35% velocidad de carga, 99.99% uptime"
                    className="flex-1 rounded-xl border border-white/5 bg-[#08180E] px-4 py-2 text-[13.5px] text-white outline-none focus:border-accent/40"
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addMetric())}
                  />
                  <button
                    type="button"
                    onClick={addMetric}
                    className="rounded-xl bg-accent text-[#050F0A] hover:bg-sky px-4 py-2 text-[13px] font-semibold transition-colors"
                  >
                    Agregar
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {metrics.map((m, idx) => (
                    <span 
                      key={idx} 
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[12px] text-white"
                    >
                      <span>{m}</span>
                      <button 
                        type="button" 
                        onClick={() => removeMetric(idx)}
                        className="text-red-400 hover:text-red-300 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-medium text-slate-300">Desarrollo detallado del caso</label>
                <textarea
                  value={editingCase.content || ""}
                  onChange={e => setEditingCase(curr => ({ ...curr, content: e.target.value }))}
                  rows={4}
                  placeholder="Detalles sobre el problema original, la solución implementada y los resultados..."
                  className="w-full rounded-xl border border-white/5 bg-[#08180E] px-4 py-2.5 text-[14.5px] text-slate-200 outline-none focus:border-accent/40"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="case-active-chk"
                  checked={editingCase.active || false}
                  onChange={e => setEditingCase(curr => curr ? { ...curr, active: e.target.checked } : null)}
                  className="h-4 w-4 accent-accent rounded"
                />
                <label htmlFor="case-active-chk" className="text-[14.5px] font-medium text-slate-200 cursor-pointer select-none">
                  Caso activo (visible en la Home)
                </label>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* List view */
        <div className="rounded-2xl border border-white/5 bg-[#0C2014] overflow-hidden shadow-soft">
          {cases.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Plus size={44} className="text-slate-700 mb-3.5" />
              <h3 className="text-[16px] font-semibold text-slate-300">No hay casos de éxito</h3>
              <p className="mt-1 text-[13.5px] text-slate-500 max-w-[32ch]">
                Publicá historias de transformaciones e implementaciones IT reales que validen tu capacidad ante clientes nuevos.
              </p>
              <button
                onClick={handleCreateNew}
                className="mt-5 flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-[13.5px] font-semibold text-[#050F0A] hover:bg-sky transition-colors"
              >
                <Plus size={16} /> Crear primer caso
              </button>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {cases.map((c) => (
                <div key={c.id} className="flex items-center gap-5 p-6 hover:bg-white/[0.01] transition-colors">
                  {/* cover preview */}
                  <div className="relative h-16 w-24 rounded-lg bg-slate-800 overflow-hidden border border-white/10 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.coverImage} alt={c.title} className="h-full w-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] font-semibold text-accent uppercase tracking-wider">{c.clientName}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${
                        c.active 
                          ? "bg-emerald/10 text-emerald border border-emerald/20" 
                          : "bg-slate-700 text-slate-400"
                      }`}>
                        {c.active ? "ACTIVO" : "OCULTO"}
                      </span>
                    </div>
                    <h3 className="mt-1.5 text-[16px] font-semibold text-white truncate">{c.title}</h3>
                    <p className="mt-1 text-[13.5px] text-slate-400 truncate">{c.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(c)}
                      className={`p-2 rounded-xl border transition-all ${
                        c.active 
                          ? "border-emerald/20 bg-emerald/5 text-emerald hover:bg-emerald/15" 
                          : "border-white/10 text-slate-500 hover:bg-white/5"
                      }`}
                      title={c.active ? "Ocultar" : "Mostrar"}
                    >
                      {c.active ? <Eye size={17} /> : <EyeOff size={17} />}
                    </button>
                    <button
                      onClick={() => handleEdit(c)}
                      className="p-2 hover:bg-white/5 text-slate-400 hover:text-slate-200 rounded-xl transition-colors"
                      title="Editar"
                    >
                      <Edit size={17} />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
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
