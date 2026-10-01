import { Link } from "react-router-dom";
import { ProductIllustration } from "../components/ProductIllustration";
import { QuantityStepper } from "../components/QuantityStepper";
import { Button } from "../components/ui/Button";
import { RemoveButton } from "../components/ui/RemoveButton";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/format";

export function CartPage() {
  const { items, updateQuantity, removeItem, totalCents } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-ink">Votre panier est vide</h1>
        <p className="mt-3 text-ink-light">Direction la boutique pour trouver de nouveaux trésors en bois.</p>
        <Link to="/boutique" className="mt-6 inline-block">
          <Button>Découvrir la boutique</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-8 font-display text-3xl text-ink">Votre panier</h1>
      <ul className="flex flex-col gap-6">
        {items.map((item) => (
          <li key={item.productId} className="flex items-center gap-4 rounded-3xl bg-white/50 p-4 sm:gap-5">
            <ProductIllustration
              illustrationKey={item.illustrationKey}
              accentColor={item.accentColor}
              imageUrl={item.imageUrl}
              alt={item.name}
              className="h-20 w-20 shrink-0 sm:h-24 sm:w-24"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <Link to={`/produits/${item.slug}`} className="font-display leading-snug hover:underline sm:text-lg">
                  {item.name}
                </Link>
                <RemoveButton
                  label={`Retirer ${item.name} du panier`}
                  onClick={() => removeItem(item.productId)}
                />
              </div>
              <span className="text-sm text-ink-light sm:text-base">{formatPrice(item.priceCents)} l'unité</span>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <QuantityStepper
                  quantity={item.quantity}
                  min={0}
                  max={item.stock}
                  onChange={(q) => updateQuantity(item.productId, q)}
                />
                {/* Sur mobile, le total de la ligne passe sous le nom faute de place à droite */}
                <span className="font-display sm:hidden">{formatPrice(item.priceCents * item.quantity)}</span>
              </div>
            </div>
            <span className="hidden w-24 shrink-0 text-right font-display text-lg sm:block">{formatPrice(item.priceCents * item.quantity)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-col items-end gap-4 border-t border-ink/10 pt-6">
        <div className="flex w-full max-w-xs items-center justify-between font-display text-xl">
          <span>Total</span>
          <span>{formatPrice(totalCents)}</span>
        </div>
        <Link to="/commande" className="w-full sm:w-auto">
          <Button className="w-full">Passer à la commande</Button>
        </Link>
      </div>
    </div>
  );
}
