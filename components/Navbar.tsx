"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { label: "Soluciones", href: "/#soluciones" },
  { label: "Cómo trabajamos", href: "/#proceso" },
  { label: "Nosotros", href: "/#nosotros" },
  { label: "Recursos", href: "/recursos" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-[1200px] items-center justify-between px-6">
        <Link href="/#top" className="flex items-center gap-2.5" aria-label="Bartez Tecnología — inicio">
          <Image src="/brand/bartez-isologo.png" alt="" width={50} height={50} priority className="size-9 flex-none" />
          <Image src="/brand/bartez-logo.png" alt="Bartez" width={200} height={50} priority className="h-7 w-auto sm:h-8" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navegación principal">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-[14px] font-medium text-slate-600 transition-colors hover:text-brand">
              {link.label}
            </a>
          ))}
        </nav>

        <Link
          href="/#cotiza"
          className="hidden rounded-lg bg-ink px-5 py-3 text-[13.5px] font-semibold text-white transition-colors hover:bg-brand lg:inline-flex"
          data-track="navbar_guided_consultation"
        >
          Contanos qué necesitás
        </Link>

        <button
          type="button"
          className="grid size-10 place-items-center text-ink lg:hidden"
          onClick={() => setOpen((current) => !current)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-slate-200 bg-white px-6 py-5 lg:hidden" aria-label="Navegación móvil">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-4">
            {links.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="py-1 text-[15px] font-medium text-slate-700">
                {link.label}
              </a>
            ))}
            <Link href="/#cotiza" onClick={() => setOpen(false)} className="mt-2 rounded-lg bg-ink px-5 py-3 text-center text-[14px] font-semibold text-white">
              Contanos qué necesitás
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}