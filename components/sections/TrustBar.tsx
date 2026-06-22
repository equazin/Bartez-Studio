import Image from "next/image";
import { Building2, FileCheck2, MapPinned } from "lucide-react";
import { getDynamicPartners } from "../../lib/db-content";

const serviceProof = [
  { icon: Building2, label: "Atención B2B dedicada" },
  { icon: FileCheck2, label: "Factura A" },
  { icon: MapPinned, label: "Cobertura nacional" },
];

export async function TrustBar() {
  const brands = await getDynamicPartners();

  return (
    <section className="border-y border-slate-200 bg-slate-50/70 py-8" aria-label="Clientes, marcas y cobertura">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-x-9 gap-y-5">
          {brands.slice(0, 9).map((brand) => (
            <Image key={brand.name} src={brand.logo} alt={brand.name} width={96} height={28} className="h-5 w-auto grayscale opacity-55 md:h-6" />
          ))}
        </div>
        <div className="grid gap-4 border-slate-200 sm:grid-cols-3 lg:border-l lg:pl-8">
          {serviceProof.map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 text-[12.5px] font-medium text-slate-700">
              <item.icon className="size-5 flex-none text-brand" strokeWidth={1.6} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
