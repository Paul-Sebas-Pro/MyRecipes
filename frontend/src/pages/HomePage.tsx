import { useState } from "react";
import RecipeCard from "../components/RecipeCard";
import { useRecipesContext } from "../context/RecipesContext";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function HomePage() {
  const { recipes } = useRecipesContext();
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? recipes.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase())
      )
    : recipes;

  return (
    <div>
      <div className="flex gap-2 mb-8">
        <Input
          placeholder="Rechercher une recette..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        {search && (
          <Button variant="outline" onClick={() => setSearch("")}>
            Effacer
          </Button>
        )}
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {search ? `Résultats pour "${search}" (${filtered.length})` : "Toutes les recettes"}
      </h2>

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-12">Aucune recette trouvée.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
