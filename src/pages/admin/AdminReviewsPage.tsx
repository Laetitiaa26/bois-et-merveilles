import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductIllustration } from "../../components/ProductIllustration";
import { Button } from "../../components/ui/Button";
import { Stars } from "../../components/ui/Stars";
import { api } from "../../lib/api";
import type { AccentColor, IllustrationKey } from "../../types";

interface AdminReview {
  id: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
  user: { name: string | null; email: string };
  product: {
    name: string;
    slug: string;
    imageUrl: string | null;
    illustrationKey: IllustrationKey;
    accentColor: AccentColor;
  };
}

export function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[] | null>(null);

  useEffect(() => {
    api
      .get<{ reviews: AdminReview[] }>("/admin/reviews")
      .then((res) => setReviews(res.reviews))
      .catch((err) => console.error(err));
  }, []);

  const setApproved = async (reviewId: string, approved: boolean) => {
    await api.patch(`/admin/reviews/${reviewId}`, { approved });
    setReviews((prev) => prev?.map((review) => (review.id === reviewId ? { ...review, approved } : review)) ?? null);
  };

  const remove = async (review: AdminReview) => {
    if (!window.confirm(`Supprimer définitivement l'avis de ${review.user.name ?? review.user.email} ?`)) return;
    await api.delete(`/admin/reviews/${review.id}`);
    setReviews((prev) => prev?.filter((r) => r.id !== review.id) ?? null);
  };

  if (!reviews) {
    return <p className="text-ink-light">Chargement...</p>;
  }

  if (reviews.length === 0) {
    return <p className="text-ink-light">Aucun avis pour le moment.</p>;
  }

  const pendingCount = reviews.filter((review) => !review.approved).length;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-ink-light">
        {pendingCount > 0
          ? `${pendingCount} avis en attente de validation : ils ne sont pas visibles sur la boutique tant que vous ne les avez pas publiés.`
          : "Tous les avis ont été traités."}
      </p>
      <ul className="flex flex-col gap-4">
        {reviews.map((review) => (
          <li
            key={review.id}
            className={`rounded-3xl p-6 ${review.approved ? "bg-white/50" : "bg-mustard-light ring-1 ring-mustard/40"}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <ProductIllustration
                  illustrationKey={review.product.illustrationKey}
                  accentColor={review.product.accentColor}
                  imageUrl={review.product.imageUrl}
                  alt={review.product.name}
                  className="h-14 w-14 shrink-0 rounded-xl!"
                />
                <div>
                  <Link to={`/produits/${review.product.slug}`} className="font-medium text-ink hover:underline">
                    {review.product.name}
                  </Link>
                  <p className="text-sm text-ink-light">
                    {review.user.name ?? "Sans nom"} · {review.user.email} ·{" "}
                    {new Date(review.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  review.approved ? "bg-sage-light text-sage" : "bg-white/70 text-ink"
                }`}
              >
                {review.approved ? "Publié" : "En attente"}
              </span>
            </div>

            <div className="mt-4">
              <Stars rating={review.rating} />
              <p className="mt-2 text-ink">{review.comment}</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {review.approved ? (
                <Button variant="secondary" onClick={() => setApproved(review.id, false)}>
                  Masquer
                </Button>
              ) : (
                <Button onClick={() => setApproved(review.id, true)}>Publier</Button>
              )}
              <Button variant="ghost" onClick={() => remove(review)}>
                Supprimer
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
