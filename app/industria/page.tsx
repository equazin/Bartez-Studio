import type { Metadata } from "next";
import { Cctv, Cpu, HardHat, Network, Server, Wifi } from "lucide-react";
import { CommercialLanding } from "@/components/CommercialLanding";

export const metadata: Metadata = {
  title: "Soluciones IT para industria — Bartez Tecnología",
  description:
    "Equipamiento, workstations CTO/BTO para CAD, redes de planta con instaladores partners, servidores para virtualización y CCTV para plantas industriales en Argentina.",
  alternates: { canonical: "/industria" },
  openGraph: {
    title: "Soluciones IT para industria — Bartez Tecnología",
    description:
      "Workstations CAD, WiFi de planta, servidores rack para virtualización, CCTV en predios industriales y proyectos llave en mano con instaladores partners.",
    url: "https://bartez.com.ar/industria",
    type: "website",
  },
};

export default function IndustriaPage() {
  return (
    <CommercialLanding
      title="Tecnología para plantas industriales y empresas manufactureras."
      intro="Workstations para ingeniería y CAD, redes de planta con relevamiento previo, servidores para virtualización, videovigilancia y proyectos coordinados con instaladores partners para el despliegue físico."
      intent="company"
      whatsappDetails={["Sector: industria y manufactura"]}
      items={[
        {
          icon: Cpu,
          title: "Workstations CAD y simulación",
          description:
            "Dell Precision, HP Z y Lenovo ThinkStation configuradas para AutoCAD, Revit, ANSYS y CAD/CAM. Xeon o Threadripper Pro, RAM ECC y GPU profesional certificada ISV.",
        },
        {
          icon: Wifi,
          title: "WiFi de planta y depósito",
          description:
            "Cobertura con Ubiquiti UniFi o Aruba para naves y sedes múltiples. Relevamiento por sitio, equipos de contingencia y despliegue con instaladores partners.",
        },
        {
          icon: Server,
          title: "Servidores para producción",
          description:
            "Servidores rack Lenovo, HPE y Dell para MES, ERP y sistemas de piso de planta. Virtualización Proxmox o VMware con fuente redundante y backup.",
        },
        {
          icon: Network,
          title: "Networking industrial",
          description:
            "Switches core Cisco Catalyst / Aruba, segmentación por VLAN entre oficina y planta, firewalls para acceso remoto seguro a sistemas críticos.",
        },
        {
          icon: Cctv,
          title: "Videovigilancia de predio",
          description:
            "Cámaras IP direccionales y multi-sensor panorámicas para playa, accesos y perímetro. NVR dimensionado, discos CCTV específicos y cableado exterior con partners.",
        },
        {
          icon: HardHat,
          title: "Proyectos llave en mano",
          description:
            "Coordinación integral cuando el proyecto incluye tendido, montaje y puesta en marcha. Un solo interlocutor, un solo alcance, factura A.",
        },
      ]}
      proof={[
        "Relevamiento de planta y sedes antes de dimensionar.",
        "Segmentación explícita entre red de oficina y sistemas de producción.",
        "Comparación multi-marca (Lenovo/HPE/Dell) en configuraciones equivalentes.",
        "Instaladores partners bajo coordinación técnica propia para el despliegue físico.",
        "Cotización formal con validez explícita, plazos comprometidos y factura A.",
        "Cobertura nacional para plantas y sedes en el interior del país.",
      ]}
      note="Para proyectos con obra civil, tendido exterior o integración de sistemas, ver Servicios Profesionales."
      secondary={{
        label: "Ver Workstations alta gama",
        href: "/soluciones/workstations-alta-gama",
      }}
    />
  );
}

