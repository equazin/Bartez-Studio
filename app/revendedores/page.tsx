import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, CheckCircle2, Gift, Handshake, MessageCircle, Package, Percent, Star, Users } from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { ResellerWhatsAppForm } from "@/components/ResellerWhatsAppForm";
import { whatsappLinks } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Revendedores y Canal IT — Bartez Tecnología",
  description:
    "Sumate al canal de distribución de Bartez Tecnología. Condiciones B2B, marcas líderes, soporte comercial y técnico. Revendé tecnología de primera línea en todo Argentina.",
};

const benefits = [
  {
    icon: Percent,
    title: "Condiciones comerciales competitivas",
    desc: "Accedés a precios de canal con márgenes pensados para que tu negocio sea rentable.",
  },
  {
    icon: Package,
    title: "Disponibilidad en marcas líderes",
    desc: "Consultamos alternativas de Dell, Lenovo, HP, Cisco, Kingston y más según cada pedido.",
  },
  {
    icon: BadgeCheck,
    title: "Acompañamiento en garantías",
    desc: "Te orientamos según las condiciones informadas por cada fabricante y producto.",
  },
  {
    icon: Users,
    title: "Soporte comercial dedicado",
    desc: "Tenés un interlocutor comercial directo para cotizaciones, consultas y seguimiento de pedidos.",
  },
  {
    icon: Gift,
    title: "Factura A en todas las operaciones",
    desc: "Responsable Inscripto. Todas las transacciones con documentación comercial correcta.",
  },
  {
    icon: Star,
    title: "18 años en el rubro",
    desc: "Experiencia comercial y técnica aplicada al mercado IT argentino.",
  },
];

const steps = [
  {
    num: "01",
    title: "Completá el formulario",
    desc: "Contanos quién sos, qué tipo de productos distribuís y cuál es tu mercado principal.",
  },
  {
    num: "02",
    title: "Te contactamos en 24 hs",
    desc: "Un asesor comercial se comunica para conocer tu operación y acordar condiciones.",
  },
  {
    num: "03",
    title: "Definimos las condiciones",
    desc: "Establecemos márgenes, plazos, logística y soporte según el volumen y el canal.",
  },
  {
    num: "04",
    title: "Empezamos a operar",
    desc: "Accedés a catálogo, precios de canal y soporte comercial para empezar a vender.",
  },
];

const faqs = [
  { q: "¿Qué tipos de revendedores trabajan con Bartez?", a: "Trabajamos con tiendas de informática, integradores de sistemas, empresas de servicios IT, distribuidores regionales y profesionales independientes que revenden tecnología a empresas u hogares." },
  { q: "¿Hay un mínimo de compra para ser revendedor?", a: "No tenemos un mínimo rígido para ingresar al canal. Las condiciones se acuerdan según el perfil, volumen estimado y tipo de productos. Consultanos sin compromiso." },
  { q: "¿Ofrecen soporte técnico para revendedores?", a: "Sí. Tenés acceso a soporte comercial y orientación técnica para que puedas asesorar correctamente a tus clientes." },
  { q: "¿Cómo se gestionan las garantías?", a: "Te informamos las condiciones aplicables a cada producto y acompañamos el inicio y seguimiento del caso cuando corresponde." },
  { q: "¿Emiten Factura A?", a: "Sí. Somos Responsable Inscripto y todas las operaciones se documentan con Factura A." },
];

const whatsappHref = whatsappLinks.reseller;

export default function RevendedoresPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#030c07] text-white pt-20">
        
        {/* Hero */}
        <section className="relative py-20 md:py-28 bg-[#030c07]">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3.5 py-1.5 mb-6">
              <Handshake className="size-3.5 text-accent animate-pulse" />
              <span className="text-[12px] font-bold tracking-wide text-accent">Canal IT · Programa de revendedores</span>
            </div>
            <h1 className="max-w-[700px] font-display text-[clamp(40px,6vw,70px)] font-extrabold leading-[0.98] tracking-[-0.05em] text-balance text-white">
              Revendé tecnología de{" "}
              <span className="text-accent">primera línea.</span>
            </h1>
            <p className="mt-7 max-w-[56ch] text-[clamp(16px,1.5vw,18px)] leading-relaxed text-slate-400">
              Sumate al canal de distribución de Bartez. Condiciones comerciales competitivas, marcas líderes y 18 años de experiencia para acompañar el crecimiento de tu negocio.
            </p>
            <div className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center">
              <a
                href="#registro"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-[14.5px] font-bold text-ink transition hover:scale-[1.02]"
              >
                Quiero ser revendedor <ArrowRight size={17} />
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-3.5 text-[14px] font-semibold text-white transition hover:bg-white/10"
              >
                <MessageCircle size={17} /> Consultar por WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* Beneficios */}
        <section className="bg-[#06140d] border-y border-white/5 py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="max-w-[560px] mb-12">
              <span className="text-[12px] font-bold uppercase tracking-widest text-accent">Ventajas del canal</span>
              <h2 className="mt-3 font-display text-[clamp(28px,3.5vw,42px)] font-bold leading-[1.06] tracking-[-0.035em] text-white">
                Por qué distribuir con Bartez.
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-slate-450">
                Dieciocho años de experiencia en el mercado IT argentino nos permiten entender la dinámica del canal y ofrecer una atención comercial directa.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((b) => (
                <div key={b.title} className="rounded-3xl border border-white/5 bg-[#082214] p-8 hover:border-accent/30 transition duration-300">
                  <span className="grid size-11 place-items-center rounded-xl bg-accent/10 border border-accent/20">
                    <b.icon className="size-5 text-accent" strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-5 font-display text-[16px] font-bold text-white">{b.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-400">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cómo funciona */}
        <section className="bg-[#030c07] py-20 md:py-24">
          <div className="mx-auto max-w-[1200px] px-6">
            <h2 className="max-w-[560px] font-display text-[clamp(26px,3.5vw,38px)] font-bold leading-[1.06] tracking-[-0.035em] text-white">
              Cómo sumarte al canal.
            </h2>

            <ol className="relative mt-14 grid gap-9 md:grid-cols-4 md:gap-6">
              <span className="absolute left-[8%] right-[8%] top-5 hidden h-px bg-white/10 md:block" aria-hidden />
              {steps.map((step) => (
                <li key={step.num} className="relative">
                  <span className="relative z-10 grid size-10 place-items-center rounded-full border border-accent bg-[#082214] font-display text-[13px] font-bold text-accent">
                    {step.num}
                  </span>
                  <h3 className="mt-6 font-display text-[15px] font-bold text-white">{step.title}</h3>
                  <p className="mt-2 max-w-[26ch] text-[13px] leading-relaxed text-slate-400">{step.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Formulario de registro */}
        <section id="registro" className="scroll-mt-24 bg-[#06140d] border-t border-white/5 py-20 text-white md:py-28">
          <div className="mx-auto grid max-w-[1200px] gap-12 px-6 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <h2 className="font-display text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.06] tracking-[-0.04em] text-white">
                Registrate como revendedor.
              </h2>
              <p className="mt-5 max-w-[36ch] text-[15px] leading-relaxed text-slate-400">
                Completá el formulario y un asesor se comunicará con vos en las próximas 24 hs hábiles para acordar las condiciones de trabajo.
              </p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-3 text-[14px] font-semibold transition hover:bg-white/10"
              >
                <MessageCircle size={17} /> Prefiero WhatsApp
              </a>
            </div>

            <div className="rounded-3xl bg-[#030c07] border border-white/10 p-6 text-white shadow-soft md:p-9">
              <h3 className="font-display text-[20px] font-bold text-white">Contanos sobre tu negocio</h3>
              <p className="mt-2 text-[13.5px] text-slate-400">Sin compromiso. Evaluamos cada consulta de forma personalizada.</p>

              <ResellerWhatsAppForm />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-[#030c07] py-20 md:py-24 border-t border-white/5">
          <div className="mx-auto max-w-[1200px] px-6">
            <h2 className="max-w-[500px] font-display text-[clamp(26px,3.5vw,38px)] font-bold leading-[1.06] tracking-[-0.035em] text-white">
              Preguntas de revendedores
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {faqs.map((item) => (
                <div key={item.q} className="rounded-2xl border border-white/5 bg-[#082214] p-6">
                  <div className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 flex-none text-accent" strokeWidth={1.8} />
                    <div>
                      <h3 className="font-display text-[14.5px] font-bold text-white">{item.q}</h3>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-slate-400">{item.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
