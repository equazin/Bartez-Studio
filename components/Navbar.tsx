"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, MessageCircle, Phone, SlidersHorizontal, X } from "lucide-react";
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

const toolLinks = [
  { label: "Configurador IT", href: "/configurador" },
  { label: "Comparador orientativo", href: "/comparador" },
  { label: "Cotización masiva (RFQ)", href: "/rfq" },
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
  "relative flex items-center h-[60px] px-3.5 text-[14px] font-semibold text-white/90 transition-colors hover:text-white after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-[2px] after:rounded-t after:transition-colors";
const navLinkHover = "hover:after:bg-[#0046EA]/40";
const navLinkActive = "text-white after:bg-[#0046EA]";
const dropdownPanel =
  "invisible absolute left-1/2 top-[56px] -translate-x-1/2 translate-y-2 rounded-2xl border border-white/10 bg-[#0c1020] p-[18px] opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100";

const solutionPrefixes = [
  "/soluciones",
  "/ciberseguridad",
  "/cloud-licenciamiento",
  "/servicios-administrados",
  "/soporte-corporativo",
  "/renting-leasing",
];
const channelPrefixes = ["/empresas", "/revendedores", "/gobierno", "/educacion"];

function matchesPrefix(pathname: string | null, prefixes: string[]): boolean {
  if (!pathname) return false;
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string): boolean => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isSolutionsActive = matchesPrefix(pathname, solutionPrefixes);
  const isChannelActive = matchesPrefix(pathname, channelPrefixes);
  const isBarposActive = isActive("/barpos");

  return (
    <header className="sticky inset-x-0 top-0 z-50 bg-[linear-gradient(180deg,#080b18,#060914)] text-white shadow-[0_1px_0_0_rgba(0,70,234,0.15),0_12px_32px_-16px_rgba(0,0,0,0.5)]">
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
              aria-current={isBarposActive ? "page" : undefined}
              className={`relative flex h-[60px] items-center px-3.5 text-[14px] font-bold transition-colors bg-[linear-gradient(90deg,rgba(255,143,31,0.08),transparent)] after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-[2px] after:rounded-t ${
                isBarposActive
                  ? "text-[#ffd4a8] after:bg-[#ff8f1f]"
                  : "text-[#ffb86c] hover:text-[#ffd4a8] after:bg-[#ff8f1f]/60"
              }`}
            >
              BarPOS
            </Link>

            <span className="mx-1 h-5 w-px bg-white/8" />

            {/* Soluciones dropdown */}
            <div className="group relative">
              <Link
                href="/#soluciones"
                aria-current={isSolutionsActive ? "page" : undefined}
                className={`${navLinkBase} ${navLinkHover} gap-1.5 ${isSolutionsActive ? navLinkActive : ""}`}
              >
                Soluciones <ChevronDown size={12} className="text-white/30 transition-colors group-hover:text-white/50" />
              </Link>
              <div className={`${dropdownPanel} w-[920px]`}>
                <div className="mb-3 flex items-center justify-between border-b border-white/10 px-0.5 pb-3">
                  <strong className="text-[13px] font-bold text-white">Soluciones</strong>
                  <span className="text-[12px] font-medium text-slate-400">Agrupadas por necesidad</span>
                </div>
                <div className="grid grid-cols-[1.1fr_1fr_1fr_0.85fr] gap-3">
                  <Link
                    href="/barpos"
                    className="min-h-[188px] rounded-xl border border-[#ff8f1f]/25 bg-[radial-gradient(circle_at_24px_20px,rgba(255,143,31,0.23),transparent_34px),linear-gradient(145deg,rgba(255,143,31,0.16),rgba(0,70,234,0.14))] p-[18px] transition hover:border-[#ff8f1f]/45"
                  >
                    <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#ffd38b]">Acceso destacado</span>
                    <span className="mt-4 block text-[20px] font-semibold leading-[1.05] tracking-[-0.035em] text-white">BarPOS punto de venta</span>
                    <span className="mt-2 block text-[13px] font-medium leading-[1.45] text-slate-300">Solución para comercios con caja, software, periféricos, implementación y soporte.</span>
                    <span className="mt-4 inline-flex text-[13px] font-bold text-white">Ver landing BarPOS →</span>
                  </Link>
                  {solutionGroups.map((group) => (
                    <div key={group.title} className="rounded-xl p-2">
                      <p className="mx-2 mb-2 mt-1 text-[11px] font-bold uppercase tracking-[0.11em] text-white">{group.title}</p>
                      {group.links.map((link) => (
                        <Link key={link.href} href={link.href} className="block rounded-lg px-2 py-2.5 text-[13px] font-medium text-slate-300 transition hover:bg-white/5 hover:text-[#8fb5ff]">
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                  <div className="rounded-xl border border-[#0046EA]/20 bg-[#0046EA]/[0.06] p-3">
                    <div className="mx-1 mb-2 mt-1 flex items-center gap-1.5">
                      <SlidersHorizontal size={12} className="text-[#8fb5ff]" />
                      <p className="text-[11px] font-bold uppercase tracking-[0.11em] text-[#8fb5ff]">Herramientas</p>
                    </div>
                    {toolLinks.map((link) => (
                      <Link key={link.href} href={link.href} className="block rounded-lg px-2 py-2.5 text-[13px] font-medium text-slate-300 transition hover:bg-white/5 hover:text-[#8fb5ff]">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Canal B2B dropdown */}
            <div className="group relative">
              <Link
                href="/empresas"
                aria-current={isChannelActive ? "page" : undefined}
                className={`${navLinkBase} ${navLinkHover} gap-1.5 ${isChannelActive ? navLinkActive : ""}`}
              >
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
            {institutionalLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`${navLinkBase} ${navLinkHover} ${active ? navLinkActive : ""}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: phone + CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${contact.phoneDisplay.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3.5 py-2.5 text-[14px] font-semibold text-white/90 transition hover:border-white/20 hover:text-white"
          >
            <Phone size={14} strokeWidth={1.8} />
            {contact.phoneDisplay}
          </a>
          <a
            href={whatsappLinks.quote}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#0046EA] px-4 py-2.5 text-[14px] font-bold text-white shadow-[0_8px_20px_-8px_rgba(0,70,234,0.5)] transition hover:bg-[#0038C4]"
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

            <span className="pt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8fb5ff]">Herramientas</span>
            <div className="grid sm:grid-cols-2">
              {toolLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="border-b border-white/5 py-3 text-[14px] font-medium text-slate-300 hover:text-[#8fb5ff] sm:pr-4">
                  {link.label}
                </Link>
              ))}
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
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0046EA] px-5 py-3 text-[13px] font-bold text-white"
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
