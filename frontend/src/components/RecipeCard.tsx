import { Link } from "react-router-dom";
import type { RecipeSummary } from "../@types/recipe";
import { useFavorites } from "../context/FavoritesContext";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useAuth } from "../context/AuthContext";

interface RecipeCardProps {
  recipe: RecipeSummary;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { isLoggedIn } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();

  const favorite = isFavorite(recipe.id);

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <img
          src={recipe.thumbnail}
          alt={recipe.name}
          className="w-full h-full object-cover"
        />
        {isLoggedIn && (
          <button
            onClick={() => toggleFavorite(recipe.id, recipe.name, recipe.thumbnail)}
            className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-md transition-all hover:scale-110"
            aria-label={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <span className="text-2xl">{favorite ? "❤️" : "🤍"}</span>
          </button>
        )}
      </div>

      <CardContent className="p-4 flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
          {recipe.name}
        </h3>
        <Button asChild variant="default" className="w-full">
          <Link to={`/recette/${recipe.id}`}>Voir la recette</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
