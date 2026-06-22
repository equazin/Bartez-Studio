import Image from "next/image";
import Link from "next/link";
import { company, contact } from "../constants";

const links = [
  { label: "Soluciones", href: "/#soluciones" },
  { label: "Cómo trabajamos", href: "/#proceso" },
  { label: "Nosotros", href: "/#nosotros" },
  { label: "Recursos", href: "/recursos" },
  { label: "Contacto", href: "/#cotiza" },
];

export function Footer() {
  return (
    <footer className="bg-[#062014] text-white">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3" aria-label="Bartez — inicio">
            <Image src="/brand/bartez-isologo.png" alt="" width={50} height={50} className="size-10" />
            <Image src="/brand/bartez-logo.png" alt="Bartez" width={200} height={50} className="h-8 w-auto brightness-0 invert" />
          </Link>
          <p className="mt-5 max-w-[38ch] text-[13px] leading-relaxed text-slate-300">
            Tecnología e infraestructura IT para empresas, con asesoramiento técnico y acompañamiento de punta a punta.
          </p>
        </div>

        <div>
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.13em] text-slate-400">Navegación</h2>
          <ul className="mt-4 grid gap-2.5">
            {links.map((link) => (
              <li key={link.href}><a href={link.href} className="text-[13.5px] text-slate-300 transition-colors hover:text-white">{link.label}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.13em] text-slate-400">Contacto</h2>
          <ul className="mt-4 grid gap-2.5 text-[13.5px] text-slate-300">
            <li><a href={`mailto:${contact.email}`} className="hover:text-white">{contact.email}</a></li>
            <li><a href={`tel:${contact.phoneDisplay.replace(/\s/g, "")}`} className="hover:text-white">{contact.phoneDisplay}</a></li>
            <li>{company.city}, {company.province}</li>
            <li>{contact.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-6 py-5 text-[11.5px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {company.name}. Todos los derechos reservados.</span>
          <span className="flex gap-5">
            <Link href="/legales/privacidad" className="hover:text-white">Privacidad</Link>
            <Link href="/legales/terminos" className="hover:text-white">Términos</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}