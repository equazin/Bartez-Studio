import type { Metadata } from "next";
import { AlarmClock, BarChart3, Boxes, HeadphonesIcon, Server, ShieldCheck } from "lucide-react";
import { CommercialLanding } from "@/components/CommercialLanding";

export const metadata: Metadata = {
  title: "Servicios IT administrados (MSP) — Bartez Tecnología",
  description:
    "Mesa de ayuda, monitoreo de servidores y red, gestión de endpoints y backup como servicio para empresas sin equipo IT propio o con equipo acotado.",
  alternates: { canonical: "/servicios-administrados" },
  openGraph: {
    title: "Servicios IT administrados (MSP) — Bartez Tecnología",
    description:
      "Mesa de ayuda por SLA, monitoreo de infraestructura, gestión de licencias y backup gestionado para PyME y mediana empresa.",
    url: "https://bartez.com.ar/servicios-administrados",
    type: "website",
  },
};

export default function ServiciosAdministradosPage() {
  return (
    <CommercialLanding
      title="Servicios IT administrados (MSP) por SLA."
      intro="Mesa de ayuda, monitoreo de servidores y red, gestión de endpoints y backup gestionado con SLA explícito. Diseñado para PyME y mediana empresa sin equipo IT interno o con equipo acotado que necesita respaldo técnico consistente."
      intent="services"
      whatsappDetails={["Servicio de interés: servicios administrados / MSP"]}
      items={[
        {
          icon: HeadphonesIcon,
          title: "Mesa de ayuda por SLA",
          description:
            "Atención a usuarios finales por email, WhatsApp o teléfono con tiempo de respuesta acordado. Resolución en primer nivel + escalamiento a especialista cuando corresponde.",
        },
        {
          icon: Server,
          title: "Monitoreo de infraestructura",
          description:
            "Monitoreo 24/7 de servidores, virtualización, storage y equipamiento de red. Alertas por caída, uso de CPU/RAM/disco, snapshots fallidos y otros eventos definidos.",
        },
        {
          icon: ShieldCheck,
          title: "Gestión de endpoints",
          description:
            "Inventario de equipos, aplicación de políticas de seguridad, parcheo de sistema operativo y aplicaciones, respuesta a incidentes de endpoint gestionado.",
        },
        {
          icon: Boxes,
          title: "Backup gestionado",
          description:
            "Definición de política de backup, ejecución diaria, pruebas de restauración periódicas y reporte mensual. Cumplimos con los RPO/RTO acordados en el contrato.",
        },
        {
          icon: AlarmClock,
          title: "Mantenimiento preventivo",
          description:
            "Actualizaciones de firmware, limpieza de logs, chequeo de discos y ventilación de servidores, revisión de configuración de backup — todo lo que evita incidentes.",
        },
        {
          icon: BarChart3,
          title: "Reporte mensual",
          description:
            "Reporte de tickets atendidos, disponibilidad de infraestructura, backup ejecutado y recomendaciones proactivas de mejora. Reunión mensual de revisión opcional.",
        },
      ]}
      proof={[
        "SLA por tiempo de respuesta explícito según ticket priority.",
        "Contrato con alcance, exclusiones y cobertura horaria documentados.",
        "Sin acompañamiento de equipos personales — solo activos del cliente.",
        "Herramientas de monitoreo y ticketing propias — sin instalar cosas raras.",
        "Cobertura remota nacional + on-site en zona Rosario / Buenos Aires.",
        "Factura mensual A con detalle de tickets del período.",
      ]}
      note="Este servicio se enfoca en operación IT recurrente. Para proyectos puntuales con alcance definido (migración, implementación, tendido) ver Servicios Profesionales."
      secondary={{
        label: "Ver Soporte corporativo",
        href: "/soporte-corporativo",
      }}
    />
  );
}
