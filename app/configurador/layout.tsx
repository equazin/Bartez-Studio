import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configurador de Servidores y Equipos | Bartez Tecnología",
  description:
    "Configurá servidores, notebooks, workstations y equipos IT a medida. Seleccioná procesador, memoria, almacenamiento y más con el configurador de Bartez Tecnología.",
  alternates: { canonical: "/configurador" },
};

export default function ConfiguradorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
