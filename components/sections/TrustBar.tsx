import Image from "next/image";
import { getDynamicPartners } from "../../lib/db-content";

export async function TrustBar() {
  const brands = await getDynamicPartners();

  return (
    <section className="border-b border-white/10 bg-[#020a06] py-10" aria-label="Marcas que trabajamos">
      <div className="mx-auto grid max-w-[1320px] gap-7 px-6 lg:grid-cols-[190px_1fr] lg:items-center lg:px-8">
        <p className="max-w-[12ch] font-display text-[21px] font-bold leading-tight text-white">Marcas que trabajamos</p>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-6 lg:justify-between">
            {brands.slice(0, 9).map((brand) => (
              <span key={brand.name} className="relative h-14 w-28 sm:w-32">
                <Image src={brand.logo} alt={brand.name} fill sizes="128px" className="object-contain object-left brightness-0 invert opacity-75 transition duration-300 hover:opacity-100" />
              </span>
            ))}
        </div>
      </div>
    </section>
  );
}
