import { partners } from "../../constants";

export function TrustBar() {
  return (
    <section className="border-y border-slate-200 bg-white py-10">
      <div className="mx-auto max-w-[1200px] px-7">
        <p className="mb-7 text-center text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          {partners.title}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {partners.brands.map((b) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={b.name}
              src={b.logo}
              alt={`${b.name} — marca oficial distribuida por Bartez`}
              className="h-6 w-auto opacity-60 transition-opacity duration-300 hover:opacity-100 md:h-7"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
