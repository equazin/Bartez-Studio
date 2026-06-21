"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, PackageCheck, FileText } from "lucide-react";
import { catalogPreview } from "../../constants";
import { SectionHeading } from "../SectionHeading";
import { Button } from "../ui/Button";
import { track } from "../Analytics";

function quoteProduct(label: string) {
  track("quote_product", { product: label });
  window.dispatchEvent(new CustomEvent("bartez:quote", { detail: label }));
  window.location.hash = "#contacto";
}

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
                  <div className="relative h-36 overflow-hidden rounded-xl bg-gradient-to-b from-slate-100 to-slate-50 ring-1 ring-slate-200">
                    <Image
                      src={p.image}
                      alt={`${p.brand} ${p.model}`}
                      fill
                      sizes="270px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute left-2.5 top-2.5 rounded-md bg-white/90 px-2 py-0.5 text-[11px] font-bold text-ink shadow-sm backdrop-blur">{p.brand}</span>
                  </div>
                  <div className="mt-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">{p.category}</div>
                  <h3 className="mt-1.5 text-[16px] font-semibold text-ink">{p.model}</h3>
                  <span className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold ${p.stock ? "bg-emerald/10 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                    <PackageCheck size={13} /> {p.stock ? "Stock disponible" : "A pedido"}
                  </span>
                  <button
                    type="button"
                    onClick={() => quoteProduct(`${p.brand} ${p.model}`)}
                    className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-[13px] font-semibold text-brand transition-colors hover:border-brand hover:bg-brand hover:text-white"
                  >
                    <FileText size={14} /> Cotizar
                  </button>
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
