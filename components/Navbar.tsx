"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, MessageCircle, X } from "lucide-react";
import { useState } from "react";
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

        <nav className="hidden items-center gap-[18px] lg:flex" aria-label="Navegación principal">
          <Link
            href="/barpos"
            className="inline-flex min-h-[38px] items-center gap-2 rounded-[10px] border border-[#ff8f1f]/40 bg-[#ff8f1f]/10 px-3 text-[13.5px] font-extrabold text-white transition hover:bg-[#ff8f1f]/20"
          >
            <span className="size-[7px] rounded-full bg-[#ff8f1f] shadow-[0_0_0_4px_rgba(255,143,31,0.14)]" />
            BarPOS
          </Link>

          <div className="group relative">
            <Link href="/#soluciones" className="flex min-h-[74px] items-center gap-1.5 text-[13.5px] font-extrabold text-white/88 transition hover:text-[#8fb5ff]">
              Soluciones <ChevronDown size={14} className="text-white/50 group-hover:text-[#8fb5ff]" />
            </Link>
            <div className="invisible absolute left-1/2 top-[70px] w-[820px] -translate-x-1/2 translate-y-2 rounded-2xl border border-white/10 bg-[#0c1020] p-[18px] opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <div className="mb-3 flex items-center justify-between border-b border-white/10 px-0.5 pb-3">
                <strong className="text-[13.5px] text-white">Soluciones</strong>
                <span className="text-[12px] font-semibold text-slate-400">Agrupadas por necesidad</span>
              </div>

              <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-3">
                <Link
                  href="/barpos"
                  className="min-h-[188px] rounded-[14px] border border-[#ff8f1f]/25 bg-[radial-gradient(circle_at_24px_20px,rgba(255,143,31,0.23),transparent_34px),linear-gradient(145deg,rgba(255,143,31,0.16),rgba(18,54,216,0.14))] p-[18px] transition hover:border-[#ff8f1f]/45"
                >
                  <span className="text-[11px] font-black uppercase tracking-[0.08em] text-[#ffd38b]">Acceso destacado</span>
                  <span className="mt-4 block text-[21px] font-black leading-[1.05] tracking-[-0.035em] text-white">BarPOS punto de venta</span>
                  <span className="mt-2 block text-[13px] font-medium leading-[1.45] text-slate-300">Solución para comercios con caja, software, periféricos, implementación y soporte.</span>
                  <span className="mt-4 inline-flex text-[13px] font-extrabold text-white">Ver landing BarPOS →</span>
                </Link>

                {solutionGroups.map((group) => (
                  <div key={group.title} className="rounded-[14px] p-2">
                    <h3 className="mx-2 mb-2 mt-1 text-[11px] font-black uppercase tracking-[0.11em] text-white">{group.title}</h3>
                    {group.links.map((link) => (
                      <Link key={link.href} href={link.href} className="block rounded-[10px] px-2 py-2.5 text-[13px] font-bold text-slate-300 transition hover:bg-white/5 hover:text-[#8fb5ff]">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="group relative">
            <Link href="/empresas" className="flex min-h-[74px] items-center gap-1.5 text-[13.5px] font-extrabold text-white/88 transition hover:text-[#8fb5ff]">
              Canal B2B <ChevronDown size={14} className="text-white/50 group-hover:text-[#8fb5ff]" />
            </Link>
            <div className="invisible absolute left-1/2 top-[70px] w-[580px] -translate-x-1/2 translate-y-2 rounded-2xl border border-white/10 bg-[#0c1020] p-[18px] opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <div className="mb-3 flex items-center justify-between border-b border-white/10 px-0.5 pb-3">
                <strong className="text-[13.5px] text-white">Canal B2B</strong>
                <span className="text-[12px] font-semibold text-slate-400">Empresas y revendedores</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {channelLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="min-h-32 rounded-[14px] border border-white/10 bg-white/[0.045] p-4 transition hover:border-white/20 hover:bg-white/[0.065]">
                    <span className="block text-[16px] font-black tracking-[-0.025em] text-white">{link.label}</span>
                    <span className="mt-2 block text-[13px] font-medium leading-[1.45] text-slate-400">{link.description}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {institutionalLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-[13.5px] font-extrabold text-white/88 transition hover:text-[#8fb5ff]">
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
            <Link
              href="/barpos"
              onClick={() => setOpen(false)}
              className="mb-2 flex items-center justify-between rounded-[14px] border border-[#ff8f1f]/30 bg-[#ff8f1f]/10 px-4 py-4 text-[15px] font-black text-white transition hover:bg-[#ff8f1f]/20"
            >
              BarPOS punto de venta <span aria-hidden="true">→</span>
            </Link>

            <span className="pt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Soluciones</span>
            <div className="grid sm:grid-cols-2">
              {solutionGroups.flatMap((group) =>
                group.links.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="border-b border-white/5 py-3 text-[14px] font-semibold text-slate-300 hover:text-[#8fb5ff] sm:pr-4">
                    {link.label}
                  </Link>
                )),
              )}
            </div>

            <span className="pt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Canal B2B</span>
            <div className="grid sm:grid-cols-2">
              {channelLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="border-b border-white/5 py-3 text-[14px] font-semibold text-slate-300 hover:text-[#8fb5ff] sm:pr-4">
                  {link.label}
                </Link>
              ))}
            </div>

            <span className="pt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Institucional</span>
            {institutionalLinks.map((link) => (
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
