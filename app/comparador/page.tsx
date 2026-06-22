"use client";

import { useMemo, useState } from "react";
import { Check, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const options = [
  { id: "notebook", name: "Notebook corporativa", ideal: "Movilidad y puestos híbridos", scale: "1 a 200+ equipos", strengths: ["Movilidad", "Bajo consumo", "Despliegue por flota"], consider: "Puertos, autonomía, peso y garantía aplicable" },
  { id: "desktop", name: "PC de escritorio", ideal: "Puestos fijos y administrativos", scale: "1 a 200+ equipos", strengths: ["Costo por puesto", "Mantenimiento", "Ampliación"], consider: "Espacio, monitor, periféricos y consumo" },
  { id: "workstation", name: "Workstation", ideal: "Diseño, ingeniería y cálculo", scale: "1 a 50+ equipos", strengths: ["Rendimiento sostenido", "GPU profesional", "Memoria ampliable"], consider: "Software, certificaciones y carga real" },
  { id: "server", name: "Servidor", ideal: "Aplicaciones, datos y virtualización", scale: "Por carga y crecimiento", strengths: ["Centralización", "Redundancia", "Administración"], consider: "Usuarios, almacenamiento, backup y continuidad" },
];

export default function ComparadorPage() {
  const [selected, setSelected] = useState(["notebook", "desktop"]);
  const compared = useMemo(() => options.filter((option) => selected.includes(option.id)), [selected]);

  function toggle(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 3 ? [...current, id] : current);
  }

  const whatsappHref = buildWhatsAppUrl("quote", ["Origen: comparador web", `Alternativas comparadas: ${compared.map((item) => item.name).join(", ")}`]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pb-24 pt-32 text-slate-900">
        <div className="mx-auto max-w-[1100px] px-6">
          <h1 className="font-display text-[clamp(34px,5vw,56px)] font-bold tracking-[-0.045em]">Comparador orientativo</h1>
          <p className="mt-4 max-w-[65ch] text-[15px] leading-relaxed text-slate-600">Elegí hasta tres familias. La comparación sirve para ordenar la decisión; la configuración final depende de usuarios, software, escala y presupuesto.</p>

          <div className="mt-8 flex flex-wrap gap-2">
            {options.map((option) => {
              const active = selected.includes(option.id);
              return <button key={option.id} type="button" onClick={() => toggle(option.id)} aria-pressed={active} className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-[13px] font-semibold transition ${active ? "border-brand bg-brand text-white" : "border-slate-200 bg-white text-slate-700 hover:border-brand"}`}>{active ? <Check size={15} /> : null}{option.name}</button>;
            })}
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {compared.map((option) => (
              <article key={option.id} className="border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="font-display text-[20px] font-bold">{option.name}</h2>
                <dl className="mt-5 grid gap-4 text-[13px]">
                  <div><dt className="font-bold text-slate-500">Ideal para</dt><dd className="mt-1 text-slate-800">{option.ideal}</dd></div>
                  <div><dt className="font-bold text-slate-500">Escala orientativa</dt><dd className="mt-1 text-slate-800">{option.scale}</dd></div>
                  <div><dt className="font-bold text-slate-500">Fortalezas</dt><dd className="mt-2 flex flex-wrap gap-1.5">{option.strengths.map((item) => <span key={item} className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11.5px] font-semibold text-brand">{item}</span>)}</dd></div>
                  <div><dt className="font-bold text-slate-500">Antes de elegir</dt><dd className="mt-1 leading-relaxed text-slate-800">{option.consider}</dd></div>
                </dl>
              </article>
            ))}
          </div>

          <div className="mt-10 border border-slate-200 bg-white p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div><h2 className="font-display text-[20px] font-bold">Llevá esta comparación a una cotización</h2><p className="mt-1 text-[13px] text-slate-500">El mensaje incluirá las alternativas seleccionadas.</p></div>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-5 py-3 text-[14px] font-bold text-white sm:mt-0"><MessageCircle size={17} /> Consultar por WhatsApp</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
