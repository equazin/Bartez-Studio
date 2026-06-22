import Link from "next/link";
import { Download, FileText, MessageCircle, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { whatsappLinks } from "@/lib/whatsapp";

const resources = [
  {
    title: "Catálogo general B2B",
    category: "Catálogo",
    description: "Marcas y familias de productos que trabajamos para empresas, organismos y revendedores.",
    href: "/catalogo.pdf",
    icon: FileText,
    action: "Descargar catálogo",
  },
  {
    title: "Brochure institucional Bartez",
    category: "Empresa",
    description: "Presentación de capacidades, segmentos atendidos y formas de trabajo.",
    href: "/brochure.pdf",
    icon: FileText,
    action: "Descargar brochure",
  },
];

export default function Descargas() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#030c07] pb-24 pt-32 text-white">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="max-w-[720px]">
            <h1 className="font-display text-[clamp(36px,5vw,58px)] font-bold leading-[1.02] tracking-[-0.045em]">Centro de descargas</h1>
            <p className="mt-5 max-w-[60ch] text-[16px] leading-relaxed text-slate-400">
              Accedé a materiales comerciales y documentación de ayuda. Las condiciones, disponibilidad y garantías se confirman para cada cotización.
            </p>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="border-t border-white/10">
              {resources.map((resource) => (
                <article key={resource.href} className="grid gap-5 border-b border-white/10 py-7 sm:grid-cols-[48px_1fr_auto] sm:items-center">
                  <span className="grid size-12 place-items-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
                    <resource.icon size={21} />
                  </span>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent">{resource.category}</span>
                    <h2 className="mt-1 font-display text-[18px] font-bold text-white">{resource.title}</h2>
                    <p className="mt-1 text-[13px] leading-relaxed text-slate-400">{resource.description}</p>
                  </div>
                  <a href={resource.href} download className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-[13px] font-bold text-ink transition hover:scale-[1.02]">
                    <Download size={15} /> {resource.action}
                  </a>
                </article>
              ))}

              <article className="grid gap-5 border-b border-white/10 py-7 sm:grid-cols-[48px_1fr_auto] sm:items-center">
                <span className="grid size-12 place-items-center rounded-xl border border-accent/20 bg-accent/10 text-accent"><ShieldCheck size={21} /></span>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent">Soporte</span>
                  <h2 className="mt-1 font-display text-[18px] font-bold text-white">Garantías y RMA</h2>
                  <p className="mt-1 text-[13px] leading-relaxed text-slate-400">Pasos, información necesaria y canal de inicio para cada consulta.</p>
                </div>
                <Link href="/garantias-rma" className="inline-flex items-center justify-center rounded-lg border border-white/20 px-4 py-2.5 text-[13px] font-bold text-white transition hover:border-accent hover:text-accent">Ver guía</Link>
              </article>
            </div>

            <aside className="h-fit border border-white/10 bg-[#082214] p-7">
              <h2 className="font-display text-[22px] font-bold text-white">¿Necesitás una ficha o modelo específico?</h2>
              <p className="mt-3 text-[14px] leading-relaxed text-slate-400">Indicá marca, familia, cantidad y uso previsto. El equipo comercial te ayuda a encontrar la documentación y preparar la cotización.</p>
              <a href={whatsappLinks.quote} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-[14px] font-bold text-ink">
                <MessageCircle size={17} /> Consultar por WhatsApp
              </a>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
