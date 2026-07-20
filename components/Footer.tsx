import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { company, contact } from "../constants";

const navLinks = [
  { label: "Empresas", href: "/empresas" },
  { label: "Revendedores", href: "/revendedores" },
  { label: "Gobierno", href: "/gobierno" },
  { label: "Educación", href: "/educacion" },
  { label: "Marcas", href: "/marcas" },
  { label: "Quiénes somos", href: "/quienes-somos" },
];

const toolsLinks = [
  { label: "Cotización masiva (RFQ)", href: "/rfq" },
  { label: "Catálogo de soluciones", href: "/catalogo" },
  { label: "BarPOS punto de venta", href: "/barpos" },
  { label: "Comparador orientativo", href: "/comparador" },
  { label: "Configurador IT", href: "/configurador" },
  { label: "Garantías y RMA", href: "/garantias-rma" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#04060d] text-slate-300">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-14 md:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
        {/* Brand column — dominant, with right separator */}
        <div className="flex flex-col items-start md:border-r md:border-white/5 md:pr-8">
          <Link href="/" className="inline-flex items-center" aria-label="Bartez — inicio">
            <Image
              src="/brand/bartez-logo.png"
              alt="Bartez Tecnología"
              width={180}
              height={45}
              className="h-10 w-auto object-contain"
            />
          </Link>
          <p className="mt-5 max-w-[38ch] text-[13px] leading-relaxed text-slate-400">
            Distribución de equipamiento, infraestructura y soluciones IT para empresas, organismos y revendedores en toda Argentina.
          </p>
          <p className="mt-4 text-[11.5px] font-bold uppercase tracking-[0.13em] text-sky">
            18 años · +10.000 clientes
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href={contact.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Bartez"
              className="grid size-8 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:border-sky hover:text-sky"
            >
              <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href={contact.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Bartez"
              className="grid size-8 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:border-sky hover:text-sky"
            >
              <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Secondary nav — reduced opacity */}
        <div>
          <h2 className="text-[11.5px] font-bold uppercase tracking-[0.13em] text-slate-300">Navegación</h2>
          <ul className="mt-4 grid gap-2.5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-[13px] font-medium text-slate-500 transition-colors hover:text-sky">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Tools and resources — reduced opacity */}
        <div>
          <h2 className="text-[11.5px] font-bold uppercase tracking-[0.13em] text-slate-300">Herramientas</h2>
          <ul className="mt-4 grid gap-2.5 text-[13px] font-medium text-slate-500">
            {toolsLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-sky">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact — highlighted with icons and brighter colors */}
        <div>
          <h2 className="text-[11.5px] font-bold uppercase tracking-[0.13em] text-sky">Contacto</h2>
          <ul className="mt-4 grid gap-3 text-[13.5px]">
            <li>
              <a href={`tel:${contact.phoneDisplay.replace(/\s/g, "")}`} className="group flex items-start gap-2 font-semibold text-slate-200 transition-colors hover:text-sky">
                <Phone size={15} className="mt-0.5 flex-none text-sky" />
                <span>{contact.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="group flex items-start gap-2 font-semibold text-slate-200 transition-colors hover:text-sky">
                <Mail size={15} className="mt-0.5 flex-none text-sky" />
                <span>{contact.email}</span>
              </a>
            </li>
            <li className="flex items-start gap-2 font-medium text-slate-400">
              <MapPin size={15} className="mt-0.5 flex-none text-slate-500" />
              <span>{company.address}</span>
            </li>
            <li className="flex items-start gap-2 font-medium text-slate-400">
              <Clock size={15} className="mt-0.5 flex-none text-slate-500" />
              <span>{contact.hours}</span>
            </li>
          </ul>
          <p className="mt-5 text-[11.5px] font-medium text-slate-600">
            {company.legalNotice} · CUIT {company.cuit} · {company.address}
          </p>
        </div>
      </div>

      <div className="border-t border-white/5 bg-[#020306]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-6 py-5 text-[11.5px] font-semibold text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {company.name}. Todos los derechos reservados.</span>
          <span className="flex gap-5">
            <Link href="/legales/privacidad" className="transition-colors hover:text-sky">Privacidad</Link>
            <Link href="/legales/terminos" className="transition-colors hover:text-sky">Términos</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
