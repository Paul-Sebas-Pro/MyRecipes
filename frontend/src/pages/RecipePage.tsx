import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Recipe } from "../@types/recipe";
import { getRecipeById } from "../services/api";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { Skeleton } from "../components/ui/skeleton";
import { Heart, Play } from "lucide-react";
import { translateCategory, translateArea } from "../lib/translations";

export default function RecipePage() {
  const { id } = useParams<{ id: string }>();
  const { isLoggedIn } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getRecipeById(id)
      .then(setRecipe)
      .catch(() => setError("Recette introuvable"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-5 w-52" />
        <Skeleton className="h-8 w-80" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="flex gap-6">
          <Skeleton className="w-85 h-70 rounded-xl shrink-0" />
          <Skeleton className="flex-1 h-70 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-[#111827] mb-4">
          Recette non trouvée
        </h2>
        <Link to="/" className="text-[#7c3aed] hover:underline text-sm">
          ← Retour aux recettes
        </Link>
      </div>
    );
  }

  const favorite = isFavorite(recipe.id);

  return (
    <div className="space-y-4.5">
      {/* Fil d'ariane */}
      <div className="flex items-center gap-1.5 text-[13px]">
        <Link
          to="/"
          className="text-[#6b7280] hover:text-[#7c3aed] transition-colors"
        >
          Accueil
        </Link>
        <span className="text-[#6b7280]">›</span>
        <span className="text-[#7c3aed]">{recipe.name}</span>
      </div>

      {/* Titre */}
      <h1 className="text-[28px] font-bold text-[#111827] leading-tight">
        {recipe.name}
      </h1>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {recipe.category && (
          <span className="px-2.5 py-1 rounded-full bg-[#ede9fe] text-[#7c3aed] text-[12px] font-medium">
            {translateCategory(recipe.category)}
          </span>
        )}
        {recipe.area && (
          <span className="px-2.5 py-1 rounded-full bg-[#dbeafe] text-[#1d4ed8] text-[12px] font-medium">
            {translateArea(recipe.area)}
          </span>
        )}
        {recipe.tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 rounded-full bg-[#d1fae5] text-[#065f46] text-[12px] font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Deux colonnes */}
      <div className="flex gap-6">
        {/* Colonne gauche : image + actions */}
        <div className="w-85 shrink-0 flex flex-col gap-3">
          <img
            src={recipe.thumbnail}
            alt={recipe.name}
            className="w-85 h-70 object-cover rounded-xl"
          />
          <div className="flex items-center gap-2.5">
            {isLoggedIn && (
              <button
                type="button"
                onClick={() =>
                  toggleFavorite(recipe.id, recipe.name, recipe.thumbnail)
                }
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-[12px] font-medium transition-colors cursor-pointer ${
                  favorite
                    ? "bg-[#fff5f5] border-[#fecaca] text-[#ef4444] hover:bg-red-50"
                    : "bg-white border-[#e5e7eb] text-[#6b7280] hover:bg-gray-50"
                }`}
              >
                <Heart
                  size={15}
                  className={
                    favorite
                      ? "fill-[#ef4444] text-[#ef4444]"
                      : "text-[#6b7280]"
                  }
                />
                {favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              </button>
            )}
            {recipe.youtube && (
              <a
                href={recipe.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#ef4444] text-white rounded-lg text-[12px] font-medium hover:bg-red-600 transition-colors"
              >
                <Play size={14} />
                YouTube
              </a>
            )}
          </div>
        </div>

        {/* Colonne droite : ingrédients */}
        <div className="flex-1 flex flex-col gap-2.5 min-w-0">
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-bold text-[#111827]">
              Ingrédients
            </h2>
            <span className="text-[13px] text-[#6b7280]">
              {recipe.ingredients.length} ingrédients
            </span>
          </div>
          <div className="bg-white rounded-[10px] border border-[#e5e7eb] overflow-hidden">
            {recipe.ingredients.map((ing, i) => (
              <div
                key={i}
                className={`flex items-center justify-between px-4 h-11 text-[14px] ${
                  i < recipe.ingredients.length - 1
                    ? "border-b border-[#e5e7eb]"
                    : ""
                }`}
              >
                <span className="font-medium text-[#111827]">{ing.name}</span>
                <span className="text-[#6b7280]">{ing.measure}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions */}
      {recipe.instructions && (
        <div className="bg-white rounded-[10px] border border-[#e5e7eb] p-5">
          <h2 className="text-[17px] font-bold text-[#111827] mb-3">
            Préparation
          </h2>
          <p className="text-[#374151] text-[14px] leading-relaxed whitespace-pre-line">
            {recipe.instructions}
          </p>
        </div>
      )}
    </div>
  );
}
