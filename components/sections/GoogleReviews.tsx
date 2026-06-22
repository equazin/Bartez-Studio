import { Star } from "lucide-react";

export type GoogleReview = {
  id: string;
  author: string;
  date: string;
  rating: number;
  text: string;
  sourceUrl: string;
};

export function GoogleReviews({ reviews }: { reviews: GoogleReview[] }) {
  if (reviews.length === 0) return null;

  return (
    <section className="bg-[#06140d] py-20 md:py-24" aria-labelledby="reviews-title">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 id="reviews-title" className="font-display text-[clamp(28px,4vw,44px)] font-bold tracking-[-0.04em] text-white">Experiencias verificadas de clientes.</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <article key={review.id} className="border border-white/10 bg-[#030c07] p-6">
              <div className="flex gap-1" aria-label={`${review.rating} de 5 estrellas`}>{Array.from({ length: review.rating }).map((_, index) => <Star key={index} className="fill-accent text-accent" size={15} />)}</div>
              <blockquote className="mt-5 text-[14px] leading-relaxed text-slate-300">“{review.text}”</blockquote>
              <div className="mt-6 border-t border-white/10 pt-4"><p className="text-[13px] font-bold text-white">{review.author}</p><p className="mt-1 text-[11.5px] text-slate-500">{review.date}</p><a href={review.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex text-[12px] font-semibold text-accent">Ver review en Google</a></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
