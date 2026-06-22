import Image from "next/image";
import { getDynamicPartners } from "../../lib/db-content";

export async function TrustBar() {
  const brands = await getDynamicPartners();

  return (
    <section className="border-b border-white/5 bg-[#06140d] py-10" aria-label="Marcas que trabajamos">
      <div className="mx-auto grid max-w-[1200px] gap-7 px-6 lg:grid-cols-[180px_1fr] lg:items-center">
        <p className="max-w-[12ch] font-display text-[20px] font-bold leading-tight text-white">Marcas que trabajamos</p>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-5 lg:justify-between">
            {brands.slice(0, 9).map((brand) => (
              <span key={brand.name} className="relative h-9 w-20 sm:w-24">
                <Image src={brand.logo} alt={brand.name} fill sizes="96px" className="object-contain object-left brightness-0 invert opacity-60 transition duration-300 hover:opacity-100" />
              </span>
            ))}
        </div>
      </div>
    </section>
  );
}
