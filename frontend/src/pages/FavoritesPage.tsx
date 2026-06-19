import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function FavoritesPage() {
  const { isLoggedIn } = useAuth();
  const { favorites, loading } = useFavorites();

  if (!isLoggedIn) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Connectez-vous pour voir vos favoris</h2>
        <Button asChild>
          <Link to="/login">Se connecter</Link>
        </Button>
      </div>
    );
  }

  if (loading) {
    return <p className="text-center py-8 text-gray-500">Chargement des favoris...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Mes favoris ({favorites.length})
        </h2>
        <Button asChild variant="outline">
          <Link to="/">← Toutes les recettes</Link>
        </Button>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-4">Aucun favori pour l'instant.</p>
          <Button asChild>
            <Link to="/">Découvrir les recettes</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <Card key={fav.recipe_id} className="overflow-hidden hover:shadow-xl transition-shadow">
              {fav.recipe_thumb && (
                <img
                  src={fav.recipe_thumb}
                  alt={fav.recipe_name}
                  className="w-full h-48 object-cover"
                />
              )}
              <CardContent className="p-4 flex flex-col gap-3">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                  {fav.recipe_name}
                </h3>
                <Button asChild variant="default" className="w-full">
                  <Link to={`/recette/${fav.recipe_id}`}>Voir la recette</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
