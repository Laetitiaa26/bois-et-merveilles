import { useState } from "react";
import type { Product } from "../types";
import { ProductIllustration } from "./ProductIllustration";

export function ProductGallery({ product }: { product: Product }) {
  const photos = [product.imageUrl, ...product.images].filter((url): url is string => Boolean(url));
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <ProductIllustration
        illustrationKey={product.illustrationKey}
        accentColor={product.accentColor}
        imageUrl={photos[activeIndex]}
        alt={product.name}
        className="aspect-square w-full"
      />
      {photos.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {photos.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Voir la photo ${index + 1}`}
              aria-current={index === activeIndex}
              className={`h-20 w-20 shrink-0 overflow-hidden rounded-2xl ring-2 transition ${
                index === activeIndex ? "ring-ink" : "ring-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={url} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
