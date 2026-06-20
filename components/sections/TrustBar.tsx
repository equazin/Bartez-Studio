import { partners } from "../../constants";

export function TrustBar() {
  return (
    <section className="border-t border-white/5 bg-verde-deep py-8">
      <div className="mx-auto max-w-[1200px] px-7">
        <p className="mb-5 text-center text-[12px] uppercase tracking-[0.14em] text-white/45">{partners.title}</p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {partners.brands.map((b) => (
            <span
              key={b}
              className="text-[20px] font-bold tracking-tight text-white/40 grayscale transition-colors hover:text-white/85"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
