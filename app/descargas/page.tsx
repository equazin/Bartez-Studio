"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { 
  type LucideIcon,
  Download, 
  FileText, 
  Lock, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  Server, 
  Laptop, 
  Network, 
  ShieldCheck 
} from "lucide-react";
import { track } from "../../components/Analytics";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#06140d] px-4 py-3 text-[14px] text-white outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15 placeholder-slate-500";

interface Resource {
  id: string;
  title: string;
  category: string;
  description: string;
  fileSize: string;
  icon: LucideIcon;
  fileUrl: string;
}

const resources: Resource[] = [
  {
    id: "catalogo-general",
    title: "Catálogo General Mayorista B2B",
    category: "Catálogo",
    description: "Accedé al listado completo de marcas y líneas de productos que distribuimos a nivel nacional.",
    fileSize: "4.2 MB",
    icon: FileText,
    fileUrl: "/catalogo.pdf"
  },
  {
    id: "brochure-servers",
    title: "Brochure de Servidores e Infraestructura",
    category: "Infraestructura",
    description: "Detalles sobre servidores Dell PowerEdge, HP ProLiant, configuraciones de virtualización y datacenters.",
    fileSize: "2.8 MB",
    icon: Server,
    fileUrl: "/brochure-servidores-bartez.pdf"
  },
  {
    id: "brochure-fleet",
    title: "Brochure de Equipamiento & Flotas Corporativas",
    category: "Equipamiento",
    description: "Propuestas de leasing, renting y fleet management de notebooks Lenovo ThinkPad y Dell Latitude.",
    fileSize: "1.9 MB",
    icon: Laptop,
    fileUrl: "/brochure-flotas-bartez.pdf"
  },
  {
    id: "brochure-networking",
    title: "Brochure de Redes y Conectividad WiFi 6",
    category: "Redes",
    description: "Soluciones de switches Cisco, firewalls Fortinet y cableado estructurado certificado.",
    fileSize: "2.1 MB",
    icon: Network,
    fileUrl: "/brochure-redes-bartez.pdf"
  },
  {
    id: "guia-rma",
    title: "Instructivo de Garantías y Proceso RMA",
    category: "Soporte",
    description: "Manual detallado paso a paso para la solicitud, validación y envío de equipamiento bajo garantía oficial.",
    fileSize: "1.2 MB",
    icon: ShieldCheck,
    fileUrl: "/instructivo-rma-bartez.pdf"
  }
];

export default function Descargas() {
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    empresa: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.empresa) {
      setError("Completá todos los campos para continuar.");
      return;
    }

    setLoading(true);
    setError("");

    track("downloads_optin_submitted", { empresa: form.empresa });

    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empresa: form.empresa,
          nombre: form.nombre,
          email: form.email,
          tipoConsulta: "descarga-recursos",
          mensaje: "Acceso desbloqueado al Centro de Descargas.",
          origen: "downloads-center",
          canalPreferido: "email",
        }),
      });
      setUnlocked(true);
    } catch {
      // Dejar ingresar incluso si la API de leads falla para no arruinar UX
      setUnlocked(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (resId: string) => {
    track("resource_downloaded", { resourceId: resId });
  };

  return (
    <>
      <Navbar />
      <main className="bg-[#030c07] min-h-screen pt-32 pb-24 text-white">
        <div className="mx-auto max-w-[1100px] px-6">
          
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-accent">
              Recursos Técnicos y Comerciales
            </span>
            <h1 className="mt-3 font-display text-[clamp(30px,4.2vw,48px)] font-bold leading-tight tracking-[-0.03em] text-white">
              Centro de Descargas
            </h1>
            <p className="mt-3 text-[16px] text-slate-400 max-w-[55ch] mx-auto">
              Accedé a nuestros folletos oficiales, fichas de producto e instructivos de soporte postventa en formato PDF de descarga directa.
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            
            {/* Listado de archivos */}
            <div className="space-y-4">
              <h2 className="text-[17px] font-bold text-white mb-2">Fichas y folletos disponibles</h2>
              
              {resources.map(res => {
                const Icon = res.icon;
                return (
                  <div 
                    key={res.id} 
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl border border-white/5 bg-[#082214] shadow-glow"
                  >
                    <div className="flex gap-4">
                      <span className="flex size-12 items-center justify-center rounded-xl bg-accent/10 text-accent flex-none">
                        <Icon size={22} />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[11px] font-semibold text-accent">
                            {res.category}
                          </span>
                          <span className="text-[11.5px] text-slate-400 font-medium">
                            {res.fileSize}
                          </span>
                        </div>
                        <h3 className="text-[15px] font-bold text-white mt-1.5">{res.title}</h3>
                        <p className="text-[13px] text-slate-400 mt-1 leading-normal">
                          {res.description}
                        </p>
                      </div>
                    </div>

                    <div className="w-full sm:w-auto flex-none">
                      {unlocked ? (
                        <a
                          href={res.fileUrl}
                          download
                          onClick={() => handleDownload(res.id)}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-[13px] font-bold text-ink transition hover:scale-[1.02]"
                        >
                          <Download size={14} /> Descargar PDF
                        </a>
                      ) : (
                        <button
                          disabled
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-[13px] font-semibold text-slate-500 cursor-not-allowed"
                        >
                          <Lock size={13} /> Bloqueado
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Formulario lateral de desbloqueo */}
            <div>
              {unlocked ? (
                <div className="rounded-2xl border border-accent/20 bg-accent/10 p-6 text-center shadow-glow">
                  <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent/20 text-accent">
                    <CheckCircle2 size={24} />
                  </span>
                  <h3 className="mt-4 font-display text-[18px] font-bold text-white">¡Acceso concedido!</h3>
                  <p className="mt-2 text-[13px] text-slate-300 leading-relaxed">
                    Ya podés hacer clic en los botones de descarga de la lista de la izquierda para obtener cualquiera de los archivos PDF de forma directa.
                  </p>
                  <div className="mt-5 border-t border-white/10 pt-4">
                    <span className="text-[12px] text-slate-400 block">¿Buscás equipar tu empresa?</span>
                    <Link 
                      href="/#cotiza" 
                      className="mt-2 inline-flex items-center gap-1 text-[13px] font-bold text-accent hover:underline"
                    >
                      Solicitar presupuesto a medida <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/5 bg-[#082214] p-6 md:p-8 shadow-glow">
                  <div className="flex gap-2.5 items-start">
                    <Lock className="text-accent mt-0.5 flex-none" size={18} />
                    <div>
                      <h3 className="font-display text-[18px] font-bold text-white">Desbloquear descargas</h3>
                      <p className="mt-1 text-[13px] text-slate-400 leading-normal">
                        Ingresá tus datos corporativos para habilitar la descarga inmediata de todos los folletos de nuestra distribuidora.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <label className="block">
                      <span className="mb-1 block text-[12.5px] font-semibold text-slate-300">Nombre de contacto</span>
                      <input
                        required
                        value={form.nombre}
                        onChange={e => setForm(prev => ({ ...prev, nombre: e.target.value }))}
                        className={inputClass}
                        placeholder="Ej: Sofía Martínez"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1 block text-[12.5px] font-semibold text-slate-300">Email Corporativo</span>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                        className={inputClass}
                        placeholder="Ej: smartinez@empresa.com"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1 block text-[12.5px] font-semibold text-slate-300">Empresa / Razón Social</span>
                      <input
                        required
                        value={form.empresa}
                        onChange={e => setForm(prev => ({ ...prev, empresa: e.target.value }))}
                        className={inputClass}
                        placeholder="Ej: Distribuidora Norte S.R.L."
                      />
                    </label>

                    {error && (
                      <p className="text-[12.5px] text-red-400 font-semibold">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-[14px] font-bold text-ink transition hover:scale-[1.02] disabled:opacity-60"
                    >
                      {loading ? (
                        <><Loader2 size={15} className="animate-spin" /> Procesando...</>
                      ) : (
                        <>
                          Desbloquear folletos PDF <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </form>

                  <p className="mt-4 text-[11.5px] text-slate-500 text-center leading-normal">
                    Tu dirección de correo será utilizada únicamente para procesar tu solicitud. Sin spam corporativo.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
