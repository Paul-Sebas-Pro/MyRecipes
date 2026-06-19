import { Router } from "express";
import { favoritesController } from "../controllers/favorites.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { schemas } from "../validations/schemas.js";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Favoris de l'utilisateur connecté
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des favoris
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Favorite'
 *       401:
 *         description: Token manquant ou invalide
 */
router.get("/favorites", favoritesController.list);

/**
 * @swagger
 * /favorites:
 *   post:
 *     summary: Ajouter une recette aux favoris
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [recipe_id, recipe_name]
 *             properties:
 *               recipe_id: { type: string, example: "52772" }
 *               recipe_name: { type: string, example: "Teriyaki Chicken Casserole" }
 *               recipe_thumb: { type: string, example: "https://..." }
 *     responses:
 *       201:
 *         description: Favori ajouté
 *       200:
 *         description: Favori existait déjà
 *       401:
 *         description: Non authentifié
 */
router.post("/favorites", validate(schemas.addFavorite), favoritesController.add);

/**
 * @swagger
 * /favorites/{recipeId}:
 *   delete:
 *     summary: Retirer une recette des favoris
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Favori supprimé
 *       404:
 *         description: Favori non trouvé
 *       401:
 *         description: Non authentifié
 */
router.delete("/favorites/:recipeId", favoritesController.remove);

export { router as favoritesRouter };
