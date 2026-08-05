import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Gift,
  Handshake,
  MessageCircle,
  Package,
  Percent,
  Star,
  Users,
} from "lucide-react";
import { ResellerWhatsAppForm } from "@/components/ResellerWhatsAppForm";
import {
  InternalCta,
  InternalFeatureGrid,
  InternalHero,
  InternalPageShell,
  InternalSection,
} from "@/components/InternalPage";
import { whatsappLinks } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Revendedores y Canal IT - Bartez Tecnología",
  description:
    "Sumate al canal de distribución de Bartez Tecnología. Condiciones B2B, marcas líderes, soporte comercial y técnico. Revende tecnología de primera línea en todo Argentina.",
};

const benefits = [
  {
    icon: Percent,
    title: "Condiciones comerciales competitivas",
    description: "Accedés a precios de canal con márgenes pensados para que tu negocio sea rentable.",
  },
  {
    icon: Package,
    title: "Disponibilidad en marcas líderes",
    description: "Consultamos alternativas de Dell, Lenovo, HP, Cisco, Kingston y más según cada pedido.",
  },
  {
    icon: BadgeCheck,
    title: "Acompañamiento en garantías",
    description: "Te orientamos según las condiciones informadas por cada fabricante y producto.",
  },
  {
    icon: Users,
    title: "Soporte comercial dedicado",
    description: "Tenés un interlocutor comercial directo para cotizaciones, consultas y seguimiento de pedidos.",
  },
  {
    icon: Gift,
    title: "Factura A en todas las operaciones",
    description: "Responsable Inscripto. Todas las transacciones con documentación comercial correcta.",
  },
  {
    icon: Star,
    title: "18 años en el rubro",
    description: "Experiencia comercial y técnica aplicada al mercado IT argentino.",
  },
];

const steps = [
  {
    num: "01",
    title: "Completá el formulario",
    desc: "Contanos quién sos, qué productos distribuís y cuál es tu mercado principal.",
  },
  {
    num: "02",
    title: "Te contactamos",
    desc: "Un asesor comercial se comunica para conocer tu operación y validar condiciones.",
  },
  {
    num: "03",
    title: "Definimos el circuito",
    desc: "Acordamos márgenes, plazos, logística y soporte según volumen y canal.",
  },
  {
    num: "04",
    title: "Empezamos a operar",
    desc: "Accedés a catálogo, precios de canal y seguimiento comercial para vender.",
  },
];

const faqs = [
  {
    q: "¿Qué tipos de revendedores trabajan con Bartez?",
    a: "Trabajamos con tiendas de informática, integradores de sistemas, empresas de servicios IT, distribuidores regionales y profesionales independientes.",
  },
  {
    q: "¿Hay un mínimo de compra para ser revendedor?",
    a: "No tenemos un mínimo rígido para ingresar al canal. Las condiciones se acuerdan según perfil, volumen estimado y tipo de productos.",
  },
  {
    q: "¿Ofrecen soporte técnico para revendedores?",
    a: "Sí. Tenés acceso a soporte comercial y orientación técnica para asesorar correctamente a tus clientes.",
  },
  {
    q: "¿Cómo se gestionan las garantías?",
    a: "Te informamos las condiciones aplicables a cada producto y acompañamos el inicio y seguimiento del caso cuando corresponde.",
  },
];

export default function RevendedoresPage() {
  return (
    <InternalPageShell>
      <InternalHero
        accent="violet"
        eyebrow="Canal IT"
        eyebrowIcon={Handshake}
        title={
          <>
            Revende tecnología de <span className="text-brand">primera línea.</span>
          </>
        }
        intro="Sumate al canal de distribución de Bartez. Condiciones comerciales competitivas, marcas líderes y 18 años de experiencia para acompañar el crecimiento de tu negocio."
        image="/photos/products/desktop.jpg"
        imageAlt="Equipamiento para canal de revendedores"
        imagePriority
        mediaLabel="Programa de canal"
        mediaTitle="Un circuito claro para cotizar y revender."
        mediaSubtitle="Validamos perfil, volumen y categorías para definir condiciones comerciales sostenibles."
        mediaItems={[
          { icon: Percent, title: "Margen", description: "Condiciones según volumen y categoría." },
          { icon: Package, title: "Portfolio", description: "Marcas líderes para empresas y tiendas." },
          { icon: Users, title: "Seguimiento", description: "Interlocutor comercial directo." },
        ]}
        metrics={[
          { value: "B2B", label: "precios de canal" },
          { value: "24 hs", label: "respuesta comercial" },
          { value: "ARG", label: "operación nacional" },
        ]}
        actions={[
          { label: "Quiero ser revendedor", href: "#registro", icon: ArrowRight },
          { label: "Consultar por WhatsApp", href: whatsappLinks.reseller, external: true, variant: "secondary", icon: MessageCircle },
        ]}
      />

      <InternalSection
        tone="soft"
        eyebrow="Ventajas del canal"
        title="Por qué distribuir con Bartez."
        intro="La propuesta de canal se apoya en respuesta comercial, variedad de marcas y experiencia real en el mercado IT argentino."
      >
        <InternalFeatureGrid features={benefits} />
      </InternalSection>

      <InternalSection
        tone="white"
        eyebrow="Proceso de alta"
        title="Cómo sumarte al canal."
        intro="El alta se resuelve por etapas simples para entender tu negocio antes de habilitar condiciones."
      >
        <ol className="grid gap-5 md:grid-cols-4">
          {steps.map((step) => (
            <li key={step.num} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <span className="grid size-10 place-items-center rounded-lg border border-blue-100 bg-blue-50 font-display text-[13px] font-semibold text-[#0046EA]">
                {step.num}
              </span>
              <h3 className="mt-5 font-display text-[17px] font-semibold text-[#11142a]">{step.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">{step.desc}</p>
            </li>
          ))}
        </ol>
      </InternalSection>

      <section id="registro" className="scroll-mt-24 border-y border-slate-200 bg-[#f7f9fc] py-16 md:py-20">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-6 lg:grid-cols-[0.74fr_1.26fr] lg:gap-14">
          <div>
            <p className="text-[13px] font-bold text-[#0046EA]">Registro de canal</p>
            <h2 className="mt-2 font-display text-[clamp(30px,4vw,46px)] font-semibold leading-[1.05] text-[#11142a]">
              Contanos sobre tu negocio.
            </h2>
            <p className="mt-4 max-w-[38ch] text-[15.5px] leading-relaxed text-slate-600">
              Completás el formulario y un asesor se comunica en las próximas 24 hs hábiles para revisar condiciones de trabajo.
            </p>
            <a
              href={whatsappLinks.reseller}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-5 py-3 text-[14px] font-bold text-[#0046EA] shadow-sm hover:border-[#0046EA] hover:bg-blue-50"
            >
              <MessageCircle size={17} /> Prefiero WhatsApp
            </a>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-[0_28px_70px_-50px_rgba(17,20,42,0.45)] md:p-8">
            <h3 className="font-display text-[22px] font-semibold text-[#11142a]">Solicitud de revendedor</h3>
            <p className="mt-2 text-[13.5px] text-slate-600">Sin compromiso. Evaluamos cada consulta de forma personalizada.</p>
            <ResellerWhatsAppForm />
          </div>
        </div>
      </section>

      <InternalSection tone="white" eyebrow="Preguntas frecuentes" title="Dudas habituales del canal.">
        <div className="grid gap-5 md:grid-cols-2">
          {faqs.map((item) => (
            <article key={item.q} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 size-5 flex-none text-[#0046EA]" strokeWidth={1.8} />
                <div>
                  <h3 className="font-display text-[16px] font-semibold text-[#11142a]">{item.q}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">{item.a}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </InternalSection>

      <InternalCta
        title="¿Listo para evaluar condiciones de canal?"
        intro="Enviamos el primer contacto por WhatsApp y despues ordenamos el circuito comercial según tu operación."
        actions={[
          { label: "Iniciar consulta de canal", href: whatsappLinks.reseller, external: true, icon: MessageCircle },
          { label: "Ver marcas", href: "/marcas", variant: "secondary", icon: ArrowRight },
        ]}
      />
    </InternalPageShell>
  );
}
