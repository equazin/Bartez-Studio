import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Building2, CheckCircle2, Globe, Landmark, MessageCircle, Network, Rocket, School, Sparkles, Store, Truck } from "lucide-react";
import {
  InternalChecklist,
  InternalCta,
  InternalFeatureGrid,
  InternalHero,
  InternalPageShell,
  InternalSection,
} from "@/components/InternalPage";
import { company } from "@/constants";
import { whatsappLinks } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Quienes somos - Bartez Tecnología",
  description:
    "Conocé la historia, misión y valores de Bartez Tecnología. Dieciocho años en el rubro distribuyendo tecnología para empresas, organismos y revendedores en toda Argentina desde Rosario.",
};

const channels = [
  {
    icon: Building2,
    title: "Canal corporativo",
    description: "Empresas que necesitan equipamiento, infraestructura y soluciones IT con asesoramiento técnico y condiciones B2B.",
  },
  {
    icon: Store,
    title: "Revendedores e integradores",
    description: "Tiendas, integradores y profesionales IT que necesitan atención de canal, marcas y respuesta comercial.",
  },
  {
    icon: Landmark,
    title: "Sector público y privado",
    description: "Organismos e instituciónes con necesidades de equipamiento masivo y condiciones instituciónales.",
  },
  {
    icon: School,
    title: "Educación",
    description: "Escuelas, institutos y universidades con necesidades de equipamiento, conectividad e infraestructura.",
  },
];

const values = [
  "Dieciocho años en el rubro nos permiten entender cada necesidad y proponer alternativas adecuadas.",
  "Trabajamos con marcas reconocidas mundialmente y líneas pensadas para uso real.",
  "Cada cliente recibe atención dedicada: no vendemos productos aislados, armamos soluciones.",
  "Desde Rosario gestionamos distribución y proyectos en diferentes puntos de Argentina.",
];

type TimelineMilestone = {
  year: string;
  icon: LucideIcon;
  title: string;
  detail: string;
};

const milestones: TimelineMilestone[] = [
  {
    year: "2008",
    icon: Rocket,
    title: "Fundación en Rosario",
    detail: "Bartez nace con foco en distribución IT al canal y al sector corporativo argentino.",
  },
  {
    year: "2013",
    icon: Store,
    title: "Apertura del canal mayorista",
    detail: "Acuerdos directos con fabricantes líderes y crecimiento del programa de revendedores en todo el país.",
  },
  {
    year: "2017",
    icon: Network,
    title: "Infraestructura y proyectos",
    detail: "Sumamos servidores, redes, energía y servicios profesionales para escalar a proyectos de mayor complejidad.",
  },
  {
    year: "2020",
    icon: Truck,
    title: "Logística nacional",
    detail: "Coordinación de entregas multi-sede y operaciones en organismos públicos, salud y educación.",
  },
  {
    year: "2026",
    icon: Sparkles,
    title: "Hoy",
    detail: "Más de 10.000 clientes atendidos, BarPOS 4.0 en el portfolio y herramientas online para cotizar y comparar.",
  },
];

export default function QuienesSomosPage() {
  return (
    <InternalPageShell>
      <InternalHero
        eyebrow="Distribuidora IT - Rosario"
        title={
          <>
            Distribuyendo tecnología <span className="text-[#0046EA]">hace 18 años.</span>
          </>
        }
        intro={company.description}
        image="/photos/bartez-operations-hero-v2.webp"
        imageAlt="Equipo Bartez y operaciones tecnológicas"
        imagePriority
        mediaLabel="Bartez Tecnología"
        mediaTitle="Experiencia comercial directa desde 2008."
        mediaSubtitle="Atendemos empresas, organismos, instituciónes educativas y revendedores en toda Argentina."
        mediaItems={[
          { icon: Building2, title: "Empresas", description: "Soluciones IT y equipamiento B2B." },
          { icon: Store, title: "Canal", description: "Revendedores e integradores." },
          { icon: Globe, title: "Cobertura", description: "Operación nacional desde Rosario." },
        ]}
        metrics={[
          { value: "18", label: "años de experiencia" },
          { value: "2008", label: "año de fundación" },
          { value: "10k+", label: "clientes" },
        ]}
        actions={[
          { label: "Hablar con Bartez", href: whatsappLinks.general, external: true, icon: MessageCircle },
          { label: "Ver empresas", href: "/empresas", variant: "secondary", icon: ArrowRight },
        ]}
      />

      <InternalSection
        tone="white"
        eyebrow="Nuestra historia"
        title="Una empresa de tecnología construida desde la atención comercial."
        intro="Somos una empresa dedicada a comercializar y distribuir tecnología para empresas, revendedores, organizaciones públicas e instituciones educativas."
      >
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="rounded-lg border border-slate-200 bg-[#f7f9fc] p-6">
            <CheckCircle2 className="size-7 text-[#0046EA]" strokeWidth={1.7} />
            <h3 className="mt-5 font-display text-[22px] font-semibold text-[#11142a]">Nuestra ventaja competitiva</h3>
            <p className="mt-3 text-[14.5px] leading-relaxed text-slate-600">
              Combinamos experiencia en el rubro, asesoramiento personalizado y una atención cercana para traducir necesidades reales en propuestas concretas.
            </p>
          </div>
          <InternalChecklist items={values} />
        </div>
      </InternalSection>

      <InternalSection
        tone="soft"
        eyebrow="Línea de tiempo"
        title="Hitos que marcaron el crecimiento de Bartez."
        intro="Una mirada rápida a los momentos clave desde la fundación hasta hoy."
      >
        <ol
          aria-label="Hitos de Bartez Tecnología desde 2008"
          className="relative grid gap-6 sm:gap-7"
        >
          <span
            aria-hidden="true"
            className="absolute left-[22px] top-2 bottom-2 w-px bg-gradient-to-b from-blue-200 via-blue-100 to-transparent sm:left-[27px]"
          />
          {milestones.map((milestone, index) => {
            const Icon = milestone.icon;
            const isLast = index === milestones.length - 1;
            return (
              <li key={milestone.year} className="relative flex gap-5 sm:gap-6">
                <span
                  className={`relative z-10 grid size-11 sm:size-14 flex-none place-items-center rounded-full border-2 ${
                    isLast
                      ? "border-brand bg-brand text-white shadow-[0_18px_36px_-18px_rgba(0,70,234,0.7)]"
                      : "border-blue-200 bg-white text-brand shadow-sm"
                  }`}
                >
                  <Icon size={20} strokeWidth={1.9} />
                </span>
                <div className="flex-1 rounded-lg border border-slate-200 bg-white p-5 shadow-[0_18px_50px_-40px_rgba(17,20,42,0.35)] sm:p-6">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="font-display text-[22px] font-semibold leading-none text-brand sm:text-[26px]">
                      {milestone.year}
                    </span>
                    <h3 className="font-display text-[16px] font-semibold text-ink sm:text-[17px]">
                      {milestone.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600 sm:text-[14px]">
                    {milestone.detail}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </InternalSection>

      <InternalSection
        tone="white"
        eyebrow="Mercados atendidos"
        title="Los canales que atendemos."
        intro="Nuestra experiencia nos permite adaptarnos a la realidad de cada cliente, sin importar el rubro ni la escala."
      >
        <InternalFeatureGrid columns="four" features={channels} />
      </InternalSection>

      <InternalCta
        title="¿Querés trabajar con nosotros?"
        intro="Contanos tu necesidad y un especialista te contactará con una propuesta concreta en 24 hs hábiles."
        actions={[
          { label: "Contanos qué necesitás", href: whatsappLinks.general, external: true, icon: MessageCircle },
          { label: "Soy revendedor", href: "/revendedores", variant: "secondary", icon: ArrowRight },
        ]}
      />
    </InternalPageShell>
  );
}
