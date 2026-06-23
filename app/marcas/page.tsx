import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
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
  MessageCircle,
  Cloud,
} from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { whatsappLinks } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Marcas que trabajamos — Bartez Tecnología",
  description:
    "Conocé las marcas de tecnología que trabajamos para empresas, organismos y revendedores: Dell, Lenovo, HP, Cisco, Intel, AMD, Kingston y más.",
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
    accent: "text-blue-500",
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
    accent: "text-red-500",
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
    accent: "text-sky-500",
  },
  {
    name: "Hewlett Packard Enterprise",
    logo: "/logos/hpe.svg",
    category: "Servidores · Almacenamiento · Networking",
    description:
      "Soluciones empresariales avanzadas de Hewlett Packard Enterprise. Distribuimos servidores ProLiant Gen11, soluciones de almacenamiento modular Alletra y equipamiento de misión crítica.",
    products: [
      { icon: Server, label: "Servidores HPE ProLiant" },
      { icon: HardDrive, label: "Almacenamiento Alletra" },
      { icon: Network, label: "Switches y conectividad" },
      { icon: Package, label: "Soporte HPE Pointnext" },
    ],
    accent: "text-emerald-500",
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
    accent: "text-teal-500",
  },
  {
    name: "Aruba",
    logo: "/logos/aruba.svg",
    category: "Networking · WiFi corporativo · Switches",
    description:
      "Conectividad inteligente y segura para empresas de Aruba Networks (HPE). Switches Instant On, access points WiFi 6 administrables en la nube y soluciones SD-WAN.",
    products: [
      { icon: Network, label: "Switches Instant On" },
      { icon: Network, label: "Access Points WiFi 6" },
      { icon: Shield, label: "Seguridad y control ClearPass" },
      { icon: Cloud, label: "Gestión Aruba Central" },
    ],
    accent: "text-orange-500",
  },
  {
    name: "APC",
    logo: "/logos/apc.svg",
    category: "Energía · UPS · Racks · Distribución",
    description:
      "Sistemas de energía ininterrumpida y protección eléctrica APC by Schneider Electric. UPS Smart-UPS monofásicas y trifásicas, racks NetShelter y PDUs para datacenters.",
    products: [
      { icon: Cpu, label: "Smart-UPS Monofásicas" },
      { icon: Server, label: "Sistemas trifásicos Symmetra" },
      { icon: Package, label: "Racks y gabinetes" },
      { icon: HardDrive, label: "PDUs de distribución" },
    ],
    accent: "text-red-500",
  },
  {
    name: "Lyonn",
    logo: "/logos/lyonn.svg",
    category: "Protección de energía · UPS · Estabilizadores",
    description:
      "Soluciones de respaldo y protección eléctrica Lyonn. UPS hogareñas e industriales, estabilizadores de tensión y baterías de reemplazo con excelente relación costo-beneficio.",
    products: [
      { icon: Cpu, label: "UPS interactivos (650-2000VA)" },
      { icon: Server, label: "UPS Online Doble Conversión" },
      { icon: Package, label: "Estabilizadores de tensión" },
      { icon: HardDrive, label: "Baterías selladas" },
    ],
    accent: "text-blue-500",
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
    accent: "text-blue-500",
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
    accent: "text-orange-500",
  },
  {
    name: "Kingston",
    logo: "/logos/kingston.svg",
    category: "RAM · SSDs · Memorias Flash",
    description:
      "Memorias RAM, SSDs y storage flash para upgrades corporativos. Consultanos compatibilidad, disponibilidad y las condiciones de garantía aplicables a cada línea.",
    products: [
      { icon: HardDrive, label: "RAM DDR4 / DDR5" },
      { icon: HardDrive, label: "SSDs SATA / NVMe" },
      { icon: Package, label: "Memorias flash USB" },
      { icon: Package, label: "HyperX Gaming" },
    ],
    accent: "text-red-500",
  },
];

const whyBrands = [
  { title: "Portfolio para cada necesidad", desc: "Combinamos líneas corporativas, infraestructura, componentes y periféricos." },
  { title: "Disponibilidad a consultar", desc: "Confirmamos alternativas y plazos al momento de cada cotización." },
  { title: "Asesoramiento especializado", desc: "Te ayudamos a comparar familias y dimensionar la opción adecuada." },
  { title: "Condiciones B2B", desc: "Preparamos propuestas por volumen para empresas, organismos y revendedores." },
];

export default function MarcasPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#030c07] text-white pt-20">
        
        {/* Hero */}
        <section className="bg-[#030c07] py-20 md:py-28 relative">
          <div className="mx-auto max-w-[1200px] px-6">
            <h1 className="max-w-[700px] font-display text-[clamp(38px,5.5vw,66px)] font-extrabold leading-[0.98] tracking-[-0.05em] text-balance text-white">
              Marcas que trabajamos para cada proyecto.
            </h1>
            <p className="mt-7 max-w-[56ch] text-[clamp(15px,1.4vw,17px)] leading-relaxed text-slate-400">
              Trabajamos con fabricantes reconocidos en equipamiento, infraestructura, redes y componentes. Consultanos disponibilidad, alternativas y condiciones para tu empresa o canal.
            </p>
            <div className="mt-10 flex flex-col gap-3.5 sm:flex-row sm:items-center">
              <a
                href={whatsappLinks.quote}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-[14.5px] font-bold text-ink transition hover:scale-[1.02]"
              >
                <MessageCircle size={17} /> Consultar disponibilidad
              </a>
              <Link
                href="/revendedores"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-3.5 text-[14px] font-semibold text-white transition hover:bg-white/10"
              >
                Soy revendedor <ExternalLink size={15} />
              </Link>
            </div>
          </div>
        </section>

        {/* Cómo trabajamos el portfolio */}
        <section className="bg-[#06140d] border-y border-white/5 py-14">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {whyBrands.map((item) => (
                <div key={item.title} className="flex gap-3 rounded-2xl bg-[#082214] p-5 border border-white/5">
                  <CheckCircle2 className="mt-0.5 size-5 flex-none text-accent" strokeWidth={1.8} />
                  <div>
                    <h3 className="font-display text-[14px] font-bold text-white">{item.title}</h3>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Grid de marcas */}
        <section className="bg-[#030c07] py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6">
            <h2 className="font-display text-[clamp(26px,3.5vw,40px)] font-bold tracking-[-0.035em] text-white">
              Nuestro portfolio de marcas
            </h2>
            <p className="mt-3 max-w-[55ch] text-[15px] leading-relaxed text-slate-400">
              Seleccionamos las marcas líderes en cada categoría para cubrir todos los segmentos y presupuestos.
            </p>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {brands.map((brand) => (
                <div
                  key={brand.name}
                  className="group rounded-3xl border border-white/5 bg-[#082214] p-8 hover:border-accent/30 transition duration-300 shadow-soft"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className={`text-[11px] font-bold uppercase tracking-[0.15em] ${brand.accent}`}>
                        {brand.category}
                      </span>
                      <div className="mt-3 h-8 grayscale contrast-125 opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:contrast-100 transition-all duration-300">
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

                  <p className="mt-5 text-[13.5px] leading-relaxed text-slate-400">
                    {brand.description}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    {brand.products.map((product) => (
                      <div key={product.label} className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-100 px-3 py-2">
                        <product.icon className="size-3.5 flex-none text-[#1236d8]" strokeWidth={1.6} />
                        <span className="text-[12px] font-medium text-slate-600">{product.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#06140d] border-t border-white/5 py-16 text-white">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-display text-[clamp(24px,3vw,36px)] font-bold tracking-[-0.03em] text-white">
                  ¿Buscás un producto específico?
                </h2>
                <p className="mt-3 max-w-[50ch] text-[15px] leading-relaxed text-slate-300">
                  Consultanos disponibilidad, condiciones y precios. Un especialista te responde en 24 hs hábiles.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={whatsappLinks.quote}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-[14.5px] font-bold text-ink transition hover:scale-[1.02]"
                >
                  <MessageCircle size={17} /> Pedir cotización
                </a>
                <Link
                  href="/revendedores"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3.5 text-[14.5px] font-semibold text-white transition hover:bg-white/10"
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
