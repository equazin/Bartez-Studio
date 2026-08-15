import type { Metadata } from "next";
import { Barcode, Cctv, Laptop, MapPinned, Server, Wifi } from "lucide-react";
import { CommercialLanding } from "@/components/CommercialLanding";

export const metadata: Metadata = {
  title: "Soluciones IT para logística — Bartez Tecnología",
  description:
    "WiFi de depósito con UniFi, captura de códigos, servidores para WMS/TMS y coordinación multi-sede para operadores logísticos, distribución y e-commerce.",
  alternates: { canonical: "/logistica" },
  openGraph: {
    title: "Soluciones IT para logística — Bartez Tecnología",
    description:
      "Cobertura WiFi para naves, lectores y etiquetado, servidores para WMS/TMS, videovigilancia y coordinación de despliegue multi-sede con instaladores partners.",
    url: "https://bartez.com.ar/logistica",
    type: "website",
  },
};

export default function LogisticaPage() {
  return (
    <CommercialLanding
      title="Tecnología para logística, depósitos, distribución y e-commerce."
      intro="Cobertura WiFi para naves con UniFi o Aruba, equipos de captura (lectores, impresión de etiquetas), servidores para WMS/TMS y coordinación multi-sede con instaladores partners para el despliegue físico en depósitos y sucursales."
      intent="company"
      whatsappDetails={["Sector: logística, distribución y e-commerce"]}
      items={[
        {
          icon: Wifi,
          title: "WiFi de depósito y naves",
          description:
            "Ubiquiti UniFi para multi-sede con controlador central o Aruba para cobertura corporativa. Access points long-range y outdoor según altura, materiales y densidad de dispositivos móviles.",
        },
        {
          icon: Barcode,
          title: "Captura y periféricos",
          description:
            "Lectores 1D/2D fijos e inalámbricos, impresoras térmicas de etiquetas y tickets. Evaluamos el flujo (picking, packing, expedición) antes de recomendar modelo.",
        },
        {
          icon: Laptop,
          title: "Puestos administrativos",
          description:
            "Notebooks ThinkPad / ProBook / Latitude y PCs de escritorio por lote con Windows 11 Pro e imagen unificada para atención, coordinación y gestión.",
        },
        {
          icon: Server,
          title: "Servidores para WMS / TMS",
          description:
            "Servidores rack Lenovo, HPE y Dell para WMS, TMS y ERP con fuente redundante y virtualización Proxmox o VMware. Storage y backup dimensionados por operación.",
        },
        {
          icon: MapPinned,
          title: "Coordinación multi-sede",
          description:
            "Un solo interlocutor para proyectos en varias sucursales o depósitos. Cronograma unificado, entregas parciales y despliegue con instaladores partners locales.",
        },
        {
          icon: Cctv,
          title: "Videovigilancia de predio",
          description:
            "Cámaras panorámicas y direccionales para playa de carga, accesos, patios y racks de picking. NVR y discos CCTV específicos con cableado exterior por partners.",
        },
      ]}
      proof={[
        "Relevamiento de cada nave o depósito antes de dimensionar WiFi.",
        "Ubiquiti UniFi como plataforma central para escenarios multi-sede.",
        "Comparación multi-marca (Lenovo/HPE/Dell) en configuraciones equivalentes.",
        "Instaladores partners bajo coordinación técnica para tendido en depósitos.",
        "Cobertura nacional con logística y coordinación por destino.",
        "Cotización formal con validez explícita, plazos comprometidos y factura A.",
      ]}
      note="Para proyectos con obra civil, tendido exterior o cableado estructurado en obra, ver Servicios Profesionales."
      secondary={{
        label: "Ver WiFi multi-sede",
        href: "/soluciones/wifi-multisede",
      }}
    />
  );
}
