import { useEffect, useState } from "react";
import { ProductIllustration } from "../../components/ProductIllustration";
import { api } from "../../lib/api";
import { formatPrice } from "../../lib/format";
import type { Order, OrderStatus } from "../../types";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "PENDING", label: "En attente de paiement" },
  { value: "PAID", label: "Payée" },
  { value: "FAILED", label: "Échouée" },
  { value: "CANCELLED", label: "Annulée" },
];

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    api
      .get<{ orders: Order[] }>("/admin/orders")
      .then((res) => setOrders(res.orders))
      .catch((err) => console.error(err));
  }, []);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    const res = await api.patch<{ order: Order }>(`/admin/orders/${orderId}`, { status });
    setOrders((prev) => prev?.map((order) => (order.id === orderId ? res.order : order)) ?? null);
  };

  if (!orders) {
    return <p className="text-ink-light">Chargement...</p>;
  }

  if (orders.length === 0) {
    return <p className="text-ink-light">Aucune commande pour le moment.</p>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {orders.map((order) => (
        <li key={order.id} className="rounded-3xl bg-white/50 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-medium text-ink">
                Commande #{order.id.slice(-8)}
                <span className="ml-2 text-sm font-normal text-ink-light">
                  {new Date(order.createdAt).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
                </span>
              </p>
              <p className="mt-1 text-sm text-ink-light">
                {order.shippingName} · {order.email}
                <br />
                {order.shippingAddress}, {order.shippingPostalCode} {order.shippingCity}, {order.shippingCountry}
              </p>
            </div>
            <select
              value={order.status}
              onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
              aria-label="Statut de la commande"
              className="rounded-full border border-ink/15 bg-white/70 px-4 py-2 text-sm text-ink focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <ul className="mt-4 flex flex-col gap-3 border-t border-ink/10 pt-4 text-sm">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-3 text-ink-light">
                  <ProductIllustration
                    illustrationKey={item.product.illustrationKey}
                    accentColor={item.product.accentColor}
                    imageUrl={item.product.imageUrl}
                    alt={item.product.name}
                    className="h-14 w-14 shrink-0 rounded-xl!"
                  />
                  {item.product.name} × {item.quantity}
                </span>
                <span>{formatPrice(item.unitPriceCents * item.quantity, order.currency)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-ink/10 pt-3">
            <span className="text-sm text-ink-light">
              {order.promoCode ? `Code ${order.promoCode} : -${formatPrice(order.discountCents, order.currency)}` : ""}
            </span>
            <span className="font-display text-lg text-ink">{formatPrice(order.totalCents, order.currency)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
