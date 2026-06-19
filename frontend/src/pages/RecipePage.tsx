import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Recipe } from "../@types/recipe";
import { getRecipeById } from "../services/api";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";

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
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-96 w-full rounded-lg" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recette non trouvée</h2>
        <Button asChild variant="outline">
          <Link to="/">← Retour aux recettes</Link>
        </Button>
      </div>
    );
  }

  const favorite = isFavorite(recipe.id);

  return (
    <div className="max-w-4xl mx-auto">
      <Button asChild variant="outline" className="mb-6">
        <Link to="/">← Retour aux recettes</Link>
      </Button>

      <div className="relative h-96 rounded-lg overflow-hidden mb-8">
        <img src={recipe.thumbnail} alt={recipe.name} className="w-full h-full object-cover" />
        {isLoggedIn && (
          <button
            onClick={() => toggleFavorite(recipe.id, recipe.name, recipe.thumbnail)}
            className="absolute top-4 right-4 w-14 h-14 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
            aria-label={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <span className="text-3xl">{favorite ? "❤️" : "🤍"}</span>
          </button>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-6">
          <h1 className="text-4xl font-bold text-white">{recipe.name}</h1>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {recipe.category && <Badge variant="secondary">{recipe.category}</Badge>}
        {recipe.area && <Badge variant="outline">{recipe.area}</Badge>}
        {recipe.tags.map((tag) => (
          <Badge key={tag} variant="outline">{tag}</Badge>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-neutral-200 shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Ingrédients</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex justify-between pb-2 border-b border-gray-100 text-sm">
                <span className="font-medium text-gray-800">{ing.name}</span>
                <span className="text-gray-500">{ing.measure}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Instructions</h2>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
            {recipe.instructions}
          </p>
          {recipe.youtube && (
            <a
              href={recipe.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-sm text-red-600 hover:underline"
            >
              ▶ Voir la vidéo YouTube
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
