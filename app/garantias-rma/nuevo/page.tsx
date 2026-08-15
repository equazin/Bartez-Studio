import type { Metadata } from "next";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { InternalPageShell } from "@/components/InternalPage";
import { RmaForm } from "@/components/RmaForm";
import { company } from "@/constants";

export const metadata: Metadata = {
  title: "Iniciar caso de RMA / Garantía - Bartez Tecnología",
  description:
    "Formulario para iniciar un caso de garantía o RMA con Bartez Tecnología. Recibí un número de caso y respuesta inicial en 48 hs hábiles.",
  alternates: { canonical: "/garantias-rma/nuevo" },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Iniciar caso de RMA / Garantía - Bartez Tecnología",
    description:
      "Formulario dedicado para gestión de garantía o RMA. Con número de caso de referencia y respuesta en 48 hs hábiles.",
    url: `${company.url}/garantias-rma/nuevo`,
    type: "website",
  },
};

export default function NuevoRmaPage() {
  return (
    <InternalPageShell>
      <section className="border-b border-slate-200 bg-white py-16 md:py-20">
        <div className="mx-auto max-w-[860px] px-6">
          <Link
            href="/garantias-rma"
            className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-600 transition hover:text-[#0046EA]"
          >
            <ArrowLeft size={13} /> Volver a Garantías y RMA
          </Link>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-[12px] font-semibold text-[#0046EA]">
            <ShieldCheck className="size-3.5" strokeWidth={1.8} /> Gestión de garantía / RMA
          </div>

          <h1 className="mt-5 font-display text-[clamp(30px,4vw,44px)] font-semibold leading-[1.05] tracking-[-0.03em] text-[#11142a]">
            Iniciar caso de RMA o garantía
          </h1>
          <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed text-slate-600">
            Formulario dedicado con los campos que necesitamos para gestionar el caso con el fabricante o iniciar la evaluación técnica. Al enviar recibís un número de caso de referencia y respondemos en 48 hs hábiles.
          </p>
        </div>
      </section>

      <section className="bg-[#f7f9fc] py-14">
        <div className="mx-auto max-w-[860px] px-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <RmaForm />
          </div>
          <p className="mt-6 text-center text-[12px] leading-relaxed text-slate-500">
            Los casos de RMA se registran en un flujo separado del canal comercial para no mezclarlos con cotizaciones. La evaluación de cobertura se hace según las condiciones vigentes del fabricante para el producto.
          </p>
        </div>
      </section>
    </InternalPageShell>
  );
}
