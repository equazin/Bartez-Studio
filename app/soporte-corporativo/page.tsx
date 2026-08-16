import type { Metadata } from "next";
import { FileWarning, LifeBuoy, MapPin, MessageCircle, Package, Wrench } from "lucide-react";
import { CommercialLanding } from "@/components/CommercialLanding";

export const metadata: Metadata = {
  title: "Soporte técnico corporativo — Bartez Tecnología",
  description:
    "Soporte técnico corporativo por ticket para incidentes puntuales, gestión de garantía y RMA, coordinación con fabricantes y visitas on-site en zona Rosario.",
  alternates: { canonical: "/soporte-corporativo" },
  openGraph: {
    title: "Soporte técnico corporativo — Bartez Tecnología",
    description:
      "Canal de soporte técnico para empresas: incidentes puntuales, gestión de garantía, coordinación con fabricantes y on-site cuando corresponde.",
    url: "https://bartez.com.ar/soporte-corporativo",
    type: "website",
  },
};

export default function SoporteCorporativoPage() {
  return (
    <CommercialLanding
      title="Soporte técnico corporativo por incidente o por bolsa de horas."
      intro="Canal técnico para empresas que necesitan respaldo puntual sin contratar un servicio administrado completo. Gestión de garantía, RMA, incidentes de infraestructura y coordinación con fabricantes — a demanda o por bolsa mensual."
      intent="services"
      whatsappDetails={["Servicio de interés: soporte corporativo"]}
      items={[
        {
          icon: MessageCircle,
          title: "Canal directo",
          description:
            "WhatsApp, email o teléfono para reportar el incidente. Un técnico responde en horario hábil, evalúa el caso y define pasos con tiempo estimado de resolución.",
        },
        {
          icon: FileWarning,
          title: "Gestión de garantía y RMA",
          description:
            "Iniciamos y seguimos el caso con el fabricante (Dell, HPE, Lenovo, HP, Cisco, Aruba, APC). Ver /garantias-rma/nuevo para el formulario dedicado.",
        },
        {
          icon: Wrench,
          title: "Diagnóstico y reparación",
          description:
            "Análisis de logs, diagnóstico de hardware o software, aplicación de parches y coordinación de reparación cuando corresponde por garantía o fuera de ella.",
        },
        {
          icon: MapPin,
          title: "On-site zona Rosario",
          description:
            "Visita técnica presencial en Rosario y GBA para intervenciones que lo requieren. Para el resto del país coordinamos con partners locales bajo nuestra dirección.",
        },
        {
          icon: LifeBuoy,
          title: "Bolsa de horas mensual",
          description:
            "Alternativa por incidente puntual: bolsa de 8 / 16 / 24 horas mensuales con tarifa preferencial que se consume por atención efectiva. Sin ticket, sin cobro.",
        },
        {
          icon: Package,
          title: "Post-venta de compras Bartez",
          description:
            "Los equipos comprados a Bartez tienen prioridad y no requieren contrato específico — está incluido en la relación comercial durante la vigencia de garantía.",
        },
      ]}
      proof={[
        "Sin contrato mínimo para incidentes de equipos comprados a Bartez.",
        "Tarifas por hora o por bolsa mensual con condiciones documentadas.",
        "Gestión de garantía con fabricantes: caso trackeable de punta a punta.",
        "On-site directo en zona Rosario + partners en el resto del país.",
        "Sin cargos de diagnóstico ocultos — presupuesto antes de intervenir.",
        "Factura A por hora o por bolsa según modalidad elegida.",
      ]}
      note="Para operación IT continua (mesa de ayuda, monitoreo 24/7, endpoints gestionados) ver Servicios administrados (MSP)."
      secondary={{
        label: "Iniciar caso de RMA",
        href: "/garantias-rma/nuevo",
      }}
    />
  );
}
