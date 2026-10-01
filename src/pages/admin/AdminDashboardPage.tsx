import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { formatPrice } from "../../lib/format";

interface Stats {
  productCount: number;
  orderCount: number;
  paidOrderCount: number;
  revenueCents: number;
  subscriberCount: number;
  lowStockCount: number;
  pendingReviewCount: number;
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api
      .get<Stats>("/admin/stats")
      .then(setStats)
      .catch((err) => console.error(err));
  }, []);

  if (!stats) {
    return <p className="text-ink-light">Chargement...</p>;
  }

  const cards = [
    {
      label: "Chiffre d'affaires",
      value: formatPrice(stats.revenueCents),
      hint: `${stats.paidOrderCount} commande(s) payée(s)`,
    },
    { label: "Commandes", value: stats.orderCount, hint: "toutes commandes confondues", to: "/admin/commandes" },
    { label: "Produits en ligne", value: stats.productCount, hint: "visibles dans la boutique", to: "/admin/produits" },
    { label: "Stock faible", value: stats.lowStockCount, hint: "produits à 5 unités ou moins", to: "/admin/produits" },
    { label: "Avis à valider", value: stats.pendingReviewCount, hint: "en attente de publication", to: "/admin/avis" },
    { label: "Abonnés newsletter", value: stats.subscriberCount, hint: "inscrits via le pied de page" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {cards.map((card) => {
        const content = (
          <>
            <span className="text-sm text-ink-light">{card.label}</span>
            <span className="font-display text-3xl text-ink">{card.value}</span>
            <span className="text-xs text-ink-light">{card.hint}</span>
          </>
        );
        const className = "flex flex-col gap-1 rounded-3xl bg-white/50 p-6";
        return card.to ? (
          <Link key={card.label} to={card.to} className={`${className} transition hover:shadow-md`}>
            {content}
          </Link>
        ) : (
          <div key={card.label} className={className}>
            {content}
          </div>
        );
      })}
    </div>
  );
}
