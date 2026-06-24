import type { Metadata } from "next";
import { ArrowRight, Building2, CheckCircle2, Globe, Landmark, MessageCircle, School, Store } from "lucide-react";
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
    "Conoce la historia, misión y valores de Bartez Tecnología. Dieciocho años en el rubro distribuyendo tecnología para empresas, organismos y revendedores en toda Argentina desde Rosario.",
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

export default function QuienesSomosPage() {
  return (
    <InternalPageShell>
      <InternalHero
        eyebrow="Distribuidora IT - Rosario"
        title={
          <>
            Distribuyendo tecnología <span className="text-[#1236d8]">hace 18 años.</span>
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
            <CheckCircle2 className="size-7 text-[#1236d8]" strokeWidth={1.7} />
            <h3 className="mt-5 font-display text-[22px] font-extrabold text-[#11142a]">Nuestra ventaja competitiva</h3>
            <p className="mt-3 text-[14.5px] leading-relaxed text-slate-600">
              Combinamos experiencia en el rubro, asesoramiento personalizado y una atención cercana para traducir necesidades reales en propuestas concretas.
            </p>
          </div>
          <InternalChecklist items={values} />
        </div>
      </InternalSection>

      <InternalSection
        tone="soft"
        eyebrow="Mercados atendidos"
        title="Los canales que atendemos."
        intro="Nuestra experiencia nos permite adaptarnos a la realidad de cada cliente, sin importar el rubro ni la escala."
      >
        <InternalFeatureGrid columns="four" features={channels} />
      </InternalSection>

      <InternalCta
        title="Querés trabajar con nosotros?"
        intro="Contaños tu necesidad y un especialista te contactara con una propuesta concreta en 24 hs hábiles."
        actions={[
          { label: "Contaños qué necesitás", href: whatsappLinks.general, external: true, icon: MessageCircle },
          { label: "Soy revendedor", href: "/revendedores", variant: "secondary", icon: ArrowRight },
        ]}
      />
    </InternalPageShell>
  );
}
