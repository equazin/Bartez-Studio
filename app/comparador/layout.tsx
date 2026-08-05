import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparador de Productos IT | Bartez Tecnología",
  description:
    "Compará servidores, notebooks, workstations y equipos de tecnología lado a lado. Evaluá especificaciones, precios y características para elegir la mejor opción.",
  alternates: { canonical: "/comparador" },
};

export default function ComparadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
