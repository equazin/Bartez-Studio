import type { Metadata } from "next";
import { FileCheck2, MessageCircle, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { whatsappLinks } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Certificaciones y respaldos — Bartez Tecnología", description: "Documentación comercial y respaldos verificables de Bartez Tecnología." };

export default function CertificacionesPage() {
  return <><Navbar /><main className="min-h-screen bg-[#030c07] pb-24 pt-32 text-white"><div className="mx-auto max-w-[900px] px-6"><h1 className="font-display text-[clamp(38px,5vw,62px)] font-bold tracking-[-0.05em]">Certificaciones y respaldos verificables.</h1><p className="mt-5 max-w-[64ch] text-[16px] leading-relaxed text-slate-400">Esta sección reúne únicamente documentación vigente y comprobable. No utilizamos niveles de partnership, certificaciones o autorizaciones sin respaldo documental.</p><div className="mt-12 grid gap-5 sm:grid-cols-2"><article className="border border-white/10 bg-[#06140d] p-7"><FileCheck2 className="text-accent" size={26} /><h2 className="mt-5 font-display text-[20px] font-bold">Documentación comercial</h2><p className="mt-3 text-[13.5px] leading-relaxed text-slate-400">Razón social, CUIT, condición fiscal y documentación requerida para cada operación.</p></article><article className="border border-white/10 bg-[#06140d] p-7"><ShieldCheck className="text-accent" size={26} /><h2 className="mt-5 font-display text-[20px] font-bold">Certificaciones</h2><p className="mt-3 text-[13.5px] leading-relaxed text-slate-400">Se incorporarán cuando exista documentación vigente, alcance identificable y autorización para publicarla.</p></article></div><a href={whatsappLinks.general} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-[14px] font-bold text-ink"><MessageCircle size={17} /> Solicitar documentación</a></div></main><Footer /></>;
}
