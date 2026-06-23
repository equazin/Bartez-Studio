"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { whatsappLinks } from "@/lib/whatsapp";

const primaryLinks = [
  { label: "Empresas", href: "/empresas" },
  { label: "Revendedores", href: "/revendedores" },
  { label: "Marcas", href: "/marcas" },
  { label: "Nosotros", href: "/quienes-somos" },
];

const solutionLinks = [
  { label: "Catálogo de soluciones", href: "/catalogo" },
  { label: "BarPOS punto de venta", href: "/barpos" },
  { label: "Notebooks corporativas", href: "/soluciones/notebooks-corporativas" },
  { label: "Servidores y almacenamiento", href: "/soluciones/servidores" },
  { label: "Redes e infraestructura", href: "/soluciones/redes-infraestructura" },
  { label: "Servicios administrados", href: "/servicios-administrados" },
  { label: "Soporte corporativo", href: "/soporte-corporativo" },
  { label: "Cloud y licenciamiento", href: "/cloud-licenciamiento" },
  { label: "Ciberseguridad", href: "/ciberseguridad" },
  { label: "Renting y leasing", href: "/renting-leasing" },
  { label: "Gobierno", href: "/gobierno" },
  { label: "Educación", href: "/educacion" },
  { label: "Garantías y RMA", href: "/garantias-rma" },
  { label: "Centro de ayuda", href: "/ayuda" },
  { label: "Recursos", href: "/recursos" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#020a06]">
      <div className="mx-auto flex h-[88px] max-w-[1320px] min-w-0 items-center justify-between gap-5 px-5 sm:px-6">
        <Link href="/#top" className="flex min-w-0 items-center" aria-label="Bartez Tecnología — inicio">
          <Image src="/brand/bartez-logo-oficial-blanco.png" alt="Bartez Tecnología — Distribuidor mayorista" width={272} height={60} priority className="h-12 w-auto sm:h-[54px]" />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegación principal">
          <Link href="/empresas" className="text-[14px] font-medium text-slate-300 transition-colors hover:text-accent">
            Empresas
          </Link>

          <div className="group relative">
            <Link href="/#soluciones" className="flex items-center gap-1.5 py-7 text-[14px] font-medium text-slate-300 transition-colors hover:text-accent">
              Soluciones <ChevronDown size={14} />
            </Link>
            <div className="invisible absolute left-1/2 top-[76px] w-[720px] -translate-x-1/2 translate-y-2 border border-white/10 bg-[#06140d] p-3 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <div className="grid grid-cols-3">
                {solutionLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="border-b border-white/5 px-4 py-3 text-[13.5px] font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-accent">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {primaryLinks.slice(1).map((link) => (
            <Link key={link.href} href={link.href} className="text-[14px] font-medium text-slate-300 transition-colors hover:text-accent">
              {link.label}
            </Link>
          ))}
        </nav>

        <a
          href={whatsappLinks.quote}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden min-h-12 items-center gap-2 rounded-md border border-[#74f5a9] bg-[#22dc6c] px-5 text-[14px] font-extrabold text-[#02170b] shadow-[0_8px_24px_rgba(34,220,108,0.16)] transition-colors hover:bg-[#4ade80] lg:inline-flex"
          data-track="navbar_whatsapp_quote"
        >
          <MessageCircle size={17} /> Cotizar por WhatsApp
        </a>

        <button
          type="button"
          className="grid size-10 flex-none place-items-center rounded-lg border border-white/10 text-white lg:hidden"
          onClick={() => setOpen((current) => !current)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {open ? (
        <nav className="max-h-[calc(100vh-88px)] overflow-y-auto border-t border-white/10 bg-[#030c07] px-5 py-5 lg:hidden" aria-label="Navegación móvil">
          <div className="mx-auto flex max-w-[1200px] flex-col">
            <Link href="/empresas" onClick={() => setOpen(false)} className="border-b border-white/10 py-3 text-[15px] font-semibold text-white">Empresas</Link>
            <span className="pt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Soluciones y segmentos</span>
            <div className="grid sm:grid-cols-2">
              {solutionLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="border-b border-white/5 py-3 text-[14px] font-medium text-slate-300 hover:text-accent sm:pr-4">
                  {link.label}
                </Link>
              ))}
            </div>
            {primaryLinks.slice(1).map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="border-b border-white/10 py-3 text-[15px] font-semibold text-white">
                {link.label}
              </Link>
            ))}
            <a href={whatsappLinks.quote} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3.5 text-[14px] font-bold text-ink">
              <MessageCircle size={18} /> Cotizar por WhatsApp
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
