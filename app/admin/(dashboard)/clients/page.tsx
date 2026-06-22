"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Upload, 
  Loader, 
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";

type ClientLogo = {
  id: number;
  name: string;
  logoUrl: string;
  displayOrder: number;
  active: boolean;
};

export default function AdminClients() {
  const [clients, setClients] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New Client Form state
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [formError, setFormError] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/clients");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setClients(data.clients);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setFormError(null);

    try {
      const res = await fetch(`/api/admin/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setLogoUrl(data.url);
    } catch (err) {
      setFormError(`Error al subir el logo: ${(err as Error).message}`);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !logoUrl) {
      setFormError("Nombre y logo son requeridos");
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          logoUrl,
          displayOrder: parseInt(displayOrder, 10) || 0,
          active: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setName("");
      setLogoUrl("");
      setDisplayOrder("0");
      fetchClients();
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (client: ClientLogo) => {
    try {
      const res = await fetch(`/api/admin/clients/${client.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !client.active }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchClients();
    } catch (err) {
      alert(`Error al actualizar estado: ${(err as Error).message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que querés eliminar esta marca/cliente?")) return;
    try {
      const res = await fetch(`/api/admin/clients/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchClients();
    } catch (err) {
      alert(`Error al eliminar: ${(err as Error).message}`);
    }
  };

  if (loading && clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader size={36} className="animate-spin text-accent" />
        <span className="text-slate-400">Cargando marcas y logos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-white/5 pb-5">
        <h1 className="font-display text-[26px] font-bold text-white tracking-tight">Logos de Clientes</h1>
        <p className="mt-1.5 text-[14px] text-slate-400 font-medium">Subí y organizá las marcas que se muestran en el carrusel de partners.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-[14px] text-red-400">
          <AlertCircle size={16} className="shrink-0" />
          <span>Error: {error}</span>
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-3">
        {/* Form panel */}
        <div className="rounded-2xl border border-white/5 bg-[#0C2014] p-6 h-fit space-y-5">
          <h2 className="text-[16px] font-semibold text-white">Agregar marca</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3.5 text-[13px] text-red-400">
                <AlertCircle size={15} />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[12.5px] font-medium text-slate-300">Nombre de la empresa</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="ej: Lenovo, Cisco"
                className="w-full rounded-xl border border-white/5 bg-[#08180E] px-4 py-2.5 text-[14px] text-white outline-none focus:border-accent/40"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[12.5px] font-medium text-slate-300">Orden de visualización</label>
              <input
                type="number"
                required
                value={displayOrder}
                onChange={e => setDisplayOrder(e.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-white/5 bg-[#08180E] px-4 py-2.5 text-[14px] text-white outline-none focus:border-accent/40"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[12.5px] font-medium text-slate-300">Archivo de logo</label>
              {logoUrl ? (
                <div className="flex items-center gap-3.5 p-3 rounded-xl border border-white/5 bg-[#08180E]">
                  <div className="relative h-11 w-16 bg-white/5 rounded p-1 border border-white/5 flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logoUrl} alt="Logo" className="max-h-full max-w-full object-contain filter brightness-90 grayscale" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setLogoUrl("")}
                    className="text-[12px] font-semibold text-red-400 hover:text-red-300"
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploadingLogo}
                  />
                  <label
                    htmlFor="logo-upload"
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
                        <span>Subir imagen</span>
                      </>
                    )}
                  </label>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting || uploadingLogo}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-accent py-3 text-center text-[13.5px] font-semibold text-[#050F0A] hover:bg-sky focus:outline-none disabled:opacity-50 transition-all"
            >
              {submitting ? (
                <Loader size={16} className="animate-spin text-[#050F0A]" />
              ) : (
                <Plus size={16} />
              )}
              Agregar marca
            </button>
          </form>
        </div>

        {/* List panel */}
        <div className="md:col-span-2 rounded-2xl border border-white/5 bg-[#0C2014] overflow-hidden shadow-soft">
          {clients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Plus size={40} className="text-slate-700 mb-3" />
              <h3 className="text-[15.5px] font-semibold text-slate-300">No hay logos subidos</h3>
              <p className="mt-1 text-[13px] text-slate-500 max-w-[28ch]">
                Subí las marcas oficiales que tu distribuidora ofrece para mostrarlas en la home.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {clients.map((client) => (
                <div key={client.id} className="flex items-center justify-between p-5 hover:bg-white/[0.01] transition-colors">
                  <div className="flex items-center gap-5">
                    {/* logo container, white background to display dark logos correctly */}
                    <div className="h-12 w-20 bg-white rounded-lg p-1.5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={client.logoUrl} alt={client.name} className="max-h-full max-w-full object-contain filter grayscale" />
                    </div>
                    <div>
                      <h3 className="text-[14.5px] font-semibold text-white">{client.name}</h3>
                      <span className="text-[12px] text-slate-500">Posición: {client.displayOrder}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleActive(client)}
                      className={`p-2 rounded-xl border transition-all ${
                        client.active 
                          ? "border-emerald/20 bg-emerald/5 text-emerald hover:bg-emerald/15" 
                          : "border-white/10 text-slate-500 hover:bg-white/5"
                      }`}
                      title={client.active ? "Ocultar en la web" : "Mostrar en la web"}
                    >
                      {client.active ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="p-2 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-xl transition-all"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
