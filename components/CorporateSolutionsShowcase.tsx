"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ComponentType } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Cloud,
  Headphones,
  Laptop,
  Monitor,
  Server,
  ShieldCheck,
  Wifi,
  type LucideProps,
} from "lucide-react";

type CorporateSolution = {
  id: string;
  icon: ComponentType<LucideProps>;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
  bullets: string[];
  brands: { name: string; logo: string }[];
};

const corporateSolutions: CorporateSolution[] = [
  {
    id: "datacenter",
    icon: Server,
    label: "Infraestructura y Datacenter",
    eyebrow: "SOLUCIÓN DESTACADA",
    title: "Infraestructura y Datacenter",
    description:
      "Servidores, storage, racks, UPS y soluciones de infraestructura diseñadas para garantizar máximo rendimiento, disponibilidad y escalabilidad.",
    href: "/soluciones/servidores",
    image: "/photos/datacenter.jpg",
    imageAlt: "Sala de servidores para infraestructura corporativa",
    bullets: [
      "Servidores de última generación",
      "Storage y backup empresarial",
      "Racks, gabinetes y accesorios",
      "Soluciones de energía (UPS y PDU)",
      "Componentes para datacenter",
    ],
    brands: [
      { name: "Dell", logo: "/logos/dell.png" },
      { name: "HPE", logo: "/logos/hpe.png" },
      { name: "Lenovo", logo: "/logos/lenovo.png" },
      { name: "APC", logo: "/logos/apc.svg" },
      { name: "Vertiv", logo: "/logos/vertiv.png" },
      { name: "GLC", logo: "/logos/glc.png" },
    ],
  },
  {
    id: "equipamiento",
    icon: Laptop,
    label: "Equipamiento corporativo",
    eyebrow: "Renovación de parque IT",
    title: "Equipamiento corporativo",
    description:
      "Notebooks, PCs, monitores y periféricos para renovar puestos de trabajo con criterio técnico y disponibilidad comercial.",
    href: "/soluciones/notebooks-corporativas",
    image: "/photos/products/laptop1.jpg",
    imageAlt: "Notebook corporativa para empresas",
    bullets: [
      "Notebooks y PCs por perfil de usuario",
      "Monitores, docks y periféricos",
      "Estandarización por áreas o sucursales",
      "Configuración previa y logística",
      "Garantía y seguimiento comercial",
    ],
    brands: [
      { name: "Lenovo", logo: "/logos/lenovo.png" },
      { name: "Dell", logo: "/logos/dell.png" },
      { name: "HP", logo: "/logos/hp.png" },
      { name: "Kingston", logo: "/logos/kingston.png" },
      { name: "Epson", logo: "/logos/epson.png" },
    ],
  },
  {
    id: "redes",
    icon: Wifi,
    label: "Redes y conectividad",
    eyebrow: "Conectividad empresarial",
    title: "Redes y conectividad",
    description:
      "Switches, access points, routers, cableado y firewalls para redes estables, seguras y preparadas para crecer.",
    href: "/soluciones/redes-infraestructura",
    image: "/photos/products/switch.jpg",
    imageAlt: "Switch de red para infraestructura empresarial",
    bullets: [
      "Switches administrables y PoE",
      "WiFi corporativo y access points",
      "Routers, firewalls y seguridad perimetral",
      "Cableado estructurado y racks",
      "Diseño e implementación de red",
    ],
    brands: [
      { name: "Cisco", logo: "/logos/cisco.png" },
      { name: "Aruba", logo: "/logos/aruba.png" },
      { name: "Ubiquiti", logo: "/logos/ubiquiti.png" },
      { name: "GLC", logo: "/logos/glc.png" },
    ],
  },
  {
    id: "seguridad",
    icon: ShieldCheck,
    label: "Seguridad y vigilancia",
    eyebrow: "Protección y control",
    title: "Seguridad y vigilancia",
    description:
      "Cámaras IP, NVR, almacenamiento y control de acceso para proteger oficinas, depósitos, plantas y sucursales.",
    href: "/soluciones/videovigilancia-cctv",
    image: "/photos/cctv.jpg",
    imageAlt: "Cámara de seguridad para videovigilancia corporativa",
    bullets: [
      "Cámaras IP interiores y exteriores",
      "Grabadores NVR y almacenamiento",
      "Monitoreo remoto desde celular o PC",
      "Control de accesos y trazabilidad",
      "Instalación y puesta en marcha",
    ],
    brands: [
      { name: "Cisco", logo: "/logos/cisco.png" },
      { name: "Ubiquiti", logo: "/logos/ubiquiti.png" },
      { name: "WD", logo: "/logos/wd.png" },
      { name: "Intel", logo: "/logos/intel.png" },
    ],
  },
  {
    id: "cloud",
    icon: Cloud,
    label: "Cloud y licencias",
    eyebrow: "Software y continuidad",
    title: "Cloud y licencias",
    description:
      "Licencias, productividad, backup, correo corporativo y soluciones cloud para ordenar la operación digital de la empresa.",
    href: "/cloud-licenciamiento",
    image: "/photos/office.jpg",
    imageAlt: "Equipo corporativo trabajando con soluciones cloud",
    bullets: [
      "Microsoft 365 y licencias corporativas",
      "Backup y continuidad operativa",
      "Correo, colaboración y productividad",
      "Antivirus y seguridad endpoint",
      "Asesoramiento de adopción y renovación",
    ],
    brands: [
      { name: "Microsoft", logo: "/logos/microsoft.svg" },
      { name: "Eset", logo: "/logos/eset.svg" },
    ],
  },
  {
    id: "soporte",
    icon: Headphones,
    label: "Soporte corporativo",
    eyebrow: "Servicio técnico para empresas",
    title: "Soporte corporativo",
    description:
      "Acompañamiento técnico y comercial para mantener equipos, redes e infraestructura funcionando sin improvisar.",
    href: "/soporte-corporativo",
    image: "/photos/engineer.jpg",
    imageAlt: "Técnico trabajando en soporte corporativo",
    bullets: [
      "Mesa de ayuda y asistencia técnica",
      "Mantenimiento preventivo",
      "Soporte en sitio o remoto",
      "Gestión de garantías y RMA",
      "Planes por criticidad operativa",
    ],
    brands: [
      { name: "Dell", logo: "/logos/dell.png" },
      { name: "Lenovo", logo: "/logos/lenovo.png" },
      { name: "HP", logo: "/logos/hp.png" },
      { name: "Microsoft", logo: "/logos/microsoft.svg" },
    ],
  },
  {
    id: "barpos",
    icon: Monitor,
    label: "BarPOS punto de venta",
    eyebrow: "Solución para comercios",
    title: "BarPOS punto de venta",
    description:
      "Punto de venta completo para comercios: hardware, software, implementación, capacitación y soporte comercial.",
    href: "/barpos",
    image: "/photos/products/desktop.jpg",
    imageAlt: "Equipo de escritorio para punto de venta BarPOS",
    bullets: [
      "Equipamiento + software + soporte",
      "Caja, ventas, clientes e inventario",
      "Reportes y gestión administrativa",
      "Implementación y capacitación",
      "Programa para revendedores por zona",
    ],
    brands: [
      { name: "3nStar", logo: "/logos/3nstar.png" },
      { name: "OCOM", logo: "/logos/ocom.png" },
      { name: "Epson", logo: "/logos/epson.png" },
    ],
  },
];

export function CorporateSolutionsShowcase() {
  const [selectedId, setSelectedId] = useState(corporateSolutions[0].id);
  const selected =
    corporateSolutions.find((item) => item.id === selectedId) ??
    corporateSolutions[0];

  return (
    <section id="soluciones" className="bg-[#f7f9ff] py-14 lg:py-16">
      <div className="mx-auto w-[calc(100vw-32px)] max-w-[1320px] min-w-0 px-0 sm:w-full sm:px-6 lg:px-10">
        <div className="text-center">
          <h2 className="mx-auto max-w-[13ch] font-display text-[clamp(27px,7vw,48px)] font-black leading-tight tracking-[-0.045em] text-[#11142a] sm:max-w-none">
            Soluciones corporativas
          </h2>
          <p className="mt-2 text-[15px] font-medium text-slate-500">
            Tecnología y servicios para cada necesidad de tu empresa.
          </p>
        </div>

        <div className="mt-9 grid min-w-0 gap-5 lg:grid-cols-[300px_1fr]">
          {/* Sidebar */}
          <div className="min-w-0 rounded-3xl border border-blue-100 bg-white p-3 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.55)]">
            {corporateSolutions.map((item) => {
              const isActive = item.id === selected.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelectedId(item.id)}
                  className={`group flex w-full min-w-0 items-center gap-3 rounded-2xl px-3.5 py-3.5 text-left text-[12.5px] font-black transition sm:px-4 sm:py-4 sm:text-[13.5px] ${
                    isActive
                      ? "bg-gradient-to-r from-[#0046EA] via-[#006dff] to-[#0ea5ff] text-white shadow-[0_18px_36px_-22px_rgba(0,109,255,0.9)]"
                      : "text-slate-700 hover:bg-blue-50 hover:text-[#0046EA]"
                  }`}
                >
                  <item.icon size={21} strokeWidth={1.8} />
                  <span className="min-w-0 flex-1 leading-tight">{item.label}</span>
                  <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                </button>
              );
            })}
          </div>

          {/* Content Card */}
          <article className="grid min-w-0 overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-[0_28px_80px_-52px_rgba(15,23,42,0.65)] lg:grid-cols-[1.05fr_0.95fr]">
            <div className="min-w-0 p-7 lg:p-10 flex flex-col justify-between">
              <div>
                <span className="inline-flex rounded-full bg-gradient-to-r from-[#0046EA] via-[#006dff] to-[#0ea5ff] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.08em] text-white">
                  {selected.eyebrow}
                </span>
                <h3 className="mt-6 max-w-[14ch] font-display text-[clamp(29px,3.6vw,42px)] font-black leading-[1.02] tracking-[-0.05em] text-[#11142a]">
                  {selected.title}
                </h3>
                <p className="mt-5 max-w-[48ch] text-[14.5px] leading-relaxed text-slate-600">
                  {selected.description}
                </p>

                <ul className="mt-6 grid gap-3">
                  {selected.bullets.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-[13.5px] font-semibold text-slate-700"
                    >
                      <CheckCircle2
                        size={17}
                        className="mt-0.5 flex-none text-[#0046EA]"
                      />{" "}
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botón y Marcas en la misma sección inferior */}
              <div className="mt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-slate-100">
                <Link
                  href={selected.href}
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#0046EA] px-6 py-3 text-[14px] font-black text-[#0046EA] transition hover:bg-[#0046EA]/5"
                >
                  Ver más <ArrowRight size={17} />
                </Link>

                <div className="flex flex-wrap items-center gap-5 sm:gap-6">
                  {selected.brands.map((brand) => (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      key={brand.name}
                      src={brand.logo}
                      alt={brand.name}
                      className="h-6 sm:h-7 w-auto object-contain opacity-95 hover:opacity-100 transition-opacity"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Columna de la Imagen */}
            <div className="relative p-6 lg:p-8 flex items-stretch justify-center min-h-[340px] lg:min-h-auto">
              <div
                className="relative w-full min-h-[280px] lg:min-h-[360px] bg-gradient-to-br from-[#0046EA] via-[#006dff] to-[#0ea5ff] p-[3px] shadow-2xl transition-all duration-300 hover:scale-[1.01]"
                style={{
                  clipPath: "polygon(22% 0%, 100% 0%, 100% 100%, 20% 100%, 0% 48%)",
                }}
              >
                <div
                  className="absolute inset-[3px] left-[7px] bg-[#050816] overflow-hidden"
                  style={{
                    clipPath: "polygon(22% 0%, 100% 0%, 100% 100%, 20% 100%, 0% 48%)",
                  }}
                >
                  <Image
                    key={selected.image}
                    src={selected.image}
                    alt={selected.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover opacity-90 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#050816]/40 via-transparent to-[#38bdf8]/15" />
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
