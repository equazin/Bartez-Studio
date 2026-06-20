import { partners } from "../../constants";

export function TrustBar() {
  return (
    <section className="border-y border-slate-200 bg-white py-10">
      <div className="mx-auto max-w-[1200px] px-7">
        <p className="mb-6 text-center text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          {partners.title}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
          {partners.brands.map((b) => (
            <span key={b} className="text-[19px] font-bold tracking-tight text-slate-400 transition-colors hover:text-ink">
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
