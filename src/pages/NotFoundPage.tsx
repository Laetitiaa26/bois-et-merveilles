import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-display text-4xl text-ink">404</h1>
      <p className="mt-3 text-ink-light">Cette page s'est égarée quelque part entre les copeaux de bois.</p>
      <Link to="/" className="mt-8 inline-block">
        <Button>Retour à l'accueil</Button>
      </Link>
    </div>
  );
}
