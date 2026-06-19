export interface Ingredient {
  name: string;
  measure: string;
}

export interface RecipeSummary {
  id: string;
  name: string;
  thumbnail: string;
}

export interface Recipe {
  id: string;
  name: string;
  category: string | null;
  area: string | null;
  instructions: string | null;
  thumbnail: string;
  tags: string[];
  youtube: string | null;
  ingredients: Ingredient[];
}

export interface Category {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
}

export interface Favorite {
  id: number;
  recipe_id: string;
  recipe_name: string;
  recipe_thumb: string | null;
  user_id: number;
}

export interface AuthUser {
  id: number;
  pseudo: string;
  email: string;
}
