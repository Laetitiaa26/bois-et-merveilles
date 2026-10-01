import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { ProductIllustration } from "../components/ProductIllustration";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { api } from "../lib/api";
import { formatPrice } from "../lib/format";

export function CheckoutPage() {
  const { items, totalCents } = useCart();
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email ?? "");
  const [name, setName] = useState(user?.name ?? "");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("France");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<{ code: string; percent: number } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  if (items.length === 0) {
    return <Navigate to="/panier" replace />;
  }

  // Même calcul que le serveur : la réduction s'applique sur chaque prix unitaire arrondi
  const payableCents = promo
    ? items.reduce((sum, item) => sum + Math.round((item.priceCents * (100 - promo.percent)) / 100) * item.quantity, 0)
    : totalCents;

  const applyPromo = async () => {
    setPromoError(null);
    try {
      setPromo(await api.post<{ code: string; percent: number }>("/checkout/promo", { code: promoInput }));
    } catch (err) {
      setPromo(null);
      setPromoError(err instanceof Error ? err.message : "Code promo invalide");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await api.post<{ url: string }>("/checkout/create-session", {
        email,
        shipping: { name, address, city, postalCode, country },
        items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        promoCode: promo?.code,
      });
      window.location.href = res.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue, réessayez.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-8 font-display text-3xl text-ink">Finaliser la commande</h1>
      <div className="grid gap-10 sm:grid-cols-[1.2fr_1fr]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Nom complet" required value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Adresse" required value={address} onChange={(e) => setAddress(e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Ville" required value={city} onChange={(e) => setCity(e.target.value)} />
            <Input label="Code postal" required value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
          </div>
          <Input label="Pays" required value={country} onChange={(e) => setCountry(e.target.value)} />

          {error && <p className="text-sm text-terracotta">{error}</p>}

          <Button type="submit" disabled={isSubmitting} className="mt-2">
            {isSubmitting ? "Redirection vers le paiement..." : `Payer ${formatPrice(payableCents)}`}
          </Button>
          <div className="rounded-2xl bg-sage-light p-4 text-sm text-ink">
            <p className="font-medium">Site de démonstration : aucun montant réel ne sera débité.</p>
            <p className="mt-1 text-ink-light">
              Sur la page de paiement Stripe, utilisez la carte test{" "}
              <span className="font-semibold whitespace-nowrap text-ink">2223 0031 2200 3222</span>, une date
              d'expiration future et n'importe quel code à 3 chiffres.
            </p>
            <p className="mt-1 text-ink-light">
              Rien ne sera expédié : vous pouvez saisir un nom et une adresse fictifs.
            </p>
          </div>
        </form>

        <div className="h-fit rounded-3xl bg-white/50 p-6">
          <h2 className="mb-4 font-display text-lg">Récapitulatif</h2>
          <ul className="flex flex-col gap-3 text-sm">
            {items.map((item) => (
              <li key={item.productId} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-3 text-ink-light">
                  <ProductIllustration
                    illustrationKey={item.illustrationKey}
                    accentColor={item.accentColor}
                    imageUrl={item.imageUrl}
                    alt={item.name}
                    className="h-14 w-14 shrink-0 rounded-xl!"
                  />
                  {item.name} × {item.quantity}
                </span>
                <span>{formatPrice(item.priceCents * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2 border-t border-ink/10 pt-4">
            <div className="flex gap-2">
              <input
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Code promo"
                aria-label="Code promo"
                className="min-w-0 flex-1 rounded-full border border-ink/15 bg-white/70 px-4 py-2 text-sm uppercase text-ink placeholder:normal-case placeholder:text-ink-light/60 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30"
              />
              <Button
                type="button"
                variant="ghost"
                className="px-4 py-2"
                onClick={applyPromo}
                disabled={!promoInput.trim()}
              >
                Appliquer
              </Button>
            </div>
            {promoError && <p className="text-sm text-terracotta">{promoError}</p>}
          </div>
          {promo && (
            <div className="mt-4 flex justify-between text-sm text-sage">
              <span>
                Code {promo.code} (-{promo.percent} %)
              </span>
              <span>-{formatPrice(totalCents - payableCents)}</span>
            </div>
          )}
          <div className="mt-4 flex justify-between border-t border-ink/10 pt-4 font-display text-lg">
            <span>Total</span>
            <span>{formatPrice(payableCents)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
