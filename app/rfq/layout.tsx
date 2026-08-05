import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solicitud de Cotización (RFQ) | Bartez Tecnología",
  description:
    "Solicitá una cotización personalizada para proyectos de infraestructura IT, servidores, networking y más. Respuesta rápida del equipo comercial de Bartez Tecnología.",
  alternates: { canonical: "/rfq" },
};

export default function RfqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
