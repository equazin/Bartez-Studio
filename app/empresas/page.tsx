import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  Laptop,
  MessageCircle,
  Monitor,
  Network,
  Package,
  Server,
  Shield,
} from "lucide-react";
import {
  InternalChecklist,
  InternalCta,
  InternalFeatureGrid,
  InternalHero,
  InternalPageShell,
  InternalSection,
} from "@/components/InternalPage";
import { contact } from "@/constants";

export const metadata: Metadata = {
  title: "Soluciones IT para Empresas - Bartez Tecnología",
  description:
    "Equipamiento, infraestructura y servicios IT para empresas argentinas. Notebooks corporativas, servidores, redes y workstations con asesoramiento técnico y condiciones B2B.",
};

const services = [
  {
    icon: Laptop,
    title: "Notebooks corporativas",
    description: "Fleet de notebooks ThinkPad, Latitude y ProBook para equipos de trabajo de cualquier tamano.",
  },
  {
    icon: Server,
    title: "Servidores y storage",
    description: "PowerEdge, ProLiant y storage para datacenter, sala de servidores o virtualizacion.",
  },
  {
    icon: Network,
    title: "Redes e infraestructura",
    description: "Switches, firewalls, WiFi y cableado estructurado para planta, deposito u oficina.",
  },
  {
    icon: Monitor,
    title: "Workstations y PCs",
    description: "Estaciones de trabajo para diseño, CAD, ingeniería, administración y producción.",
  },
  {
    icon: Shield,
    title: "Videovigilancia CCTV",
    description: "Cámaras IP, NVR, almacenamiento y monitoreo para proteger instalaciónes.",
  },
  {
    icon: Package,
    title: "Perifericos y puestos",
    description: "Monitores, docks, headsets y accesorios para dejar cada puesto operativo.",
  },
];

const reasons = [
  "Asesoramiento técnico personalizado, sin venderte lo que no necesitás.",
  "Productos de marcas líderes y acompañamiento en la gestión de garantías.",
  "Factura A en todas las operaciones y condiciones comerciales B2B.",
  "Cobertura nacional con entregas coordinadas a una o varias sedes.",
  "Cuenta corriente y plazos acordes a cada operación.",
  "Soporte postventa para resolver dudas luego de la entrega.",
];

const whatsappHref = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(
  "Hola, necesito asesoramiento IT para mi empresa."
)}`;

export default function EmpresasPage() {
  return (
    <InternalPageShell>
      <InternalHero
        eyebrow="Canal corporativo"
        title={
          <>
            Soluciones IT completas <span className="text-[#0046EA]">para tu empresa.</span>
          </>
        }
        intro="Equipamos empresas de todos los rubros con tecnología de primera línea. Notebooks, servidores, redes, workstations y periféricos con asesoramiento profesional y cobertura nacional."
        image="/photos/hero-products-combo.png"
        imageAlt="Equipamiento corporativo para empresas"
        imagePriority
        mediaLabel="Proyecto corporativo"
        mediaTitle="De la necesidad al equipamiento listo para operar."
        mediaSubtitle="Ordenamos usuarios, sedes, criticidad y plazos para preparar una propuesta concreta."
        mediaItems={[
          { icon: Laptop, title: "Puestos", description: "Equipos y periféricos para cada perfil." },
          { icon: Server, title: "Infraestructura", description: "Servidores, red, energía y storage." },
          { icon: CheckCircle2, title: "Condiciones", description: "Factura A, B2B y cobertura nacional." },
        ]}
        metrics={[
          { value: "18", label: "años en el rubro" },
          { value: "10k+", label: "clientes atendidos" },
          { value: "ARG", label: "cobertura nacional" },
        ]}
        actions={[
          { label: "Pedir cotización", href: whatsappHref, external: true, icon: MessageCircle },
          { label: "Ver marcas", href: "/marcas", variant: "secondary", icon: ArrowRight },
        ]}
      />

      <InternalSection
        tone="soft"
        eyebrow="Equipamiento y servicios"
        title="Todo lo que necesita tu empresa en un solo circuito de compra."
        intro="Una sola fuente de equipamiento IT, con asesoramiento técnico y condiciones comerciales pensadas para empresas."
      >
        <InternalFeatureGrid features={services} />
      </InternalSection>

      <InternalSection
        tone="white"
        eyebrow="Criterios de trabajo"
        title="Por que las empresas eligen Bartez."
        intro="Dieciocho años de experiencia en el mercado IT argentino nos permiten entender la realidad de cada empresa y proponer soluciones que realmente funcionen."
      >
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div className="rounded-lg border border-slate-200 bg-[#f7f9fc] p-6">
            <Network className="size-7 text-[#0046EA]" strokeWidth={1.7} />
            <h3 className="mt-5 font-display text-[22px] font-semibold text-[#11142a]">Compra corporativa sin friccion</h3>
            <p className="mt-3 text-[14px] leading-relaxed text-slate-600">
              Relevamos necesidad, cantidad, sedes y tiempos para que la propuesta llegue ordenada y con alternativas reales.
            </p>
          </div>
          <InternalChecklist items={reasons} columns="two" />
        </div>
      </InternalSection>

      <InternalCta
        title="¿Querés equipar tu empresa con tecnología de primera línea?"
        intro="Contanos cuántos usuarios, qué tipo de trabajo realizan y cuál es tu plazo. Un especialista te responde con una propuesta en 24 hs hábiles."
        actions={[
          { label: "Solicitar asesoramiento", href: whatsappHref, external: true, icon: MessageCircle },
          { label: "Ver soluciones", href: "/soluciones/servidores", variant: "secondary", icon: ArrowRight },
        ]}
      />
    </InternalPageShell>
  );
}
