import type { Metadata } from "next";
import { Cloud, HardDrive, KeyRound, Mail, RefreshCw, Users } from "lucide-react";
import { CommercialLanding } from "@/components/CommercialLanding";

export const metadata: Metadata = {
  title: "Cloud y licenciamiento corporativo — Bartez Tecnología",
  description:
    "Microsoft 365, Azure, Google Workspace y licencias corporativas (Windows Server, ESET, Adobe) con onboarding, backup 365 y renovación gestionada.",
  alternates: { canonical: "/cloud-licenciamiento" },
  openGraph: {
    title: "Cloud y licenciamiento corporativo — Bartez Tecnología",
    description:
      "Suscripciones Microsoft 365, Google Workspace, Azure y licencias corporativas con onboarding, migración de correo y backup de la nube.",
    url: "https://bartez.com.ar/cloud-licenciamiento",
    type: "website",
  },
};

export default function CloudLicenciamientoPage() {
  return (
    <CommercialLanding
      title="Cloud y licenciamiento corporativo, con onboarding real."
      intro="Suscripciones Microsoft 365 y Google Workspace, servicios de Azure para hosting y backup, licencias Windows Server y CAL, ESET Endpoint, Adobe Creative Cloud. Con onboarding, migración de correo y política de renovación clara — sin sobreprovisionar."
      intent="services"
      whatsappDetails={["Servicio de interés: cloud y licenciamiento"]}
      items={[
        {
          icon: Mail,
          title: "Microsoft 365 / Google Workspace",
          description:
            "Suscripciones Business Basic, Standard y Premium con MFA obligatorio para admins. Onboarding, migración de correo desde on-premise o de otro proveedor y capacitación básica al equipo.",
        },
        {
          icon: Cloud,
          title: "Azure y backup en la nube",
          description:
            "Máquinas virtuales, storage y backup de VMs, sitios web y file shares en Azure. Alternativa cost-effective a datacenter propio cuando la operación lo justifica.",
        },
        {
          icon: HardDrive,
          title: "Backup para 365 y Google",
          description:
            "Microsoft 365 y Workspace NO tienen backup nativo pensado para restauración a punto en el tiempo. Cotizamos Veeam Backup for M365 o alternativas equivalentes.",
        },
        {
          icon: KeyRound,
          title: "Windows Server y CAL",
          description:
            "Licencias Windows Server Standard/Datacenter con CAL por usuario/dispositivo, SQL Server y otras licencias corporativas Microsoft por canal autorizado.",
        },
        {
          icon: Users,
          title: "Endpoint y productividad",
          description:
            "ESET Endpoint Protection, Adobe Creative Cloud for Teams, licencias de Autodesk y otros softwares profesionales por canal autorizado.",
        },
        {
          icon: RefreshCw,
          title: "Renovación gestionada",
          description:
            "Aviso proactivo de vencimientos, revisión anual del sizing (crecimiento vs subutilización) y consolidación de facturación mensual o anual según preferencia.",
        },
      ]}
      proof={[
        "Revenues autorizados por canal para Microsoft y otros fabricantes.",
        "Factura A y consolidación mensual o anual de licencias.",
        "Migración de correo coordinada con ventana de mantenimiento.",
        "Backup de 365 y Workspace evaluado según retención requerida.",
        "Sin sobreprovisionar planes — recomendamos el tier que corresponde.",
        "Cobertura nacional con onboarding remoto o en sitio.",
      ]}
      note="Para reventa de licencias por canal (revendedores) trabajamos condiciones diferenciadas — ver /revendedores."
      secondary={{
        label: "Ver Ciberseguridad",
        href: "/ciberseguridad",
      }}
    />
  );
}
