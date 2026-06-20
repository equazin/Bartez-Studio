import { testimonial } from "../../constants";
import { Reveal } from "../motion";
import { Quote } from "lucide-react";

export function Testimonial() {
  return (
    <section className="bg-verde py-28 text-white">
      <div className="mx-auto max-w-[920px] px-7 text-center">
        <Reveal>
          <Quote className="mx-auto mb-7 h-10 w-10 text-bronce" aria-hidden />
          <blockquote className="font-serif text-[clamp(26px,3.4vw,42px)] leading-[1.18] tracking-[-0.01em] text-balance">
            “{testimonial.quote}”
          </blockquote>
          <figcaption className="mt-8 text-[15px]">
            <span className="font-semibold">{testimonial.author}</span>
            <span className="text-white/60"> · {testimonial.role}</span>
          </figcaption>
        </Reveal>
      </div>
    </section>
  );
}
