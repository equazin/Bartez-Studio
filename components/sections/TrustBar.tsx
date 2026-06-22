import Image from "next/image";
import { CalendarCheck2, FileCheck2, MapPinned, Trophy } from "lucide-react";
import { getDynamicPartners } from "../../lib/db-content";

const serviceProof = [
  { icon: CalendarCheck2, label: "Desde 2008", sub: "Trayectoria en el sector" },
  { icon: Trophy, label: "30+ años de experiencia", sub: "Conocimiento profesional" },
  { icon: FileCheck2, label: "Factura A", sub: "Responsable Inscripto" },
  { icon: MapPinned, label: "Cobertura nacional", sub: "Todo Argentina" },
];

export async function TrustBar() {
  const brands = await getDynamicPartners();

  return (
    <section className="border-y border-white/5 bg-[#06140d] py-10" aria-label="Trayectoria, marcas y cobertura">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Logos en color completo */}
        <div>
          <p className="mb-4 text-[11.5px] font-bold uppercase tracking-[0.15em] text-slate-450">Partners y marcas oficiales</p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            {brands.slice(0, 9).map((brand) => (
              <Image key={brand.name} src={brand.logo} alt={brand.name} width={96} height={28} className="h-6 w-auto md:h-7 brightness-0 invert opacity-60 hover:opacity-100 transition duration-300" />
            ))}
          </div>
        </div>

        {/* Pruebas sociales de negocio */}
        <div className="grid gap-4 border-white/5 sm:grid-cols-2 lg:border-l lg:pl-10">
          {serviceProof.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="grid size-9 flex-none place-items-center rounded-lg bg-accent/10 border border-accent/20 text-accent">
                <item.icon className="size-4.5" strokeWidth={1.6} />
              </span>
              <div>
                <span className="block text-[13px] font-semibold text-white">{item.label}</span>
                <span className="block text-[11px] text-slate-450">{item.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
