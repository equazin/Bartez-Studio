import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ClipboardList,
  Compass,
  FileCheck2,
  Handshake,
  MessageCircle,
  Package,
  PackageSearch,
  Receipt,
  ShieldCheck,
  Truck,
  Workflow,
} from "lucide-react";
import {
  InternalChecklist,
  InternalCta,
  InternalHero,
  InternalPageShell,
  InternalSection,
} from "@/components/InternalPage";
import { company } from "@/constants";
import { whatsappLinks } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Cómo trabajamos — Bartez Tecnología",
  description:
    "Así trabajamos en Bartez Tecnología: cotizamos en 24 hs hábiles, conseguimos el equipamiento que necesitás y lo entregamos con garantía oficial a todo el país. Un solo interlocutor de punta a punta.",
  alternates: { canonical: "/como-trabajamos" },
  openGraph: {
    title: "Cómo trabajamos — Bartez Tecnología",
    description:
      "Cotización 24 hs, provisión con garantía oficial, coordinación de proyectos llave en mano con instaladores partners y factura A.",
    url: "https://bartez.com.ar/como-trabajamos",
    type: "website",
  },
};

const steps = [
  {
    num: "01",
    icon: PackageSearch,
    title: "Nos contás el pedido",
    desc: "Recibimos tu requerimiento por formulario, WhatsApp o email. No hace falta pliego cerrado: alcanza con modelo y cantidades, o un contexto de uso.",
  },
  {
    num: "02",
    icon: ClipboardList,
    title: "Cotizamos en 24 hs hábiles",
    desc: "Confirmamos disponibilidad y precio, y te devolvemos una propuesta formal con modelos, alternativas equivalentes y plazo real de entrega.",
  },
  {
    num: "03",
    icon: Truck,
    title: "Compra y despacho",
    desc: "Al confirmar la orden, preparamos el pedido y coordinamos el despacho por Andreani a todo el país. Recibís número de seguimiento el mismo día que sale.",
  },
  {
    num: "04",
    icon: ShieldCheck,
    title: "Garantía oficial",
    desc: "Todo el equipamiento se entrega con garantía oficial del fabricante. Si aparece una falla, gestionamos el RMA y hacemos seguimiento hasta la resolución.",
  },
];

const modelBenefits = [
  {
    icon: Compass,
    title: "Precio directo, sin sobrecostos",
    description:
      "Estructura ágil: cada operación se cotiza a precio actualizado, sin cargar sobrecostos operativos al presupuesto final.",
  },
  {
    icon: PackageSearch,
    title: "Catálogo amplio y flexible",
    description:
      "Cotizamos cualquier modelo vigente en el país. Si un fabricante no tiene disponibilidad, te proponemos alternativas equivalentes en la misma respuesta.",
  },
  {
    icon: BadgeCheck,
    title: "Factura A en todas las operaciones",
    description:
      "Responsable Inscripto. Toda la documentación queda en regla para compras corporativas, licitaciones y desgravaciones.",
  },
  {
    icon: Building2,
    title: "18 años y +5.000 clientes",
    description:
      "Trayectoria y experiencia comercial en compras corporativas, canal y sector público a lo largo del país.",
  },
];

const transparencyItems = [
  "No prometemos disponibilidad genérica: cada cotización lleva plazo real confirmado.",
  "No publicamos precios ni stock en tiempo real porque cambian a diario; los confirmamos al recibir la consulta.",
  "Si un modelo no está disponible, lo decimos y proponemos alternativas equivalentes en la misma respuesta.",
  "El detalle técnico y comercial queda por escrito antes de la orden, no se cambia después.",
];

const whoWorksWithUs = [
  { icon: Building2, title: "Empresas y PyMEs", desc: "Renovación de puestos, servidores, redes, licencias y proyectos de infraestructura." },
  { icon: Handshake, title: "Revendedores IT", desc: "Precios de canal, condiciones B2B y disponibilidad para tiendas, integradores y distribuidores regionales." },
  { icon: FileCheck2, title: "Organismos y educación", desc: "Cotizaciones para licitaciones, compras directas e instituciones educativas con documentación completa." },
];

export default function ComoTrabajamosPage() {
  return (
    <InternalPageShell>
      <InternalHero
        eyebrow="Cómo trabajamos"
        eyebrowIcon={Workflow}
        title={
          <>
            Un solo interlocutor, <span className="text-[#0046EA]">del pedido a la entrega.</span>
          </>
        }
        intro="Cotizamos en 24 hs hábiles, conseguimos el equipamiento que necesitás y lo entregamos con garantía oficial vía Andreani a todo el país. De punta a punta hablás con el mismo asesor."
        image="/photos/home/warehouse-hero.jpg"
        imageAlt="Logística de abastecimiento IT"
        imagePriority
        mediaLabel="Modelo operativo"
        mediaTitle="Del pedido a la entrega en 4 pasos."
        mediaSubtitle="Proceso ordenado, plazos reales y documentación completa desde la primera respuesta."
        mediaItems={[
          { icon: ClipboardList, title: "24 hs", description: "Cotización hábil, no genérica." },
          { icon: Truck, title: "Andreani", description: "Despacho nacional con tracking." },
          { icon: ShieldCheck, title: "Garantía", description: "Oficial del fabricante en cada compra." },
        ]}
        metrics={[
          { value: "24 hs", label: "cotización hábil" },
          { value: "ARG", label: "entrega nacional" },
          { value: "Factura A", label: "en todas las operaciones" },
        ]}
        actions={[
          { label: "Pedir cotización", href: whatsappLinks.quote, external: true, icon: MessageCircle },
          { label: "Cotización masiva (RFQ)", href: "/rfq", variant: "secondary", icon: ArrowRight },
        ]}
      />

      <InternalSection tone="soft" eyebrow="Proceso" title="Los 4 pasos, con los tiempos reales.">
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li key={step.num} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <span className="grid size-10 place-items-center rounded-lg border border-blue-100 bg-blue-50 font-display text-[13px] font-semibold text-[#0046EA]">{step.num}</span>
              <step.icon className="mt-6 size-6 text-[#0046EA]" strokeWidth={1.7} />
              <h3 className="mt-4 font-display text-[17px] font-semibold text-[#11142a]">{step.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">{step.desc}</p>
            </li>
          ))}
        </ol>
      </InternalSection>

      <InternalSection
        tone="white"
        eyebrow="Ventajas"
        title="Por qué comprar IT con nosotros."
        intro="Trabajamos con estructura ágil y precio actualizado por operación. El resultado: mejor precio y respuesta directa para el cliente."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {modelBenefits.map((item) => (
            <article key={item.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <span className="grid size-10 place-items-center rounded-lg border border-blue-100 bg-blue-50">
                <item.icon size={20} className="text-[#0046EA]" strokeWidth={1.7} />
              </span>
              <h3 className="mt-5 font-display text-[17px] font-semibold text-[#11142a]">{item.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>
      </InternalSection>

      <InternalSection
        tone="soft"
        eyebrow="Transparencia"
        title="Lo que decimos y lo que no."
        intro="En B2B la confianza se construye con reglas claras. Estas son las nuestras."
      >
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <InternalChecklist items={transparencyItems} />
        </div>
      </InternalSection>

      <InternalSection
        tone="white"
        eyebrow="Público"
        title="Con quién trabajamos."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {whoWorksWithUs.map((item) => (
            <article key={item.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <item.icon size={26} className="text-[#0046EA]" strokeWidth={1.7} />
              <h3 className="mt-4 font-display text-[17px] font-semibold text-[#11142a]">{item.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">{item.desc}</p>
            </article>
          ))}
        </div>
      </InternalSection>

      <InternalSection
        tone="soft"
        eyebrow="Documentación"
        title="Lo que recibís en cada operación."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Receipt, label: "Cotización formal por escrito" },
            { icon: Package, label: "Confirmación de disponibilidad y plazo" },
            { icon: Truck, label: "Número de seguimiento Andreani" },
            { icon: FileCheck2, label: "Factura A y remito" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
              <item.icon size={20} className="flex-none text-[#0046EA]" strokeWidth={1.7} />
              <p className="text-[13.5px] font-semibold text-[#11142a]">{item.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4 text-[13.5px] text-[#11142a]">
          <CheckCircle2 size={20} className="flex-none text-[#0046EA]" strokeWidth={1.8} />
          <p>Responsable Inscripto · CUIT {company.cuit} · Toda la operación en regla para compras corporativas, canal y sector público.</p>
        </div>
      </InternalSection>

      <InternalCta
        title="¿Tenés un proyecto o una lista de equipos para cotizar?"
        intro="Envianos el pedido y en 24 hs hábiles te devolvemos una propuesta formal con modelos, alternativas y plazo real de entrega."
        actions={[
          { label: "Pedir cotización", href: whatsappLinks.quote, external: true, icon: MessageCircle },
          { label: "Ir al RFQ", href: "/rfq", variant: "secondary", icon: ArrowRight },
        ]}
      />
    </InternalPageShell>
  );
}
