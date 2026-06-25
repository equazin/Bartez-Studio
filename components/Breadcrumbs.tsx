"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { verticals } from "@/constants";

type Crumb = {
  label: string;
  href?: string;
};

const SEGMENT_LABELS: Record<string, string> = {
  empresas: "Empresas",
  revendedores: "Revendedores",
  gobierno: "Gobierno",
  educacion: "Educación",
  marcas: "Marcas",
  "quienes-somos": "Quiénes somos",
  contacto: "Contacto",
  barpos: "BarPOS",
  catalogo: "Catálogo",
  configurador: "Configurador",
  comparador: "Comparador",
  rfq: "Cotización masiva",
  ciberseguridad: "Ciberseguridad",
  "cloud-licenciamiento": "Cloud y licenciamiento",
  "servicios-administrados": "Servicios administrados",
  "soporte-corporativo": "Soporte corporativo",
  "renting-leasing": "Renting y leasing",
  soluciones: "Soluciones",
  industria: "Industria",
  salud: "Salud",
  logistica: "Logística",
  "logistica-cobertura": "Cobertura logística",
  "medios-de-pago": "Medios de pago",
  ayuda: "Ayuda",
  recursos: "Recursos",
  legales: "Legales",
  certificaciones: "Certificaciones",
  descargas: "Descargas",
  "garantias-rma": "Garantías y RMA",
  gracias: "Gracias",
  casos: "Casos",
};

function labelFor(segment: string, parent?: string): string {
  if (parent === "soluciones") {
    const vertical = verticals.find((item) => item.slug === segment);
    if (vertical) return vertical.navLabel;
  }
  if (SEGMENT_LABELS[segment]) return SEGMENT_LABELS[segment];
  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildCrumbs(pathname: string): Crumb[] {
  const segments = pathname.split("/").filter(Boolean);
  if (!segments.length) return [];

  const crumbs: Crumb[] = [];
  let acc = "";
  segments.forEach((segment, index) => {
    acc += `/${segment}`;
    const parent = index > 0 ? segments[index - 1] : undefined;
    const isLast = index === segments.length - 1;
    crumbs.push({
      label: labelFor(segment, parent),
      href: isLast ? undefined : acc,
    });
  });
  return crumbs;
}

export function Breadcrumbs() {
  const pathname = usePathname();
  if (!pathname || pathname === "/") return null;

  const crumbs = buildCrumbs(pathname);
  if (!crumbs.length) return null;

  return (
    <nav
      aria-label="Migas de pan"
      className="border-b border-slate-100 bg-white"
    >
      <ol className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-1.5 px-6 py-3 text-[12.5px] text-slate-600">
        <li className="flex items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-brand"
            aria-label="Inicio"
          >
            <Home size={13} strokeWidth={2} />
            <span>Inicio</span>
          </Link>
        </li>
        {crumbs.map((crumb) => (
          <li key={`${crumb.label}-${crumb.href ?? "current"}`} className="flex items-center gap-1.5">
            <ChevronRight size={13} className="text-slate-400" aria-hidden="true" />
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="rounded-md px-1.5 py-1 font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-brand"
              >
                {crumb.label}
              </Link>
            ) : (
              <span
                aria-current="page"
                className="rounded-md px-1.5 py-1 font-bold text-ink"
              >
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
