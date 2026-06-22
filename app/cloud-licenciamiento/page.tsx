import type { Metadata } from "next";
import { Cloud, Database, KeyRound, RefreshCw, ShieldCheck, Users } from "lucide-react";
import { CommercialLanding } from "@/components/CommercialLanding";

export const metadata: Metadata = { title: "Cloud y licenciamiento — Bartez Tecnología", description: "Consultá soluciones cloud, productividad, backup y licenciamiento para empresas." };

export default function CloudLicenciamientoPage() {
  return <CommercialLanding title="Cloud y licenciamiento alineados con tu operación." intro="Relevamos usuarios, aplicaciones, datos y renovaciones para evaluar licencias, productividad, backup y servicios cloud sin sobredimensionar." intent="services" whatsappDetails={["Servicio de interés: cloud y licenciamiento"]} items={[
    { icon: Users, title: "Productividad", description: "Evaluación de licencias por usuario, rol y necesidades de colaboración." },
    { icon: Cloud, title: "Servicios cloud", description: "Alternativas para cargas, archivos, aplicaciones y continuidad." },
    { icon: Database, title: "Backup", description: "Definición de activos, retención, recuperación y copias fuera del entorno principal." },
    { icon: KeyRound, title: "Accesos e identidad", description: "Buenas prácticas de cuentas, permisos y autenticación según plataforma." },
    { icon: RefreshCw, title: "Renovaciones", description: "Calendario de vencimientos y revisión de uso antes de renovar." },
    { icon: ShieldCheck, title: "Alcance informado", description: "Licencias, servicios y responsabilidades detallados en la propuesta." },
  ]} proof={["Inventario de usuarios y licencias antes de proponer.", "Alternativas comparadas según necesidad y presupuesto.", "Vigencias y renovaciones informadas en la cotización.", "Implementación o migración cotizada por separado cuando corresponda."]} />;
}
