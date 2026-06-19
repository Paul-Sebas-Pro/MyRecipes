import type { Recipe, RecipeSummary, Category, Favorite } from "../@types/recipe";

const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:3000") + "/api";

function getAuthHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// Auth
export async function signUp(
  pseudo: string,
  email: string,
  password: string,
  passwordConfirm: string
) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pseudo, email, password, passwordConfirm }),
  });
  return handleResponse<{ id: number; pseudo: string; email: string }>(res);
}

export async function signIn(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<{ token: string; user: { id: number; pseudo: string; email: string } }>(res);
}

// Recipes
export async function getRecipes(params?: {
  q?: string;
  c?: string;
  letter?: string;
}): Promise<RecipeSummary[]> {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  const res = await fetch(`${API_URL}/recipes${query ? `?${query}` : ""}`);
  return handleResponse<RecipeSummary[]>(res);
}

export async function searchRecipes(q: string): Promise<RecipeSummary[]> {
  const res = await fetch(`${API_URL}/recipes/search?q=${encodeURIComponent(q)}`);
  return handleResponse<RecipeSummary[]>(res);
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/recipes/categories`);
  return handleResponse<Category[]>(res);
}

export async function getRecipeById(id: string): Promise<Recipe> {
  const res = await fetch(`${API_URL}/recipes/${id}`);
  return handleResponse<Recipe>(res);
}

// Favorites
export async function getFavorites(token: string): Promise<Favorite[]> {
  const res = await fetch(`${API_URL}/favorites`, {
    headers: getAuthHeaders(token),
  });
  return handleResponse<Favorite[]>(res);
}

export async function addFavorite(
  token: string,
  recipe_id: string,
  recipe_name: string,
  recipe_thumb: string
): Promise<Favorite> {
  const res = await fetch(`${API_URL}/favorites`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ recipe_id, recipe_name, recipe_thumb }),
  });
  return handleResponse<Favorite>(res);
}

export async function removeFavorite(token: string, recipeId: string): Promise<void> {
  const res = await fetch(`${API_URL}/favorites/${recipeId}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
  return handleResponse<void>(res);
}
