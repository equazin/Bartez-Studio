"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Download, FileText, Lock, Loader2 } from "lucide-react";
import { track } from "../Analytics";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#030c07] px-4 py-3 text-[14px] text-white outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15 placeholder-slate-500";

export function CatalogDownload() {
  const [step, setStep] = useState<"form" | "loading" | "done">("form");
  const [email, setEmail] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !empresa) {
      setError("Completá empresa y email para descargar.");
      return;
    }
    setError("");
    setStep("loading");
    track("catalog_download_requested", { empresa });

    // Registrar lead con origen catálogo
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empresa,
          email,
          tipoConsulta: "descarga-catalogo",
          mensaje: "Descarga de catálogo desde el sitio web.",
          origen: "catalog-download",
          canalPreferido: "email",
        }),
      });
    } catch {
      // Continuar aunque falle el registro — no bloquear la descarga
    }

    setStep("done");
  }

  return (
    <section className="bg-[#06140d] py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid gap-10 rounded-3xl border border-white/5 bg-[#082214] p-8 md:grid-cols-[1fr_1.2fr] md:p-10 lg:p-14">
          {/* Descripción */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3.5 py-1.5 mb-5">
              <FileText className="size-3.5 text-accent" />
              <span className="text-[12px] font-semibold text-accent">Catálogo de productos</span>
            </div>
            <h2 className="font-display text-[clamp(24px,3vw,36px)] font-bold leading-[1.1] tracking-[-0.035em] text-white">
              Descargá nuestro catálogo completo.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-400">
              Accedé al portfolio completo de productos que distribuimos: notebooks, servidores, redes, workstations, periféricos y más. Actualizado con las principales líneas de Dell, Lenovo, HP, Cisco y otras marcas líderes.
            </p>

            <ul className="mt-7 grid gap-3">
              {[
                "Notebooks corporativas y gamer",
                "Servidores y storage",
                "Redes e infraestructura",
                "Workstations y PCs armadas",
                "Periféricos y accesorios",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-[13.5px] text-slate-400">
                  <span className="size-1.5 rounded-full bg-accent flex-none" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex items-center gap-2 text-[12px] text-slate-400">
              <Lock className="size-3.5" />
              <span>Tu email solo se usa para enviarte el catálogo. Sin spam.</span>
            </div>
          </div>

          {/* Formulario / Estado */}
          <div className="flex items-center">
            {step === "done" ? (
              <div className="w-full rounded-2xl bg-[#030c07] border border-white/10 p-8 text-center">
                <span className="mx-auto grid size-16 place-items-center rounded-full bg-accent/10 text-accent">
                  <Download size={28} />
                </span>
                <h3 className="mt-5 font-display text-[22px] font-bold text-white">¡Listo!</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-slate-400">
                  Tu descarga comenzará automáticamente. Si no inicia,{" "}
                  <a
                    href="/catalogo.pdf"
                    download
                    className="font-semibold text-accent hover:underline"
                  >
                    hacé clic aquí.
                  </a>
                </p>
                <a
                  href="/catalogo.pdf"
                  download="Bartez-Catalogo.pdf"
                  onClick={() => track("catalog_downloaded")}
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-[14px] font-bold text-ink transition-all hover:scale-[1.02] hover:bg-[#10b981]"
                >
                  <Download size={16} /> Descargar catálogo PDF
                </a>
                <p className="mt-4 text-[12px] text-slate-400">
                  ¿Necesitás asesoramiento?{" "}
                  <Link href="/#cotiza" className="font-semibold text-accent hover:underline">
                    Escribinos
                  </Link>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div>
                  <h3 className="font-display text-[20px] font-bold text-white">
                    Accedé al catálogo completo
                  </h3>
                  <p className="mt-1.5 text-[13px] text-slate-400">
                    Dejá tu empresa y email — descarga inmediata, sin costo.
                  </p>
                </div>

                <label>
                  <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-350 font-display">Empresa</span>
                  <input
                    required
                    value={empresa}
                    onChange={(e) => setEmpresa(e.target.value)}
                    className={inputClass}
                    placeholder="Nombre de la empresa"
                  />
                </label>

                <label>
                  <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-350 font-display">Email corporativo</span>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="nombre@empresa.com"
                  />
                </label>

                {error && (
                  <p className="rounded-lg bg-red-950/40 border border-red-500/20 px-4 py-2.5 text-[13px] text-red-200">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={step === "loading"}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-[14.5px] font-bold text-ink transition-all hover:scale-[1.02] hover:bg-[#10b981] disabled:opacity-60"
                >
                  {step === "loading" ? (
                    <><Loader2 size={17} className="animate-spin" /> Preparando descarga...</>
                  ) : (
                    <><Download size={17} /> Descargar catálogo gratis <ArrowRight size={15} /></>
                  )}
                </button>

                <p className="text-center text-[11.5px] text-slate-400">
                  También podés{" "}
                  <Link href="/#cotiza" className="font-semibold text-accent hover:underline">
                    pedir una cotización personalizada
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
