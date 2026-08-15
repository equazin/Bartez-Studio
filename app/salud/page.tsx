import type { Metadata } from "next";
import { Database, HeartPulse, Laptop, Network, Server, ShieldCheck } from "lucide-react";
import { CommercialLanding } from "@/components/CommercialLanding";

export const metadata: Metadata = {
  title: "Soluciones IT para salud — Bartez Tecnología",
  description: "Equipamiento, redes e infraestructura tecnológica para clínicas, centros médicos y organizaciones de salud.",
  alternates: { canonical: "/salud" },
  openGraph: {
    title: "Soluciones IT para salud — Bartez Tecnología",
    description: "Puestos de trabajo, redes, servidores, storage y continuidad para clínicas y centros de salud en Argentina.",
    url: "https://bartez.com.ar/salud",
    type: "website",
  },
};

export default function SaludPage() {
  return <CommercialLanding title="Tecnología para organizaciones de salud." intro="Equipamiento e infraestructura para puestos administrativos, profesionales, sedes y servicios internos. Relevamos criticidad, continuidad y requisitos de cada entorno." intent="company" whatsappDetails={["Sector: salud"]} items={[
    { icon: Laptop, title: "Puestos de trabajo", description: "Equipos para administración, admisión, profesionales y movilidad interna." },
    { icon: Network, title: "Conectividad", description: "Redes cableadas y WiFi dimensionadas por zonas, usuarios y dispositivos." },
    { icon: Server, title: "Infraestructura", description: "Servidores, almacenamiento y continuidad para aplicaciones internas." },
    { icon: Database, title: "Datos y respaldos", description: "Capacidad, retención y recuperación alineadas con el entorno tecnológico." },
    { icon: ShieldCheck, title: "Accesos", description: "Alternativas para segmentación, identidad y protección de endpoints." },
    { icon: HeartPulse, title: "Continuidad operativa", description: "Priorización de activos y dependencias para reducir interrupciones." },
  ]} proof={["Relevamiento de sedes, usuarios y aplicaciones.", "Separación entre equipamiento clínico y tecnología de uso general.", "Condiciones de implementación y soporte documentadas.", "Cotización por etapas o por volumen según el proyecto."]} />;
}
