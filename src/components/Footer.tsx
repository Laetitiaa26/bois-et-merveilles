import { Link } from "react-router-dom";
import { NewsletterForm } from "./NewsletterForm";

const LINK_COLUMNS = [
  {
    title: "Boutique",
    links: [
      { to: "/boutique", label: "Tous les produits" },
      { to: "/notre-histoire", label: "Notre histoire" },
      { to: "/compte", label: "Mon compte" },
      { to: "/compte/favoris", label: "Mes favoris" },
    ],
  },
  {
    title: "Infos",
    links: [
      { to: "/livraison-retours", label: "Livraison & retours" },
      { to: "/cgv", label: "Conditions générales de vente" },
      { to: "/mentions-legales", label: "Mentions légales" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/10 bg-cream-dark">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.4fr]">
        <div className="max-w-sm">
          <Link to="/" className="font-display text-xl text-ink">
            Bois &amp; Merveilles
          </Link>
          <p className="mt-3 text-sm text-ink-light">
            Des jouets simples et intemporels en bois, pensés pour nourrir la créativité, la confiance et
            l'imagination des tout-petits.
          </p>
          <p className="mt-3 text-sm text-ink-light">contact@boisetmerveilles.fr</p>
        </div>
        {LINK_COLUMNS.map((column) => (
          <div key={column.title} className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-ink">{column.title}</span>
            {column.links.map((link) => (
              <Link key={link.to} to={link.to} className="text-ink-light hover:text-ink">
                {link.label}
              </Link>
            ))}
          </div>
        ))}
        <div className="flex flex-col gap-3 text-sm">
          <span className="font-semibold text-ink">Newsletter</span>
          <p className="text-ink-light">Nouveautés, idées de jeu et -10 % sur votre première commande.</p>
          <NewsletterForm />
        </div>
      </div>
      <div className="border-t border-ink/10 px-6 py-4 text-center text-xs text-ink-light">
        © {new Date().getFullYear()} Bois &amp; Merveilles — Projet de portfolio, site de démonstration.
      </div>
    </footer>
  );
}
