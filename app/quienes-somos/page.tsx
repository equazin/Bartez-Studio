import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, Gamepad2, Globe, Home, Landmark } from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { company } from "../../constants";

export const metadata: Metadata = {
  title: "Quiénes somos — Bartez Tecnología",
  description:
    "Conocé la historia, misión y valores de Bartez Tecnología. Más de 30 años de experiencia distribuyendo tecnología para empresas, organismos y hogares en toda Argentina desde Rosario.",
};

const channels = [
  {
    icon: Building2,
    title: "Canal corporativo",
    description:
      "Empresas de todos los rubros que necesitan equipamiento, infraestructura y soluciones IT con asesoramiento técnico y condiciones B2B.",
  },
  {
    icon: Gamepad2,
    title: "Canal gamer",
    description:
      "Equipos, periféricos y componentes para entusiastas y profesionales del gaming, con productos de primera línea y asesoramiento especializado.",
  },
  {
    icon: Landmark,
    title: "Sector público y privado",
    description:
      "Organismos gubernamentales, instituciones educativas y organizaciones privadas con necesidades de equipamiento masivo y condiciones institucionales.",
  },
  {
    icon: Home,
    title: "Hogares",
    description:
      "Particulares que buscan tecnología de calidad con el respaldo del asesoramiento profesional que nos diferencia en el mercado.",
  },
];

const values = [
  { title: "Conocimiento profesional", desc: "Más de 30 años de experiencia acumulada nos permiten entender cada necesidad y proponer la solución correcta." },
  { title: "Productos de primera línea", desc: "Trabajamos con marcas reconocidas mundialmente: Dell, Lenovo, HP, Cisco, Intel, AMD y Kingston, entre otros." },
  { title: "Asesoramiento personalizado", desc: "Cada cliente recibe atención dedicada. No vendemos productos, diseñamos soluciones adaptadas a cada contexto." },
  { title: "Cobertura nacional", desc: "Desde Rosario gestionamos distribución y proyectos en diferentes puntos de Argentina." },
];

export default function QuienesSomosPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#030c07] text-white pt-20">
        
        {/* Hero */}
        <section className="bg-[#030c07] py-20 text-white md:py-28">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3.5 py-1.5 mb-6">
              <span className="size-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[12px] font-bold tracking-wide text-accent">Distribuidora IT · Rosario, Argentina</span>
            </div>
            <h1 className="max-w-[700px] font-display text-[clamp(40px,6vw,70px)] font-extrabold leading-[0.98] tracking-[-0.05em] text-balance text-white">
              Distribuyendo tecnología{" "}
              <span className="text-accent">desde 2008.</span>
            </h1>
            <p className="mt-7 max-w-[58ch] text-[clamp(16px,1.5vw,18px)] leading-relaxed text-slate-400">
              {company.description}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5 border-t border-white/15 pt-8">
              <div>
                <span className="block font-display text-[42px] font-bold leading-none text-accent">30+</span>
                <span className="mt-1 block text-[12px] text-slate-405">años de experiencia</span>
              </div>
              <div>
                <span className="block font-display text-[42px] font-bold leading-none text-accent">2008</span>
                <span className="mt-1 block text-[12px] text-slate-405">año de fundación</span>
              </div>
              <div>
                <span className="block font-display text-[42px] font-bold leading-none text-accent">4</span>
                <span className="mt-1 block text-[12px] text-slate-405">canales atendidos</span>
              </div>
              <div>
                <span className="block font-display text-[42px] font-bold leading-none text-accent">ARG</span>
                <span className="mt-1 block text-[12px] text-slate-405">cobertura nacional</span>
              </div>
            </div>
          </div>
        </section>

        {/* Descripción */}
        <section className="bg-[#06140d] border-y border-white/5 py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
              <div>
                <span className="text-[12px] font-bold uppercase tracking-widest text-accent">Nuestra Historia</span>
                <h2 className="mt-3 font-display text-[clamp(28px,3.5vw,42px)] font-bold leading-[1.06] tracking-[-0.035em] text-white">
                  Quiénes somos
                </h2>
                <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-slate-400">
                  <p>
                    Somos una empresa dedicada a comercializar y distribuir tecnología con el fin de brindar soluciones a diversos canales: el corporativo, gamer, organizaciones privadas y públicas, y hogares en diferentes puntos de Argentina.
                  </p>
                  <p>
                    Nuestra ventaja competitiva es brindar valor agregado a nuestros clientes a través de un conocimiento profesional adquirido por más de 30 años de experiencia, ya que les proveemos productos de primera línea con un asesoramiento personalizado.
                  </p>
                  <p>
                    Desde el año 2008 ofrecemos soluciones completas y a medida de las necesidades de nuestros clientes, adaptándonos a cada contexto con la misma dedicación y profesionalismo.
                  </p>
                </div>
                <Link
                  href="/#cotiza"
                  className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-[14.5px] font-bold text-ink transition hover:scale-[1.02]"
                >
                  Consultanos <ArrowRight size={16} />
                </Link>
              </div>

              <div className="grid gap-5 content-start">
                {values.map((v) => (
                  <div key={v.title} className="flex gap-4 rounded-2xl border border-white/5 bg-[#082214] p-5">
                    <CheckCircle2 className="mt-0.5 size-5 flex-none text-accent" strokeWidth={1.8} />
                    <div>
                      <h3 className="font-display text-[15px] font-bold text-white">{v.title}</h3>
                      <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-400">{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Canales atendidos */}
        <section className="bg-[#030c07] py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="max-w-[600px] mb-12">
              <span className="text-[12px] font-bold uppercase tracking-widest text-accent">Nuestros Mercados</span>
              <h2 className="mt-3 font-display text-[clamp(28px,3.5vw,42px)] font-bold leading-[1.06] tracking-[-0.035em] text-white">
                Los canales que atendemos.
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-slate-400">
                Nuestra experiencia nos permite adaptarnos a la realidad de cada cliente, sin importar el rubro ni la escala.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {channels.map((ch) => (
                <div key={ch.title} className="rounded-3xl border border-white/5 bg-[#082214] p-8 hover:border-accent/30 transition duration-300">
                  <span className="grid size-12 place-items-center rounded-xl bg-accent/10 border border-accent/20">
                    <ch.icon className="size-6 text-accent" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-5 font-display text-[16px] font-bold text-white">{ch.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-400">{ch.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-[#06140d] border-t border-white/5 py-20">
          <div className="mx-auto max-w-[1200px] px-6 text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <Globe className="size-5 text-accent" />
              <span className="text-[13px] font-semibold text-slate-400">Rosario, Santa Fe · Cobertura nacional</span>
            </div>
            <h2 className="font-display text-[clamp(26px,3.5vw,40px)] font-bold tracking-[-0.035em] text-white">
              ¿Querés trabajar con nosotros?
            </h2>
            <p className="mx-auto mt-4 max-w-[50ch] text-[15px] leading-relaxed text-slate-400">
              Contanos tu necesidad y un especialista te contactará con una propuesta concreta en 24 hs hábiles.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/#cotiza" className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-[14.5px] font-bold text-ink transition hover:scale-[1.02]">
                Contanos qué necesitás <ArrowRight size={16} />
              </Link>
              <Link href="/revendedores" className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3.5 text-[14.5px] font-semibold text-white transition hover:bg-white/10">
                Soy revendedor <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
