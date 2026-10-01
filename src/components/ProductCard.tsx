import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/format";
import type { Product } from "../types";
import { FavoriteButton } from "./FavoriteButton";
import { ProductIllustration } from "./ProductIllustration";
import { Button } from "./ui/Button";
import { NewBadge } from "./ui/NewBadge";
import { Stars } from "./ui/Stars";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl bg-white/60 p-2 shadow-sm ring-1 ring-ink/5 transition hover:-translate-y-1 hover:shadow-md sm:rounded-[28px] sm:p-3">
      <div className="relative">
        <Link to={`/produits/${product.slug}`} className="block">
          <ProductIllustration
            illustrationKey={product.illustrationKey}
            accentColor={product.accentColor}
            imageUrl={product.imageUrl}
            alt={product.name}
            className="aspect-square w-full transition group-hover:scale-[1.02]"
          />
          {product.isNew && <NewBadge className="absolute left-2 top-2 sm:left-3 sm:top-3" />}
        </Link>
        <FavoriteButton productId={product.id} className="absolute right-2 top-2 sm:right-3 sm:top-3" />
      </div>
      <div className="flex flex-1 flex-col gap-2 px-1 pb-1 pt-3 sm:px-2 sm:pb-2 sm:pt-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-light">{product.category.name}</span>
        <Link
          to={`/produits/${product.slug}`}
          className="font-display leading-snug text-ink hover:underline sm:text-lg"
        >
          {product.name}
        </Link>
        {product.reviewCount ? (
          <span className="flex items-center gap-1.5 text-xs text-ink-light">
            <Stars rating={product.averageRating ?? 0} className="h-3.5 w-3.5" />({product.reviewCount})
          </span>
        ) : null}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
          <span className="font-display text-ink sm:text-lg">{formatPrice(product.priceCents, product.currency)}</span>
          <Button
            variant="ghost"
            className="px-4 py-2 text-xs"
            onClick={() => addItem(product)}
            disabled={product.stock <= 0}
          >
            {product.stock > 0 ? "Ajouter" : "Épuisé"}
          </Button>
        </div>
      </div>
    </div>
  );
}
