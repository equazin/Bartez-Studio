import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solicitud de Cotizacion (RFQ) | Bartez Tecnologia",
  description:
    "Solicita una cotizacion personalizada para proyectos de infraestructura IT, servidores, networking y mas. Respuesta rapida del equipo comercial de Bartez Tecnologia.",
  alternates: { canonical: "/rfq" },
};

export default function RfqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
