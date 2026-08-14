import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Award, Briefcase, Building2, FileCheck2, Lock, MessageCircle, Recycle, ShieldCheck, Truck } from "lucide-react";
import {
  InternalChecklist,
  InternalCta,
  InternalFeatureGrid,
  InternalHero,
  InternalPageShell,
  InternalSection,
} from "@/components/InternalPage";
import { whatsappLinks } from "@/lib/whatsapp";

// Fabricantes con revendedor autorizado vigente. El nivel de partnership no
// se declara para no inflar el claim; alcanza con la autorización de venta.
const authorizedBrands = [
  { name: "Lenovo", logo: "/logos/lenovo.png" },
  { name: "Dell", logo: "/logos/dell.png" },
  { name: "HP", logo: "/logos/hp.png" },
  { name: "Aruba", logo: "/logos/aruba.png" },
  { name: "Cisco", logo: "/logos/cisco.png" },
];

// Marcas técnicas que operamos regularmente en proyectos sin declarar canal
// formal — el trato de venta se resuelve por distribuidores mayoristas.
const operatedBrands = [
  { name: "HPE", logo: "/logos/hpe.png" },
  { name: "Ubiquiti", logo: "/logos/ubiquiti.png" },
  { name: "APC", logo: "/logos/apc.svg" },
  { name: "WD", logo: "/logos/wd.png" },
  { name: "Vertiv", logo: "/logos/vertiv.png" },
];

export const metadata: Metadata = {
  title: "Certificaciones y respaldos - Bartez Tecnología",
  description: "Documentación comercial y respaldos verificables de Bartez Tecnología.",
};

const items = [
  {
    icon: FileCheck2,
    title: "Documentación comercial",
    description: "Razón social, CUIT, condición fiscal y documentación requerida para cada operación.",
  },
  {
    icon: ShieldCheck,
    title: "Certificaciones vigentes",
    description: "Se incorporan cuando existe documentación vigente, alcance identificable y autorización para publicarla.",
  },
  {
    icon: Building2,
    title: "Inscripciones ante organismos",
    description: "Habilitaciones y registros ante organismos públicos nacionales y provinciales cuando la operación lo requiere.",
  },
  {
    icon: Briefcase,
    title: "Revendedor autorizado",
    description: "Autorización de venta vigente con Lenovo, Dell, HP, Aruba y Cisco. Detallamos el alcance real, sin inflar niveles de partnership.",
  },
  {
    icon: Lock,
    title: "Cumplimiento y privacidad",
    description: "Políticas de tratamiento de datos, confidencialidad en cotizaciones y resguardo de información comercial.",
  },
  {
    icon: Truck,
    title: "Logística verificable",
    description: "Cobertura documentada con operadores logísticos para entregas en todo el territorio nacional.",
  },
];

const proofItems = [
  "Facturación tipo A para operaciones B2B",
  "CUIT y condición fiscal verificable en AFIP",
  "Libre deuda de AFIP disponible bajo solicitud",
  "Póliza de seguro de transporte vigente",
  "Acuerdos de distribución con marcas autorizadas",
  "Domicilio fiscal y comercial verificable",
  "Datos de contacto corporativos publicados",
  "Historial de operaciones B2B comprobable",
];

export default function CertificacionesPage() {
  return (
    <InternalPageShell>
      <InternalHero
        eyebrow="Respaldos verificables"
        title={
          <>
            Certificaciones y documentación <span className="text-[#0046EA]">sin promesas infladas.</span>
          </>
        }
        intro="Esta sección reune documentación vigente y comprobable. No utilizamos niveles de partnership, certificaciones o autorizaciones sin respaldo documental."
        image="/photos/products/server.jpg"
        imageAlt="Documentación y respaldo comercial"
        imagePriority
        mediaLabel="Transparencia"
        mediaTitle="Documentación disponible según operación."
        mediaSubtitle="Preparamos los respaldos comerciales que tu proceso de compra necesite."
        mediaItems={[
          { icon: FileCheck2, title: "Fiscal", description: "Datos comerciales y CUIT." },
          { icon: ShieldCheck, title: "Respaldo", description: "Solo información verificable." },
          { icon: MessageCircle, title: "Solicitud", description: "Respuesta comercial directa." },
        ]}
        metrics={[
          { value: "A", label: "factura" },
          { value: "B2B", label: "documentación comercial" },
          { value: "24 hs", label: "respuesta inicial" },
        ]}
        actions={[
          { label: "Solicitar documentación", href: whatsappLinks.general, external: true, icon: MessageCircle },
          { label: "Ir a contacto", href: "/contacto", variant: "secondary", icon: ArrowRight },
        ]}
      />

      <InternalSection tone="soft" eyebrow="Áreas documentadas" title="Respaldos comerciales y operativos." intro="Cada respaldo responde a un aspecto concreto de la operación. No publicamos certificaciones genéricas ni niveles sin documentación vigente.">
        <InternalFeatureGrid columns="three" features={items} />
      </InternalSection>

      <InternalSection
        tone="white"
        eyebrow="Revendedor autorizado"
        title="Fabricantes con canal activo."
        intro="Autorización de venta vigente con cinco marcas líderes del mercado corporativo. Alcance real, sin niveles inflados."
      >
        <div className="grid grid-cols-2 items-center gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
          {authorizedBrands.map((brand) => (
            <div key={brand.name} className="flex h-16 items-center justify-center rounded-lg border border-slate-200 bg-white p-4">
              <Image src={brand.logo} alt={brand.name} width={140} height={44} className="max-h-10 w-auto object-contain" />
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-[12.5px] text-slate-500">
          Constancias disponibles bajo solicitud para procesos de compra corporativos y licitaciones.
        </p>
      </InternalSection>

      <InternalSection
        tone="soft"
        eyebrow="Marcas técnicas operadas"
        title="Marcas que trabajamos regularmente sin canal formal."
        intro="Para estas marcas la compra se resuelve a través de distribuidores mayoristas y no declaramos autorización directa. La experiencia técnica de nuestro equipo cubre las líneas más habituales del mercado corporativo."
      >
        <div className="grid grid-cols-2 items-center gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
          {operatedBrands.map((brand) => (
            <div key={brand.name} className="flex h-16 items-center justify-center rounded-lg border border-slate-200 bg-white p-4">
              <Image src={brand.logo} alt={brand.name} width={140} height={44} className="max-h-10 w-auto object-contain" />
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-[12.5px] text-slate-500">
          Otras marcas operadas en proyectos concretos: Hikvision, Dahua, Fortinet, Kingston, GLC. Consultanos.
        </p>
      </InternalSection>

      <InternalSection tone="white" eyebrow="Comprobables" title="Información que podés verificar." intro="Estos puntos forman parte de nuestra documentación estándar para operaciones corporativas y licitaciones.">
        <InternalChecklist items={proofItems} columns="two" />
      </InternalSection>

      <InternalSection tone="blue" eyebrow="Compromiso">
        <div className="mx-auto max-w-[680px] text-center">
          <Award className="mx-auto size-10 text-[#0046EA]" strokeWidth={1.5} />
          <h2 className="mt-5 font-display text-[clamp(24px,3.2vw,36px)] font-semibold leading-tight text-[#11142a]">Transparencia como principio operativo</h2>
          <p className="mt-4 text-[15.5px] leading-relaxed text-slate-600">
            Publicamos solo lo que podemos respaldar. Cuando una certificación vence, se retira. Cuando un acuerdo cambia de nivel, se actualiza. No hay letra chica ni promesas sin documentación.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-[12.5px] font-semibold text-[#0046EA]">
            <Recycle className="size-4" /> Actualización periódica verificable
          </div>
        </div>
      </InternalSection>

      <InternalCta
        title="¿Necesitás documentación para una compra?"
        intro="Escribinos qué tipo de respaldo requiere tu proceso y lo preparamos según corresponda."
        actions={[
          { label: "Pedir documentación", href: whatsappLinks.general, external: true, icon: MessageCircle },
          { label: "Ver descargas", href: "/descargas", variant: "secondary", icon: ArrowRight },
        ]}
      />
    </InternalPageShell>
  );
}
