import { useEffect, useState } from "react";
import type { Recipe } from "../@types/recipe";

const API_URL = "http://localhost:3000/api";

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/recipes`);

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des recettes");
        }

        const data = await response.json();
        setRecipes(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return { recipes, loading, error };
}
