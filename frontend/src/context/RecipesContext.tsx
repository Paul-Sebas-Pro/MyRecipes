import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { RecipeSummary } from "../@types/recipe";
import { getRecipes } from "../services/api";

interface RecipesContextType {
  recipes: RecipeSummary[];
  loading: boolean;
  error: string | null;
  getRecipeById: (id: string) => RecipeSummary | undefined;
}

const RecipesContext = createContext<RecipesContextType | undefined>(undefined);

export function RecipesProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRecipes()
      .then((data) => {
        setRecipes(data);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      })
      .finally(() => setLoading(false));
  }, []);

  function getRecipeById(id: string): RecipeSummary | undefined {
    return recipes.find((r) => r.id === id);
  }

  return (
    <RecipesContext.Provider value={{ recipes, loading, error, getRecipeById }}>
      {children}
    </RecipesContext.Provider>
  );
}

export function useRecipesContext() {
  const context = useContext(RecipesContext);
  if (!context) {
    throw new Error("useRecipesContext doit être utilisé dans un RecipesProvider");
  }
  return context;
}
