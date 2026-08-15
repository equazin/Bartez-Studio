import type { Metadata } from "next";
import { Cctv, Database, Laptop, Network, Server, ShieldCheck } from "lucide-react";
import { CommercialLanding } from "@/components/CommercialLanding";

export const metadata: Metadata = {
  title: "Soluciones IT para salud — Bartez Tecnología",
  description:
    "Equipamiento, redes segmentadas, servidores con fuentes redundantes, backup y videovigilancia para clínicas, centros médicos y organizaciones de salud.",
  alternates: { canonical: "/salud" },
  openGraph: {
    title: "Soluciones IT para salud — Bartez Tecnología",
    description:
      "Infraestructura crítica 24/7 para salud: servidores redundantes, backup, redes segmentadas, PCs y notebooks para admisión, historias clínicas y profesionales.",
    url: "https://bartez.com.ar/salud",
    type: "website",
  },
};

export default function SaludPage() {
  return (
    <CommercialLanding
      title="Tecnología para clínicas, centros médicos y organizaciones de salud."
      intro="Infraestructura pensada para operación crítica 24/7: servidores con fuentes redundantes, backup, redes segmentadas entre administración e historia clínica, PCs corporativas para admisión y profesionales, y videovigilancia coordinada."
      intent="company"
      whatsappDetails={["Sector: salud (clínicas, centros médicos, laboratorios)"]}
      items={[
        {
          icon: Laptop,
          title: "PCs y notebooks corporativas",
          description:
            "Lenovo ThinkPad / ThinkCentre, HP EliteBook / ProDesk y Dell Latitude / OptiPlex por lote con Windows 11 Pro para admisión, consultorios y áreas administrativas.",
        },
        {
          icon: Network,
          title: "Redes segmentadas",
          description:
            "Switches core administrables Cisco Catalyst o Aruba con VLANs separadas para historia clínica, imágenes médicas, WiFi de pacientes y equipos administrativos.",
        },
        {
          icon: Server,
          title: "Servidores para historia clínica",
          description:
            "Lenovo, HPE y Dell con fuente redundante, controladora HBA y storage NVMe. Virtualización Proxmox o VMware con snapshots y cluster HA cuando la criticidad lo justifica.",
        },
        {
          icon: Database,
          title: "Backup y continuidad",
          description:
            "Política de backup 3-2-1 dimensionada por volumen de datos y retención requerida. UPS y fuente redundante para no perder actividad ante corte eléctrico.",
        },
        {
          icon: ShieldCheck,
          title: "Ciberseguridad",
          description:
            "Firewalls para segmentación interna, antivirus endpoint y accesos remotos seguros para profesionales que consultan desde fuera de la institución.",
        },
        {
          icon: Cctv,
          title: "Videovigilancia",
          description:
            "Cámaras IP para accesos, guardia, farmacia y áreas críticas. NVR dimensionado con discos CCTV específicos (WD Purple / SkyHawk) para retención sostenida 24/7.",
        },
      ]}
      proof={[
        "Relevamiento de sedes, usuarios concurrentes y aplicaciones críticas.",
        "Separación explícita entre red de gestión y red asistencial.",
        "Servidores con fuente redundante y RAID adecuado según criticidad.",
        "UPS y política de backup dimensionadas por RPO y RTO esperados.",
        "Comparación multi-marca (Lenovo/HPE/Dell) en configuraciones equivalentes.",
        "Cotización formal con validez explícita, plazos comprometidos y factura A.",
      ]}
      note="El equipamiento clínico específico (ecografía, laboratorio, RIS/PACS) queda fuera de nuestro alcance — sí acompañamos la infraestructura de datos y red donde corren."
      secondary={{
        label: "Ver Ciberseguridad",
        href: "/ciberseguridad",
      }}
    />
  );
}
