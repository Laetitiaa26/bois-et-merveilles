import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ProductIllustration } from "../components/ProductIllustration";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { formatPrice } from "../lib/format";
import type { Order } from "../types";

const STATUS_LABELS: Record<Order["status"], string> = {
  PENDING: "En attente de paiement",
  PAID: "Payée",
  FAILED: "Échouée",
  CANCELLED: "Annulée",
};

export function AccountPage() {
  const { user, isLoading, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user) {
      api
        .get<{ orders: Order[] }>("/orders")
        .then((res) => setOrders(res.orders))
        .catch((err) => console.error(err));
    }
  }, [user]);

  if (isLoading) {
    return <div className="mx-auto max-w-4xl px-6 py-24 text-center text-ink-light">Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/connexion" replace />;
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Mon compte</h1>
          <p className="mt-1 text-ink-light">{user.email}</p>
        </div>
        <Button variant="ghost" onClick={() => logout()}>
          Se déconnecter
        </Button>
      </div>

      <div className="mb-10 flex flex-wrap gap-3">
        <Link to="/compte/favoris">
          <Button variant="ghost">♡ Mes favoris</Button>
        </Link>
        {user.role === "ADMIN" && (
          <Link to="/admin">
            <Button variant="secondary">Espace administrateur</Button>
          </Link>
        )}
      </div>

      <h2 className="mb-4 font-display text-xl text-ink">Historique des commandes</h2>
      {orders.length === 0 ? (
        <p className="text-ink-light">Vous n'avez pas encore passé de commande.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {orders.map((order) => (
            <li key={order.id} className="rounded-2xl bg-white/50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-ink">Commande #{order.id.slice(-8)}</span>
                <span className="text-sm text-ink-light">{new Date(order.createdAt).toLocaleDateString("fr-FR")}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="rounded-full bg-sage-light px-3 py-1 font-medium text-sage">
                  {STATUS_LABELS[order.status]}
                </span>
                <span className="font-display text-lg text-ink">{formatPrice(order.totalCents, order.currency)}</span>
              </div>
              <ul className="mt-4 flex flex-col gap-3 border-t border-ink/10 pt-4 text-sm">
                {order.items.map((item) => (
                  <li key={item.id}>
                    <Link to={`/produits/${item.product.slug}`} className="flex items-center gap-3 text-ink-light hover:text-ink">
                      <ProductIllustration
                        illustrationKey={item.product.illustrationKey}
                        accentColor={item.product.accentColor}
                        imageUrl={item.product.imageUrl}
                        alt={item.product.name}
                        className="h-14 w-14 shrink-0 rounded-xl!"
                      />
                      {item.product.name} × {item.quantity}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
