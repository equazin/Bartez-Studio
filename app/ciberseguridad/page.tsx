import type { Metadata } from "next";
import { Database, Eye, KeyRound, LockKeyhole, Network, ShieldCheck } from "lucide-react";
import { CommercialLanding } from "@/components/CommercialLanding";

export const metadata: Metadata = {
  title: "Ciberseguridad para empresas — Bartez Tecnología",
  description:
    "Firewalls Fortinet, WatchGuard y Sophos, endpoint ESET/Microsoft Defender, MFA, backup 3-2-1 y segmentación por VLAN para empresas y organismos en Argentina.",
  alternates: { canonical: "/ciberseguridad" },
  openGraph: {
    title: "Ciberseguridad para empresas — Bartez Tecnología",
    description:
      "Capas de protección práctica: perímetro con firewalls, endpoint, identidad con MFA, backup con RPO/RTO y segmentación de red.",
    url: "https://bartez.com.ar/ciberseguridad",
    type: "website",
  },
};

export default function CiberseguridadPage() {
  return (
    <CommercialLanding
      title="Ciberseguridad práctica para empresas y organismos."
      intro="Capas concretas sobre lo que ya tenés: perímetro con firewalls administrables, endpoint gestionado, identidad con MFA, backup con RPO/RTO explícitos y segmentación de red. Priorizamos por impacto y presupuesto, sin sobredimensionar."
      intent="services"
      whatsappDetails={["Servicio de interés: ciberseguridad"]}
      items={[
        {
          icon: Network,
          title: "Perímetro y firewalls",
          description:
            "Fortinet FortiGate, WatchGuard Firebox o Sophos XGS según escenario. VPN de acceso remoto, políticas por VLAN y control de aplicaciones. Cotizamos hardware + licencias plurianuales.",
        },
        {
          icon: LockKeyhole,
          title: "Endpoint gestionado",
          description:
            "ESET Endpoint Protection Advanced o Microsoft Defender for Business. Consola central, políticas por grupo, aislamiento de equipos comprometidos y reporte de amenazas.",
        },
        {
          icon: KeyRound,
          title: "Identidad y MFA",
          description:
            "Revisión de cuentas y permisos, MFA obligatorio para usuarios administrativos (Microsoft 365, VPN, Windows Server), rotación de contraseñas de servicio.",
        },
        {
          icon: Database,
          title: "Backup 3-2-1",
          description:
            "Copias con retención dimensionada por RPO/RTO objetivo. Backup en storage local + copia off-site (cloud o segunda sede) con pruebas de restauración periódicas.",
        },
        {
          icon: Eye,
          title: "Visibilidad y alertas",
          description:
            "Definimos qué eventos son relevantes, cómo se notifican y quién escala. Sin comprar SIEM que nadie va a mirar; sí encendiendo alertas útiles del firewall y endpoint existentes.",
        },
        {
          icon: ShieldCheck,
          title: "Plan por etapas",
          description:
            "Diagnóstico inicial con priorización explícita por impacto/urgencia. Cotización por etapa (mes 1 / mes 2 / mes 3) para ir cerrando huecos según presupuesto.",
        },
      ]}
      proof={[
        "No ofrecemos seguridad absoluta ni auditorías sin relevamiento.",
        "Priorizamos activos y riesgos antes de recomendar productos.",
        "Alcance técnico y responsabilidades documentados en la propuesta.",
        "Integramos equipamiento, licencias e implementación en un solo alcance.",
        "Comparación multi-marca (Fortinet/WatchGuard/Sophos) cuando corresponde.",
        "Factura A y condiciones B2B para empresas y organismos.",
      ]}
      note="Este servicio se enfoca en higiene de seguridad para PyME/mediana empresa. Para escenarios regulados o compliance específico (ISO 27001, PCI, HIPAA) escalamos con partners especializados."
      secondary={{
        label: "Ver Cloud y licenciamiento",
        href: "/cloud-licenciamiento",
      }}
    />
  );
}
