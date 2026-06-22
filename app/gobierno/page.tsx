import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building,
  Building2,
  FileText,
  Globe,
  GraduationCap,
  Headphones,
  HeartPulse,
  Landmark,
  Mail,
  Package,
  ShieldCheck,
} from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { contact } from "../../constants";
import { whatsappLinks } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Tecnología para el Sector Público — Bartez Tecnología",
  description:
    "Provisión de equipamiento IT para organismos públicos, municipios, ministerios y entidades estatales en Argentina. Cotizaciones para licitaciones y compras directas.",
};

const offerings = [
  {
    icon: FileText,
    title: "Documentación completa",
    desc: "Presupuestos formales, cotizaciones para licitaciones y toda la documentación requerida por los procesos de compra pública.",
  },
  {
    icon: Building2,
    title: "Organismos de todos los niveles",
    desc: "Municipal, provincial y nacional. Experiencia en diferentes escalas de gobierno.",
  },
  {
    icon: ShieldCheck,
    title: "Factura A garantizada",
    desc: "Somos Responsable Inscripto. Todas las operaciones con documentación fiscal correcta.",
  },
  {
    icon: Package,
    title: "Equipamiento para cada requerimiento",
    desc: "Productos de marcas reconocidas y acompañamiento según las condiciones de garantía de cada fabricante.",
  },
  {
    icon: Globe,
    title: "Cobertura nacional",
    desc: "Coordinamos la provisión y entrega en cualquier punto del país.",
  },
  {
    icon: Headphones,
    title: "Soporte técnico",
    desc: "Acompañamiento técnico durante y después de la implementación.",
  },
];

const sectors = [
  {
    icon: Landmark,
    title: "Municipios y comunas",
    desc: "Equipamiento para administraciones locales: PCs, notebooks, impresoras, redes y servidores.",
  },
  {
    icon: GraduationCap,
    title: "Educación pública",
    desc: "Laboratorios de computación, tablets, proyectores y conectividad para escuelas e institutos.",
  },
  {
    icon: HeartPulse,
    title: "Salud pública",
    desc: "Equipamiento para hospitales, centros de salud y laboratorios: terminales, servidores y redes.",
  },
  {
    icon: Building,
    title: "Organismos provinciales y nacionales",
    desc: "Proyectos de mayor escala con coordinación técnica y logística en múltiples sedes.",
  },
];

const steps = [
  {
    num: "01",
    title: "Recibimos la solicitud",
    desc: "Consultá por WhatsApp, email o el formulario. Describí el organismo y la necesidad.",
  },
  {
    num: "02",
    title: "Preparamos la cotización",
    desc: "Elaboramos el presupuesto formal con toda la documentación requerida en 24-48 hs.",
  },
  {
    num: "03",
    title: "Gestión de compra",
    desc: "Acompañamos el proceso de compra directa o licitación con la documentación necesaria.",
  },
  {
    num: "04",
    title: "Entrega e implementación",
    desc: "Coordinamos la entrega y, si es necesario, la implementación en el organismo.",
  },
];

export default function GobiernoPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#030c07] text-white pt-20">
        {/* Hero */}
        <section className="bg-[#030c07] py-20 text-white md:py-28">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3.5 py-1.5 mb-6">
              <span className="size-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[12px] font-semibold tracking-wide text-accent">
                Sector Público · Gobierno y organismos estatales
              </span>
            </div>

            <h1 className="max-w-[700px] font-display text-[clamp(40px,6vw,70px)] font-bold leading-[0.98] tracking-[-0.05em] text-balance">
              Tecnología para organismos{" "}
              <span className="text-gradient">públicos y gubernamentales.</span>
            </h1>

            <p className="mt-7 max-w-[58ch] text-[clamp(16px,1.5vw,18px)] leading-relaxed text-slate-400">
              Proveemos equipamiento IT, infraestructura y soluciones
              tecnológicas para municipios, ministerios, hospitales, escuelas y
              entidades estatales en toda Argentina.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={whatsappLinks.government}
                className="inline-flex justify-center items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-[14.5px] font-bold text-ink transition-all hover:scale-[1.02]"
              >
                Solicitar cotización <ArrowRight size={17} />
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-white/10"
              >
                Contactar comercial
              </Link>
            </div>
          </div>
        </section>

        {/* Lo que ofrecemos */}
        <section className="bg-[#030c07] border-t border-white/5 py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="max-w-[560px]">
              <h2 className="font-display text-[clamp(28px,3.5vw,42px)] font-bold leading-[1.06] tracking-[-0.035em] text-white">
                Soluciones para el sector público.
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-slate-400">
                Entendemos los requisitos y procesos del sector público
                argentino. Preparamos la documentación que necesitás para cada
                etapa de la compra.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {offerings.map((o) => (
                <div
                  key={o.title}
                  className="rounded-3xl border border-white/5 bg-[#082214] p-6 hover:border-accent/40 hover:bg-[#0c2e1d] transition duration-300 shadow-glow"
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-accent/10 border border-accent/20">
                    <o.icon className="size-5 text-accent" strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-5 font-display text-[16px] font-bold text-white">
                    {o.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
                    {o.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Para qué tipo de organismos */}
        <section className="bg-[#06140d] py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="max-w-[560px]">
              <h2 className="font-display text-[clamp(28px,3.5vw,42px)] font-bold leading-[1.06] tracking-[-0.035em] text-white">
                Trabajamos con todo el sector público.
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-slate-400">
                Desde pequeñas comunas hasta organismos nacionales, adaptamos
                la propuesta a la escala y los procesos de cada organismo.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {sectors.map((s) => (
                <div
                  key={s.title}
                  className="flex items-start gap-5 rounded-3xl border border-white/5 bg-[#082214] p-7 hover:border-accent/40 hover:bg-[#0c2e1d] transition duration-300 shadow-glow"
                >
                  <span className="grid size-14 flex-none place-items-center rounded-2xl bg-accent/10 border border-accent/20">
                    <s.icon className="size-6 text-accent" strokeWidth={1.5} />
                  </span>
                  <div>
                    <h3 className="font-display text-[16px] font-bold text-white">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-slate-400">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Proceso */}
        <section className="bg-[#030c07] border-t border-white/5 py-20 md:py-24">
          <div className="mx-auto max-w-[1200px] px-6">
            <h2 className="max-w-[560px] font-display text-[clamp(26px,3.5vw,38px)] font-bold leading-[1.06] tracking-[-0.035em] text-white">
              Cómo trabajamos con el sector público.
            </h2>

            <ol className="relative mt-14 grid gap-9 md:grid-cols-4 md:gap-6">
              <span
                className="absolute left-[8%] right-[8%] top-5 hidden h-px bg-accent/20 md:block"
                aria-hidden
              />
              {steps.map((step) => (
                <li key={step.num} className="relative">
                  <span className="relative z-10 grid size-10 place-items-center rounded-full border border-accent bg-[#030c07] font-display text-[13px] font-bold text-accent">
                    {step.num}
                  </span>
                  <h3 className="mt-6 font-display text-[15px] font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-[26ch] text-[13px] leading-relaxed text-slate-400">
                    {step.desc}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-[#06140d] py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6 text-center">
            <h2 className="font-display text-[clamp(28px,4vw,46px)] font-bold leading-[1.06] tracking-[-0.04em] text-white text-balance">
              ¿Necesitás una cotización para tu organismo?
            </h2>
            <p className="mx-auto mt-5 max-w-[52ch] text-[16px] leading-relaxed text-slate-400">
              Preparamos presupuestos formales adaptados a los requerimientos
              del sector público. Respondemos en 24-48 hs hábiles.
            </p>
            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href={whatsappLinks.government}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-[14.5px] font-bold text-ink transition-all hover:scale-[1.02]"
              >
                Solicitar presupuesto <ArrowRight size={17} />
              </Link>
              <a
                href={`mailto:${contact.email}?subject=Cotizaci%C3%B3n%20sector%20p%C3%BAblico`}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-white/10"
              >
                <Mail size={17} /> {contact.email}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
