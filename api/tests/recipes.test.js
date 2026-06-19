import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { app } from "../app.js";

// Repas complet avec tous les champs TheMealDB
const MOCK_MEAL = {
  idMeal: "52772",
  strMeal: "Teriyaki Chicken Casserole",
  strCategory: "Chicken",
  strArea: "Japanese",
  strInstructions: "Cook the chicken...",
  strMealThumb: "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
  strTags: "Meat,Casserole",
  strYoutube: "",
  strIngredient1: "soy sauce",
  strMeasure1: "3/4 cup",
  strIngredient2: "water",
  strMeasure2: "1/2 cup",
};
// Remplir les slots vides (3 à 20)
for (let i = 3; i <= 20; i++) {
  MOCK_MEAL[`strIngredient${i}`] = "";
  MOCK_MEAL[`strMeasure${i}`] = "";
}

const MOCK_SUMMARY = {
  idMeal: "52772",
  strMeal: "Teriyaki Chicken Casserole",
  strMealThumb: "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
};

const MOCK_CATEGORY = {
  idCategory: "1",
  strCategory: "Beef",
  strCategoryThumb: "https://www.themealdb.com/images/category/beef.png",
  strCategoryDescription: "Beef is the culinary name for meat from cattle.",
};

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("GET /api/recipes", () => {
  it("retourne une liste de recettes normalisée", async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ meals: [MOCK_SUMMARY] }),
    });

    const res = await request(app).get("/api/recipes");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toMatchObject({
      id: "52772",
      name: "Teriyaki Chicken Casserole",
    });
  });

  it("retourne [] si TheMealDB renvoie meals: null", async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ meals: null }),
    });

    const res = await request(app).get("/api/recipes");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe("GET /api/recipes/categories", () => {
  it("retourne les catégories normalisées", async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ categories: [MOCK_CATEGORY] }),
    });

    const res = await request(app).get("/api/recipes/categories");

    expect(res.status).toBe(200);
    expect(res.body[0]).toMatchObject({ id: "1", name: "Beef" });
  });
});

describe("GET /api/recipes/:id", () => {
  it("retourne le détail complet d'une recette", async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ meals: [MOCK_MEAL] }),
    });

    const res = await request(app).get("/api/recipes/52772");

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: "52772",
      name: "Teriyaki Chicken Casserole",
      category: "Chicken",
      area: "Japanese",
    });
    expect(Array.isArray(res.body.ingredients)).toBe(true);
    expect(res.body.ingredients.length).toBe(2);
    expect(res.body.ingredients[0]).toMatchObject({ name: "soy sauce", measure: "3/4 cup" });
  });

  it("retourne 404 si la recette n'existe pas", async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ meals: null }),
    });

    const res = await request(app).get("/api/recipes/99999");

    expect(res.status).toBe(404);
  });
});
