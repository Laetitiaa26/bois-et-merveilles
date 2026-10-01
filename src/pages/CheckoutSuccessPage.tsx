import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useCart } from "../context/CartContext";
import { api } from "../lib/api";
import { formatPrice } from "../lib/format";
import type { Order } from "../types";

export function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order");
  const { clear } = useCart();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!orderId) return;
    api
      .get<{ order: Order }>(`/orders/${orderId}`)
      .then((res) => setOrder(res.order))
      .catch((err) => console.error(err));
  }, [orderId]);

  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <span className="text-5xl">🌿</span>
      <h1 className="mt-4 font-display text-3xl text-ink">Merci pour votre commande !</h1>
      <p className="mt-3 text-ink-light">
        Votre paiement a bien été reçu. Un email de confirmation vous sera envoyé sous peu.
      </p>
      {order && (
        <div className="mt-8 rounded-3xl bg-white/50 p-6 text-left">
          <div className="flex justify-between text-sm text-ink-light">
            <span>Commande</span>
            <span>#{order.id.slice(-8)}</span>
          </div>
          <div className="mt-2 flex justify-between font-display text-lg">
            <span>Total</span>
            <span>{formatPrice(order.totalCents, order.currency)}</span>
          </div>
        </div>
      )}
      <Link to="/boutique" className="mt-8 inline-block">
        <Button>Continuer mes achats</Button>
      </Link>
    </div>
  );
}
