import type { Metadata } from "next";
import { Building2, Calendar, FileText, Laptop, RefreshCw, WalletCards } from "lucide-react";
import { CommercialLanding } from "@/components/CommercialLanding";

export const metadata: Metadata = { title: "Renting y leasing tecnológico — Bartez Tecnología", description: "Evaluá alternativas de renting, leasing y renovación tecnológica para empresas." };

export default function RentingLeasingPage() {
  return <CommercialLanding title="Evaluá tu renovación tecnológica sin inmovilizar toda la inversión." intro="Analizamos alternativas de renting, leasing o financiación mediante condiciones propias o terceros, según operación, disponibilidad y evaluación comercial." intent="company" whatsappDetails={["Consulta: renting o leasing tecnológico"]} items={[
    { icon: Laptop, title: "Flotas corporativas", description: "Notebooks, desktops, monitores y accesorios dimensionados por perfil de usuario." },
    { icon: Calendar, title: "Planificación", description: "Escalonamiento de renovaciones según presupuesto, sedes y ciclos de recambio." },
    { icon: RefreshCw, title: "Recambio tecnológico", description: "Evaluación de continuidad, estandarización y próximos hitos de renovación." },
    { icon: WalletCards, title: "Alternativas comerciales", description: "Opciones sujetas a evaluación, monto, plazo y disponibilidad de proveedores financieros." },
    { icon: Building2, title: "Uso empresarial", description: "Propuestas pensadas para organizaciones con necesidades recurrentes o por volumen." },
    { icon: FileText, title: "Condiciones transparentes", description: "La propuesta detalla proveedor, plazo, alcance, responsabilidades y costos." },
  ]} proof={["Primero relevamos cantidad y perfiles de uso.", "Las alternativas están sujetas a evaluación comercial y crediticia.", "No se considera aprobada ninguna financiación hasta la propuesta formal.", "Podemos comparar compra directa y renovación escalonada."]} note="Bartez no garantiza aprobación crediticia ni disponibilidad de una modalidad específica hasta completar la evaluación correspondiente." />;
}
