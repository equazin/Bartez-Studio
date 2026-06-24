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
      <main className="min-h-screen bg-white pb-24 pt-20 text-slate-900">
        {/* Hero */}
        <section className="border-b border-slate-200 bg-white py-16 md:py-20">
          <div className="mx-auto max-w-[1100px] px-6">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[12px] font-semibold text-[#1236d8]">
              <span className="size-1.5 rounded-full bg-[#ff8f1f]" />
              Herramienta de decisión
            </div>
            <h1 className="max-w-[780px] font-display text-[clamp(34px,5vw,56px)] font-extrabold leading-[1.02] tracking-[-0.035em] text-[#11142a]">Comparador orientativo</h1>
            <p className="mt-5 max-w-[62ch] text-[clamp(15.5px,1.45vw,18px)] leading-relaxed text-slate-600">Elegí hasta tres familias de equipos. La comparación sirve para ordenar la decisión; la configuración final depende de usuarios, software, escala y presupuesto.</p>
          </div>
        </section>

        <section className="bg-[#f7f9fc] py-16 md:py-20 border-b border-slate-200">
        <div className="mx-auto max-w-[1100px] px-6">
          <p className="mb-2 text-[13px] font-bold text-[#1236d8]">Seleccioná hasta 3 familias</p>

          <div className="mt-8 flex flex-wrap gap-2">
            {options.map((option) => {
              const active = selected.includes(option.id);
              return <button key={option.id} type="button" onClick={() => toggle(option.id)} aria-pressed={active} className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-[13px] font-semibold transition ${active ? "border-[#1236d8] bg-[#1236d8] text-white" : "border-slate-200 bg-white text-slate-700 hover:border-[#1236d8]"}`}>{active ? <Check size={15} /> : null}{option.name}</button>;
            })}
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {compared.map((option) => (
              <article key={option.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
                <h2 className="font-display text-[20px] font-bold text-[#11142a]">{option.name}</h2>
                <dl className="mt-5 grid gap-4 text-[13px]">
                  <div><dt className="font-bold text-slate-500">Ideal para</dt><dd className="mt-1 text-slate-800">{option.ideal}</dd></div>
                  <div><dt className="font-bold text-slate-500">Escala orientativa</dt><dd className="mt-1 text-slate-800">{option.scale}</dd></div>
                  <div><dt className="font-bold text-slate-500">Fortalezas</dt><dd className="mt-2 flex flex-wrap gap-1.5">{option.strengths.map((item) => <span key={item} className="rounded-full bg-blue-50 px-2.5 py-1 text-[11.5px] font-semibold text-[#1236d8]">{item}</span>)}</dd></div>
                  <div><dt className="font-bold text-slate-500">Antes de elegir</dt><dd className="mt-1 leading-relaxed text-slate-800">{option.consider}</dd></div>
                </dl>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-slate-200 bg-white p-8 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div><h2 className="font-display text-[20px] font-bold text-[#11142a]">Llevá esta comparación a una cotización</h2><p className="mt-1 text-[13.5px] text-slate-500">El mensaje incluirá las alternativas seleccionadas.</p></div>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-[linear-gradient(90deg,#ff7a18,#ff8f1f,#ffb000)] px-6 py-3.5 text-[14px] font-bold text-white shadow-[0_18px_32px_-18px_rgba(255,122,24,0.85)] transition hover:-translate-y-0.5 sm:mt-0"><MessageCircle size={17} /> Consultar por WhatsApp</a>
          </div>
        </div>
        </section>

        {/* CTA dark */}
        <section className="bg-[#070a16] py-16 md:py-20 text-white">
          <div className="mx-auto flex max-w-[1000px] flex-col items-center px-6 text-center">
            <h2 className="font-display text-[clamp(28px,4vw,46px)] font-extrabold leading-[1.06] text-balance text-white">¿Necesitás ayuda para definir el equipamiento?</h2>
            <p className="mt-4 max-w-[58ch] text-[15.5px] leading-relaxed text-slate-300">Un especialista de Bartez analiza tu escenario real y te propone la mejor combinación de equipos, marcas y condiciones.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[linear-gradient(90deg,#ff7a18,#ff8f1f,#ffb000)] px-5 py-3 text-[14px] font-bold text-white shadow-[0_18px_32px_-18px_rgba(255,122,24,0.85)] transition hover:-translate-y-0.5"><MessageCircle size={17} /> Hablar con un asesor</a>
              <a href="/configurador" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-blue-200/20 bg-transparent px-5 py-3 text-[14px] font-bold text-white transition hover:bg-white/5">Usar el configurador</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
