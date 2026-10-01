import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../lib/api";
import type { Product } from "../types";
import { useAuth } from "./AuthContext";

interface FavoritesContextValue {
  favoriteIds: Set<string>;
  isFavorite: (productId: string) => boolean;
  // Renvoie false si l'utilisateur doit d'abord se connecter
  toggleFavorite: (productId: string) => Promise<boolean>;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);
const EMPTY = new Set<string>();

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  // Les favoris sont rattachés à l'utilisateur qui les a chargés : à la
  // déconnexion (ou changement de compte) la liste redevient vide d'elle-même.
  const [loaded, setLoaded] = useState<{ userId: string; ids: Set<string> } | null>(null);
  const favoriteIds = user && loaded?.userId === user.id ? loaded.ids : EMPTY;
  const setFavoriteIds = (update: (prev: Set<string>) => Set<string>) =>
    setLoaded((prev) => (prev && user ? { userId: user.id, ids: update(prev.ids) } : prev));

  useEffect(() => {
    if (!user) return;
    api
      .get<{ products: Product[] }>("/favorites")
      .then((res) => setLoaded({ userId: user.id, ids: new Set(res.products.map((product) => product.id)) }))
      .catch((err) => console.error(err));
  }, [user]);

  const toggleFavorite = async (productId: string) => {
    if (!user) return false;
    const wasFavorite = favoriteIds.has(productId);

    // Mise à jour optimiste, annulée si l'API échoue
    const update = (add: boolean) =>
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (add) next.add(productId);
        else next.delete(productId);
        return next;
      });
    update(!wasFavorite);
    try {
      if (wasFavorite) await api.delete(`/favorites/${productId}`);
      else await api.post(`/favorites/${productId}`);
    } catch (err) {
      console.error(err);
      update(wasFavorite);
    }
    return true;
  };

  return (
    <FavoritesContext.Provider
      value={{ favoriteIds, isFavorite: (productId) => favoriteIds.has(productId), toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- hook colocated with its provider by design
export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites doit être utilisé dans un FavoritesProvider");
  return ctx;
}
