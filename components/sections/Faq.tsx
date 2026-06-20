"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { faq } from "../../constants";
import { SectionHeading } from "../SectionHeading";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-[860px] px-7">
        <SectionHeading num={faq.num} eyebrow={faq.eyebrow} title={faq.title} center className="mb-12" />
        <div className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-slate-50"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-[16.5px] font-semibold text-ink">{item.q}</span>
                  <span className={`grid h-7 w-7 flex-none place-items-center rounded-full transition-colors ${isOpen ? "bg-brand text-white" : "bg-slate-100 text-brand"}`}>
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                </button>
                <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-[15px] leading-relaxed text-slate-600">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
