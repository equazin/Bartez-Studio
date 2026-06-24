"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, MessageCircle, Phone, X } from "lucide-react";
import { useState } from "react";
import { contact } from "@/constants";
import { whatsappLinks } from "@/lib/whatsapp";

const institutionalLinks = [
  { label: "Marcas", href: "/marcas" },
  { label: "Nosotros", href: "/quienes-somos" },
  { label: "Contacto", href: "/contacto" },
];

const solutionGroups = [
  {
    title: "Infraestructura",
    links: [
      { label: "Servidores y almacenamiento", href: "/soluciones/servidores" },
      { label: "Redes e infraestructura", href: "/soluciones/redes-infraestructura" },
      { label: "Ciberseguridad", href: "/ciberseguridad" },
      { label: "Cloud y licenciamiento", href: "/cloud-licenciamiento" },
    ],
  },
  {
    title: "Equipamiento y servicios",
    links: [
      { label: "Notebooks corporativas", href: "/soluciones/notebooks-corporativas" },
      { label: "Servicios administrados", href: "/servicios-administrados" },
      { label: "Soporte corporativo", href: "/soporte-corporativo" },
      { label: "Renting y leasing", href: "/renting-leasing" },
    ],
  },
];

const channelLinks = [
  {
    label: "Empresas",
    href: "/empresas",
    description: "Compras corporativas, proyectos IT, infraestructura y cuentas B2B.",
  },
  {
    label: "Revendedores",
    href: "/revendedores",
    description: "Canal mayorista, condiciones comerciales y distribución.",
  },
];

const navLinkBase =
  "relative flex items-center h-[60px] px-3.5 text-[13px] font-semibold text-white/60 transition-colors hover:text-white/90 after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-[2px] after:rounded-t after:transition-colors";
const navLinkHover = "hover:after:bg-[#1236d8]/40";
const dropdownPanel =
  "invisible absolute left-1/2 top-[56px] -translate-x-1/2 translate-y-2 rounded-2xl border border-white/10 bg-[#0c1020] p-[18px] opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky inset-x-0 top-0 z-50 bg-[linear-gradient(180deg,#080b18,#060914)] text-white shadow-[0_1px_0_0_rgba(18,54,216,0.15),0_12px_32px_-16px_rgba(0,0,0,0.5)]">
      <div className="mx-auto flex h-[60px] max-w-[1320px] min-w-0 items-center justify-between px-5 sm:px-6">
        {/* Left: logo + nav */}
        <div className="flex min-w-0 items-center">
          <Link href="/" className="flex min-w-0 items-center" aria-label="Bartez Tecnología — inicio">
            <Image
              src="/brand/bartez-logo.png"
              alt="Bartez Tecnología"
              width={160}
              height={40}
              className="h-[34px] w-auto object-contain"
              priority
            />
          </Link>

          <nav className="ml-7 hidden items-center lg:flex" aria-label="Navegación principal">
            {/* BarPOS — accent link */}
            <Link
              href="/barpos"
              className="relative flex h-[60px] items-center px-3.5 text-[13px] font-bold text-[#ffb86c] transition-colors bg-[linear-gradient(90deg,rgba(255,143,31,0.08),transparent)] hover:text-[#ffd4a8] after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-[2px] after:rounded-t after:bg-[#ff8f1f]/60"
            >
              BarPOS
            </Link>

            <span className="mx-1 h-5 w-px bg-white/8" />

            {/* Soluciones dropdown */}
            <div className="group relative">
              <Link href="/#soluciones" className={`${navLinkBase} ${navLinkHover} gap-1.5`}>
                Soluciones <ChevronDown size={12} className="text-white/30 transition-colors group-hover:text-white/50" />
              </Link>
              <div className={`${dropdownPanel} w-[820px]`}>
                <div className="mb-3 flex items-center justify-between border-b border-white/10 px-0.5 pb-3">
                  <strong className="text-[13px] font-bold text-white">Soluciones</strong>
                  <span className="text-[12px] font-medium text-slate-400">Agrupadas por necesidad</span>
                </div>
                <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-3">
                  <Link
                    href="/barpos"
                    className="min-h-[188px] rounded-xl border border-[#ff8f1f]/25 bg-[radial-gradient(circle_at_24px_20px,rgba(255,143,31,0.23),transparent_34px),linear-gradient(145deg,rgba(255,143,31,0.16),rgba(18,54,216,0.14))] p-[18px] transition hover:border-[#ff8f1f]/45"
                  >
                    <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#ffd38b]">Acceso destacado</span>
                    <span className="mt-4 block text-[20px] font-extrabold leading-[1.05] tracking-[-0.035em] text-white">BarPOS punto de venta</span>
                    <span className="mt-2 block text-[13px] font-medium leading-[1.45] text-slate-300">Solución para comercios con caja, software, periféricos, implementación y soporte.</span>
                    <span className="mt-4 inline-flex text-[13px] font-bold text-white">Ver landing BarPOS →</span>
                  </Link>
                  {solutionGroups.map((group) => (
                    <div key={group.title} className="rounded-xl p-2">
                      <h3 className="mx-2 mb-2 mt-1 text-[11px] font-bold uppercase tracking-[0.11em] text-white">{group.title}</h3>
                      {group.links.map((link) => (
                        <Link key={link.href} href={link.href} className="block rounded-lg px-2 py-2.5 text-[13px] font-medium text-slate-300 transition hover:bg-white/5 hover:text-[#8fb5ff]">
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Canal B2B dropdown */}
            <div className="group relative">
              <Link href="/empresas" className={`${navLinkBase} ${navLinkHover} gap-1.5`}>
                Canal B2B <ChevronDown size={12} className="text-white/30 transition-colors group-hover:text-white/50" />
              </Link>
              <div className={`${dropdownPanel} w-[520px]`}>
                <div className="mb-3 flex items-center justify-between border-b border-white/10 px-0.5 pb-3">
                  <strong className="text-[13px] font-bold text-white">Canal B2B</strong>
                  <span className="text-[12px] font-medium text-slate-400">Empresas y revendedores</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {channelLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="min-h-28 rounded-xl border border-white/10 bg-white/[0.045] p-4 transition hover:border-white/20 hover:bg-white/[0.065]">
                      <span className="block text-[15px] font-bold tracking-[-0.02em] text-white">{link.label}</span>
                      <span className="mt-2 block text-[13px] font-medium leading-[1.45] text-slate-400">{link.description}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <span className="mx-1 h-5 w-px bg-white/8" />

            {/* Institutional links */}
            {institutionalLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`${navLinkBase} ${navLinkHover}`}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: phone + CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${contact.phoneDisplay.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3.5 py-2 text-[12.5px] font-semibold text-white/70 transition hover:border-white/20 hover:text-white"
          >
            <Phone size={14} strokeWidth={1.8} />
            {contact.phoneDisplay}
          </a>
          <a
            href={whatsappLinks.quote}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#1236d8] px-4 py-2 text-[12.5px] font-bold text-white shadow-[0_8px_20px_-8px_rgba(18,54,216,0.5)] transition hover:bg-[#0f2bb8]"
            data-track="navbar_whatsapp_quote"
          >
            <MessageCircle size={15} strokeWidth={1.8} /> Cotizar
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="grid size-10 flex-none place-items-center rounded-lg border border-white/10 text-white lg:hidden"
          onClick={() => setOpen((current) => !current)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open ? (
        <nav className="max-h-[calc(100vh-60px)] overflow-y-auto border-t border-white/10 bg-[#060914] px-5 py-5 lg:hidden" aria-label="Navegación móvil">
          <div className="mx-auto flex max-w-[1200px] flex-col">
            <Link
              href="/barpos"
              onClick={() => setOpen(false)}
              className="mb-2 flex items-center justify-between rounded-xl border border-[#ff8f1f]/30 bg-[#ff8f1f]/10 px-4 py-3.5 text-[14px] font-bold text-white transition hover:bg-[#ff8f1f]/20"
            >
              BarPOS punto de venta <span aria-hidden="true">→</span>
            </Link>

            <span className="pt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Soluciones</span>
            <div className="grid sm:grid-cols-2">
              {solutionGroups.flatMap((group) =>
                group.links.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="border-b border-white/5 py-3 text-[14px] font-medium text-slate-300 hover:text-[#8fb5ff] sm:pr-4">
                    {link.label}
                  </Link>
                )),
              )}
            </div>

            <span className="pt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Canal B2B</span>
            <div className="grid sm:grid-cols-2">
              {channelLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="border-b border-white/5 py-3 text-[14px] font-medium text-slate-300 hover:text-[#8fb5ff] sm:pr-4">
                  {link.label}
                </Link>
              ))}
            </div>

            <span className="pt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Institucional</span>
            {institutionalLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="border-b border-white/10 py-3 text-[14px] font-semibold text-white transition hover:text-[#8fb5ff]">
                {link.label}
              </Link>
            ))}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a
                href={`tel:${contact.phoneDisplay.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-[13px] font-semibold text-white/80"
              >
                <Phone size={16} /> {contact.phoneDisplay}
              </a>
              <a
                href={whatsappLinks.quote}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#1236d8] px-5 py-3 text-[13px] font-bold text-white"
              >
                <MessageCircle size={16} /> Cotizar por WhatsApp
              </a>
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
