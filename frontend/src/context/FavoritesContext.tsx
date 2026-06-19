import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { Favorite } from "../@types/recipe";
import { getFavorites, addFavorite, removeFavorite } from "../services/api";
import { useAuth } from "./AuthContext";

interface FavoritesContextType {
  favorites: Favorite[];
  favoriteIds: string[];
  favoriteCount: number;
  loading: boolean;
  toggleFavorite: (recipeId: string, recipeName: string, recipeThumb: string) => Promise<void>;
  isFavorite: (recipeId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoriteProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFavorites = useCallback(async () => {
    if (!token) {
      setFavorites([]);
      return;
    }
    setLoading(true);
    try {
      const data = await getFavorites(token);
      setFavorites(data);
    } catch {
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  async function toggleFavorite(
    recipeId: string,
    recipeName: string,
    recipeThumb: string
  ): Promise<void> {
    if (!token) return;

    const already = favorites.some((f) => f.recipe_id === recipeId);
    if (already) {
      await removeFavorite(token, recipeId);
      setFavorites((prev) => prev.filter((f) => f.recipe_id !== recipeId));
    } else {
      const newFav = await addFavorite(token, recipeId, recipeName, recipeThumb);
      setFavorites((prev) => [...prev, newFav]);
    }
  }

  function isFavorite(recipeId: string): boolean {
    return favorites.some((f) => f.recipe_id === recipeId);
  }

  const favoriteIds = favorites.map((f) => f.recipe_id);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteIds,
        favoriteCount: favorites.length,
        loading,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites doit être utilisé dans un FavoriteProvider");
  }
  return context;
}
