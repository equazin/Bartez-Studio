import type { Metadata } from "next";
import { Barcode, Laptop, MapPinned, Network, Server, Truck } from "lucide-react";
import { CommercialLanding } from "@/components/CommercialLanding";

export const metadata: Metadata = { title: "Soluciones IT para logística — Bartez Tecnología", description: "Equipamiento, conectividad e infraestructura para depósitos, operadores y empresas de logística." };

export default function LogisticaPage() {
  return <CommercialLanding title="Tecnología para logística, depósitos y distribución." intro="Conectamos puestos, movilidad, depósitos y sedes con equipamiento e infraestructura dimensionados para el flujo operativo." intent="company" whatsappDetails={["Sector: logística y distribución"]} items={[
    { icon: Laptop, title: "Puestos y movilidad", description: "Notebooks, desktops y accesorios para administración y operación." },
    { icon: Barcode, title: "Captura y periféricos", description: "Evaluación de lectores, impresión y accesorios según el flujo de trabajo." },
    { icon: Network, title: "Conectividad de depósito", description: "Cobertura WiFi, switching y cableado según zonas y densidad." },
    { icon: Server, title: "Infraestructura", description: "Servidores y almacenamiento para aplicaciones y datos operativos." },
    { icon: MapPinned, title: "Múltiples sedes", description: "Estandarización de equipamiento y coordinación por ubicación." },
    { icon: Truck, title: "Despliegue coordinado", description: "Entrega y planificación según horarios, accesos y responsables." },
  ]} proof={["Mapa de sedes y zonas antes de dimensionar.", "Perfiles diferenciados para administración y operación.", "Coordinación de entrega por destino.", "Alternativas sujetas a disponibilidad al cotizar."]} />;
}
