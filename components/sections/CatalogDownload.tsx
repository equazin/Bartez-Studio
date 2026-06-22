import Link from "next/link";
import { ArrowRight, Download, MessageCircle } from "lucide-react";
import { whatsappLinks } from "@/lib/whatsapp";

export function CatalogDownload() {
  return (
    <section className="border-y border-white/5 bg-[#06140d] py-16 md:py-20">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h2 className="font-display text-[clamp(28px,3.5vw,42px)] font-bold leading-[1.05] tracking-[-0.035em] text-white">Explorá las marcas y líneas que trabajamos.</h2>
          <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed text-slate-400">Descargá el catálogo general o escribinos con modelos y cantidades. La disponibilidad y las alternativas se confirman al momento de cotizar.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
          <a href="/catalogo.pdf" download className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-5 py-3 text-[14px] font-semibold text-white transition hover:border-accent hover:text-accent">
            <Download size={17} /> Descargar catálogo
          </a>
          <a href={whatsappLinks.quote} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-[14px] font-bold text-ink transition hover:scale-[1.02]">
            <MessageCircle size={17} /> Consultar disponibilidad
          </a>
          <Link href="/descargas" className="inline-flex items-center justify-center gap-2 px-2 py-3 text-[13px] font-semibold text-slate-400 transition hover:text-white xl:hidden">Más recursos <ArrowRight size={15} /></Link>
        </div>
      </div>
    </section>
  );
}
