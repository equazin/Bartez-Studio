"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, PackageCheck } from "lucide-react";
import { catalogPreview } from "../../constants";
import { SectionHeading } from "../SectionHeading";
import { Button } from "../ui/Button";

export function CatalogPreview() {
  const [loading, setLoading] = useState(true);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const scroll = (dir: 1 | -1) => scroller.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  return (
    <section id="catalogo" className="scroll-mt-24 bg-white py-24">
      <div className="mx-auto max-w-[1200px] px-7">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading num={catalogPreview.num} eyebrow={catalogPreview.eyebrow} title={catalogPreview.title} />
          <div className="hidden gap-2 md:flex">
            <button onClick={() => scroll(-1)} aria-label="Anterior" className="grid h-11 w-11 place-items-center rounded-full border border-slate-300 text-slate-700 transition-colors hover:border-brand hover:bg-brand hover:text-white">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => scroll(1)} aria-label="Siguiente" className="grid h-11 w-11 place-items-center rounded-full border border-slate-300 text-slate-700 transition-colors hover:border-brand hover:bg-brand hover:text-white">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div ref={scroller} className="no-scrollbar -mx-7 flex snap-x gap-5 overflow-x-auto px-7 pb-4">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-[270px] flex-none snap-start rounded-2xl border border-slate-200 p-6">
                  <div className="h-28 w-full animate-pulse rounded-xl bg-slate-100" />
                  <div className="mt-5 h-3 w-16 animate-pulse rounded bg-slate-100" />
                  <div className="mt-3 h-5 w-40 animate-pulse rounded bg-slate-100" />
                  <div className="mt-3 h-7 w-28 animate-pulse rounded-full bg-slate-100" />
                </div>
              ))
            : catalogPreview.products.map((p, i) => (
                <article key={i} className="group w-[270px] flex-none snap-start rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-card">
                  <div className="relative flex h-28 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-slate-100">
                    <span className="font-display text-2xl font-bold text-slate-400 transition-colors group-hover:text-brand">{p.brand}</span>
                  </div>
                  <div className="mt-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">{p.category}</div>
                  <h3 className="mt-1.5 text-[16px] font-semibold text-ink">{p.model}</h3>
                  <span className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold ${p.stock ? "bg-emerald/10 text-emerald" : "bg-slate-100 text-slate-500"}`}>
                    <PackageCheck size={13} /> {p.stock ? "Stock disponible" : "A pedido"}
                  </span>
                </article>
              ))}
        </div>

        <div className="mt-10">
          <Button href={catalogPreview.cta.href} variant="primary" arrow>{catalogPreview.cta.label}</Button>
        </div>
      </div>
    </section>
  );
}
