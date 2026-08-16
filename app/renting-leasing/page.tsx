import type { Metadata } from "next";
import { Banknote, CalendarClock, FileText, Handshake, RotateCcw, ShieldCheck } from "lucide-react";
import { CommercialLanding } from "@/components/CommercialLanding";

export const metadata: Metadata = {
  title: "Renting y leasing tecnológico corporativo — Bartez Tecnología",
  description:
    "Renting IT y leasing operativo para empresas: notebooks, workstations y servidores con cuota mensual, mantenimiento incluido y renovación programada. Factura A.",
  alternates: { canonical: "/renting-leasing" },
  openGraph: {
    title: "Renting y leasing IT corporativo — Bartez Tecnología",
    description:
      "Notebooks, workstations y servidores como servicio con cuota mensual predecible, mantenimiento incluido y refresh programado del parque.",
    url: "https://bartez.com.ar/renting-leasing",
    type: "website",
  },
};

export default function RentingLeasingPage() {
  return (
    <CommercialLanding
      title="Renting y leasing tecnológico para empresas."
      intro="Alternativa al CAPEX de comprar equipamiento: cuota mensual predecible por 24, 36 o 48 meses con mantenimiento, garantía y refresh al final del plazo. Aplicable a notebooks, PCs, workstations, servidores y equipamiento de red."
      intent="services"
      whatsappDetails={["Servicio de interés: renting / leasing IT"]}
      items={[
        {
          icon: Banknote,
          title: "Cuota mensual predecible",
          description:
            "Convertís CAPEX de compra en OPEX mensual deducible. Cuota fija por plazo elegido — sin sorpresas presupuestarias por depreciación o reemplazo anticipado.",
        },
        {
          icon: CalendarClock,
          title: "Plazos 24 / 36 / 48 meses",
          description:
            "Elegís el ciclo de renovación según el tipo de equipo: 24-36 meses para notebooks y PCs de flota; 48 meses para servidores e infraestructura de red.",
        },
        {
          icon: ShieldCheck,
          title: "Mantenimiento incluido",
          description:
            "Garantía extendida por el plazo del contrato + soporte técnico + reemplazo por falla. El equipo funciona o se cambia — no lo tenés que gestionar vos.",
        },
        {
          icon: RotateCcw,
          title: "Refresh al vencimiento",
          description:
            "Al final del plazo devolvés el equipamiento y arrancás con hardware nuevo. Sin equipos obsoletos acumulándose ni gestión de disposición del parque viejo.",
        },
        {
          icon: Handshake,
          title: "Escala flotas grandes",
          description:
            "Especialmente conveniente en flotas de 30+ notebooks o parques de servidores donde el ciclo de compra/depreciación/reemplazo consume tiempo administrativo.",
        },
        {
          icon: FileText,
          title: "Documentación B2B",
          description:
            "Contratos claros con alcance, plazos y condiciones. Factura A mensual, condiciones de rescisión anticipada explícitas y política de siniestro documentada.",
        },
      ]}
      proof={[
        "Alternativa a la compra tradicional cuando el flujo de caja lo justifica.",
        "Cuota mensual con mantenimiento y garantía incluidos.",
        "Refresh programado del parque sin gestión de disposición.",
        "Documentación B2B completa (contrato, factura A, condiciones).",
        "Aplicable a notebooks, PCs, workstations, servidores y networking.",
        "Cobertura nacional con logística y coordinación por sede.",
      ]}
      note="El renting se evalúa según volumen y perfil crediticio de la empresa. Para consultas de canal (revendedores) las condiciones son diferenciadas."
      secondary={{
        label: "Ver Servicios administrados",
        href: "/servicios-administrados",
      }}
    />
  );
}
