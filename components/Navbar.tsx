"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, ClipboardList, GitCompareArrows, Menu, MessageCircle, Phone, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { contact } from "@/constants";
import { whatsappLinks } from "@/lib/whatsapp";

const institutionalLinks = [
  { label: "Marcas", href: "/marcas" },
  { label: "Casos", href: "/casos" },
  { label: "Nosotros", href: "/quienes-somos" },
  { label: "Contacto", href: "/contacto" },
];

const solutionGroups = [
  {
    title: "Infraestructura",
    links: [
      { label: "Redes e infraestructura", href: "/soluciones/redes-infraestructura" },
      { label: "WiFi multi-sede (UniFi)", href: "/soluciones/wifi-multisede" },
      { label: "Videovigilancia / CCTV", href: "/soluciones/videovigilancia-cctv" },
      { label: "Servidores y storage", href: "/soluciones/servidores" },
      { label: "Virtualización Proxmox", href: "/soluciones/virtualizacion-proxmox" },
      { label: "Cableado y racks", href: "/soluciones/cableado-racks" },
    ],
  },
  {
    title: "Equipamiento",
    links: [
      { label: "Notebooks corporativas", href: "/soluciones/notebooks-corporativas" },
      { label: "Workstations alta gama", href: "/soluciones/workstations-alta-gama" },
      { label: "PCs de escritorio y flota", href: "/soluciones/workstations-pcs" },
      { label: "Periféricos corporativos", href: "/soluciones/perifericos-corporativos" },
      { label: "BarPOS punto de venta", href: "/barpos" },
    ],
  },
  {
    title: "Servicios",
    links: [
      { label: "Servicios profesionales", href: "/servicios-profesionales" },
      { label: "Ciberseguridad", href: "/ciberseguridad" },
      { label: "Cloud y licenciamiento", href: "/cloud-licenciamiento" },
      { label: "Servicios administrados", href: "/servicios-administrados" },
      { label: "Soporte corporativo", href: "/soporte-corporativo" },
      { label: "Renting y leasing", href: "/renting-leasing" },
    ],
  },
];

const toolLinks = [
  { label: "Configurador IT", href: "/configurador", icon: SlidersHorizontal },
  { label: "Comparador orientativo", href: "/comparador", icon: GitCompareArrows },
  { label: "Cotización masiva (RFQ)", href: "/rfq", icon: ClipboardList },
];

const channelLinks = [
  {
    label: "Empresas",
    href: "/empresas",
    description: "Compras corporativas, proyectos IT, infraestructura y cuentas B2B.",
  },
  {
    label: "Gobierno",
    href: "/gobierno",
    description: "Cotizaciones formales, pliegos, deal registration y compra pública.",
  },
  {
    label: "Revendedores",
    href: "/revendedores",
    description: "Canal mayorista, condiciones comerciales y distribución.",
  },
];

const navLinkBase =
  "relative flex items-center h-[64px] px-3.5 text-[13.5px] font-semibold text-ink/85 transition-colors hover:text-ink hover:bg-blue-50/70 after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-[2px] after:rounded-t after:transition-colors";
const navLinkHover = "hover:after:bg-brand/30";
const navLinkActive = "text-ink after:bg-brand bg-blue-50/50";
const dropdownPanel =
  "invisible absolute left-1/2 top-[60px] -translate-x-1/2 translate-y-2 rounded-2xl border border-slate-200 bg-white p-[18px] opacity-0 shadow-[0_28px_70px_-40px_rgba(15,23,42,0.35)] transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100";

const solutionPrefixes = [
  "/soluciones",
  "/barpos",
  "/ciberseguridad",
  "/cloud-licenciamiento",
  "/servicios-administrados",
  "/servicios-profesionales",
  "/soporte-corporativo",
  "/renting-leasing",
];
const channelPrefixes = ["/empresas", "/revendedores", "/gobierno"];

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

  return (
    <header className="sticky inset-x-0 top-0 z-50 border-b border-slate-200 bg-[#fbfcff] shadow-[0_1px_0_0_rgba(15,23,42,0.02)]">
      <div className="h-[3px] w-full bg-gradient-to-r from-brand via-[#0ea5ff] to-brand" />
      <div className="mx-auto flex h-[64px] max-w-[1320px] min-w-0 items-center justify-between px-5 sm:px-6">
        {/* Left: logo + nav */}
        <div className="flex min-w-0 items-center">
          <Link href="/" className="flex min-w-0 items-center" aria-label="Bartez Tecnología — inicio">
            <Image
              src="/brand/bartez-logo.png"
              alt="Bartez Tecnología"
              width={160}
              height={40}
              className="h-[32px] w-auto object-contain"
              priority
            />
          </Link>

          <nav className="ml-7 hidden items-center lg:flex" aria-label="Navegación principal">
            {/* Soluciones dropdown */}
            <div className="group relative">
              <Link
                href="/#soluciones"
                aria-current={isSolutionsActive ? "page" : undefined}
                className={`${navLinkBase} ${navLinkHover} gap-1.5 ${isSolutionsActive ? navLinkActive : ""}`}
              >
                Soluciones <ChevronDown size={12} className="text-slate-400 transition-colors group-hover:text-slate-500" />
              </Link>
              <div className={`${dropdownPanel} w-[720px]`}>
                <div className="mb-3 flex items-center justify-between border-b border-slate-100 px-0.5 pb-3">
                  <strong className="text-[13px] font-bold text-ink">Soluciones</strong>
                  <span className="text-[12px] font-medium text-slate-500">Agrupadas por necesidad</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {solutionGroups.map((group) => (
                    <div key={group.title} className="rounded-xl p-2">
                      <p className="mx-2 mb-2 mt-1 text-[10.5px] font-bold uppercase tracking-[0.1em] text-brand">{group.title}</p>
                      {group.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`block rounded-lg px-2 py-2.5 text-[13px] font-medium transition hover:bg-blue-50 hover:text-brand ${
                            link.href === "/barpos" ? "font-bold text-brand" : "text-slate-600"
                          }`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                  {toolLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-[#f7f9fc] px-3.5 py-2 text-[12px] font-semibold text-ink transition hover:border-brand/40 hover:text-brand"
                    >
                      <link.icon size={13} strokeWidth={1.8} /> {link.label}
                    </Link>
                  ))}
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
                Canal B2B <ChevronDown size={12} className="text-slate-400 transition-colors group-hover:text-slate-500" />
              </Link>
              <div className={`${dropdownPanel} w-[640px]`}>
                <div className="mb-3 flex items-center justify-between border-b border-slate-100 px-0.5 pb-3">
                  <strong className="text-[13px] font-bold text-ink">Canal B2B</strong>
                  <span className="text-[12px] font-medium text-slate-500">Empresas, gobierno y revendedores</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {channelLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="min-h-28 rounded-xl border border-slate-200 bg-[#f7f9fc] p-4 transition hover:border-brand/30 hover:bg-blue-50/60"
                    >
                      <span className="block text-[14.5px] font-bold tracking-[-0.02em] text-ink">{link.label}</span>
                      <span className="mt-2 block text-[12.5px] font-medium leading-[1.45] text-slate-500">{link.description}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <span className="mx-1 h-5 w-px bg-slate-200" />

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
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3.5 py-2.5 text-[13.5px] font-semibold text-slate-600 transition hover:border-slate-300 hover:text-ink"
          >
            <Phone size={14} strokeWidth={1.8} />
            {contact.phoneDisplay}
          </a>
          <a
            href={whatsappLinks.quote}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-[13.5px] font-bold text-white shadow-[0_10px_22px_-10px_rgba(0,70,234,0.55)] transition hover:bg-brand-bright"
            data-track="navbar_whatsapp_quote"
          >
            <MessageCircle size={15} strokeWidth={1.8} /> Cotizar
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="grid size-10 flex-none place-items-center rounded-lg border border-slate-200 text-ink lg:hidden"
          onClick={() => setOpen((current) => !current)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open ? (
        <nav className="max-h-[calc(100vh-64px)] overflow-y-auto border-t border-slate-200 bg-white px-5 py-5 lg:hidden" aria-label="Navegación móvil">
          <div className="mx-auto flex max-w-[1200px] flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Soluciones</span>
            <div className="grid sm:grid-cols-2">
              {solutionGroups.flatMap((group) =>
                group.links.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="border-b border-slate-100 py-3 text-[14px] font-medium text-slate-600 hover:text-brand sm:pr-4">
                    {link.label}
                  </Link>
                )),
              )}
            </div>

            <span className="pt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">Herramientas</span>
            <div className="grid sm:grid-cols-2">
              {toolLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="border-b border-slate-100 py-3 text-[14px] font-medium text-slate-600 hover:text-brand sm:pr-4">
                  {link.label}
                </Link>
              ))}
            </div>

            <span className="pt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Canal B2B</span>
            <div className="grid sm:grid-cols-2">
              {channelLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="border-b border-slate-100 py-3 text-[14px] font-medium text-slate-600 hover:text-brand sm:pr-4">
                  {link.label}
                </Link>
              ))}
            </div>

            <span className="pt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Institucional</span>
            {institutionalLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="border-b border-slate-200 py-3 text-[14px] font-semibold text-ink transition hover:text-brand">
                {link.label}
              </Link>
            ))}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a
                href={`tel:${contact.phoneDisplay.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-[13px] font-semibold text-slate-600"
              >
                <Phone size={16} /> {contact.phoneDisplay}
              </a>
              <a
                href={whatsappLinks.quote}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-[13px] font-bold text-white"
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
