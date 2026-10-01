import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { ProductIllustration } from "../components/ProductIllustration";
import { ReviewsMarquee } from "../components/ReviewsMarquee";
import { Button } from "../components/ui/Button";
import { api } from "../lib/api";
import type { Category, IllustrationKey, Product } from "../types";

const CATEGORY_ILLUSTRATIONS: Record<string, IllustrationKey> = {
  "blocs-de-construction": "blocks",
  "emboitement-et-tri": "nesting-bowls",
  "empileurs-arc-en-ciel": "rainbow-stacker",
  "foulards-de-jeu": "scarves",
  "bacs-sensoriels": "sensory-bin",
  "vehicules-en-bois": "vehicle",
  "disques-en-bois": "discs",
  "blocs-gemmes": "gem-blocks",
};

const CATEGORY_ACCENTS: Record<string, "sage" | "terracotta" | "mustard" | "dustypink" | "sky"> = {
  "blocs-de-construction": "mustard",
  "emboitement-et-tri": "sage",
  "empileurs-arc-en-ciel": "dustypink",
  "foulards-de-jeu": "sky",
  "bacs-sensoriels": "terracotta",
  "vehicules-en-bois": "mustard",
  "disques-en-bois": "sage",
  "blocs-gemmes": "dustypink",
};

export function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    api
      .get<{ categories: Category[] }>("/categories")
      .then((res) => setCategories(res.categories))
      .catch((err) => console.error(err));
    api
      .get<{ products: Product[] }>("/products?featured=true")
      .then((res) => setFeatured(res.products))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden">
        <img
          src="/header.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-[50%_65%] saturate-125"
        />
        <div className="absolute inset-0 bg-cream/15" />
        <div className="absolute inset-0 bg-linear-to-t from-cream via-cream/15 to-transparent" />

        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 pb-16 pt-16 text-center sm:pt-24">
          <span className="rounded-full bg-sage-light px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-sage">
            Simple. Naturel. Intemporel.
          </span>
          <h1 className="font-display text-4xl leading-tight text-ink drop-shadow-[0_2px_16px_rgba(251,244,232,0.9)] sm:text-6xl">
            Les plus beaux jouets <br className="hidden sm:block" />à{" "}
            <span className="text-terracotta">jeu libre</span>
          </h1>
          <p className="max-w-xl font-medium text-ink drop-shadow-[0_2px_12px_rgba(251,244,232,0.9)] sm:text-lg">
            Des pièces simples en bois pour des esprits curieux et un jeu créatif. Pas de règles, pas d'écran,
            des possibilités infinies.
          </p>
          <Link to="/boutique">
            <Button>Découvrir la boutique</Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl text-ink sm:text-3xl">Nos univers de jeu</h2>
          <Link to="/boutique" className="text-sm font-medium text-ink-light hover:text-ink">
            Tout voir →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/boutique?categorie=${category.slug}`}
              className="group flex flex-col items-center gap-3 rounded-3xl bg-white/50 p-4 text-center transition hover:-translate-y-1 hover:shadow-md"
            >
              <ProductIllustration
                illustrationKey={CATEGORY_ILLUSTRATIONS[category.slug] ?? "blocks"}
                accentColor={CATEGORY_ACCENTS[category.slug] ?? "sage"}
                imageUrl={category.imageUrl}
                alt={category.name}
                className="aspect-square w-full"
              />
              <span className="font-display text-sm text-ink">{category.name}</span>
              <span className="text-xs text-ink-light">{category.tagline}</span>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-2xl text-ink sm:text-3xl">Coups de cœur</h2>
            <Link to="/boutique" className="text-sm font-medium text-ink-light hover:text-ink">
              Tout voir →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <ReviewsMarquee />

      <section className="bg-cream-dark py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 sm:grid-cols-3">
          {[
            { title: "Matériaux naturels", text: "Bois massif, teintures à l'eau et finitions sans danger." },
            { title: "Jeu libre", text: "Des jouets ouverts qui grandissent avec l'enfant, sans mode d'emploi." },
            { title: "Fabriqué avec soin", text: "Petites séries, ponçage et huilage réalisés à la main." },
          ].map((item) => (
            <div key={item.title} className="text-center sm:text-left">
              <h3 className="font-display text-lg text-ink">{item.title}</h3>
              <p className="mt-2 text-sm text-ink-light">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
