import { payments } from "../../constants";
import { Icon } from "../icons";
import { Reveal } from "../motion";

export function Payments() {
  return (
    <section className="border-t border-slate-200 bg-white py-14">
      <div className="mx-auto max-w-[1200px] px-7">
        <Reveal className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <h2 className="font-display text-[20px] font-bold text-ink">{payments.title}</h2>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {payments.methods.map((m) => (
              <span key={m.label} className="flex items-center gap-2.5 text-[14.5px] font-medium text-slate-700">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-brand">
                  <Icon name={m.icon} className="h-5 w-5" />
                </span>
                {m.label}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
