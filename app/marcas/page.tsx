import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, CheckCircle2, MessageCircle, Package } from "lucide-react";
import {
  InternalCta,
  InternalFeatureGrid,
  InternalHero,
  InternalPageShell,
  InternalSection,
} from "@/components/InternalPage";
import { buildWhatsAppUrl, whatsappLinks } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Marcas que trabajamos - Bartez Tecnología",
  description:
    "Conoce las marcas de tecnología que trabajamos para empresas, organismos y revendedores: Dell, Lenovo, HP, Cisco, Intel, AMD, Kingston y más.",
};

const brands = [
  { name: "Dell", logo: "/logos/dell.png", category: "Servidores, notebooks, workstations y storage", products: ["PowerEdge", "Latitude", "Precision", "PowerVault"] },
  { name: "Lenovo", logo: "/logos/lenovo.png", category: "Notebooks, PCs y servidores", products: ["ThinkPad", "ThinkCentre", "ThinkStation", "ThinkSystem"] },
  { name: "HP", logo: "/logos/hp.png", category: "Notebooks, PCs e impresion", products: ["ProBook", "EliteBook", "ProDesk", "LaserJet"] },
  { name: "HPE", logo: "/logos/hpe.png", category: "Servidores, storage y networking", products: ["ProLiant", "Alletra", "Aruba", "Pointnext"] },
  { name: "Cisco", logo: "/logos/cisco.png", category: "Switches, routers, firewalls y WiFi", products: ["Catalyst", "Meraki", "Firepower", "WiFi 6"] },
  { name: "Aruba", logo: "/logos/aruba.png", category: "Networking y WiFi corporativo", products: ["Instant On", "Access Points", "Switches", "Central"] },
  { name: "APC", logo: "/logos/apc.svg", category: "Energía, UPS, racks y PDUs", products: ["Smart-UPS", "NetShelter", "PDUs", "Symmetra"] },
  { name: "Lyonn", logo: "/logos/lyonn.png", category: "UPS y protección eléctrica", products: ["UPS interactivos", "UPS online", "Estabilizadores", "Baterias"] },
  { name: "Intel", logo: "/logos/intel.png", category: "Procesadores y componentes", products: ["Core", "Xeon", "NUC", "Componentes"] },
  { name: "AMD", logo: "/logos/amd.png", category: "Procesadores, GPUs y componentes", products: ["Ryzen", "EPYC", "Radeon", "Componentes"] },
  { name: "Kingston", logo: "/logos/kingston.png", category: "RAM, SSDs y memorias flash", products: ["DDR4", "DDR5", "NVMe", "USB"] },
  { name: "Microsoft", logo: "/logos/microsoft.svg", category: "Sistemas, licencias y cloud", products: ["Microsoft 365", "Windows Server", "Office", "Azure"] },
  { name: "ESET", logo: "/logos/eset.svg", category: "Antivirus y seguridad endpoint", products: ["Endpoint", "NOD32", "Cloud admin", "Mobile"] },
  { name: "Epson", logo: "/logos/epson.png", category: "Impresion, proyectores y POS", products: ["EcoTank", "Laser", "Tickets POS", "PowerLite"] },
  { name: "3nStar", logo: "/logos/3nstar.png", category: "Punto de venta y lectores", products: ["Terminales POS", "Lectores", "Impresoras", "Cajones"] },
  { name: "OCOM", logo: "/logos/ocom.png", category: "Hardware POS e impresion", products: ["Terminales", "Tickets", "Lectores", "Accesorios"] },
  { name: "Ubiquiti", logo: "/logos/ubiquiti.png", category: "WiFi, switching y videovigilancia", products: ["UniFi", "Switches", "Gateways", "Protect"] },
  { name: "Vertiv", logo: "/logos/vertiv.png", category: "Energía, racks y datacenter", products: ["Liebert", "SmartCabinet", "PDUs", "UPS"] },
  { name: "GLC", logo: "/logos/glc.png", category: "Fibra optica, cableado y conectividad", products: ["UTP", "Fibra", "Patch panels", "Racks"] },
  { name: "WD", logo: "/logos/wd.png", category: "Discos, SSDs y almacenamiento", products: ["Purple", "Red", "Gold", "NVMe"] },
];

const whyBrands = [
  { title: "Portfolio para cada necesidad", description: "Combinamos líneas corporativas, infraestructura, componentes, energía y periféricos." },
  { title: "Disponibilidad a consultar", description: "Confirmamos alternativas y plazos al momento de cada cotización." },
  { title: "Asesoramiento especializado", description: "Te ayudamos a comparar familias y dimensionar la opción adecuada." },
  { title: "Condiciones B2B", description: "Preparamos propuestas por volumen para empresas, organismos y revendedores." },
];

export default function MarcasPage() {
  return (
    <InternalPageShell>
      <InternalHero
        eyebrow="Portfolio de fabricantes"
        title={
          <>
            Marcas que trabajamos <span className="text-[#0046EA]">para cada proyecto.</span>
          </>
        }
        intro="Trabajamos con fabricantes reconocidos en equipamiento, infraestructura, redes, componentes y punto de venta. Consultanos disponibilidad, alternativas y condiciones para tu empresa o canal."
        actions={[
          { label: "Consultar disponibilidad", href: whatsappLinks.quote, external: true, icon: MessageCircle },
          { label: "Soy revendedor", href: "/revendedores", variant: "secondary", icon: ArrowRight },
        ]}
        metrics={[
          { value: "20+", label: "fabricantes activos" },
          { value: "B2B", label: "condiciones por volumen" },
          { value: "IT", label: "portfolio corporativo" },
        ]}
      >
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_28px_70px_-46px_rgba(17,20,42,0.42)]">
          <div className="grid grid-cols-2 gap-px bg-slate-200 sm:grid-cols-3">
            {brands.slice(0, 9).map((brand) => (
              <div key={brand.name} className="flex h-28 items-center justify-center bg-white p-5">
                <Image src={brand.logo} alt={brand.name} width={150} height={52} className="max-h-12 w-auto object-contain" />
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 bg-[#f7f9fc] p-6">
            <p className="text-[13px] font-bold text-[#0046EA]">Hardware, software, energía y conectividad</p>
            <h2 className="mt-2 font-display text-[24px] font-extrabold text-[#11142a]">Selección por categoría, disponibilidad y contexto.</h2>
            <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">
              No empujamos una sola marca. Comparamos alternativas según uso, presupuesto y plazo de entrega.
            </p>
          </div>
        </div>
      </InternalHero>

      <InternalSection tone="soft" eyebrow="Cómo trabajamos el portfolio" title="La marca se elige despues de entender la necesidad.">
        <InternalFeatureGrid columns="four" features={whyBrands} />
      </InternalSection>

      <InternalSection
        tone="white"
        eyebrow="Portfolio"
        title="Fabricantes y líneas que podemos cotizar."
        intro="Selecciónamos marcas líderes para cubrir segmentos corporativos, infraestructura, energía, punto de venta y componentes."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {brands.map((brand) => {
            const brandWhatsAppHref = buildWhatsAppUrl("quote", [
              `Marca de interés: ${brand.name}`,
              `Líneas: ${brand.products.join(", ")}`,
              "Origen: página de marcas",
            ]);
            return (
              <a
                key={brand.name}
                href={brandWhatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Cotizar productos de ${brand.name} por WhatsApp`}
                className="group flex flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-[0_18px_50px_-40px_rgba(17,20,42,0.35)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_24px_60px_-36px_rgba(0,70,234,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
              >
                <p className="text-[12px] font-bold text-[#0046EA]">{brand.category}</p>
                <div className="mt-4 flex h-14 items-center">
                  <Image src={brand.logo} alt={brand.name} width={180} height={52} className="h-12 w-auto object-contain object-left" />
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  {brand.products.map((product) => (
                    <div key={product} className="flex min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-[#f7f9fc] px-3 py-2">
                      <Package className="size-3.5 flex-none text-[#0046EA]" strokeWidth={1.7} />
                      <span className="min-w-0 text-[12px] font-medium leading-snug text-slate-700">{product}</span>
                    </div>
                  ))}
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#0046EA] opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                  Cotizar {brand.name} por WhatsApp <ArrowRight size={13} />
                </span>
              </a>
            );
          })}
        </div>
      </InternalSection>

      <InternalSection tone="soft" eyebrow="Disponibilidad" title="La cotización se confirma con datos vigentes.">
        <div className="grid gap-5 md:grid-cols-3">
          {["Modelos equivalentes cuando no hay stock", "Plazos confirmados al momento de cotizar", "Condiciones por volumen para empresas y canal"].map((item) => (
            <div key={item} className="flex gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <CheckCircle2 className="mt-0.5 size-5 flex-none text-[#0046EA]" strokeWidth={1.8} />
              <p className="text-[14px] font-semibold leading-relaxed text-[#11142a]">{item}</p>
            </div>
          ))}
        </div>
      </InternalSection>

      <InternalCta
        title="Buscás un producto específico?"
        intro="Consultanos disponibilidad, condiciones y precios. Un especialista te responde en 24 hs hábiles."
        actions={[
          { label: "Pedir cotización", href: whatsappLinks.quote, external: true, icon: MessageCircle },
          { label: "Canal revendedores", href: "/revendedores", variant: "secondary", icon: ArrowRight },
        ]}
      />
    </InternalPageShell>
  );
}
