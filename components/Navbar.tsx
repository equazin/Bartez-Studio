"use client";

import { useEffect, useState } from "react";
import { Menu, X, ChevronRight } from "lucide-react";
import { nav, topbar } from "../constants";
import { Icon } from "./icons";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Utility bar B2B */}
      <div className="hidden bg-ink text-white/80 md:block">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-7 py-2 text-[12.5px]">
          <div className="flex items-center gap-6">
            {topbar.items.map((it) => (
              <span key={it.text} className="flex items-center gap-1.5">
                <Icon name={it.icon} className="h-3.5 w-3.5 text-accent" />
                {it.text}
              </span>
            ))}
          </div>
          <a href={topbar.cta.href} className="flex items-center gap-1 font-medium text-white transition-colors hover:text-accent">
            {topbar.cta.label} <ChevronRight size={14} />
          </a>
        </div>
      </div>

      {/* Main nav */}
      <div className={`border-b transition-all ${scrolled ? "border-slate-200 bg-white/90 backdrop-blur-md" : "border-transparent bg-white"}`}>
        <nav className="mx-auto flex h-[64px] max-w-[1200px] items-center justify-between px-7" aria-label="Principal">
          <a href="/#top" title="Bartez Tecnología — inicio" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-brand to-accent font-display text-[18px] font-bold text-white">B</span>
            <span className="font-display text-[19px] font-bold tracking-tight text-ink">
              Bartez<span className="font-medium text-brand"> Tecnología</span>
            </span>
          </a>

          <div className="hidden items-center gap-7 lg:flex">
            {nav.links.map((l) => (
              <a key={l.href} href={l.href} className="text-[14.5px] font-medium text-slate-600 transition-colors hover:text-brand">
                {l.label}
              </a>
            ))}
            <a href={nav.cta.href} className="rounded-full bg-brand px-5 py-2.5 text-[14px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-bright hover:shadow-glow">
              {nav.cta.label}
            </a>
          </div>

          <button className="text-ink lg:hidden" onClick={() => setOpen((v) => !v)} aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open}>
            {open ? <X /> : <Menu />}
          </button>
        </nav>

        {open && (
          <div className="border-t border-slate-200 bg-white px-7 py-4 lg:hidden">
            <div className="flex flex-col gap-3">
              {nav.links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-1 font-medium text-slate-700">
                  {l.label}
                </a>
              ))}
              <a href={nav.cta.href} onClick={() => setOpen(false)} className="mt-1 rounded-full bg-brand px-5 py-2.5 text-center font-semibold text-white">
                {nav.cta.label}
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
