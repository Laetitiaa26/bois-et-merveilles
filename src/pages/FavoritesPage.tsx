import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { api } from "../lib/api";
import type { Product } from "../types";

export function FavoritesPage() {
  const { user, isLoading } = useAuth();
  const { favoriteIds } = useFavorites();
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    if (!user) return;
    api
      .get<{ products: Product[] }>("/favorites")
      .then((res) => setProducts(res.products))
      .catch((err) => console.error(err));
  }, [user]);

  if (isLoading) {
    return <div className="mx-auto max-w-6xl px-6 py-24 text-center text-ink-light">Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/connexion" replace />;
  }

  // Un cœur décoché sur cette page retire le produit immédiatement
  const visible = products?.filter((product) => favoriteIds.has(product.id)) ?? [];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link to="/compte" className="text-sm font-medium text-ink-light hover:text-ink">
        ← Mon compte
      </Link>
      <h1 className="mb-8 mt-2 font-display text-3xl text-ink">Mes favoris</h1>
      {products === null ? (
        <p className="text-ink-light">Chargement...</p>
      ) : visible.length === 0 ? (
        <p className="text-ink-light">
          Vous n'avez pas encore de favoris. Cliquez sur le cœur d'un jouet dans la{" "}
          <Link to="/boutique" className="font-medium text-sage hover:underline">
            boutique
          </Link>{" "}
          pour le retrouver ici.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
