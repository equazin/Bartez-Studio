import type { Metadata } from "next";
import { Cpu, Factory, HardDrive, Monitor, Network, Server } from "lucide-react";
import { CommercialLanding } from "@/components/CommercialLanding";

export const metadata: Metadata = { title: "Soluciones IT para industria — Bartez Tecnología", description: "Equipamiento, workstations, redes e infraestructura para plantas y empresas industriales." };

export default function IndustriaPage() {
  return <CommercialLanding title="Infraestructura IT para entornos industriales." intro="Diseñamos propuestas para oficinas, ingeniería, planta y operaciones conectadas. La selección considera condiciones de uso, criticidad y crecimiento esperado." intent="company" whatsappDetails={["Sector: industria"]} items={[
    { icon: Factory, title: "Planta y oficinas", description: "Equipamiento diferenciado por ambiente, puesto y exigencia operativa." },
    { icon: Monitor, title: "Workstations", description: "Estaciones para CAD, ingeniería, modelado y procesamiento intensivo." },
    { icon: Network, title: "Redes", description: "Switching, WiFi y segmentación para áreas administrativas y operativas." },
    { icon: Server, title: "Servidores", description: "Infraestructura para aplicaciones, archivos, virtualización y servicios internos." },
    { icon: HardDrive, title: "Almacenamiento", description: "Capacidad y redundancia definidas según carga y continuidad requerida." },
    { icon: Cpu, title: "Dimensionamiento", description: "Configuraciones comparadas según software, usuarios y ciclos de trabajo." },
  ]} proof={["Perfiles de uso definidos antes de elegir hardware.", "Revisión de condiciones ambientales y de instalación.", "Planificación por áreas o etapas.", "Cotización con modelos, cantidades y alternativas equivalentes."]} secondary={{ label: "Usar configurador", href: "/configurador" }} />;
}
