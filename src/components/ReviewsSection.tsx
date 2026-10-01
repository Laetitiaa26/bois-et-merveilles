import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import type { Review } from "../types";
import { Button } from "./ui/Button";
import { StarInput, Stars } from "./ui/Stars";

export function ReviewsSection({ slug }: { slug: string }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const loadReviews = () =>
    api
      .get<{ reviews: Review[] }>(`/products/${slug}/reviews`)
      .then((res) => setReviews(res.reviews))
      .catch((err) => console.error(err));

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- rechargement seulement au changement de produit
  }, [slug]);

  const myReview = user ? reviews.find((review) => review.userId === user.id) : undefined;
  // La note moyenne ne compte que les avis publiés, comme sur les fiches de la boutique
  const publishedReviews = reviews.filter((review) => review.approved);
  const average = publishedReviews.length
    ? publishedReviews.reduce((sum, review) => sum + review.rating, 0) / publishedReviews.length
    : 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Choisissez une note de 1 à 5 étoiles.");
      return;
    }
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);
    try {
      await api.post(`/products/${slug}/reviews`, { rating, comment });
      setRating(0);
      setComment("");
      setSuccess(true);
      await loadReviews();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d'envoyer votre avis.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-20" id="avis">
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <h2 className="font-display text-2xl text-ink">Avis clients</h2>
        {publishedReviews.length > 0 && (
          <span className="flex items-center gap-2 text-sm text-ink-light">
            <Stars rating={average} />
            {average.toFixed(1)} / 5 · {publishedReviews.length} avis
          </span>
        )}
      </div>

      <div className="grid gap-10 sm:grid-cols-[1.4fr_1fr]">
        {reviews.length === 0 ? (
          <p className="text-ink-light">Aucun avis pour le moment. Soyez le premier à partager votre expérience !</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {reviews.map((review) => (
              <li key={review.id} className="rounded-2xl bg-white/50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Stars rating={review.rating} />
                  <span className="text-xs text-ink-light">
                    {new Date(review.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <p className="mt-3 text-ink">{review.comment}</p>
                <p className="mt-3 flex items-center gap-2 text-sm text-ink-light">
                  {review.authorName}
                  {review.verifiedPurchase && (
                    <span className="rounded-full bg-sage-light px-2 py-0.5 text-xs font-semibold text-sage">
                      Achat vérifié
                    </span>
                  )}
                  {!review.approved && (
                    <span className="rounded-full bg-mustard-light px-2 py-0.5 text-xs font-semibold text-ink">
                      En attente de validation
                    </span>
                  )}
                </p>
              </li>
            ))}
          </ul>
        )}

        <div className="h-fit rounded-3xl bg-white/50 p-6">
          <h3 className="mb-4 font-display text-lg text-ink">{myReview ? "Modifier mon avis" : "Donner mon avis"}</h3>
          {user ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <StarInput value={rating} onChange={setRating} />
              <textarea
                required
                minLength={3}
                maxLength={1000}
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Qu'avez-vous pensé de ce jouet ?"
                className="rounded-2xl border border-ink/15 bg-white/70 px-4 py-2.5 text-sm text-ink placeholder:text-ink-light/60 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30"
              />
              {error && <p className="text-sm text-terracotta">{error}</p>}
              {success && (
                <p className="text-sm text-sage">Merci ! Votre avis sera publié après validation par notre équipe.</p>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Envoi..." : "Publier mon avis"}
              </Button>
            </form>
          ) : (
            <p className="text-sm text-ink-light">
              <Link to="/connexion" className="font-medium text-sage hover:underline">
                Connectez-vous
              </Link>{" "}
              pour laisser un avis.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
