import type { Metadata } from "next";
import { ArrowRight, Building, Building2, ClipboardCheck, FileSignature, FileText, Globe, GraduationCap, Handshake, Headphones, HeartPulse, Landmark, Mail, MessageCircle, Package, Receipt, ShieldCheck, Timer } from "lucide-react";
import {
  InternalChecklist,
  InternalCta,
  InternalFeatureGrid,
  InternalHero,
  InternalPageShell,
  InternalSection,
} from "@/components/InternalPage";
import { company, contact } from "@/constants";
import { safeJsonLd } from "@/lib/json-ld";
import { whatsappLinks } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Tecnología para el Sector Público - Bartez Tecnología",
  description:
    "Provisión de equipamiento IT para organismos públicos, municipios, ministerios y entidades estatales en Argentina. Cotizaciones para licitaciones y compras directas.",
  alternates: { canonical: "/gobierno" },
  openGraph: {
    title: "Tecnología para el Sector Público - Bartez Tecnología",
    description:
      "Cotizaciones formales para organismos con validez de oferta, deal registration, factura A y experiencia con COMPR.AR y SIPAF.",
    url: `${company.url}/gobierno`,
    type: "website",
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Provisión de tecnología para el sector público",
  serviceType: "Compra pública IT",
  description:
    "Cotizaciones formales para organismos públicos con validez de oferta, retenciones, plazos comprometidos, deal registration con Dell/HPE/Lenovo y experiencia con COMPR.AR y SIPAF.",
  url: `${company.url}/gobierno`,
  areaServed: { "@type": "Country", name: "Argentina" },
  audience: {
    "@type": "GovernmentOrganization",
    name: "Organismos públicos municipales, provinciales y nacionales",
  },
  provider: {
    "@type": "Organization",
    name: company.name,
    url: company.url,
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: company.url },
    { "@type": "ListItem", position: 2, name: "Gobierno", item: `${company.url}/gobierno` },
  ],
};

const offerings = [
  { icon: FileText, title: "Documentación completa", description: "Presupuestos formales, cotizaciones para licitaciones y documentación requerida por procesos de compra pública." },
  { icon: Building2, title: "Organismos de todos los niveles", description: "Municipal, provincial y nacional. Experiencia en diferentes escalas de gobierno." },
  { icon: ShieldCheck, title: "Factura A garantizada", description: "Somos Responsable Inscripto. Todas las operaciones con documentación fiscal correcta." },
  { icon: Package, title: "Equipamiento para cada requerimiento", description: "Productos de marcas reconocidas y acompañamiento según garantía de cada fabricante." },
  { icon: Globe, title: "Cobertura nacional", description: "Coordinamos provisión y entrega en cualquier punto del país." },
  { icon: Headphones, title: "Soporte técnico", description: "Acompañamiento técnico durante y después de la implementación." },
];

const sectors = [
  { icon: Landmark, title: "Municipios y comunas", description: "PCs, notebooks, impresoras, redes y servidores para administraciones locales." },
  { icon: GraduationCap, title: "Educación pública", description: "Laboratorios, proyectores, tablets y conectividad para escuelas e institutos." },
  { icon: HeartPulse, title: "Salud pública", description: "Terminales, servidores, redes y equipamiento para hospitales y centros de salud." },
  { icon: Building, title: "Organismos provinciales y nacionales", description: "Proyectos de mayor escala con coordinación técnica y logística multi-sede." },
];

const formalOps = [
  {
    icon: Handshake,
    title: "Registro de oportunidad (deal reg)",
    description:
      "Gestionamos el registro de oportunidad con Dell, HPE y Lenovo para obtener precio de proyecto en compras de organismos, cuando la escala y el equipamiento lo habilitan.",
  },
  {
    icon: Receipt,
    title: "Factura A y retenciones",
    description:
      "Responsable Inscripto, CUIT verificable en AFIP y capacidad de recibir las retenciones (Ganancias, IVA, IIBB) que apliquen a cada jurisdicción.",
  },
  {
    icon: Timer,
    title: "Validez de oferta y plazos",
    description:
      "Cotizaciones con validez explícita, plazos de entrega comprometidos por escrito y condiciones documentadas para la etapa de adjudicación.",
  },
  {
    icon: FileSignature,
    title: "Documentación para pliegos",
    description:
      "Preparamos la documentación técnica y comercial requerida por cada pliego: fichas técnicas, cumplimiento de especificaciones, constancias y anexos.",
  },
  {
    icon: ClipboardCheck,
    title: "Compra directa y contratación",
    description:
      "Operamos en compras directas, contrataciones menores y procesos formales de contratación pública según la normativa aplicable.",
  },
  {
    icon: Globe,
    title: "Portales de compra pública",
    description:
      "Experiencia trabajando con COMPR.AR, SIPAF y portales de contratación provinciales y municipales.",
  },
];

const rfqChecklist = [
  "Pliego, especificaciones técnicas o lista de requerimientos",
  "Volumen requerido y lugares de entrega",
  "Plazo esperado y ventana de contratación",
  "Condiciones de pago habituales del organismo",
  "Jurisdicción y régimen de retenciones aplicable",
  "Punto de contacto administrativo y técnico",
];

export default function GobiernoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
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
        image="/photos/office.jpg"
        imageAlt="Equipamiento y servicios IT para organismos públicos"
        imagePriority
        mediaLabel="Compras institucionales"
        mediaTitle="Cotización formal con documentación clara."
        mediaSubtitle="Acompañamos compras directas, pedidos institucionales y procesos con requisitos administrativos."
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
        intro="Desde pequeñas comunas hasta organismos nacionales, adaptamos la propuesta a la escala y los procesos de cada organismo."
      >
        <InternalFeatureGrid columns="four" features={sectors} />
      </InternalSection>

      <InternalSection
        tone="soft"
        eyebrow="Operatoria formal"
        title="Cómo trabajamos las compras del sector público."
        intro="No es lo mismo cotizarle a una empresa que a un organismo. Estos son los aspectos administrativos y comerciales que ya tenemos resueltos."
      >
        <InternalFeatureGrid columns="three" features={formalOps} />
      </InternalSection>

      <InternalSection
        tone="white"
        eyebrow="Enviá tu pliego"
        title="Qué necesitamos para armar una cotización formal."
        intro="Cuantos más datos nos pases, más rápida y precisa es la propuesta. Usá el formulario de cotización de proyectos con el preset de sector público."
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-start">
          <div>
            <InternalChecklist items={rfqChecklist} columns="one" />
          </div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
            <FileText className="size-8 text-[#0046EA]" strokeWidth={1.6} />
            <h3 className="mt-4 font-display text-[18px] font-semibold text-[#11142a]">
              Formulario específico para sector público
            </h3>
            <p className="mt-3 text-[13.5px] leading-relaxed text-slate-700">
              El formulario RFQ tiene una vista específica para organismos con
              información sobre validez de oferta, retenciones y plazos.
            </p>
            <a
              href="/rfq?origen=gobierno"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#0046EA] px-5 py-3 text-[13.5px] font-bold text-white transition hover:bg-[#0038C4]"
            >
              Cotizar para organismo <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </InternalSection>

      <InternalCta
        title="¿Necesitás una cotización para tu organismo?"
        intro="Preparamos presupuestos formales adaptados a los requerimientos del sector público. Respondemos en 24-48 hs hábiles."
        actions={[
          { label: "Enviar pliego (RFQ)", href: "/rfq?origen=gobierno", icon: ArrowRight },
          { label: "Solicitar por WhatsApp", href: whatsappLinks.government, external: true, variant: "secondary", icon: MessageCircle },
          { label: contact.email, href: `mailto:${contact.email}?subject=Cotización%20sector%20público`, variant: "secondary", icon: Mail },
        ]}
      />
      </InternalPageShell>
    </>
  );
}
