import type { Metadata } from "next";
import {
  ArrowRight,
  ClipboardList,
  DraftingCompass,
  FileText,
  HardHat,
  Handshake,
  Headset,
  MessageCircle,
  Rocket,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import {
  InternalChecklist,
  InternalCta,
  InternalFeatureGrid,
  InternalHero,
  InternalPageShell,
  InternalSection,
} from "@/components/InternalPage";
import { whatsappLinks } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Servicios profesionales y proyectos llave en mano | Bartez Tecnología",
  description:
    "Proyectos IT llave en mano: relevamiento, propuesta con alcance, provisión de equipamiento, coordinación de instaladores partners para el despliegue físico y puesta en marcha.",
  alternates: { canonical: "/servicios-profesionales" },
};

const phases = [
  {
    icon: DraftingCompass,
    title: "1. Relevamiento",
    description:
      "Visitamos o coordinamos remotamente el relevamiento: planta, sedes, usuarios, aplicaciones críticas, equipamiento existente, restricciones edilicias y ventanas de trabajo.",
  },
  {
    icon: FileText,
    title: "2. Propuesta con alcance",
    description:
      "Presentamos un documento con alcance técnico y comercial: equipamiento comparado en varias marcas, materiales, servicios coordinados con partners y plazo estimado.",
  },
  {
    icon: ClipboardList,
    title: "3. Orden y planificación",
    description:
      "Con la orden en firme: registro de oportunidad con fabricantes cuando corresponde, orden de compra al proveedor, planificación de logística y agenda con instaladores.",
  },
  {
    icon: HardHat,
    title: "4. Despliegue físico",
    description:
      "Coordinamos con instaladores partners el tendido de cableado, montaje de racks, patcheo, instalación de APs y cámaras. Nuestro equipo técnico supervisa el proyecto.",
  },
  {
    icon: Rocket,
    title: "5. Puesta en marcha",
    description:
      "Configuración de switches, servidores, hipervisor, VLANs, WiFi, cámaras y grabadores. Pruebas funcionales, entrega documentada y capacitación al usuario final si corresponde.",
  },
  {
    icon: Headset,
    title: "6. Soporte posventa",
    description:
      "Acompañamiento posterior: garantía, ampliaciones, monitoreo y soporte técnico según lo acordado en la propuesta.",
  },
];

const projectExamples = [
  {
    icon: DraftingCompass,
    title: "Renovación de datacenter",
    description:
      "Reemplazo de switches core, servidores rack para virtualización y UPS. Incluye migración de servicios en ventana pactada.",
  },
  {
    icon: DraftingCompass,
    title: "WiFi multi-sede",
    description:
      "UniFi o Aruba en varias sedes con controlador central, relevamiento por sitio, equipamiento de contingencia y despliegue en cada punto.",
  },
  {
    icon: DraftingCompass,
    title: "CCTV IP con exterior",
    description:
      "Cámaras direccionales, panorámicas o 360°, NVR dimensionado, discos CCTV específicos y cableado exterior con instalador partner.",
  },
  {
    icon: DraftingCompass,
    title: "Renovación de parque",
    description:
      "20+ notebooks o PCs con Windows 11 Pro, imagen unificada, joineo a dominio y entrega escalonada a una o varias sedes.",
  },
];

const scopeItems = [
  "Documento de propuesta con alcance técnico detallado",
  "Comparación multi-marca cuando corresponde (Lenovo, HPE, Dell, Cisco, Aruba, Ubiquiti)",
  "Lista de materiales completa (activos, pasivos, accesorios)",
  "Cronograma tentativo con hitos y responsabilidades",
  "Plazos de entrega comprometidos por escrito",
  "Coordinación con instaladores partners bajo dirección técnica de Bartez",
  "Puesta en marcha, pruebas funcionales y documentación de entrega",
  "Factura A y condiciones B2B para empresas y organismos",
];

export default function ServiciosProfesionalesPage() {
  return (
    <InternalPageShell>
      <InternalHero
        eyebrow="Servicios profesionales"
        title={
          <>
            Proyectos IT <span className="text-[#0046EA]">llave en mano</span>,
            con instaladores partners y coordinación técnica propia.
          </>
        }
        intro="Cuando el proyecto pide más que provisión de equipamiento — cableado, montaje, integración, ventana de corte — sumamos instaladores partners al alcance y coordinamos todo desde nuestro equipo técnico. Vos tenés un único interlocutor y una única factura."
        image="/photos/datacenter.jpg"
        imageAlt="Proyecto IT llave en mano"
        imagePriority
        mediaLabel="Alcance integral"
        mediaTitle="Un interlocutor, un alcance, una factura A."
        mediaSubtitle="Equipos, materiales e instalación coordinados por nuestro equipo técnico."
        mediaItems={[
          { icon: DraftingCompass, title: "Relevamos", description: "Sitio, sedes y restricciones antes de cotizar." },
          { icon: HardHat, title: "Coordinamos", description: "Instaladores partners bajo dirección técnica." },
          { icon: Handshake, title: "Entregamos", description: "Puesta en marcha documentada." },
        ]}
        metrics={[
          { value: "24-48", label: "hs respuesta inicial" },
          { value: "ARG", label: "cobertura nacional" },
          { value: "A", label: "factura y B2B" },
        ]}
        actions={[
          { label: "Cotizar proyecto (RFQ)", href: "/rfq?origen=proyecto", icon: ArrowRight },
          { label: "Hablar con un especialista", href: whatsappLinks.services, external: true, variant: "secondary", icon: MessageCircle },
        ]}
      />

      <InternalSection
        tone="soft"
        eyebrow="Cómo trabajamos"
        title="De la primera reunión a la puesta en marcha."
        intro="Cada proyecto atraviesa las mismas seis fases. El alcance específico y el plazo de cada fase se definen en la propuesta antes de arrancar."
      >
        <InternalFeatureGrid columns="three" features={phases} />
      </InternalSection>

      <InternalSection
        tone="white"
        eyebrow="Instaladores partners"
        title="Cómo coordinamos el despliegue físico."
      >
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <HardHat className="size-8 text-[#0046EA]" strokeWidth={1.6} />
            <h3 className="mt-4 font-display text-[20px] font-semibold text-[#11142a]">
              Instalación con partners de confianza, bajo nuestra dirección técnica.
            </h3>
            <p className="mt-3 text-[14px] leading-relaxed text-slate-600">
              Para el despliegue físico de un proyecto — tendido de cableado
              exterior, montaje de racks, patcheo, instalación de access points o
              cámaras en altura — trabajamos con instaladores partners locales
              con los que hemos coordinado obras previas. Nuestro equipo técnico
              es responsable del proyecto de punta a punta: diseño, provisión,
              supervisión de la instalación y puesta en marcha.
            </p>
            <p className="mt-4 text-[14px] leading-relaxed text-slate-600">
              Preferimos transparentar este esquema antes que ofrecer instalación
              como si fuera personal propio. Es lo mismo que hacen las
              consultoras IT que operan en varias provincias: eficiencia,
              cobertura y responsabilidad clara.
            </p>
          </div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
            <ShieldCheck className="size-8 text-[#0046EA]" strokeWidth={1.6} />
            <h3 className="mt-4 font-display text-[18px] font-semibold text-[#11142a]">
              Un solo interlocutor
            </h3>
            <p className="mt-3 text-[13.5px] leading-relaxed text-slate-700">
              Tu contacto es siempre nuestro equipo comercial y técnico.
              Coordinamos con el partner, resolvemos incidencias durante la obra
              y respondemos por el resultado final.
            </p>
            <ul className="mt-5 space-y-2 text-[13px] leading-relaxed text-slate-700">
              <li>• Un solo pedido, una sola orden, una sola factura A.</li>
              <li>• Cronograma unificado.</li>
              <li>• Responsabilidad técnica de punta a punta.</li>
            </ul>
          </div>
        </div>
      </InternalSection>

      <InternalSection
        tone="soft"
        eyebrow="Tipos de proyecto"
        title="Escenarios habituales que llegan a servicios profesionales."
        intro="No son casos de clientes reales — describen la clase de operación que solemos coordinar."
      >
        <InternalFeatureGrid columns="two" features={projectExamples} />
      </InternalSection>

      <InternalSection
        tone="white"
        eyebrow="Qué incluye la propuesta"
        title="Lo que vas a recibir por escrito antes de firmar."
      >
        <InternalChecklist items={scopeItems} columns="two" />
      </InternalSection>

      <InternalCta
        title="Contanos el proyecto que tenés en carpeta."
        intro="Cuanta más información nos pases (planos, pliegos, cantidades, sedes, plazos), más rápida y precisa va a ser la propuesta. Respondemos en 24-48 hs hábiles."
        actions={[
          { label: "Enviar cotización de proyecto", href: "/rfq?origen=proyecto", icon: ArrowRight },
          { label: "Escribir por WhatsApp", href: whatsappLinks.services, external: true, variant: "secondary", icon: MessageCircle },
        ]}
      />
    </InternalPageShell>
  );
}
