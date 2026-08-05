"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Laptop,
  Monitor,
  MonitorCog,
  Server,
  MessageCircle,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface Option {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  ideal: string;
  scale: string;
  strengths: string[];
  consider: string;
}

const options: Option[] = [
  {
    id: "notebook",
    name: "Notebook corporativa",
    icon: Laptop,
    color: "#0046EA",
    ideal: "Movilidad y puestos híbridos",
    scale: "1 a 200+ equipos",
    strengths: ["Movilidad", "Bajo consumo", "Despliegue por flota"],
    consider: "Puertos, autonomía, peso y garantía aplicable",
  },
  {
    id: "desktop",
    name: "PC de escritorio",
    icon: Monitor,
    color: "#7c3aed",
    ideal: "Puestos fijos y administrativos",
    scale: "1 a 200+ equipos",
    strengths: ["Costo por puesto", "Mantenimiento", "Ampliación"],
    consider: "Espacio, monitor, periféricos y consumo",
  },
  {
    id: "workstation",
    name: "Workstation",
    icon: MonitorCog,
    color: "#ff8f1f",
    ideal: "Diseño, ingeniería y cálculo",
    scale: "1 a 50+ equipos",
    strengths: ["Rendimiento sostenido", "GPU profesional", "Memoria ampliable"],
    consider: "Software, certificaciones y carga real",
  },
  {
    id: "server",
    name: "Servidor",
    icon: Server,
    color: "#0ea5ff",
    ideal: "Aplicaciones, datos y virtualización",
    scale: "Por carga y crecimiento",
    strengths: ["Centralización", "Redundancia", "Administración"],
    consider: "Usuarios, almacenamiento, backup y continuidad",
  },
];

export default function ComparadorPage() {
  const [selected, setSelected] = useState(["notebook", "desktop"]);
  const compared = useMemo(
    () => options.filter((o) => selected.includes(o.id)),
    [selected],
  );

  function toggle(id: string) {
    setSelected((cur) =>
      cur.includes(id)
        ? cur.filter((i) => i !== id)
        : cur.length < 3
          ? [...cur, id]
          : cur,
    );
  }

  const whatsappHref = buildWhatsAppUrl("quote", [
    "Origen: comparador web",
    `Alternativas comparadas: ${compared.map((i) => i.name).join(", ")}`,
  ]);

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-white">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#070a16] pb-16 pt-24 text-white md:pb-20 md:pt-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(0,70,234,0.25),transparent)]" />
          <div className="relative mx-auto max-w-[1100px] px-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[12px] font-semibold text-blue-200">
              <span className="size-1.5 rounded-full bg-[#ff8f1f]" />
              Herramienta de decisión
            </span>
            <h1 className="mt-5 max-w-[780px] font-display text-[clamp(32px,5vw,52px)] font-semibold leading-[1.05] tracking-[-0.035em]">
              Comparador orientativo
            </h1>
            <p className="mt-4 max-w-[58ch] text-[16px] leading-relaxed text-slate-300">
              Elegí hasta tres familias de equipos. La comparación ayuda a
              ordenar la decisión; la configuración final depende de usuarios,
              software, escala y presupuesto.
            </p>
          </div>
        </section>

        {/* Selector */}
        <section className="relative -mt-6 pb-6">
          <div className="mx-auto max-w-[1100px] px-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
              <p className="mb-4 text-[13px] font-bold uppercase tracking-[0.08em] text-slate-500">
                Seleccioná hasta 3 familias
              </p>
              <div className="flex flex-wrap gap-2">
                {options.map((option) => {
                  const active = selected.includes(option.id);
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => toggle(option.id)}
                      aria-pressed={active}
                      className={`inline-flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 text-[13px] font-bold transition ${
                        active
                          ? "border-[#0046EA] bg-[#0046EA] text-white shadow-glow"
                          : "border-slate-100 text-slate-700 hover:border-slate-200"
                      }`}
                    >
                      <Icon size={17} />
                      {option.name}
                      {active && <Check size={15} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Comparison cards */}
        <section className="pb-16 pt-6">
          <div className="mx-auto max-w-[1100px] px-6">
            <div
              className={`grid gap-5 ${compared.length === 1 ? "max-w-[480px]" : compared.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}
            >
              {compared.map((option) => {
                const Icon = option.icon;
                return (
                  <article
                    key={option.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:shadow-card"
                  >
                    <span
                      className="grid size-11 place-items-center rounded-xl"
                      style={{
                        backgroundColor: `${option.color}15`,
                        color: option.color,
                      }}
                    >
                      <Icon size={22} />
                    </span>

                    <h2 className="mt-4 font-display text-[20px] font-semibold tracking-[-0.02em] text-[#11142a]">
                      {option.name}
                    </h2>

                    <dl className="mt-5 space-y-4 text-[13px]">
                      <div>
                        <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                          Ideal para
                        </dt>
                        <dd className="mt-1 font-medium text-slate-700">
                          {option.ideal}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                          Escala orientativa
                        </dt>
                        <dd className="mt-1 font-medium text-slate-700">
                          {option.scale}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                          Fortalezas
                        </dt>
                        <dd className="mt-2 flex flex-wrap gap-1.5">
                          {option.strengths.map((s) => (
                            <span
                              key={s}
                              className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                              style={{
                                backgroundColor: `${option.color}12`,
                                color: option.color,
                              }}
                            >
                              {s}
                            </span>
                          ))}
                        </dd>
                      </div>
                      <div className="border-t border-slate-100 pt-3">
                        <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                          Antes de elegir
                        </dt>
                        <dd className="mt-1 leading-relaxed text-slate-600">
                          {option.consider}
                        </dd>
                      </div>
                    </dl>
                  </article>
                );
              })}
            </div>

            {/* Inline CTA */}
            <div className="mt-10 flex flex-col items-center gap-5 rounded-2xl border border-slate-200 bg-[#f7f9fc] p-8 text-center sm:flex-row sm:text-left">
              <div className="flex-1">
                <h2 className="font-display text-[20px] font-semibold text-[#11142a]">
                  Llevá esta comparación a una cotización
                </h2>
                <p className="mt-1 text-[13.5px] text-slate-500">
                  El mensaje incluirá las alternativas seleccionadas para que un
                  asesor te oriente.
                </p>
              </div>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-none items-center gap-2 rounded-xl bg-[linear-gradient(90deg,#ff7a18,#ff8f1f,#ffb000)] px-6 py-3.5 text-[14px] font-bold text-white shadow-[0_18px_32px_-18px_rgba(255,122,24,0.85)] transition hover:-translate-y-0.5"
              >
                <MessageCircle size={17} /> Consultar por WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* CTA dark */}
        <section className="bg-[#070a16] py-16 text-white md:py-20">
          <div className="mx-auto flex max-w-[900px] flex-col items-center px-6 text-center">
            <h2 className="font-display text-[clamp(26px,4vw,42px)] font-semibold leading-[1.06] tracking-[-0.03em] text-balance">
              ¿Necesitás ayuda para definir el equipamiento?
            </h2>
            <p className="mt-4 max-w-[54ch] text-[15px] leading-relaxed text-slate-300">
              Un especialista analiza tu escenario y propone la mejor
              combinación de equipos, marcas y condiciones.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(90deg,#ff7a18,#ff8f1f,#ffb000)] px-6 py-3.5 text-[14px] font-bold text-white shadow-[0_18px_32px_-18px_rgba(255,122,24,0.85)] transition hover:-translate-y-0.5"
              >
                <MessageCircle size={17} /> Hablar con un asesor
              </a>
              <a
                href="/configurador"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-3.5 text-[14px] font-bold text-white transition hover:bg-white/5"
              >
                Usar el configurador <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
