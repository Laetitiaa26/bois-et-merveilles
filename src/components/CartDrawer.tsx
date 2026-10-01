import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/format";
import { ProductIllustration } from "./ProductIllustration";
import { QuantityStepper } from "./QuantityStepper";
import { Button } from "./ui/Button";
import { RemoveButton } from "./ui/RemoveButton";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, totalCents } = useCart();

  // Rendu dans <body> : le backdrop-blur de l'en-tête limiterait sinon le tiroir
  // (position fixed) à la hauteur de l'en-tête.
  return createPortal(
    <>
      <div
        className={`fixed inset-0 z-40 bg-ink/30 transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Panier"
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <h2 className="font-display text-xl">Votre panier</h2>
          <button onClick={onClose} className="text-2xl leading-none text-ink-light hover:text-ink" aria-label="Fermer le panier">
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <p className="mt-10 text-center text-ink-light">Votre panier est vide pour le moment.</p>
          ) : (
            <ul className="flex flex-col gap-5">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4">
                  <ProductIllustration
                    illustrationKey={item.illustrationKey}
                    accentColor={item.accentColor}
                    imageUrl={item.imageUrl}
                    alt={item.name}
                    className="h-20 w-20 shrink-0"
                  />
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link to={`/produits/${item.slug}`} onClick={onClose} className="font-medium leading-snug hover:underline">
                        {item.name}
                      </Link>
                      <RemoveButton
                        label={`Retirer ${item.name} du panier`}
                        onClick={() => removeItem(item.productId)}
                      />
                    </div>
                    <span className="text-sm text-ink-light">{formatPrice(item.priceCents)}</span>
                    <QuantityStepper
                      quantity={item.quantity}
                      min={0}
                      max={item.stock}
                      onChange={(q) => updateQuantity(item.productId, q)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-ink/10 px-6 py-5">
            <div className="mb-4 flex items-center justify-between font-display text-lg">
              <span>Sous-total</span>
              <span>{formatPrice(totalCents)}</span>
            </div>
            <Link to="/commande" onClick={onClose}>
              <Button className="w-full">Commander</Button>
            </Link>
          </div>
        )}
      </aside>
    </>,
    document.body,
  );
}
