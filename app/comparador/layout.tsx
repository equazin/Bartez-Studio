import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparador de Productos IT | Bartez Tecnología",
  description:
    "Compará servidores, notebooks, workstations y equipos de tecnología lado a lado. Evaluá especificaciones, precios y características para elegir la mejor opción.",
  alternates: { canonical: "/comparador" },
  openGraph: {
    title: "Comparador de Productos IT | Bartez Tecnología",
    description:
      "Herramienta para comparar equipamiento IT lado a lado antes de pedir cotización formal.",
    url: "https://bartez.com.ar/comparador",
    type: "website",
  },
};

export default function ComparadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
