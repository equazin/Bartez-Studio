import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Laptop,
  Network,
  Package,
  Server,
  Shield,
  Cpu,
  HardDrive,
  Monitor,
} from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

export const metadata: Metadata = {
  title: "Marcas y Partners Oficiales — Bartez Tecnología",
  description:
    "Distribuimos tecnología de primera línea de Dell, Lenovo, HP, Cisco, Intel, AMD y Kingston. Conocé el portfolio de marcas oficiales que respalda a Bartez Tecnología.",
};

const brands = [
  {
    name: "Dell",
    logo: "/logos/dell.svg",
    category: "Servidores · Notebooks · Workstations · Storage",
    description:
      "Distribuimos toda la línea de Dell para el mercado corporativo: servidores PowerEdge, notebooks Latitude y Vostro para empresas, workstations Precision y storage PowerVault.",
    products: [
      { icon: Server, label: "Servidores PowerEdge" },
      { icon: Laptop, label: "Notebooks Latitude / Vostro" },
      { icon: Monitor, label: "Workstations Precision" },
      { icon: HardDrive, label: "Storage PowerVault / EMC" },
    ],
    color: "bg-blue-50 border-blue-100",
    accent: "text-blue-700",
  },
  {
    name: "Lenovo",
    logo: "/logos/lenovo.svg",
    category: "Notebooks · PCs · Servidores",
    description:
      "Portfolio completo Lenovo para empresas: notebooks ThinkPad (la línea más confiable del mercado corporativo), ThinkCentre para escritorio y servidores ThinkSystem.",
    products: [
      { icon: Laptop, label: "ThinkPad / IdeaPad" },
      { icon: Monitor, label: "ThinkCentre / ThinkStation" },
      { icon: Server, label: "ThinkSystem / ThinkAgile" },
      { icon: Package, label: "Periféricos y accesorios" },
    ],
    color: "bg-red-50 border-red-100",
    accent: "text-red-700",
  },
  {
    name: "HP",
    logo: "/logos/hp.svg",
    category: "Notebooks · PCs · Impresoras · Servidores",
    description:
      "HP cubre todos los segmentos: ProBook y EliteBook para empresas, ProDesk para escritorio corporativo y ProLiant para servidores. Además impresoras LaserJet para oficina.",
    products: [
      { icon: Laptop, label: "ProBook / EliteBook" },
      { icon: Monitor, label: "ProDesk / EliteDesk" },
      { icon: Server, label: "ProLiant (HPE)" },
      { icon: Package, label: "Impresoras LaserJet" },
    ],
    color: "bg-sky-50 border-sky-100",
    accent: "text-sky-700",
  },
  {
    name: "Cisco",
    logo: "/logos/cisco.svg",
    category: "Switches · Routers · Firewalls · WiFi",
    description:
      "Líderes mundiales en networking. Distribuimos switches Catalyst y Meraki, routers, firewalls Firepower/ASA y access points WiFi 6 para redes empresariales de cualquier escala.",
    products: [
      { icon: Network, label: "Switches Catalyst / Meraki" },
      { icon: Shield, label: "Firewalls Firepower / ASA" },
      { icon: Network, label: "Routers empresariales" },
      { icon: Network, label: "Access Points WiFi 6" },
    ],
    color: "bg-teal-50 border-teal-100",
    accent: "text-teal-700",
  },
  {
    name: "Intel",
    logo: "/logos/intel.svg",
    category: "Procesadores · NUC · Componentes",
    description:
      "Procesadores Intel Core e Intel Xeon para workstations y servidores. Componentes de alta performance para ensamble de PCs y estaciones de trabajo corporativas.",
    products: [
      { icon: Cpu, label: "Procesadores Core" },
      { icon: Cpu, label: "Xeon para servidores" },
      { icon: Package, label: "Intel NUC" },
      { icon: Package, label: "Componentes y accesorios" },
    ],
    color: "bg-blue-50 border-blue-100",
    accent: "text-blue-600",
  },
  {
    name: "AMD",
    logo: "/logos/amd.svg",
    category: "Procesadores · GPUs · Componentes",
    description:
      "Procesadores Ryzen para workstations y PCs de alto rendimiento. GPUs Radeon para estaciones gráficas, diseño y renderizado. La alternativa de performance para cada presupuesto.",
    products: [
      { icon: Cpu, label: "Ryzen 5 / 7 / 9" },
      { icon: Cpu, label: "EPYC para servidores" },
      { icon: Monitor, label: "Radeon GPUs" },
      { icon: Package, label: "Componentes" },
    ],
    color: "bg-orange-50 border-orange-100",
    accent: "text-orange-700",
  },
  {
    name: "Kingston",
    logo: "/logos/kingston.svg",
    category: "RAM · SSDs · Memorias Flash",
    description:
      "Memorias RAM, SSDs y storage flash de máxima confiabilidad para upgrades corporativos. Compatible con todos los fabricantes. Garantía de por vida en líneas Kingston y HyperX.",
    products: [
      { icon: HardDrive, label: "RAM DDR4 / DDR5" },
      { icon: HardDrive, label: "SSDs SATA / NVMe" },
      { icon: Package, label: "Memorias flash USB" },
      { icon: Package, label: "HyperX Gaming" },
    ],
    color: "bg-red-50 border-red-100",
    accent: "text-red-600",
  },
];

const whyPartners = [
  { title: "Garantía oficial de fábrica", desc: "Todos los productos que distribuimos tienen respaldo directo del fabricante." },
  { title: "Stock disponible", desc: "Accedemos a stock de las principales líneas para responder con agilidad." },
  { title: "Soporte técnico certificado", desc: "Nuestro equipo está capacitado en los productos que ofrecemos." },
  { title: "Precios de canal", desc: "Condiciones comerciales competitivas gracias a nuestra relación directa con los fabricantes." },
];

export default function MarcasPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-ink py-20 text-white md:py-28">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 mb-6">
              <Package className="size-3.5 text-accent" />
              <span className="text-[12px] font-semibold tracking-wide text-slate-200">Partners y marcas oficiales</span>
            </div>
            <h1 className="max-w-[700px] font-display text-[clamp(38px,5.5vw,66px)] font-bold leading-[0.98] tracking-[-0.05em] text-balance">
              Las mejores marcas del mundo,{" "}
              <span className="text-gradient">con el respaldo de Bartez.</span>
            </h1>
            <p className="mt-7 max-w-[56ch] text-[clamp(15px,1.4vw,17px)] leading-relaxed text-slate-300">
              Distribuimos tecnología de primera línea de los fabricantes más reconocidos del mercado. Más de 30 años de relaciones comerciales nos permiten ofrecer las mejores condiciones con garantía oficial.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/#cotiza"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-[14.5px] font-semibold text-ink transition-all hover:-translate-y-0.5"
              >
                Consultá disponibilidad <ArrowRight size={16} />
              </Link>
              <Link
                href="/revendedores"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-5 py-3.5 text-[14px] font-semibold transition-colors hover:border-white/60"
              >
                Soy revendedor <ExternalLink size={15} />
              </Link>
            </div>
          </div>
        </section>

        {/* Por qué trabajar con marcas oficiales */}
        <section className="bg-slate-50 py-14">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {whyPartners.map((item) => (
                <div key={item.title} className="flex gap-3 rounded-2xl bg-white p-5 shadow-soft border border-slate-100">
                  <CheckCircle2 className="mt-0.5 size-5 flex-none text-brand" strokeWidth={1.8} />
                  <div>
                    <h3 className="font-display text-[14px] font-semibold text-ink">{item.title}</h3>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Grid de marcas */}
        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6">
            <h2 className="font-display text-[clamp(26px,3.5vw,40px)] font-bold tracking-[-0.035em] text-ink">
              Nuestro portfolio de marcas
            </h2>
            <p className="mt-3 max-w-[55ch] text-[15px] leading-relaxed text-slate-500">
              Seleccionamos las marcas líderes en cada categoría para cubrir todos los segmentos y presupuestos.
            </p>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {brands.map((brand) => (
                <div
                  key={brand.name}
                  className={`group rounded-2xl border p-7 transition-shadow hover:shadow-card ${brand.color}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className={`text-[11px] font-bold uppercase tracking-[0.15em] ${brand.accent}`}>
                        {brand.category}
                      </span>
                      <div className="mt-3 h-8">
                        <Image
                          src={brand.logo}
                          alt={brand.name}
                          width={120}
                          height={32}
                          className="h-7 w-auto object-left"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="mt-5 text-[13.5px] leading-relaxed text-slate-600">
                    {brand.description}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    {brand.products.map((product) => (
                      <div key={product.label} className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2">
                        <product.icon className="size-3.5 flex-none text-slate-500" strokeWidth={1.6} />
                        <span className="text-[12px] font-medium text-slate-700">{product.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-ink py-16 text-white">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-display text-[clamp(24px,3vw,36px)] font-bold tracking-[-0.03em]">
                  ¿Buscás un producto específico?
                </h2>
                <p className="mt-3 max-w-[50ch] text-[15px] leading-relaxed text-slate-300">
                  Consultanos disponibilidad, condiciones y precios. Un especialista te responde en 24 hs hábiles.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/#cotiza"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-[14.5px] font-semibold text-ink transition-all hover:-translate-y-0.5"
                >
                  Pedir cotización <ArrowRight size={16} />
                </Link>
                <Link
                  href="/revendedores"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 px-6 py-3.5 text-[14.5px] font-semibold transition-colors hover:border-white/60"
                >
                  Canal revendedores
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
