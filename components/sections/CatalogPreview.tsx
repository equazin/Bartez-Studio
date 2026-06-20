"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, PackageCheck } from "lucide-react";
import { catalogPreview } from "../../constants";
import { SectionHeading } from "../SectionHeading";

export function CatalogPreview() {
  const [loading, setLoading] = useState(true);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simula carga del catálogo (en prod: fetch a API/CMS). Muestra skeletons.
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const scroll = (dir: 1 | -1) => {
    scroller.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section id="catalogo" className="scroll-mt-20 bg-white py-28">
      <div className="mx-auto max-w-[1200px] px-7">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading num={catalogPreview.num} eyebrow={catalogPreview.eyebrow} title={catalogPreview.title} />
          <div className="hidden gap-2 md:flex">
            <button onClick={() => scroll(-1)} aria-label="Anterior" className="grid h-11 w-11 place-items-center rounded-full border border-verde/15 text-verde transition-colors hover:bg-verde hover:text-white">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => scroll(1)} aria-label="Siguiente" className="grid h-11 w-11 place-items-center rounded-full border border-verde/15 text-verde transition-colors hover:bg-verde hover:text-white">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div ref={scroller} className="no-scrollbar -mx-7 flex snap-x gap-5 overflow-x-auto px-7 pb-4">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-[280px] flex-none snap-start rounded-3xl border border-verde/10 p-6">
                  <div className="h-32 w-full animate-pulse rounded-xl bg-verde/5" />
                  <div className="mt-5 h-3 w-16 animate-pulse rounded bg-verde/10" />
                  <div className="mt-3 h-5 w-40 animate-pulse rounded bg-verde/10" />
                  <div className="mt-3 h-7 w-28 animate-pulse rounded-full bg-verde/5" />
                </div>
              ))
            : catalogPreview.products.map((p, i) => (
                <article key={i} className="group w-[280px] flex-none snap-start rounded-3xl border border-verde/10 p-6 transition-all hover:-translate-y-1 hover:border-bronce/40 hover:shadow-card">
                  <div className="relative flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-crema to-[#eee7da]">
                    <span className="font-serif text-2xl text-verde/70">{p.brand}</span>
                  </div>
                  <div className="mt-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-bronce">{p.category}</div>
                  <h3 className="mt-1.5 text-[16px] font-semibold text-verde-deep">{p.model}</h3>
                  <span
                    className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold ${
                      p.stock ? "bg-verde-acento/15 text-verde" : "bg-black/5 text-[#6a7a70]"
                    }`}
                  >
                    <PackageCheck size={13} /> {p.stock ? "Stock disponible" : "A pedido"}
                  </span>
                </article>
              ))}
        </div>

        <div className="mt-10">
          <a href={catalogPreview.cta.href} className="inline-flex items-center gap-2 rounded-full bg-verde px-7 py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-verde-acento hover:text-verde-deep hover:shadow-glow">
            {catalogPreview.cta.label} <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
