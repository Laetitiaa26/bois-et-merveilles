import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { Button } from "./ui/Button";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await api.post<{ promoCode: string }>("/newsletter", { email });
      setPromoCode(res.promoCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Inscription impossible, réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (promoCode) {
    return (
      <p className="rounded-2xl bg-sage-light px-4 py-3 text-sm text-ink">
        Merci pour votre inscription ! Voici votre code de bienvenue :{" "}
        <strong className="font-semibold tracking-wide">{promoCode}</strong> (-10 % sur votre première commande).
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre adresse email"
          aria-label="Votre adresse email"
          className="min-w-0 flex-1 rounded-full border border-ink/15 bg-white/70 px-4 py-2.5 text-sm text-ink placeholder:text-ink-light/60 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30"
        />
        <Button type="submit" disabled={isSubmitting} className="px-5 py-2.5">
          {isSubmitting ? "..." : "S'inscrire"}
        </Button>
      </div>
      {error && <p className="text-sm text-terracotta">{error}</p>}
      <p className="text-xs text-ink-light">
        Désinscription à tout moment.{" "}
        <Link to="/confidentialite" className="underline hover:text-ink">
          Données personnelles
        </Link>
      </p>
    </form>
  );
}
