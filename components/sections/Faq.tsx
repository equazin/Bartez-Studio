"use client";

import { useState } from "react";
import { ChevronDown, Clock3, Mail, MapPin, Phone } from "lucide-react";
import { contact, faq } from "../../constants";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const questions = faq.items.slice(0, 4);

  return (
    <section className="bg-slate-50 py-20 md:py-24">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-6 lg:grid-cols-[1.25fr_.75fr] lg:gap-20">
        <div>
          <h2 className="font-display text-[clamp(30px,4vw,44px)] font-bold tracking-[-0.035em] text-ink">Preguntas frecuentes</h2>
          <div className="mt-8 border-t border-slate-200">
            {questions.map((item, index) => {
              const isOpen = open === index;
              return (
                <div key={item.q} className="border-b border-slate-200">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-[15px] font-semibold text-ink">{item.q}</span>
                    <ChevronDown className={`size-4 flex-none text-brand transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <p className="max-w-[66ch] pb-5 text-[14px] leading-relaxed text-slate-600">{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside>
          <h2 className="font-display text-[28px] font-bold tracking-[-0.03em] text-ink">Hablemos de tu proyecto</h2>
          <p className="mt-4 text-[14.5px] leading-relaxed text-slate-600">Dejanos tus datos o escribinos. Te respondemos con una orientación clara.</p>
          <ul className="mt-7 grid gap-4 text-[13.5px] text-slate-700">
            <li className="flex items-center gap-3"><Phone className="size-5 text-brand" /><a href={`tel:${contact.phoneDisplay.replace(/\s/g, "")}`}>{contact.phoneDisplay}</a></li>
            <li className="flex items-center gap-3"><Mail className="size-5 text-brand" /><a href={`mailto:${contact.email}`}>{contact.email}</a></li>
            <li className="flex items-center gap-3"><Clock3 className="size-5 text-brand" /><span>{contact.hours}</span></li>
            <li className="flex items-center gap-3"><MapPin className="size-5 text-brand" /><span>Rosario, Argentina</span></li>
          </ul>
          <a href="#cotiza" className="mt-8 inline-flex rounded-lg bg-ink px-5 py-3 text-[13.5px] font-semibold text-white transition-colors hover:bg-brand">
            Contanos qué necesitás
          </a>
        </aside>
      </div>
    </section>
  );
}