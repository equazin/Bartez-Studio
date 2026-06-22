import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, CheckCircle2, Gift, Handshake, MessageCircle, Package, Percent, Star, Users } from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { contact } from "../../constants";

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
    title: "Stock disponible en marcas líderes",
    desc: "Dell, Lenovo, HP, Cisco, Kingston y más — equipamiento para todos los segmentos y presupuestos.",
  },
  {
    icon: BadgeCheck,
    title: "Productos con garantía oficial",
    desc: "Todo lo que ofrecemos tiene respaldo de fábrica y posventa gestionada.",
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
    title: "Más de 30 años de trayectoria",
    desc: "Respaldados por décadas de experiencia en el mercado IT argentino.",
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
  { q: "¿Cómo se gestionan las garantías?", a: "Gestionamos las garantías directamente con los fabricantes. El revendedor tiene un canal de soporte dedicado para gestionar cambios y reclamos." },
  { q: "¿Emiten Factura A?", a: "Sí. Somos Responsable Inscripto y todas las operaciones se documentan con Factura A." },
];

const whatsappHref = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent("Hola, soy revendedor y quiero conocer las condiciones del canal Bartez.")}`;

export default function RevendedoresPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-ink py-20 text-white md:py-28">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 mb-6">
              <Handshake className="size-3.5 text-accent" />
              <span className="text-[12px] font-semibold tracking-wide text-slate-200">Canal IT · Programa de revendedores</span>
            </div>
            <h1 className="max-w-[700px] font-display text-[clamp(40px,6vw,70px)] font-bold leading-[0.98] tracking-[-0.05em] text-balance">
              Revendé tecnología de{" "}
              <span className="text-gradient">primera línea.</span>
            </h1>
            <p className="mt-7 max-w-[56ch] text-[clamp(16px,1.5vw,18px)] leading-relaxed text-slate-300">
              Sumate al canal de distribución de Bartez. Condiciones comerciales competitivas, marcas líderes del mercado y más de 30 años de respaldo para que tu negocio crezca.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#registro"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-[14.5px] font-semibold text-ink transition-all hover:-translate-y-0.5"
              >
                Quiero ser revendedor <ArrowRight size={17} />
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-5 py-3.5 text-[14px] font-semibold text-white transition-colors hover:border-emerald hover:text-emerald"
              >
                <MessageCircle size={17} /> Consultar por WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* Beneficios */}
        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="max-w-[560px]">
              <h2 className="font-display text-[clamp(28px,3.5vw,42px)] font-bold leading-[1.06] tracking-[-0.035em] text-ink">
                Por qué distribuir con Bartez.
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-slate-600">
                Más de 30 años de experiencia en el mercado IT argentino nos permiten ofrecerte condiciones reales para que tu negocio de reventa sea rentable.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((b) => (
                <div key={b.title} className="rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-card">
                  <span className="grid size-11 place-items-center rounded-xl bg-brand/8">
                    <b.icon className="size-5 text-brand" strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-5 font-display text-[16px] font-bold text-ink">{b.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-500">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cómo funciona */}
        <section className="bg-slate-50 py-20 md:py-24">
          <div className="mx-auto max-w-[1200px] px-6">
            <h2 className="max-w-[560px] font-display text-[clamp(26px,3.5vw,38px)] font-bold leading-[1.06] tracking-[-0.035em] text-ink">
              Cómo sumarte al canal.
            </h2>

            <ol className="relative mt-14 grid gap-9 md:grid-cols-4 md:gap-6">
              <span className="absolute left-[8%] right-[8%] top-5 hidden h-px bg-brand/30 md:block" aria-hidden />
              {steps.map((step) => (
                <li key={step.num} className="relative">
                  <span className="relative z-10 grid size-10 place-items-center rounded-full border border-brand bg-white font-display text-[13px] font-bold text-brand">
                    {step.num}
                  </span>
                  <h3 className="mt-6 font-display text-[15px] font-semibold text-ink">{step.title}</h3>
                  <p className="mt-2 max-w-[26ch] text-[13px] leading-relaxed text-slate-500">{step.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Formulario de registro */}
        <section id="registro" className="scroll-mt-24 bg-ink py-20 text-white md:py-28">
          <div className="mx-auto grid max-w-[1200px] gap-12 px-6 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
            <div>
              <h2 className="font-display text-[clamp(28px,4vw,44px)] font-bold leading-[1.06] tracking-[-0.04em] text-white">
                Registrate como revendedor.
              </h2>
              <p className="mt-5 max-w-[36ch] text-[15px] leading-relaxed text-slate-300">
                Completá el formulario y un asesor se comunicará con vos en las próximas 24 hs hábiles para acordar las condiciones de trabajo.
              </p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-lg border border-white/25 px-5 py-3 text-[14px] font-semibold transition-colors hover:border-emerald hover:text-emerald"
              >
                <MessageCircle size={17} /> Prefiero WhatsApp
              </a>
            </div>

            <div className="rounded-2xl bg-white p-6 text-slate-900 shadow-card md:p-9">
              <h3 className="font-display text-[20px] font-semibold text-ink">Contanos sobre tu negocio</h3>
              <p className="mt-2 text-[13.5px] text-slate-500">Sin compromiso. Evaluamos cada consulta de forma personalizada.</p>

              <form
                className="mt-7 grid gap-4 sm:grid-cols-2"
                action="/#cotiza"
                method="GET"
                aria-label="Formulario de registro de revendedores"
              >
                <label className="sm:col-span-2">
                  <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-600">Empresa o razón social</span>
                  <input
                    required
                    name="empresa"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[14px] text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
                    placeholder="Nombre de la empresa"
                  />
                </label>
                <label>
                  <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-600">Nombre</span>
                  <input
                    required
                    name="nombre"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[14px] text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
                    placeholder="Tu nombre"
                  />
                </label>
                <label>
                  <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-600">Teléfono / WhatsApp</span>
                  <input
                    required
                    name="telefono"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[14px] text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
                    placeholder="+54 9 ..."
                  />
                </label>
                <label className="sm:col-span-2">
                  <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-600">Email corporativo</span>
                  <input
                    required
                    type="email"
                    name="email"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[14px] text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
                    placeholder="nombre@empresa.com"
                  />
                </label>
                <label className="sm:col-span-2">
                  <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-600">Contanos sobre tu negocio</span>
                  <textarea
                    name="mensaje"
                    rows={3}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-[14px] text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
                    placeholder="¿Qué tipo de productos distribuís? ¿Cuál es tu mercado principal? ¿Volumen estimado?"
                  />
                </label>

                {/* Este form redirige al QuoteBuilder del home con contexto. En producción debería conectarse al API de leads con origen=revendedor */}
                <div className="sm:col-span-2">
                  <a
                    href={`mailto:${contact.email}?subject=Consulta%20de%20revendedor&body=Hola%2C%20quiero%20conocer%20las%20condiciones%20del%20canal%20Bartez.`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-6 py-3.5 text-[14.5px] font-semibold text-white transition-colors hover:bg-brand"
                  >
                    Enviar consulta <ArrowRight size={17} />
                  </a>
                  <p className="mt-3 text-center text-[11.5px] text-slate-400">
                    O escribinos directo a{" "}
                    <a href={`mailto:${contact.email}`} className="font-semibold text-brand hover:underline">{contact.email}</a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white py-20 md:py-24">
          <div className="mx-auto max-w-[1200px] px-6">
            <h2 className="max-w-[500px] font-display text-[clamp(26px,3.5vw,38px)] font-bold leading-[1.06] tracking-[-0.035em] text-ink">
              Preguntas de revendedores
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {faqs.map((item) => (
                <div key={item.q} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
                  <div className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 flex-none text-brand" strokeWidth={1.8} />
                    <div>
                      <h3 className="font-display text-[14.5px] font-semibold text-ink">{item.q}</h3>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">{item.a}</p>
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
