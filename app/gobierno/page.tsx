import type { Metadata } from "next";
import { ArrowRight, Building, Building2, FileText, Globe, GraduationCap, Headphones, HeartPulse, Landmark, Mail, MessageCircle, Package, ShieldCheck } from "lucide-react";
import {
  InternalCta,
  InternalFeatureGrid,
  InternalHero,
  InternalPageShell,
  InternalSection,
} from "@/components/InternalPage";
import { contact } from "@/constants";
import { whatsappLinks } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Tecnología para el Sector Público - Bartez Tecnología",
  description:
    "Provision de equipamiento IT para organismos públicos, municipios, ministerios y entidades estatales en Argentina. Cotizaciones para licitaciones y compras directas.",
};

const offerings = [
  { icon: FileText, title: "Documentación completa", description: "Presupuestos formales, cotizaciones para licitaciones y documentación requerida por procesos de compra pública." },
  { icon: Building2, title: "Organismos de todos los niveles", description: "Municipal, provincial y nacional. Experiencia en diferentes escalas de gobierno." },
  { icon: ShieldCheck, title: "Factura A garantizada", description: "Somos Responsable Inscripto. Todas las operaciones con documentación fiscal correcta." },
  { icon: Package, title: "Equipamiento para cada requerimiento", description: "Productos de marcas reconocidas y acompañamiento según garantía de cada fabricante." },
  { icon: Globe, title: "Cobertura nacional", description: "Coordinamos provision y entrega en cualquier punto del país." },
  { icon: Headphones, title: "Soporte técnico", description: "Acompañamiento técnico durante y después de la implementación." },
];

const sectors = [
  { icon: Landmark, title: "Municipios y comunas", description: "PCs, notebooks, impresoras, redes y servidores para administraciones locales." },
  { icon: GraduationCap, title: "Educación pública", description: "Laboratorios, proyectores, tablets y conectividad para escuelas e institutos." },
  { icon: HeartPulse, title: "Salud pública", description: "Terminales, servidores, redes y equipamiento para hospitales y centros de salud." },
  { icon: Building, title: "Organismos provinciales y nacionales", description: "Proyectos de mayor escala con coordinación técnica y logística multi-sede." },
];

export default function GobiernoPage() {
  return (
    <InternalPageShell>
      <InternalHero
        accent="teal"
        eyebrow="Sector público"
        title={
          <>
            Tecnología para organismos <span className="text-teal-700">públicos y gubernamentales.</span>
          </>
        }
        intro="Proveemos equipamiento IT, infraestructura y soluciones tecnológicas para municipios, ministerios, hospitales, escuelas y entidades estatales en toda Argentina."
        image="/photos/datacenter.jpg"
        imageAlt="Infraestructura tecnológica para organismos públicos"
        imagePriority
        mediaLabel="Compras institucionales"
        mediaTitle="Cotización formal con documentación clara."
        mediaSubtitle="Acompanamos compras directas, pedidos institucionales y procesos con requisitos administrativos."
        mediaItems={[
          { icon: FileText, title: "Formal", description: "Presupuestos y documentación." },
          { icon: Globe, title: "Nacional", description: "Entrega y coordinación en Argentina." },
          { icon: ShieldCheck, title: "Fiscal", description: "Factura A y datos comerciales." },
        ]}
        metrics={[
          { value: "24-48", label: "hs respuesta" },
          { value: "ARG", label: "cobertura" },
          { value: "A", label: "facturación" },
        ]}
        actions={[
          { label: "Solicitar cotización", href: whatsappLinks.government, external: true, icon: MessageCircle },
          { label: "Contactar comercial", href: "/contacto", variant: "secondary", icon: ArrowRight },
        ]}
      />

      <InternalSection
        tone="soft"
        eyebrow="Alcance institucional"
        title="Soluciones para el sector público."
        intro="Entendemos requisitos y procesos del sector público argentino. Preparamos la documentación necesaria para cada etapa."
      >
        <InternalFeatureGrid features={offerings} />
      </InternalSection>

      <InternalSection
        tone="white"
        eyebrow="Organismos"
        title="Trabajamos con todo el sector público."
        intro="Desde pequenas comunas hasta organismos nacionales, adaptamos la propuesta a la escala y los procesos de cada organismo."
      >
        <InternalFeatureGrid columns="four" features={sectors} />
      </InternalSection>

      <InternalCta
        title="¿Necesitás una cotización para tu organismo?"
        intro="Preparamos presupuestos formales adaptados a los requerimientos del sector público. Respondemos en 24-48 hs hábiles."
        actions={[
          { label: "Solicitar presupuesto", href: whatsappLinks.government, external: true, icon: MessageCircle },
          { label: contact.email, href: `mailto:${contact.email}?subject=Cotización%20sector%20público`, variant: "secondary", icon: Mail },
        ]}
      />
    </InternalPageShell>
  );
}
