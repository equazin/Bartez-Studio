import { payments } from "../../constants";
import { Icon } from "../icons";
import { Reveal } from "../motion";

export function Payments() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1200px] px-7">
        <Reveal className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <h2 className="font-serif text-[22px] text-verde-deep">{payments.title}</h2>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {payments.methods.map((m) => (
              <span key={m.label} className="flex items-center gap-2.5 text-[14.5px] font-medium text-[#4a5a50]">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-verde/5 text-verde">
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
