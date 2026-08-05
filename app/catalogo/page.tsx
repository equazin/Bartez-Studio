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
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Catálogo de soluciones IT - Bartez Tecnología",
  description: "Explorá familias de equipamiento e infraestructura IT y consultá disponibilidad por WhatsApp.",
};

const families = [
  { title: "Notebooks corporativas", image: "/photos/products/laptop1.jpg", use: "Administración, ventas, dirección, movilidad y renovación de flotas.", brands: "Dell, Lenovo, HP", href: "/soluciones/notebooks-corporativas" },
  { title: "PCs y workstations", image: "/photos/products/desktop.jpg", use: "Oficina, diseño, ingeniería, CAD, desarrollo y alto desempeño.", brands: "Dell, Lenovo, HP, Intel, AMD", href: "/configurador" },
  { title: "BarPOS punto de venta", image: "/photos/products/desktop.jpg", use: "Puesto de venta electrónico completo para comercios, con software, periféricos, implementación y soporte.", brands: "BarPOS, OCOM, controladora fiscal", href: "/barpos" },
  { title: "Servidores y almacenamiento", image: "/photos/products/server.jpg", use: "Virtualización, archivos, bases de datos, aplicaciones y continuidad.", brands: "Dell, HPE, Lenovo, Kingston", href: "/soluciones/servidores" },
  { title: "Redes e infraestructura", image: "/photos/products/switch.jpg", use: "Switching, WiFi, routing, segmentación y conectividad multi-sede.", brands: "Cisco y alternativas según proyecto", href: "/soluciones/redes-infraestructura" },
  { title: "Monitores y periféricos", image: "/photos/products/monitor.jpg", use: "Puestos completos, videollamadas, productividad y ergonomía.", brands: "Líneas corporativas y profesionales", href: "/comparador" },
  { title: "Componentes y upgrades", image: "/photos/products/storage.jpg", use: "Memoria, SSD, almacenamiento, procesadores y ampliaciones.", brands: "Intel, AMD, Kingston y más", href: "/comparador" },
  { title: "Energía y continuidad", image: "/photos/products/ups.jpg", use: "UPS, protección eléctrica y continuidad para puestos e infraestructura.", brands: "Alternativas según potencia y autonomía", href: "/soluciones/servidores" },
  { title: "Videovigilancia", image: "/photos/products/cctv.jpg", use: "Cámaras IP, grabación, almacenamiento y monitoreo empresarial.", brands: "Opciones dimensionadas por cobertura y retención", href: "/soluciones/videovigilancia-cctv" },
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
        intro="Explorá el tipo de solución que necesitás. No publicamos precios ni stock en tiempo real: confirmamos modelos, alternativas y plazos cuando recibimos tu consulta."
        image="/photos/hero-products-combo.png"
        imageAlt="Equipamiento tecnológico Bartez"
        imagePriority
        mediaLabel="Portfolio B2B"
        mediaTitle="Catálogo orientativo, cotización real."
        mediaSubtitle="Cada familia puede tener modelos equivalentes según disponibilidad, plazo y uso."
        mediaItems={[
          { title: "Familias", description: "Equipos, redes, servidores, POS y energía." },
          { title: "Alternativas", description: "Marcas y configuraciones equivalentes." },
          { title: "Consulta", description: "Respuesta comercial con disponibilidad y plazo confirmados." },
        ]}
        metrics={[
          { value: "9", label: "familias principales" },
          { value: "B2B", label: "catálogo corporativo" },
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
        intro="Usá estas familias como punto de partida. Después confirmamos modelos, equivalencias y plazos."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {families.map((family) => (
            <article key={family.title} className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200">
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
        intro="Enviá el detalle y preparamos una respuesta con disponibilidad, alternativas y plazos."
        actions={[
          { label: "Enviar por WhatsApp", href: whatsappHref, external: true, icon: MessageCircle },
          { label: "Usar RFQ", href: "/rfq", variant: "secondary", icon: ArrowRight },
        ]}
      />
    </InternalPageShell>
  );
}
