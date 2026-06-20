"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { nav, company } from "../constants";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 backdrop-blur-md transition-colors ${
        scrolled ? "bg-verde-deep/80 border-b border-bronce/20" : "bg-verde-deep/40"
      }`}
    >
      <nav className="mx-auto flex h-[68px] max-w-[1200px] items-center justify-between px-7" aria-label="Principal">
        <a href="#top" className="flex items-center gap-2.5 text-white" aria-label={`${company.name} inicio`}>
          <span className="grid h-[30px] w-[30px] place-items-center rounded-lg bg-gradient-to-br from-verde-acento to-verde font-serif text-verde-deep">
            B
          </span>
          <span className="text-[19px] font-bold tracking-tight">
            Bartez<span className="font-medium text-bronce">·Tecnología</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {nav.links.map((l) => (
            <a key={l.href} href={l.href} className="text-[14.5px] font-medium text-white/80 transition-colors hover:text-verde-acento">
              {l.label}
            </a>
          ))}
          <a
            href={nav.cta.href}
            className="rounded-full bg-verde px-5 py-2.5 text-[14px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-verde-acento hover:text-verde-deep hover:shadow-glow"
          >
            {nav.cta.label}
          </a>
        </div>

        <button
          className="text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-bronce/20 bg-verde-deep/95 px-7 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {nav.links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-1 text-white/85">
                {l.label}
              </a>
            ))}
            <a href={nav.cta.href} onClick={() => setOpen(false)} className="mt-1 rounded-full bg-verde px-5 py-2.5 text-center font-semibold text-white">
              {nav.cta.label}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
