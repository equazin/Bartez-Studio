import type { Metadata } from "next";
import { Boxes, Building2, Clock, MapPinned, PackageCheck, Truck } from "lucide-react";
import { CommercialLanding } from "@/components/CommercialLanding";

export const metadata: Metadata = { title: "Logística y cobertura — Bartez Tecnología", description: "Coordinación de entregas tecnológicas para empresas, organismos y revendedores en Argentina." };

export default function LogisticaCoberturaPage() {
  return <CommercialLanding title="Logística tecnológica con cobertura nacional." intro="Coordinamos cada operación según cantidad, destino, urgencia y modalidad de entrega. La disponibilidad y los plazos se confirman en cada cotización." intent="quote" whatsappDetails={["Consulta: logística y cobertura"]} items={[
    { icon: MapPinned, title: "Cobertura nacional", description: "Analizamos entregas en distintas localidades y sedes desde nuestra operación en Rosario." },
    { icon: Truck, title: "Entrega coordinada", description: "Definimos destino, responsable de recepción, franja horaria y requisitos de acceso." },
    { icon: Boxes, title: "Operaciones por volumen", description: "Preparamos propuestas para lotes de equipos, componentes o infraestructura." },
    { icon: Building2, title: "Entregas multi-sede", description: "Podemos evaluar distribución por sucursal, oficina, establecimiento o dependencia." },
    { icon: PackageCheck, title: "Control de la operación", description: "Documentamos el alcance acordado y mantenemos contacto durante la coordinación." },
    { icon: Clock, title: "Plazos informados", description: "No prometemos disponibilidad genérica: confirmamos tiempos al preparar la propuesta." },
  ]} proof={["Destino y lugar de entrega definidos antes de cotizar.", "Condiciones de recepción relevadas para cada operación.", "Factura A y documentación comercial correspondiente.", "Seguimiento directo por WhatsApp con el equipo comercial."]} note="La cobertura, el costo logístico y el plazo dependen del producto, volumen, destino y disponibilidad al momento de la operación." />;
}
