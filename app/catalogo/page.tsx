import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import {
  InternalCta,
  InternalHero,
  InternalPageShell,
  InternalSection,
} from "@/components/InternalPage";
import { company } from "@/constants";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Catálogo de soluciones IT - Bartez Tecnología",
  description:
    "Familias IT para empresas y organismos: notebooks, workstations alta gama, servidores, redes, WiFi multi-sede, CCTV, cableado, energía y BarPOS. Cotización real en 24 hs.",
  alternates: { canonical: "/catalogo" },
  openGraph: {
    title: "Catálogo de soluciones IT - Bartez Tecnología",
    description:
      "12 familias B2B: notebooks, workstations alta gama, servidores rack, redes Cisco/Aruba/UniFi, CCTV, cableado y racks, energía UPS, y BarPOS.",
    url: `${company.url}/catalogo`,
    type: "website",
  },
};

const families = [
  {
    anchor: "notebooks",
    title: "Notebooks corporativas",
    image: "/photos/products/laptop1.jpg",
    use: "Renovación de parque por lote con Windows 11 Pro, imagen unificada y entrega escalonada a una o varias sedes.",
    brands: "Lenovo ThinkPad · HP ProBook / EliteBook · Dell Latitude",
    href: "/soluciones/notebooks-corporativas",
  },
  {
    anchor: "workstations-alta-gama",
    title: "Workstations alta gama",
    image: "/photos/products/desktop.jpg",
    use: "Estaciones CTO/BTO para GIS/fotogrametría, render, cálculo, CAD, IA/GPU. RAM ECC hasta 512 GB y GPU profesional certificada ISV.",
    brands: "Dell Precision · HP Z / ZBook · Lenovo ThinkStation",
    href: "/soluciones/workstations-alta-gama",
  },
  {
    anchor: "pcs",
    title: "PCs de escritorio y flota",
    image: "/photos/products/desktop.jpg",
    use: "Renovación de puestos administrativos, atención al cliente, producción y aulas. Compra por lote con Win 11 Pro.",
    brands: "Lenovo ThinkCentre · HP ProDesk / EliteDesk · Dell OptiPlex",
    href: "/soluciones/workstations-pcs",
  },
  {
    anchor: "almacenamiento",
    title: "Servidores y virtualización",
    image: "/photos/products/server.jpg",
    use: "Servidores rack configurados a medida para virtualización Proxmox VE, VMware o Hyper-V. HBA para ZFS, canales de memoria poblados, fuentes redundantes.",
    brands: "Lenovo ThinkSystem · HPE ProLiant · Dell PowerEdge",
    href: "/soluciones/servidores",
  },
  {
    anchor: "redes",
    title: "Redes empresariales",
    image: "/photos/products/switch.jpg",
    use: "Switches core administrables, WiFi corporativo, firewalls y segmentación por VLAN. Relevamiento previo e implementación con instaladores partners.",
    brands: "Cisco Catalyst · Aruba · Ubiquiti UniFi · Fortinet",
    href: "/soluciones/redes-infraestructura",
  },
  {
    anchor: "wifi-multisede",
    title: "WiFi multi-sede (UniFi)",
    image: "/photos/products/switch.jpg",
    use: "Proyectos WiFi en varias sedes con controlador central UniFi, relevamiento por sitio, equipamiento de contingencia y despliegue con partners.",
    brands: "Ubiquiti UniFi · Alternativa Aruba Central",
    href: "/soluciones/wifi-multisede",
  },
  {
    anchor: "videovigilancia",
    title: "Videovigilancia / CCTV",
    image: "/photos/cctv.jpg",
    use: "Cámaras IP direccionales, panorámicas y 360° para oficinas, plantas y predios recreativos. NVR dimensionado, discos CCTV específicos y cableado exterior.",
    brands: "Hikvision · Dahua · Ubiquiti Protect · WD Purple / SkyHawk",
    href: "/soluciones/videovigilancia-cctv",
  },
  {
    anchor: "cableado-racks",
    title: "Cableado y racks",
    image: "/photos/products/switch.jpg",
    use: "Racks abiertos y cerrados, bandejas, patch panels, cableado UTP/FTP y fibra óptica. Suministro y coordinación de tendido con instaladores partners.",
    brands: "GLC · Kingston · Alternativas según proyecto",
    href: "/soluciones/cableado-racks",
  },
  {
    anchor: "energia",
    title: "Energía y continuidad",
    image: "/photos/products/ups.jpg",
    use: "UPS para servidores, racks, puestos críticos y CCTV. PDU para racks. Dimensionamiento por consumo y autonomía requerida.",
    brands: "APC · Vertiv · Alternativas según potencia",
    href: "/soluciones/servidores",
  },
  {
    anchor: "monitores",
    title: "Monitores y periféricos",
    image: "/photos/products/monitor.jpg",
    use: "Puestos completos, videollamadas, calibración para diseño, dual/triple monitor y ergonomía. Docks USB-C para notebooks.",
    brands: "Dell UltraSharp · HP Z · Lenovo · Líneas profesionales",
    href: "/soluciones/perifericos-corporativos",
  },
  {
    anchor: "componentes",
    title: "Componentes y upgrades",
    image: "/photos/products/storage.jpg",
    use: "Memoria DDR4/DDR5 ECC y no-ECC, SSD NVMe y SAS enterprise, procesadores y ampliaciones para servidores y workstations.",
    brands: "Kingston · WD · Intel · AMD",
    href: "/comparador",
  },
  {
    anchor: "pos",
    title: "BarPOS punto de venta",
    image: "/photos/products/desktop.jpg",
    use: "Puesto de venta electrónico completo para comercios: hardware, software, controladora fiscal, capacitación y soporte.",
    brands: "BarPOS 4.0 · 3nStar · OCOM · Epson",
    href: "/barpos",
  },
];

export default function CatalogoPage() {
  const whatsappHref = buildWhatsAppUrl("quote", ["Origen: catálogo web"]);

  return (
    <InternalPageShell>
      <InternalHero
        eyebrow="Catálogo de soluciones"
        title={
          <>
            Familias IT para elegir <span className="text-[#0046EA]">por necesidad.</span>
          </>
        }
        intro="Explorá las 12 familias que trabajamos. No publicamos precios ni stock en tiempo real — confirmamos modelos, alternativas y plazos cuando recibimos tu consulta, con comparación multi-marca cuando corresponde."
        image="/photos/hero-products-combo.png"
        imageAlt="Equipamiento tecnológico Bartez"
        imagePriority
        mediaLabel="Portfolio B2B"
        mediaTitle="Catálogo orientativo, cotización real."
        mediaSubtitle="Cada familia con modelos equivalentes de las principales marcas del mercado corporativo."
        mediaItems={[
          { title: "Familias", description: `${families.length} categorías del rango B2B.` },
          { title: "Multi-marca", description: "Lenovo, HPE, Dell, Cisco, Aruba, UniFi, APC." },
          { title: "Consulta", description: "Disponibilidad y plazo confirmados al cotizar." },
        ]}
        metrics={[
          { value: `${families.length}`, label: "familias del catálogo" },
          { value: "B2B", label: "cotización real, no lista" },
          { value: "24 hs", label: "respuesta inicial" },
        ]}
        actions={[
          { label: "Consultar disponibilidad", href: whatsappHref, external: true, icon: MessageCircle },
          { label: "Ya tengo modelos", href: "/rfq", variant: "secondary", icon: ArrowRight },
        ]}
      />

      <InternalSection
        tone="soft"
        eyebrow="Categorías"
        title="Explorá por tipo de solución."
        intro="Cada familia linkea a su vertical con el detalle técnico, comparativa multi-marca y FAQs específicas."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {families.map((family) => (
            <article key={family.title} id={family.anchor} className="scroll-mt-24 group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200">
              <div className="relative aspect-[16/8] overflow-hidden bg-slate-100">
                <Image src={family.image} alt={family.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
              </div>
              <div className="p-6">
                <h2 className="font-display text-[20px] font-semibold text-[#11142a]">{family.title}</h2>
                <p className="mt-3 text-[13.5px] leading-relaxed text-slate-600">{family.use}</p>
                <p className="mt-4 text-[12px] font-bold text-slate-500">{family.brands}</p>
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
                  <Link href={family.href} className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0046EA]">
                    Ver opciones <ArrowRight size={15} />
                  </Link>
                  <a href={buildWhatsAppUrl("quote", [`Familia de interés: ${family.title}`])} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#11142a]">
                    <MessageCircle size={15} /> Consultar
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </InternalSection>

      <InternalCta
        title="¿Tenés una lista de modelos o cantidades?"
        intro="Enviá el detalle por RFQ (con CUIT, cantidad, plazo, condiciones) y preparamos una respuesta con disponibilidad, alternativas multi-marca y plazos por escrito."
        actions={[
          { label: "Enviar RFQ", href: "/rfq", icon: ArrowRight },
          { label: "Consultar por WhatsApp", href: whatsappHref, external: true, variant: "secondary", icon: MessageCircle },
        ]}
      />
    </InternalPageShell>
  );
}
