import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparador de Productos IT | Bartez Tecnologia",
  description:
    "Compara servidores, notebooks, workstations y equipos de tecnologia lado a lado. Evalua especificaciones, precios y caracteristicas para elegir la mejor opcion.",
  alternates: { canonical: "/comparador" },
};

export default function ComparadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
