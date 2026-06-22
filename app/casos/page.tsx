import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getDynamicSuccessCases } from "@/lib/db-content";
import { whatsappLinks } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Casos de éxito — Bartez Tecnología", description: "Proyectos tecnológicos documentados y autorizados por clientes de Bartez." };

export default async function CasosPage() {
  const cases = await getDynamicSuccessCases();
  return <><Navbar /><main className="min-h-screen bg-[#030c07] pb-24 pt-32 text-white"><div className="mx-auto max-w-[1100px] px-6"><h1 className="font-display text-[clamp(38px,5vw,62px)] font-bold tracking-[-0.05em]">Casos de éxito verificables.</h1><p className="mt-5 max-w-[62ch] text-[16px] leading-relaxed text-slate-400">Publicamos únicamente proyectos con información y autorización suficiente para respaldar el alcance y los resultados.</p>{cases.length > 0 ? <div className="mt-12 grid gap-6 md:grid-cols-2">{cases.map((item) => <Link key={item.id} href={`/casos/${item.id}`} className="group overflow-hidden border border-white/10 bg-[#06140d]"><div className="relative aspect-[16/8]"><Image src={item.coverImage} alt={item.title} fill className="object-cover opacity-80 transition group-hover:opacity-100" /></div><div className="p-6"><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent">{item.clientName}</p><h2 className="mt-2 font-display text-[21px] font-bold">{item.title}</h2><p className="mt-3 text-[13.5px] leading-relaxed text-slate-400">{item.description}</p><span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-bold text-accent">Ver caso <ArrowRight size={15} /></span></div></Link>)}</div> : <div className="mt-12 border border-white/10 bg-[#06140d] p-8"><h2 className="font-display text-[22px] font-bold">Contenido en preparación</h2><p className="mt-3 max-w-[60ch] text-[14px] leading-relaxed text-slate-400">Los casos anónimos fueron retirados. Esta sección se habilitará a medida que contemos con clientes, resultados y autorizaciones verificables.</p><a href={whatsappLinks.company} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-[14px] font-bold text-ink"><MessageCircle size={17} /> Consultar una solución similar</a></div>}</div></main><Footer /></>;
}
