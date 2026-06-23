"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { whatsappLinks } from "@/lib/whatsapp";

const primaryLinks = [
  { label: "Productos", href: "/catalogo" },
  { label: "Empresas", href: "/empresas" },
  { label: "Revendedores", href: "/revendedores" },
  { label: "Marcas", href: "/marcas" },
  { label: "Nosotros", href: "/quienes-somos" },
  { label: "Contacto", href: "/contacto" },
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
    <header className="sticky inset-x-0 top-0 z-50 border-b border-white/10 bg-[#04060d] text-white shadow-[0_18px_45px_-30px_rgba(15,23,42,0.9)]">
      <div className="mx-auto flex h-[74px] max-w-[1320px] min-w-0 items-center justify-between gap-5 px-5 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center" aria-label="Bartez Tecnología — inicio">
          <Image
            src="/brand/bartez-logo.png"
            alt="Bartez Tecnología"
            width={180}
            height={45}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Navegación principal">
          <Link href="/catalogo" className="text-[13.5px] font-bold text-white/88 transition hover:text-[#8fb5ff]">
            Productos
          </Link>

          <div className="group relative">
            <Link href="/#soluciones" className="flex items-center gap-1.5 py-6 text-[13.5px] font-bold text-white/88 transition hover:text-[#8fb5ff]">
              Soluciones <ChevronDown size={14} className="text-white/50 group-hover:text-[#8fb5ff]" />
            </Link>
            <div className="invisible absolute left-1/2 top-[70px] w-[720px] -translate-x-1/2 translate-y-2 border border-white/10 bg-[#0c1020] p-3 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 rounded-2xl">
              <div className="grid grid-cols-3 gap-1">
                {solutionLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-300 transition hover:bg-white/5 hover:text-[#8fb5ff]">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {primaryLinks.slice(1).map((link) => (
            <Link key={link.href} href={link.href} className="text-[13.5px] font-bold text-white/88 transition hover:text-[#8fb5ff]">
              {link.label}
            </Link>
          ))}
        </nav>

        <a
          href={whatsappLinks.quote}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff7a18] via-[#ff8f1f] to-[#ffb000] px-5 text-[13.5px] font-black text-white shadow-[0_18px_38px_-18px_rgba(255,122,24,0.9)] transition hover:translate-y-[-1px] hover:shadow-[0_22px_44px_-16px_rgba(255,122,24,0.95)] lg:inline-flex"
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
        <nav className="max-h-[calc(100vh-74px)] overflow-y-auto border-t border-white/10 bg-[#04060d] px-5 py-5 lg:hidden" aria-label="Navegación móvil">
          <div className="mx-auto flex max-w-[1200px] flex-col">
            <Link href="/catalogo" onClick={() => setOpen(false)} className="border-b border-white/10 py-3 text-[15px] font-bold text-white transition hover:text-[#8fb5ff]">Productos</Link>
            <span className="pt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Soluciones y segmentos</span>
            <div className="grid sm:grid-cols-2">
              {solutionLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="border-b border-white/5 py-3 text-[14px] font-semibold text-slate-300 hover:text-[#8fb5ff] sm:pr-4">
                  {link.label}
                </Link>
              ))}
            </div>
            {primaryLinks.slice(1).map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="border-b border-white/10 py-3 text-[15px] font-bold text-white transition hover:text-[#8fb5ff]">
                {link.label}
              </Link>
            ))}
            <a
              href={whatsappLinks.quote}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff7a18] to-[#ffb000] px-5 py-3.5 text-[14px] font-black text-white"
            >
              <MessageCircle size={18} /> Cotizar por WhatsApp
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
