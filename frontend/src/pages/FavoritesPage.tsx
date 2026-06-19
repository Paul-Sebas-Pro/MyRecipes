import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { Heart, X } from "lucide-react";
import { Button } from "../components/ui/button";

export default function FavoritesPage() {
  const { isLoggedIn } = useAuth();
  const { favorites, loading, toggleFavorite } = useFavorites();

  if (!isLoggedIn) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-[#111827] mb-4">
          Connectez-vous pour voir vos favoris
        </h2>
        <Button asChild>
          <Link to="/login">Se connecter</Link>
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <p className="text-center py-8 text-[#6b7280]">
        Chargement des favoris...
      </p>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[22px] font-bold text-[#111827]">
          Mes favoris ({favorites.length})
        </h2>
        <Link
          to="/"
          className="text-[13px] text-[#6b7280] hover:text-[#7c3aed] transition-colors"
        >
          ← Toutes les recettes
        </Link>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[#6b7280] text-lg mb-4">
            Aucun favori pour l'instant.
          </p>
          <Button asChild>
            <Link to="/">Découvrir les recettes</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((fav) => (
            <div
              key={fav.recipe_id}
              className="bg-white rounded-[10px] border border-[#e5e7eb] overflow-hidden relative hover:shadow-lg transition-shadow"
            >
              {/* Bouton retrait */}
              <button
                type="button"
                onClick={() =>
                  toggleFavorite(
                    fav.recipe_id,
                    fav.recipe_name,
                    fav.recipe_thumb ?? "",
                  )
                }
                className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow transition-colors cursor-pointer z-10"
                aria-label="Retirer des favoris"
              >
                <X size={14} className="text-[#6b7280]" />
              </button>

              <Link to={`/recette/${fav.recipe_id}`}>
                {fav.recipe_thumb ? (
                  <img
                    src={fav.recipe_thumb}
                    alt={fav.recipe_name}
                    className="w-full h-35 object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-35 bg-[#ede9fe]" />
                )}
              </Link>

              <div className="p-3 flex items-center justify-between gap-2">
                <Link
                  to={`/recette/${fav.recipe_id}`}
                  className="text-[14px] font-semibold text-[#111827] line-clamp-1 hover:text-[#7c3aed] transition-colors"
                >
                  {fav.recipe_name}
                </Link>
                <span className="shrink-0 flex items-center gap-1 px-2 py-0.5 bg-[#fee2e2] rounded-full text-[11px] font-medium text-[#ef4444]">
                  <Heart size={10} className="fill-[#ef4444]" />
                  Favori
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
