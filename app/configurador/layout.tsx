import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configurador de Servidores y Equipos | Bartez Tecnologia",
  description:
    "Configura servidores, notebooks, workstations y equipos IT a medida. Selecciona procesador, memoria, almacenamiento y mas con el configurador de Bartez Tecnologia.",
  alternates: { canonical: "/configurador" },
};

export default function ConfiguradorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
