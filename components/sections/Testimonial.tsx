import { testimonial } from "../../constants";
import { Reveal } from "../motion";
import { Quote } from "lucide-react";

export function Testimonial() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-[920px] px-7">
        <Reveal className="rounded-3xl border border-slate-200 bg-white p-10 shadow-soft md:p-14">
          <Quote className="mb-6 h-9 w-9 text-brand" aria-hidden />
          <blockquote className="font-display text-[clamp(22px,2.8vw,34px)] font-medium leading-[1.25] tracking-[-0.01em] text-ink text-balance">
            “{testimonial.quote}”
          </blockquote>
          <figcaption className="mt-7 flex items-center gap-3 text-[15px]">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-brand/10 font-display font-bold text-brand">B2B</span>
            <span>
              <span className="block font-semibold text-ink">{testimonial.author}</span>
              <span className="text-slate-500">{testimonial.role}</span>
            </span>
          </figcaption>
        </Reveal>
      </div>
    </section>
  );
}
