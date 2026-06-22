import type { Metadata } from "next";
import { ClipboardCheck, Clock, Headphones, MapPinned, Server, Wrench } from "lucide-react";
import { CommercialLanding } from "@/components/CommercialLanding";

export const metadata: Metadata = { title: "Soporte corporativo IT — Bartez Tecnología", description: "Consultá modalidades de soporte IT para usuarios, equipos e infraestructura empresarial." };

export default function SoporteCorporativoPage() {
  return <CommercialLanding title="Soporte corporativo con alcance claro." intro="Evaluamos usuarios, sedes, equipamiento e infraestructura para definir una modalidad de soporte realista y documentada." intent="services" whatsappDetails={["Servicio de interés: soporte corporativo"]} items={[
    { icon: Headphones, title: "Atención a usuarios", description: "Canal y horarios definidos para consultas incluidas en el servicio." },
    { icon: Wrench, title: "Equipamiento", description: "Diagnóstico y acompañamiento sobre activos contemplados en el alcance." },
    { icon: Server, title: "Infraestructura", description: "Soporte sobre servidores, redes y servicios acordados." },
    { icon: MapPinned, title: "Sedes", description: "Evaluación de soporte remoto, coordinado o presencial según ubicación." },
    { icon: Clock, title: "Tiempos acordados", description: "Prioridades y tiempos de atención definidos según criticidad." },
    { icon: ClipboardCheck, title: "Inventario y límites", description: "Activos, exclusiones y responsabilidades documentados antes de iniciar." },
  ]} proof={["Relevamiento previo de activos y usuarios.", "Prioridades acordadas por criticidad.", "Tiempos sujetos a la modalidad contratada.", "Escalamiento a fabricantes o terceros cuando corresponda."]} />;
}
