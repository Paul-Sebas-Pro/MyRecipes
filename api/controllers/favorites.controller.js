import { Favorite } from "../models/index.js";
import { StatusCodes } from "http-status-codes";

export const favoritesController = {
  async list(req, res) {
    try {
      const favorites = await Favorite.findAll({ where: { user_id: req.userId } });
      res.json(favorites);
    } catch (error) {
      console.error("Erreur liste favoris :", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Erreur lors de la récupération des favoris" });
    }
  },

  async add(req, res) {
    try {
      const { recipe_id, recipe_name, recipe_thumb } = req.body;

      const [favorite, created] = await Favorite.findOrCreate({
        where: { user_id: req.userId, recipe_id },
        defaults: { recipe_name, recipe_thumb: recipe_thumb || null },
      });

      res.status(created ? StatusCodes.CREATED : StatusCodes.OK).json(favorite);
    } catch (error) {
      console.error("Erreur ajout favori :", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Erreur lors de l'ajout du favori" });
    }
  },

  async remove(req, res) {
    try {
      const count = await Favorite.destroy({
        where: { user_id: req.userId, recipe_id: req.params.recipeId },
      });

      if (!count) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "Favori non trouvé" });
      }

      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      console.error("Erreur suppression favori :", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Erreur lors de la suppression du favori" });
    }
  },
};
