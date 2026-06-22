import type { Metadata } from "next";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileCheck2,
  HelpCircle,
  Package,
  RefreshCw,
  Shield,
  Truck,
  Wrench,
} from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { contact } from "../../constants";

export const metadata: Metadata = {
  title: "Garantías y RMA — Bartez Tecnología",
  description:
    "Conocé cómo acompaña Bartez las consultas de garantía y el proceso de RMA según las condiciones aplicables a cada producto y fabricante.",
};

const steps = [
  {
    num: "01",
    icon: HelpCircle,
    title: "Detectás el problema",
    desc: "El equipo presenta una falla o defecto de fabricación durante el período de garantía.",
  },
  {
    num: "02",
    icon: AlertCircle,
    title: "Nos contactás",
    desc: "Escribinos por WhatsApp, email o teléfono describiendo el problema, el modelo y el número de serie.",
  },
  {
    num: "03",
    icon: FileCheck2,
    title: "Evaluamos el caso",
    desc: "Revisamos el problema y determinamos si corresponde garantía del fabricante o soporte técnico. Respondemos en 24 hs hábiles.",
  },
  {
    num: "04",
    icon: RefreshCw,
    title: "Gestionamos la solución",
    desc: "Coordinamos el retiro, la reparación o el reemplazo según corresponda. Te informamos en cada paso.",
  },
];

const covered = [
  "Defectos de fabricación detectados durante el uso normal",
  "Fallas de hardware bajo condiciones normales de operación",
  "Componentes defectuosos (pantalla, batería, teclado, disco) dentro del período",
  "Problemas de firmware asociados al equipo (según fabricante)",
];

const notCovered = [
  "Daños por golpes, líquidos o mal uso del equipo",
  "Modificaciones o reparaciones realizadas por terceros no autorizados",
  "Desgaste normal por uso (batería después de ciclos normales, etc.)",
  "Daños causados por sobretensión eléctrica sin protección adecuada",
  "Pérdida de datos — siempre recomendamos backup previo a cualquier gestión",
];

const brands = [
  { name: "Dell", warranty: "1 a 3 años según línea (ProSupport disponible)" },
  { name: "Lenovo", warranty: "1 a 3 años — ThinkPad tiene la mejor cobertura de la categoría" },
  { name: "HP", warranty: "1 año base, extensiones disponibles" },
  { name: "Cisco", warranty: "Varía por modelo — consultar" },
  { name: "Kingston", warranty: "Garantía de por vida en líneas Kingston y HyperX" },
  { name: "Intel / AMD", warranty: "3 años procesadores, 2 años GPUs (según modelo)" },
];

const faqs = [
  { q: "¿Cuánto tiempo tarda la resolución?", a: "Depende del fabricante y el tipo de problema. En general entre 5 y 15 días hábiles para reparación o sustitución. En casos de unidades de reemplazo express, puede ser menos." },
  { q: "¿Necesito el packaging original?", a: "No es obligatorio para la mayoría de los fabricantes, pero sí recomendamos conservarlo para mayor protección durante el traslado." },
  { q: "¿Pierdo mis datos durante una garantía?", a: "Posiblemente, según el tipo de reparación. Siempre recomendamos hacer un backup completo antes de cualquier gestión técnica." },
  { q: "¿Qué pasa si el equipo ya no está en garantía?", a: "Podemos orientarte en opciones de reparación o upgrade. Contactanos igualmente y evaluamos juntos la mejor solución." },
  { q: "¿Puedo iniciar una gestión desde cualquier punto del país?", a: "Sí. Revisamos cada caso y coordinamos los pasos de diagnóstico y logística según el producto, el fabricante y la ubicación." },
];

export default function GarantiasRmaPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#030c07] text-white pt-20">
        {/* Hero */}
        <section className="bg-[#030c07] py-20 text-white md:py-24">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3.5 py-1.5 mb-6">
              <Shield className="size-3.5 text-accent" />
              <span className="text-[12px] font-semibold tracking-wide text-accent">Garantías y RMA · Soporte post-venta</span>
            </div>
            <h1 className="max-w-[660px] font-display text-[clamp(36px,5vw,62px)] font-bold leading-[0.98] tracking-[-0.05em] text-balance">
              Tu compra está respaldada. Siempre.
            </h1>
            <p className="mt-6 max-w-[56ch] text-[clamp(15px,1.4vw,17px)] leading-relaxed text-slate-400">
              Si un producto presenta una falla, te ayudamos a identificar el procedimiento aplicable y acompañamos el seguimiento con información clara en cada paso.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={`https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent("Hola, necesito hacer un reclamo de garantía.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-[14.5px] font-bold text-ink transition-all hover:scale-[1.02]"
              >
                Iniciar reclamo de garantía <ArrowRight size={16} />
              </a>
              <a
                href={`mailto:${contact.email}?subject=Reclamo%20de%20garantía`}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-white/10"
              >
                Enviar por email
              </a>
            </div>
          </div>
        </section>

        {/* Garantías por marca */}
        <section className="bg-[#030c07] border-t border-white/5 py-16 md:py-20">
          <div className="mx-auto max-w-[1200px] px-6">
            <h2 className="font-display text-[clamp(24px,3vw,36px)] font-bold tracking-[-0.035em] text-white">
              Garantías por fabricante.
            </h2>
            <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-slate-400">
              Cada marca tiene su política de garantía. Estos son los períodos y condiciones de las marcas que distribuimos.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {brands.map((b) => (
                <div key={b.name} className="flex gap-4 rounded-3xl border border-white/5 bg-[#082214] p-5 hover:border-accent/40 hover:bg-[#0c2e1d] transition duration-300 shadow-glow">
                  <Package className="mt-0.5 size-5 flex-none text-accent" strokeWidth={1.6} />
                  <div>
                    <p className="font-display text-[15px] font-bold text-white">{b.name}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-slate-400">{b.warranty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Proceso RMA */}
        <section className="bg-[#06140d] py-16 md:py-20">
          <div className="mx-auto max-w-[1200px] px-6">
            <h2 className="max-w-[500px] font-display text-[clamp(24px,3vw,36px)] font-bold tracking-[-0.035em] text-white">
              Proceso de garantía paso a paso.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-400">Transparencia total en cada etapa.</p>

            <ol className="relative mt-12 grid gap-8 md:grid-cols-4 md:gap-6">
              <span className="absolute left-[8%] right-[8%] top-5 hidden h-px bg-accent/20 md:block" aria-hidden />
              {steps.map((step) => (
                <li key={step.num} className="relative">
                  <span className="relative z-10 grid size-10 place-items-center rounded-full border border-accent bg-[#030c07] font-display text-[13px] font-bold text-accent">
                    {step.num}
                  </span>
                  <div className="mt-5 flex items-center gap-2">
                    <step.icon className="size-5 text-slate-450" strokeWidth={1.5} />
                    <h3 className="font-display text-[15px] font-semibold text-white">{step.title}</h3>
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-400">{step.desc}</p>
                </li>
              ))}
            </ol>

            <div className="mt-10 flex flex-wrap gap-6 rounded-3xl bg-[#030c07] border border-white/5 px-6 py-5 shadow-glow">
              <div className="flex items-center gap-2.5">
                <Clock className="size-5 text-accent" strokeWidth={1.6} />
                <span className="text-[13.5px] font-medium text-white">Respuesta inicial: 24 hs hábiles</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Truck className="size-5 text-accent" strokeWidth={1.6} />
                <span className="text-[13.5px] font-medium text-white">Coordinamos retiro a domicilio</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Wrench className="size-5 text-accent" strokeWidth={1.6} />
                <span className="text-[13.5px] font-medium text-white">Resolución: 5 a 15 días hábiles</span>
              </div>
            </div>
          </div>
        </section>

        {/* Qué cubre y qué no */}
        <section className="bg-[#030c07] border-t border-white/5 py-16 md:py-20">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <h2 className="font-display text-[22px] font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="size-6 text-accent" strokeWidth={1.8} /> Qué cubre la garantía
                </h2>
                <ul className="mt-6 grid gap-3">
                  {covered.map((item) => (
                    <li key={item} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 size-4.5 flex-none text-accent" strokeWidth={1.8} />
                      <span className="text-[14px] leading-relaxed text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="font-display text-[22px] font-bold text-white flex items-center gap-2">
                  <AlertCircle className="size-6 text-red-400" strokeWidth={1.8} /> Qué no cubre
                </h2>
                <ul className="mt-6 grid gap-3">
                  {notCovered.map((item) => (
                    <li key={item} className="flex gap-3">
                      <AlertCircle className="mt-0.5 size-4.5 flex-none text-red-400" strokeWidth={1.8} />
                      <span className="text-[14px] leading-relaxed text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-[#06140d] py-16 md:py-20">
          <div className="mx-auto max-w-[1200px] px-6">
            <h2 className="font-display text-[clamp(22px,3vw,34px)] font-bold tracking-[-0.03em] text-white">
              Preguntas frecuentes sobre garantías
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {faqs.map((item) => (
                <div key={item.q} className="rounded-3xl border border-white/5 bg-[#082214] p-6 hover:border-accent/40 hover:bg-[#0c2e1d] transition duration-300 shadow-glow">
                  <h3 className="font-display text-[14.5px] font-semibold text-white">{item.q}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-slate-400">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#030c07] border-t border-white/5 py-14 text-white">
          <div className="mx-auto max-w-[1200px] px-6 text-center">
            <h2 className="font-display text-[clamp(22px,3vw,34px)] font-bold tracking-[-0.03em]">
              ¿Tenés un problema con un equipo comprado en Bartez?
            </h2>
            <p className="mt-3 mx-auto max-w-[50ch] text-[14px] leading-relaxed text-slate-400">
              Escribinos y lo resolvemos. Nuestro equipo te acompaña en todo el proceso de garantía sin burocracia innecesaria.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href={`https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent("Hola, necesito hacer un reclamo de garantía.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-[14.5px] font-bold text-ink transition-all hover:scale-[1.02]"
              >
                Iniciar por WhatsApp <ArrowRight size={16} />
              </a>
              <a
                href={`mailto:${contact.email}?subject=Reclamo%20de%20garantía`}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-white/10"
              >
                {contact.email}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
