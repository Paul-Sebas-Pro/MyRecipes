import { mealdbService } from "../services/mealdb.service.js";
import { StatusCodes } from "http-status-codes";

export const recipesController = {
  /**
   * GET /api/recipes
   * Supporte ?q= (search), ?c= (category), ?letter= (first letter, défaut 'c')
   */
  async list(req, res) {
    try {
      const { q, c, letter = "c" } = req.query;
      let recipes;

      if (q) {
        recipes = await mealdbService.search(q);
      } else if (c) {
        recipes = await mealdbService.filterByCategory(c);
      } else {
        recipes = await mealdbService.searchByLetter(letter);
      }

      res.json(recipes);
    } catch (error) {
      console.error("Erreur liste recettes :", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Erreur lors de la récupération des recettes" });
    }
  },

  async search(req, res) {
    try {
      const { q = "" } = req.query;
      const recipes = await mealdbService.search(q);
      res.json(recipes);
    } catch (error) {
      console.error("Erreur recherche :", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Erreur lors de la recherche" });
    }
  },

  async categories(req, res) {
    try {
      const categories = await mealdbService.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Erreur catégories :", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Erreur lors de la récupération des catégories" });
    }
  },

  async getById(req, res) {
    try {
      const recipe = await mealdbService.getById(req.params.id);
      if (!recipe) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "Recette non trouvée" });
      }
      res.json(recipe);
    } catch (error) {
      console.error("Erreur recette par id :", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Erreur lors de la récupération de la recette" });
    }
  },
};
