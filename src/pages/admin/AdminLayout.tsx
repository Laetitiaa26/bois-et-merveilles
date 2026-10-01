import { Navigate, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const TABS = [
  { to: "/admin", label: "Tableau de bord", end: true },
  { to: "/admin/produits", label: "Produits", end: false },
  { to: "/admin/commandes", label: "Commandes", end: false },
  { to: "/admin/avis", label: "Avis", end: false },
];

export function AdminLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="mx-auto max-w-6xl px-6 py-24 text-center text-ink-light">Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/connexion" replace />;
  }

  if (user.role !== "ADMIN") {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl text-ink">Accès réservé</h1>
        <p className="mt-2 text-ink-light">Cet espace est réservé aux administrateurs de la boutique.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-ink">Administration</h1>
        <nav className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive ? "border-ink bg-ink text-cream" : "border-ink/15 bg-white/60 text-ink hover:border-ink/40"
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <Outlet />
    </div>
  );
}
