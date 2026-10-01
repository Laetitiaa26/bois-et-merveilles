import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl text-ink">Commande annulée</h1>
      <p className="mt-3 text-ink-light">
        Le paiement a été annulé, votre panier a été conservé. Vous pouvez réessayer quand vous le souhaitez.
      </p>
      <Link to="/panier" className="mt-8 inline-block">
        <Button>Retour au panier</Button>
      </Link>
    </div>
  );
}
