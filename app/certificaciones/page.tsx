import type { Metadata } from "next";
import { ArrowRight, FileCheck2, MessageCircle, ShieldCheck } from "lucide-react";
import {
  InternalCta,
  InternalFeatureGrid,
  InternalHero,
  InternalPageShell,
  InternalSection,
} from "@/components/InternalPage";
import { whatsappLinks } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Certificaciones y respaldos - Bartez Tecnología",
  description: "Documentación comercial y respaldos verificables de Bartez Tecnología.",
};

const items = [
  {
    icon: FileCheck2,
    title: "Documentación comercial",
    description: "Razón social, CUIT, condición fiscal y documentación requerida para cada operación.",
  },
  {
    icon: ShieldCheck,
    title: "Certificaciones",
    description: "Se incorporan cuando existe documentación vigente, alcance identificable y autorización para publicarla.",
  },
];

export default function CertificacionesPage() {
  return (
    <InternalPageShell>
      <InternalHero
        eyebrow="Respaldos verificables"
        title={
          <>
            Certificaciones y documentación <span className="text-[#1236d8]">sin promesas infladas.</span>
          </>
        }
        intro="Esta sección reune documentación vigente y comprobable. No útilizamos niveles de partnership, certificaciones o autorizaciónes sin respaldo documental."
        image="/photos/products/server.jpg"
        imageAlt="Documentación y respaldo comercial"
        imagePriority
        mediaLabel="Transparencia"
        mediaTitle="Documentación disponible segun operación."
        mediaSubtitle="Preparamos respaldos comerciales cuando el proceso de compra lo requiere."
        mediaItems={[
          { icon: FileCheck2, title: "Fiscal", description: "Datos comerciales y CUIT." },
          { icon: ShieldCheck, title: "Respaldo", description: "Solo información verificable." },
          { icon: MessageCircle, title: "Solicitud", description: "Respuesta comercial directa." },
        ]}
        metrics={[
          { value: "A", label: "factura" },
          { value: "B2B", label: "documentación comercial" },
          { value: "24 hs", label: "respuesta inicial" },
        ]}
        actions={[
          { label: "Solicitar documentación", href: whatsappLinks.general, external: true, icon: MessageCircle },
          { label: "Ir a contacto", href: "/contacto", variant: "secondary", icon: ArrowRight },
        ]}
      />

      <InternalSection tone="soft" eyebrow="Disponibles" title="Respaldos comerciales.">
        <InternalFeatureGrid columns="two" features={items} />
      </InternalSection>

      <InternalCta
        title="Necesitás documentación para una compra?"
        intro="Escribinos que tipo de respaldo requiere tu proceso y lo preparamos segun corresponda."
        actions={[
          { label: "Pedir documentación", href: whatsappLinks.general, external: true, icon: MessageCircle },
          { label: "Ver descargas", href: "/descargas", variant: "secondary", icon: ArrowRight },
        ]}
      />
    </InternalPageShell>
  );
}
