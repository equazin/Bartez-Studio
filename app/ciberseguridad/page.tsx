import type { Metadata } from "next";
import { Database, Eye, KeyRound, LockKeyhole, Network, ShieldCheck } from "lucide-react";
import { CommercialLanding } from "@/components/CommercialLanding";

export const metadata: Metadata = { title: "Ciberseguridad para empresas — Bartez Tecnología", description: "Evaluá capas de ciberseguridad para redes, accesos, endpoints y backups." };

export default function CiberseguridadPage() {
  return <CommercialLanding title="Ciberseguridad práctica para empresas." intro="Ayudamos a ordenar las capas básicas de protección y a identificar prioridades. El alcance se define según activos, usuarios, sedes y riesgos de la operación." intent="services" whatsappDetails={["Servicio de interés: ciberseguridad"]} items={[
    { icon: Network, title: "Perímetro y redes", description: "Segmentación, firewalls, VPN y criterios de acceso entre zonas." },
    { icon: LockKeyhole, title: "Endpoints", description: "Protección y gestión de equipos según usuarios y criticidad." },
    { icon: KeyRound, title: "Identidad y accesos", description: "Revisión de cuentas, permisos, MFA y prácticas de autenticación." },
    { icon: Database, title: "Backup y recuperación", description: "Copias, retención y pruebas de recuperación para datos prioritarios." },
    { icon: Eye, title: "Visibilidad", description: "Definición de eventos relevantes, alertas y procedimiento de escalamiento." },
    { icon: ShieldCheck, title: "Plan por etapas", description: "Priorización de mejoras según impacto, urgencia y presupuesto." },
  ]} proof={["No ofrecemos seguridad absoluta ni diagnósticos sin relevamiento.", "Priorizamos activos y riesgos antes de recomendar productos.", "El alcance técnico y las responsabilidades quedan documentados.", "Podemos integrar equipamiento, licencias e implementación."]} />;
}
