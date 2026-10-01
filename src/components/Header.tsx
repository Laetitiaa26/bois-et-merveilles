import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { CartDrawer } from "./CartDrawer";

const NAV_LINKS = [
  { to: "/", label: "Accueil" },
  { to: "/boutique", label: "Boutique" },
  { to: "/notre-histoire", label: "Notre histoire" },
];

export function Header() {
  const { totalQuantity } = useCart();
  const { user } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const accountLink = { to: user ? "/compte" : "/connexion", label: user ? user.name || "Mon compte" : "Connexion" };
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition ${isActive ? "text-ink" : "text-ink-light hover:text-ink"}`;

  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-cream/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link to="/" onClick={() => setMenuOpen(false)} className="font-display text-xl tracking-tight text-ink">
          Bois <span className="text-terracotta">&amp;</span> Merveilles
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === "/"} className={navLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          {user?.role === "ADMIN" && (
            <Link to="/admin" className="hidden text-sm font-medium text-terracotta hover:text-ink md:block">
              Admin
            </Link>
          )}
          <Link to={accountLink.to} className="hidden text-sm font-medium text-ink-light hover:text-ink md:block">
            {accountLink.label}
          </Link>
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-ink/5 text-ink hover:bg-ink/10"
            aria-label="Ouvrir le panier"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 7h16l-1.5 11.5a2 2 0 0 1-2 1.5H7.5a2 2 0 0 1-2-1.5L4 7z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 7a4 4 0 0 1 8 0" strokeLinecap="round" />
            </svg>
            {totalQuantity > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-[11px] font-semibold text-cream">
                {totalQuantity}
              </span>
            )}
          </button>
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/5 text-ink hover:bg-ink/10 md:hidden"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="menu-mobile" className="border-t border-ink/10 px-6 pb-4 md:hidden">
          <ul className="flex flex-col">
            {[...NAV_LINKS, ...(user?.role === "ADMIN" ? [{ to: "/admin", label: "Admin" }] : []), accountLink].map(
              (link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === "/"}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `block py-3 text-base font-medium ${isActive ? "text-ink" : "text-ink-light hover:text-ink"}`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ),
            )}
          </ul>
        </nav>
      )}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
