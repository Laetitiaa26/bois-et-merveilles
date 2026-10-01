import { useEffect, useState, useTransition } from "react";
import { useSearchParams } from "react-router-dom";
import { CategoryPill } from "../components/CategoryPill";
import { ProductCard } from "../components/ProductCard";
import { api } from "../lib/api";
import type { Category, Product } from "../types";

const SORT_OPTIONS = [
  { value: "newest", label: "Nouveautés" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
];

// Âge de l'enfant en mois : l'API ne garde que les jouets conseillés à cet âge
const AGE_OPTIONS = [
  { value: "6", label: "6 mois" },
  { value: "12", label: "1 an" },
  { value: "18", label: "18 mois" },
  { value: "24", label: "2 ans" },
];

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("categorie") ?? "";
  const search = searchParams.get("q") ?? "";
  const sort = searchParams.get("tri") ?? "newest";
  const age = searchParams.get("age") ?? "";

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, startTransition] = useTransition();

  useEffect(() => {
    api
      .get<{ categories: Category[] }>("/categories")
      .then((res) => setCategories(res.categories))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    startTransition(async () => {
      try {
        const params = new URLSearchParams();
        if (activeCategory) params.set("category", activeCategory);
        if (search) params.set("search", search);
        if (age) params.set("age", age);
        params.set("sort", sort);
        const res = await api.get<{ products: Product[] }>(`/products?${params.toString()}`);
        setProducts(res.products);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les produits pour le moment. Vérifiez que l'API est bien démarrée.");
      }
    });
  }, [activeCategory, search, age, sort]);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };
  const setCategory = (slug: string) => setParam("categorie", slug);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10 flex flex-col gap-4">
        <h1 className="font-display text-3xl text-ink sm:text-4xl">Boutique</h1>
        <input
          type="search"
          value={search}
          onChange={(e) => setParam("q", e.target.value)}
          placeholder="Rechercher un jouet..."
          className="w-full max-w-sm rounded-full border border-ink/15 bg-white/70 px-5 py-2.5 text-sm focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30"
        />
        <div className="flex flex-wrap gap-2">
          <CategoryPill label="Tout" active={!activeCategory} onClick={() => setCategory("")} />
          {categories.map((category) => (
            <CategoryPill
              key={category.id}
              label={category.name}
              active={activeCategory === category.slug}
              onClick={() => setCategory(category.slug)}
            />
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm font-medium text-ink-light">Âge de l'enfant :</span>
            <CategoryPill label="Tous" active={!age} onClick={() => setParam("age", "")} />
            {AGE_OPTIONS.map((option) => (
              <CategoryPill
                key={option.value}
                label={option.label}
                active={age === option.value}
                onClick={() => setParam("age", option.value)}
              />
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-ink-light">
            Trier par
            <select
              value={sort}
              onChange={(e) => setParam("tri", e.target.value === "newest" ? "" : e.target.value)}
              className="rounded-full border border-ink/15 bg-white/70 px-4 py-2 text-sm text-ink focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {error ? (
        <p className="text-terracotta">{error}</p>
      ) : isLoading ? (
        <p className="text-ink-light">Chargement des produits...</p>
      ) : products.length === 0 ? (
        <p className="text-ink-light">Aucun produit ne correspond à votre recherche.</p>
      ) : (
        <>
          <p className="mb-4 text-sm text-ink-light">
            {products.length} jouet{products.length > 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
