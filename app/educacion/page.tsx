import type { Metadata } from "next";
import { ArrowRight, BookOpen, CheckCircle2, GraduationCap, Laptop, Mail, MessageCircle, Monitor, Network, Package, School, Server, Users } from "lucide-react";
import {
  InternalChecklist,
  InternalCta,
  InternalFeatureGrid,
  InternalHero,
  InternalPageShell,
  InternalSection,
} from "@/components/InternalPage";
import { contact } from "@/constants";

export const metadata: Metadata = {
  title: "Tecnología para Educación - Bartez Tecnología",
  description:
    "Equipamiento IT para escuelas, colegios, institutos y universidades. Laboratorios de computación, tablets, redes y servidores para el sector educativo argentino.",
};

const solutions = [
  { icon: Laptop, title: "Laboratorios de computación", description: "PCs y notebooks para aulas de informática, con imagen educativa y acceso a red." },
  { icon: Monitor, title: "Equipos para docentes", description: "Notebooks y accesorios para personal docente y administrativo." },
  { icon: Network, title: "Conectividad y redes", description: "Redes WiFi y cableadas para aulas, gestión centralizada y acceso seguro." },
  { icon: Server, title: "Servidores educativos", description: "Servidores para gestión académica, plataformas LMS y bases de datos." },
  { icon: Package, title: "Tablets y dispositivos", description: "Dispositivos para inclusion digital, programas 1 a 1 o flotas compartidas." },
  { icon: BookOpen, title: "Aulas audiovisuales", description: "Proyectores, pantallas, sonido y recursos para modernizar el aula." },
];

const levels = [
  { icon: School, title: "Nivel inicial y primario", description: "Equipamiento simple y robusto para primeras etapas de aprendizaje digital." },
  { icon: GraduationCap, title: "Nivel secundario", description: "Laboratorios, notebooks, redes WiFi y servidores para escuelas técnicas." },
  { icon: Users, title: "Institutos terciarios", description: "Equipamiento para carreras técnicas, diseño, sistemas y administración." },
  { icon: BookOpen, title: "Universidades", description: "Laboratorios, campus, datacenters académicos y compras masivas." },
];

const proof = [
  "Presupuestos formales para procesos de compra institucional.",
  "Productos de marcas líderes y orientación sobre garantías.",
  "Factura A en todas las operaciones.",
  "Cobertura nacional con entrega a cualquier punto del país.",
  "Asesoramiento técnico especializado antes de cotizar.",
  "Acompañamiento post-implementación según alcance.",
];

const whatsappHref = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent("Hola, represento a una institución educativa y necesito cotizar equipamiento tecnológico.")}`;

export default function EducacionPage() {
  return (
    <InternalPageShell>
      <InternalHero
        accent="amber"
        eyebrow="Sector educativo"
        eyebrowIcon={GraduationCap}
        title={
          <>
            Tecnología que <span className="text-amber-700">transforma la educación.</span>
          </>
        }
        intro="Equipamos instituciones educativas de todos los niveles con tecnología de primera línea: laboratorios de computación, tablets, redes, servidores y audiovisuales."
        image="/photos/office.jpg"
        imageAlt="Equipamiento tecnológico para educación"
        imagePriority
        mediaLabel="Compras institucionales"
        mediaTitle="Soluciones por nivel, escala y uso."
        mediaSubtitle="Adaptamos la propuesta a aula, laboratorio, administración, campus o conectividad."
        mediaItems={[
          { icon: Laptop, title: "Aulas", description: "Puestos, tablets y notebooks." },
          { icon: Network, title: "Red", description: "WiFi y cableado para sedes." },
          { icon: BookOpen, title: "A/V", description: "Proyectores y recursos de aula." },
        ]}
        metrics={[
          { value: "18", label: "años en IT" },
          { value: "ARG", label: "cobertura nacional" },
          { value: "B2B", label: "compras institucionales" },
        ]}
        actions={[
          { label: "Pedir cotización institucional", href: whatsappHref, external: true, icon: MessageCircle },
          { label: "Consultar por email", href: `mailto:${contact.email}?subject=Cotización%20educativa`, variant: "secondary", icon: Mail },
        ]}
      />

      <InternalSection tone="soft" eyebrow="Soluciones" title="Tecnología para cada espacio educativo.">
        <InternalFeatureGrid features={solutions} />
      </InternalSection>

      <InternalSection
        tone="white"
        eyebrow="Niveles"
        title="Para todos los niveles."
        intro="Adaptamos cada solución a la realidad y los requerimientos de cada nivel e institución."
      >
        <InternalFeatureGrid columns="four" features={levels} />
      </InternalSection>

      <InternalSection
        tone="soft"
        eyebrow="Por que Bartez"
        title="Compras educativas con respaldo comercial."
        intro="Dieciocho años de experiencia en el mercado IT argentino y conocimiento de las necesidades del sector educativo."
      >
        <InternalChecklist items={proof} columns="two" />
      </InternalSection>

      <InternalCta
        title="¿Necesitás cotización para tu institución?"
        intro="Preparamos presupuestos formales adaptados a requerimientos educativos. Respondemos en 24-48 hs hábiles."
        actions={[
          { label: "Solicitar presupuesto", href: whatsappHref, external: true, icon: MessageCircle },
          { label: "Ver soluciones", href: "/soluciones/notebooks-corporativas", variant: "secondary", icon: ArrowRight },
        ]}
      />
    </InternalPageShell>
  );
}
