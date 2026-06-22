import type { Metadata } from "next";
import { Activity, ClipboardCheck, Headphones, Network, Server, ShieldCheck } from "lucide-react";
import { CommercialLanding } from "@/components/CommercialLanding";

export const metadata: Metadata = { title: "Servicios administrados IT — Bartez Tecnología", description: "Consultá modalidades de operación, mantenimiento y acompañamiento IT para empresas." };

export default function ServiciosAdministradosPage() {
  return <CommercialLanding title="Servicios administrados para sostener tu operación IT." intro="Diseñamos modalidades de acompañamiento para equipos, redes e infraestructura. El alcance y los niveles de atención se definen después de relevar criticidad, sedes y entorno actual." intent="services" whatsappDetails={["Servicio de interés: servicios administrados IT"]} items={[
    { icon: Activity, title: "Monitoreo y seguimiento", description: "Definición de activos, eventos relevantes y procedimiento de escalamiento." },
    { icon: Headphones, title: "Mesa de ayuda", description: "Modalidades de atención para usuarios y responsables internos según alcance." },
    { icon: Network, title: "Redes y conectividad", description: "Revisión, documentación y mantenimiento de la infraestructura de red." },
    { icon: Server, title: "Servidores e infraestructura", description: "Acompañamiento operativo, revisión de capacidad y planificación de mejoras." },
    { icon: ShieldCheck, title: "Continuidad", description: "Identificación de dependencias críticas, respaldos y prioridades de recuperación." },
    { icon: ClipboardCheck, title: "Servicio documentado", description: "Alcance, exclusiones, responsables y frecuencia definidos antes de comenzar." },
  ]} proof={["Relevamiento inicial antes de presupuestar.", "Alcance y responsabilidades documentadas.", "Modalidad adaptada a sedes, usuarios y criticidad.", "Canal comercial y operativo definido para cada servicio."]} note="La disponibilidad de cada modalidad y sus tiempos de atención se confirman en la propuesta comercial." />;
}
