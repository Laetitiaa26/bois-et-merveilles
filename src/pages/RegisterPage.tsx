import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register(email, password, name || undefined);
      navigate("/compte");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Inscription impossible");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm px-6 py-24">
      <h1 className="mb-8 text-center font-display text-3xl text-ink">Créer un compte</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Prénom" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input
          label="Mot de passe"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-terracotta">{error}</p>}
        <Button type="submit" disabled={isSubmitting} className="mt-2">
          {isSubmitting ? "Création..." : "Créer mon compte"}
        </Button>
        <p className="text-xs text-ink-light">
          Vos données servent uniquement à gérer votre compte et vos commandes.{" "}
          <Link to="/confidentialite" className="underline hover:text-ink">
            Politique de confidentialité
          </Link>
        </p>
      </form>
      <p className="mt-6 text-center text-sm text-ink-light">
        Déjà un compte ?{" "}
        <Link to="/connexion" className="font-medium text-sage hover:underline">
          Connectez-vous
        </Link>
      </p>
    </div>
  );
}
