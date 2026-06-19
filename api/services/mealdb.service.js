const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

function normalizeMeal(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (name && name.trim()) {
      ingredients.push({ name: name.trim(), measure: (measure || "").trim() });
    }
  }

  return {
    id: meal.idMeal,
    name: meal.strMeal,
    category: meal.strCategory || null,
    area: meal.strArea || null,
    instructions: meal.strInstructions || null,
    thumbnail: meal.strMealThumb,
    tags: meal.strTags
      ? meal.strTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
    youtube: meal.strYoutube || null,
    ingredients,
  };
}

function normalizeSummary(meal) {
  return {
    id: meal.idMeal,
    name: meal.strMeal,
    thumbnail: meal.strMealThumb,
  };
}

export const mealdbService = {
  async search(query) {
    const res = await fetch(
      `${BASE_URL}/search.php?s=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    return (data.meals || []).map(normalizeSummary);
  },

  async searchByLetter(letter = "c") {
    const res = await fetch(`${BASE_URL}/search.php?f=${letter}`);
    const data = await res.json();
    return (data.meals || []).map(normalizeSummary);
  },

  async getCategories() {
    const res = await fetch(`${BASE_URL}/categories.php`);
    const data = await res.json();
    return (data.categories || []).map((cat) => ({
      id: cat.idCategory,
      name: cat.strCategory,
      thumbnail: cat.strCategoryThumb,
      description: cat.strCategoryDescription,
    }));
  },

  async filterByCategory(category) {
    const res = await fetch(
      `${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`
    );
    const data = await res.json();
    return (data.meals || []).map(normalizeSummary);
  },

  async getById(id) {
    const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    const data = await res.json();
    if (!data.meals) return null;
    return normalizeMeal(data.meals[0]);
  },

  async getRandom() {
    const res = await fetch(`${BASE_URL}/random.php`);
    const data = await res.json();
    if (!data.meals) return null;
    return normalizeMeal(data.meals[0]);
  },
};
