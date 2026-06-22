import type { Metadata } from "next";
import { Building2, Calendar, CheckCircle2, CreditCard, FileText, ReceiptText } from "lucide-react";
import { CommercialLanding } from "@/components/CommercialLanding";

export const metadata: Metadata = { title: "Medios de pago y condiciones B2B — Bartez Tecnología", description: "Consultá medios de pago y condiciones comerciales para operaciones tecnológicas B2B." };

export default function MediosDePagoPage() {
  return <CommercialLanding title="Condiciones comerciales para cada operación B2B." intro="Las alternativas de pago se informan junto con la cotización y se evalúan según cliente, monto, recurrencia y disponibilidad. No publicamos condiciones genéricas que puedan resultar engañosas." intent="quote" whatsappDetails={["Consulta: medios de pago y condiciones comerciales"]} items={[
    { icon: ReceiptText, title: "Factura A", description: "Bartez es Responsable Inscripto y documenta las operaciones comerciales correspondientes." },
    { icon: CreditCard, title: "Transferencia", description: "Alternativa disponible según las condiciones detalladas en cada propuesta." },
    { icon: Calendar, title: "Plazos a evaluar", description: "Las condiciones diferidas o recurrentes están sujetas a evaluación comercial." },
    { icon: Building2, title: "Empresas y organismos", description: "Adaptamos la documentación a procesos de compra corporativos e institucionales." },
    { icon: FileText, title: "Propuesta formal", description: "Cada cotización detalla vigencia, moneda, impuestos, entrega y forma de pago." },
    { icon: CheckCircle2, title: "Sin promesas ambiguas", description: "Confirmamos condiciones antes de avanzar y dejamos el alcance por escrito." },
  ]} proof={["La cotización informa vigencia y condición de pago.", "Las facilidades están sujetas a evaluación comercial.", "Los impuestos y costos aplicables se detallan en la propuesta.", "Podés enviar modelos y cantidades por RFQ."]} secondary={{ label: "Abrir RFQ", href: "/rfq" }} />;
}
