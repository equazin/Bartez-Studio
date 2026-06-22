import type { Metadata } from "next";
import Link from "next/link";
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
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { contact } from "../../constants";

export const metadata: Metadata = {
  title: "Soluciones IT para Empresas — Bartez Tecnología",
  description:
    "Equipamiento, infraestructura y servicios IT para empresas argentinas. Notebooks corporativas, servidores, redes y workstations con asesoramiento técnico y condiciones B2B.",
};

const services = [
  {
    icon: Laptop,
    title: "Notebooks corporativas",
    desc: "Fleet de notebooks ThinkPad, Latitude y ProBook para equipos de trabajo de cualquier tamaño.",
  },
  {
    icon: Server,
    title: "Servidores y storage",
    desc: "PowerEdge, ProLiant y storage para tu datacenter o sala de servidores.",
  },
  {
    icon: Network,
    title: "Redes e infraestructura",
    desc: "Switches Cisco, firewalls, WiFi 6 y cableado estructurado para tu planta u oficina.",
  },
  {
    icon: Monitor,
    title: "Workstations y PCs",
    desc: "Estaciones de trabajo para diseño, CAD, ingeniería y producción.",
  },
  {
    icon: Shield,
    title: "Videovigilancia CCTV",
    desc: "Cámaras IP y sistemas de monitoreo para proteger tus instalaciones.",
  },
  {
    icon: Package,
    title: "Periféricos y puestos",
    desc: "Monitores, docks, headsets y accesorios para equipar cada puesto de trabajo.",
  },
];

const reasons = [
  "Asesoramiento técnico personalizado, sin venderte lo que no necesitás",
  "Productos de primera línea con garantía oficial de fábrica",
  "Factura A en todas las operaciones — Responsable Inscripto",
  "Cobertura nacional — coordinamos entregas a cualquier sede",
  "Condiciones B2B: cuenta corriente y plazos acordes a tu operación",
  "Soporte post-venta y gestión de garantías incluida",
];

const stats = [
  { label: "30+ años de experiencia" },
  { label: "Cobertura nacional" },
  { label: "Factura A" },
];

const whatsappHref = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(
  "Hola, necesito asesoramiento IT para mi empresa."
)}`;

export default function EmpresasPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-ink py-20 text-white md:py-28">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 mb-6">
              <span className="size-2 rounded-full bg-accent" />
              <span className="text-[12px] font-semibold tracking-wide text-slate-200">
                Canal Corporativo · Empresas y organizaciones
              </span>
            </div>

            <h1 className="max-w-[700px] font-display text-[clamp(40px,6vw,70px)] font-bold leading-[0.98] tracking-[-0.05em] text-balance">
              Soluciones IT completas{" "}
              <span className="text-gradient">para tu empresa.</span>
            </h1>

            <p className="mt-7 max-w-[58ch] text-[clamp(16px,1.5vw,18px)] leading-relaxed text-slate-300">
              Equipamos empresas de todos los rubros con tecnología de primera
              línea. Notebooks, servidores, redes, workstations y periféricos
              con asesoramiento profesional y cobertura nacional.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="/#cotiza"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-[14.5px] font-semibold text-ink transition-all hover:-translate-y-0.5"
              >
                Pedir cotización <ArrowRight size={17} />
              </a>
              <Link
                href="/marcas"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-5 py-3.5 text-[14px] font-semibold text-white transition-colors hover:border-accent hover:text-accent"
              >
                Ver marcas
              </Link>
            </div>

            {/* Stats strip */}
            <div className="mt-14 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/10 pt-8">
              {stats.map((s) => (
                <div key={s.label} className="flex items-center gap-2.5">
                  <span className="size-1.5 rounded-full bg-accent" />
                  <span className="text-[13.5px] font-semibold text-slate-300">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Servicios */}
        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="max-w-[560px]">
              <h2 className="font-display text-[clamp(28px,3.5vw,42px)] font-bold leading-[1.06] tracking-[-0.035em] text-ink">
                Todo lo que necesita tu empresa en un solo lugar.
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-slate-600">
                Una sola fuente de equipamiento IT, con asesoramiento técnico
                y condiciones comerciales pensadas para empresas.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <div
                  key={s.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-card"
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-brand/8">
                    <s.icon className="size-5 text-brand" strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-5 font-display text-[16px] font-bold text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-500">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Por qué elegirnos */}
        <section className="bg-slate-50 py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 lg:items-center">
              {/* Left: text */}
              <div>
                <h2 className="font-display text-[clamp(28px,3.5vw,42px)] font-bold leading-[1.06] tracking-[-0.035em] text-ink">
                  ¿Por qué las empresas eligen Bartez?
                </h2>
                <p className="mt-5 text-[16px] leading-relaxed text-slate-600">
                  Más de 30 años de experiencia en el mercado IT argentino nos
                  permiten entender la realidad de cada empresa y proponer
                  soluciones que realmente funcionen.
                </p>
              </div>

              {/* Right: checklist */}
              <ul className="space-y-4">
                {reasons.map((r) => (
                  <li key={r} className="flex items-start gap-3">
                    <CheckCircle2
                      className="mt-0.5 size-5 flex-none text-brand"
                      strokeWidth={1.8}
                    />
                    <span className="text-[15px] leading-relaxed text-slate-700">
                      {r}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-ink py-20 text-white md:py-28">
          <div className="mx-auto max-w-[1200px] px-6 text-center">
            <h2 className="font-display text-[clamp(28px,4vw,46px)] font-bold leading-[1.06] tracking-[-0.04em] text-balance">
              ¿Querés equipar tu empresa con tecnología de primera línea?
            </h2>
            <p className="mx-auto mt-5 max-w-[52ch] text-[16px] leading-relaxed text-slate-300">
              Contanos cuántos usuarios, qué tipo de trabajo realizan y cuál es
              tu plazo. Un especialista te responde con una propuesta en 24 hs
              hábiles.
            </p>
            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href="/#cotiza"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-[14.5px] font-semibold text-ink transition-all hover:-translate-y-0.5"
              >
                Solicitar asesoramiento <ArrowRight size={17} />
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-5 py-3.5 text-[14px] font-semibold text-white transition-colors hover:border-emerald hover:text-emerald"
              >
                <MessageCircle size={17} /> Hablar por WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
