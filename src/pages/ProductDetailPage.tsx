import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { FavoriteButton } from "../components/FavoriteButton";
import { ProductGallery } from "../components/ProductGallery";
import { QuantityStepper } from "../components/QuantityStepper";
import { ReviewsSection } from "../components/ReviewsSection";
import { Button } from "../components/ui/Button";
import { NewBadge } from "../components/ui/NewBadge";
import { Stars } from "../components/ui/Stars";
import { useCart } from "../context/CartContext";
import { api, ApiError } from "../lib/api";
import { formatPrice } from "../lib/format";
import type { Product } from "../types";

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  // Remonter le composant à chaque changement de slug réinitialise tous les states
  // ci-dessous automatiquement, sans avoir à les remettre à zéro manuellement.
  return <ProductDetailView key={slug} slug={slug!} />;
}

function ProductDetailView({ slug }: { slug: string }) {
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [notFound, setNotFound] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api
      .get<{ product: Product; related: Product[] }>(`/products/${slug}`)
      .then((res) => {
        setProduct(res.product);
        setRelated(res.related);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) setNotFound(true);
      });
  }, [slug]);

  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl text-ink">Ce produit n'existe pas (ou plus)</h1>
        <Link to="/boutique" className="mt-4 inline-block text-sage hover:underline">
          Retourner à la boutique
        </Link>
      </div>
    );
  }

  if (!product) {
    return <div className="mx-auto max-w-6xl px-6 py-24 text-center text-ink-light">Chargement...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-10 sm:grid-cols-2">
        <ProductGallery product={product} />
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Link to={`/boutique?categorie=${product.category.slug}`} className="text-sm font-semibold text-sage">
              {product.category.name}
            </Link>
            {product.isNew && <NewBadge />}
          </div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-display text-3xl text-ink sm:text-4xl">{product.name}</h1>
            <FavoriteButton productId={product.id} className="mt-1 shrink-0 bg-white/70" />
          </div>
          {product.reviewCount ? (
            <a href="#avis" className="flex w-fit items-center gap-2 text-sm text-ink-light hover:text-ink">
              <Stars rating={product.averageRating ?? 0} />
              {product.reviewCount} avis
            </a>
          ) : null}
          <span className="font-display text-2xl text-ink">{formatPrice(product.priceCents, product.currency)}</span>
          <p className="text-ink-light">{product.description}</p>

          <dl className="grid grid-cols-2 gap-4 rounded-2xl bg-white/50 p-4 text-sm">
            {product.material && (
              <div>
                <dt className="text-ink-light">Matériau</dt>
                <dd className="font-medium text-ink">{product.material}</dd>
              </div>
            )}
            {product.ageRange && (
              <div>
                <dt className="text-ink-light">Âge conseillé</dt>
                <dd className="font-medium text-ink">{product.ageRange}</dd>
              </div>
            )}
          </dl>

          <div className="mt-2 flex flex-wrap items-center gap-4">
            <QuantityStepper quantity={quantity} onChange={setQuantity} max={product.stock} />
            <Button
              onClick={() => {
                addItem(product, quantity);
                setAdded(true);
              }}
              disabled={product.stock <= 0}
            >
              {product.stock > 0 ? "Ajouter au panier" : "Épuisé"}
            </Button>
          </div>
          {added && <p className="text-sm text-sage">Ajouté au panier !</p>}
          {product.stock > 0 && product.stock <= 5 && (
            <p className="text-sm text-terracotta">Plus que {product.stock} en stock.</p>
          )}
        </div>
      </div>

      <ReviewsSection slug={product.slug} />

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 font-display text-2xl text-ink">Vous aimerez aussi</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
