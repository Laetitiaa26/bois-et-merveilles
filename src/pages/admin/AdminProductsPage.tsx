import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductIllustration } from "../../components/ProductIllustration";
import { Button } from "../../components/ui/Button";
import { api } from "../../lib/api";
import { formatPrice } from "../../lib/format";
import type { AdminProduct } from "../../types";

export function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[] | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get<{ products: AdminProduct[] }>("/admin/products")
      .then((res) => setProducts(res.products))
      .catch((err) => console.error(err));
  }, []);

  const toggleActive = async (product: AdminProduct) => {
    const res = await api.patch<{ product: AdminProduct }>(`/admin/products/${product.id}`, {
      active: !product.active,
    });
    setProducts((prev) => prev?.map((p) => (p.id === product.id ? { ...p, active: res.product.active } : p)) ?? null);
  };

  if (!products) {
    return <p className="text-ink-light">Chargement...</p>;
  }

  const query = search.trim().toLowerCase();
  const visible = query
    ? products.filter((p) => p.name.toLowerCase().includes(query) || p.category.name.toLowerCase().includes(query))
    : products;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un produit..."
          className="w-full max-w-sm rounded-full border border-ink/15 bg-white/70 px-5 py-2.5 text-sm focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30"
        />
        <Link to="/admin/produits/nouveau">
          <Button>+ Nouveau produit</Button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-3xl bg-white/50">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-ink/10 text-ink-light">
            <tr>
              <th className="px-4 py-3 font-medium">Produit</th>
              <th className="px-4 py-3 font-medium">Catégorie</th>
              <th className="px-4 py-3 font-medium">Prix</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {visible.map((product) => (
              <tr key={product.id} className={`border-b border-ink/5 ${product.active ? "" : "opacity-50"}`}>
                <td className="px-4 py-3">
                  <Link to={`/admin/produits/${product.id}`} className="flex items-center gap-3 hover:underline">
                    <ProductIllustration
                      illustrationKey={product.illustrationKey}
                      accentColor={product.accentColor}
                      imageUrl={product.imageUrl}
                      className="h-12 w-12 shrink-0 rounded-xl!"
                    />
                    <span className="font-medium text-ink">{product.name}</span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-light">{product.category.name}</td>
                <td className="px-4 py-3">{formatPrice(product.priceCents, product.currency)}</td>
                <td className={`px-4 py-3 ${product.stock <= 5 ? "font-semibold text-terracotta" : ""}`}>
                  {product.stock}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {product.featured && (
                      <span className="rounded-full bg-mustard-light px-2 py-0.5 text-xs">Coup de cœur</span>
                    )}
                    {product.isNew && (
                      <span className="rounded-full bg-terracotta-light px-2 py-0.5 text-xs">Nouveauté</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => toggleActive(product)}
                    className="rounded-full border border-ink/15 px-3 py-1 text-xs font-medium hover:border-ink/40"
                  >
                    {product.active ? "Masquer" : "Remettre en ligne"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-ink-light">
        {products.length} produits · les produits masqués n'apparaissent plus dans la boutique.
      </p>
    </div>
  );
}
