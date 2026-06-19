import { Link } from "react-router-dom";
import type { RecipeSummary } from "../@types/recipe";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { Heart } from "lucide-react";

interface RecipeCardProps {
  recipe: RecipeSummary;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { isLoggedIn } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(recipe.id);

  return (
    <div className="bg-white rounded-[10px] border border-[#e5e7eb] overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/recette/${recipe.id}`}>
        <div className="h-35 overflow-hidden">
          <img
            src={recipe.thumbnail}
            alt={recipe.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      <div className="p-3 flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <Link
            to={`/recette/${recipe.id}`}
            className="text-[14px] font-semibold text-[#111827] leading-tight line-clamp-1 hover:text-[#7c3aed] transition-colors"
          >
            {recipe.name}
          </Link>
          {isLoggedIn && (
            <button
              type="button"
              onClick={() =>
                toggleFavorite(recipe.id, recipe.name, recipe.thumbnail)
              }
              aria-label={
                favorite ? "Retirer des favoris" : "Ajouter aux favoris"
              }
              className="shrink-0 cursor-pointer p-0.5 hover:scale-110 transition-transform"
            >
              <Heart
                size={18}
                className={
                  favorite
                    ? "fill-[#ef4444] text-[#ef4444]"
                    : "text-[#d1d5db] hover:text-[#ef4444] transition-colors"
                }
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
