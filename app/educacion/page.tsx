import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Laptop,
  MessageCircle,
  Monitor,
  Network,
  Package,
  School,
  Server,
  Users,
} from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { contact } from "../../constants";

export const metadata: Metadata = {
  title: "Tecnología para Educación — Bartez Tecnología",
  description:
    "Equipamiento IT para escuelas, colegios, institutos y universidades. Laboratorios de computación, tablets, redes y servidores para el sector educativo argentino.",
};

const solutions = [
  {
    icon: Laptop,
    title: "Laboratorios de computación",
    desc: "PCs y notebooks para aulas de informática, configuradas con imagen educativa, software curricular y acceso a red gestionado.",
  },
  {
    icon: Monitor,
    title: "Equipos para docentes",
    desc: "Notebooks y accesorios para el personal docente y administrativo: ThinkPad, ProBook y Dell Latitude en gama profesional.",
  },
  {
    icon: Network,
    title: "Conectividad y redes",
    desc: "Diseño e implementación de redes WiFi y cableadas para todas las aulas, con gestión centralizada y acceso seguro.",
  },
  {
    icon: Server,
    title: "Servidores educativos",
    desc: "Servidores para gestión académica, plataformas LMS, bases de datos de alumnos y servicios de administración.",
  },
  {
    icon: Package,
    title: "Tablets y dispositivos",
    desc: "Tablets y dispositivos para programas de inclusión digital, 1 a 1 o compartidos, con accesorios y gestión de flota.",
  },
  {
    icon: BookOpen,
    title: "Infraestructura audiovisual",
    desc: "Proyectores, pantallas interactivas, sistemas de sonido y pizarras digitales para modernizar el aula.",
  },
];

const levels = [
  {
    icon: School,
    title: "Nivel inicial y primario",
    desc: "Tablets, proyectores y equipos básicos adaptados para las primeras etapas del aprendizaje digital.",
  },
  {
    icon: GraduationCap,
    title: "Nivel secundario",
    desc: "Laboratorios de computación, notebooks, redes WiFi y servidores para escuelas técnicas y bachilleratos.",
  },
  {
    icon: Users,
    title: "Institutos terciarios",
    desc: "Equipamiento especializado para carreras técnicas, de diseño, sistemas y administración.",
  },
  {
    icon: BookOpen,
    title: "Universidades",
    desc: "Proyectos de escala mayor: laboratorios, datacenters académicos, redes campus y equipamiento masivo.",
  },
];

const whatsappHref = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent("Hola, represento a una institución educativa y necesito cotizar equipamiento tecnológico.")}`;

export default function EducacionPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-ink py-20 text-white md:py-28">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 mb-6">
              <GraduationCap className="size-3.5 text-accent" />
              <span className="text-[12px] font-semibold tracking-wide text-slate-200">Sector Educativo · Escuelas · Institutos · Universidades</span>
            </div>
            <h1 className="max-w-[700px] font-display text-[clamp(38px,5.5vw,66px)] font-bold leading-[0.98] tracking-[-0.05em] text-balance">
              Tecnología que{" "}
              <span className="text-gradient">transforma la educación.</span>
            </h1>
            <p className="mt-7 max-w-[58ch] text-[clamp(15px,1.4vw,17px)] leading-relaxed text-slate-300">
              Equipamos instituciones educativas de todos los niveles con tecnología de primera línea: laboratorios de computación, tablets, redes, servidores y audiovisuales. Presupuestos formales para compras institucionales.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/#cotiza"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-[14.5px] font-semibold text-ink transition-all hover:-translate-y-0.5"
              >
                Pedir cotización institucional <ArrowRight size={16} />
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-5 py-3.5 text-[14px] font-semibold transition-colors hover:border-emerald-400 hover:text-emerald-400"
              >
                <MessageCircle size={16} /> Consultar por WhatsApp
              </a>
            </div>

            {/* Stats */}
            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-8">
              {[
                { num: "30+", label: "años de experiencia" },
                { num: "2008", label: "distribuyendo desde" },
                { num: "ARG", label: "cobertura nacional" },
              ].map((s) => (
                <div key={s.label}>
                  <span className="block font-display text-[32px] font-bold leading-none text-accent">{s.num}</span>
                  <span className="mt-1 block text-[12px] text-slate-400">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Soluciones */}
        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="max-w-[560px]">
              <h2 className="font-display text-[clamp(26px,3.5vw,40px)] font-bold leading-[1.06] tracking-[-0.035em] text-ink">
                Soluciones para el sector educativo.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
                Desde un laboratorio de 20 PCs hasta la red WiFi de toda una universidad, acompañamos proyectos de cualquier escala.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {solutions.map((s) => (
                <div key={s.title} className="rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-card">
                  <span className="grid size-11 place-items-center rounded-xl bg-brand/8">
                    <s.icon className="size-5 text-brand" strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-5 font-display text-[16px] font-bold text-ink">{s.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-500">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Niveles educativos */}
        <section className="bg-slate-50 py-20 md:py-24">
          <div className="mx-auto max-w-[1200px] px-6">
            <h2 className="max-w-[500px] font-display text-[clamp(26px,3.5vw,40px)] font-bold leading-[1.06] tracking-[-0.035em] text-ink">
              Para todos los niveles.
            </h2>
            <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-slate-600">
              Adaptamos cada solución a la realidad y los requerimientos de cada nivel e institución.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {levels.map((l) => (
                <div key={l.title} className="rounded-2xl border border-slate-200 bg-white p-6">
                  <span className="grid size-12 place-items-center rounded-xl bg-brand/8">
                    <l.icon className="size-6 text-brand" strokeWidth={1.4} />
                  </span>
                  <h3 className="mt-5 font-display text-[16px] font-bold text-ink">{l.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-500">{l.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Por qué Bartez */}
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
              <div>
                <h2 className="font-display text-[clamp(24px,3vw,36px)] font-bold leading-[1.1] tracking-[-0.035em] text-ink">
                  ¿Por qué las instituciones eligen Bartez?
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
                  Más de 30 años de experiencia en el mercado IT argentino y un conocimiento profundo de las necesidades del sector educativo.
                </p>
              </div>
              <div className="grid gap-4">
                {[
                  "Presupuestos formales para procesos de compra institucional",
                  "Productos con garantía oficial de fábrica — Dell, Lenovo, HP, Cisco",
                  "Factura A en todas las operaciones",
                  "Cobertura nacional — entrega a cualquier punto del país",
                  "Asesoramiento técnico especializado sin costo",
                  "Soporte post-implementación incluido",
                ].map((item) => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 flex-none text-brand" strokeWidth={1.8} />
                    <span className="text-[14px] leading-relaxed text-slate-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-ink py-16 text-white">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-display text-[clamp(22px,3vw,34px)] font-bold tracking-[-0.03em]">
                  ¿Necesitás cotización para tu institución?
                </h2>
                <p className="mt-3 max-w-[50ch] text-[14px] leading-relaxed text-slate-300">
                  Preparamos presupuestos formales adaptados a los requerimientos educativos. Respondemos en 24-48 hs hábiles.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/#cotiza" className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-[14px] font-semibold text-ink transition-all hover:-translate-y-0.5">
                  Solicitar presupuesto <ArrowRight size={15} />
                </Link>
                <a href={`mailto:${contact.email}?subject=Cotización%20educativa`} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 px-6 py-3.5 text-[14px] font-semibold transition-colors hover:border-white/60">
                  Escribir por email
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
