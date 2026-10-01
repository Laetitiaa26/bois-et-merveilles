import { useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

export function FavoriteButton({ productId, className = "" }: { productId: string; className?: string }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const active = isFavorite(productId);

  return (
    <button
      type="button"
      onClick={async (e) => {
        e.preventDefault();
        const done = await toggleFavorite(productId);
        if (!done) navigate("/connexion");
      }}
      aria-label={active ? "Retirer des favoris" : "Ajouter aux favoris"}
      aria-pressed={active}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-cream/90 shadow-sm transition hover:scale-110 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-5 w-5 ${active ? "fill-terracotta text-terracotta" : "fill-none text-ink"}`}
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
