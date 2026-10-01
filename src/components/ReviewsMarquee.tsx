import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { Stars } from "./ui/Stars";

interface HighlightedReview {
  id: string;
  rating: number;
  comment: string;
  authorName: string;
  product: { name: string; slug: string };
}

function ReviewCard({ review }: { review: HighlightedReview }) {
  return (
    <figure className="flex w-72 shrink-0 flex-col gap-3 rounded-3xl bg-white/60 p-6 sm:w-80">
      <Stars rating={review.rating} />
      <blockquote className="flex-1 text-sm leading-relaxed text-ink">« {review.comment} »</blockquote>
      <figcaption className="text-sm text-ink-light">
        <span className="font-semibold text-ink">{review.authorName}</span> ·{" "}
        <Link to={`/produits/${review.product.slug}`} className="hover:underline">
          {review.product.name}
        </Link>
      </figcaption>
    </figure>
  );
}

export function ReviewsMarquee() {
  const [reviews, setReviews] = useState<HighlightedReview[]>([]);

  useEffect(() => {
    api
      .get<{ reviews: HighlightedReview[] }>("/products/reviews/highlights")
      .then((res) => setReviews(res.reviews))
      .catch((err) => console.error(err));
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section className="pb-24" aria-labelledby="reviews-marquee-title">
      <h2 id="reviews-marquee-title" className="mx-auto mb-8 max-w-6xl px-6 font-display text-2xl text-ink sm:text-3xl">
        Ils ont adoré
      </h2>
      {/* La liste est dupliquée pour que le défilement boucle sans saut ; la copie est masquée aux lecteurs d'écran */}
      <div className="group overflow-hidden motion-reduce:overflow-x-auto mask-[linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {[0, 1].map((copy) => (
            // pr-5 (et non un gap entre les copies) : chaque copie fait exactement 50 % de la largeur totale
            <div key={copy} className="flex gap-5 pr-5" aria-hidden={copy === 1} inert={copy === 1}>
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
