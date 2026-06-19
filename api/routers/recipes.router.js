import { Router } from "express";
import { recipesController } from "../controllers/recipes.controller.js";

const router = Router();

/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: Liste des recettes (proxy TheMealDB)
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Recherche par nom
 *       - in: query
 *         name: c
 *         schema: { type: string }
 *         description: Filtre par catégorie
 *       - in: query
 *         name: letter
 *         schema: { type: string, default: c }
 *         description: Première lettre (défaut 'c')
 *     responses:
 *       200:
 *         description: Liste de recettes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RecipeSummary'
 */
router.get("/recipes", recipesController.list);

/**
 * @swagger
 * /recipes/search:
 *   get:
 *     summary: Recherche de recettes par nom
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Résultats de la recherche
 */
router.get("/recipes/search", recipesController.search);

/**
 * @swagger
 * /recipes/categories:
 *   get:
 *     summary: Liste des catégories TheMealDB
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: Liste des catégories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get("/recipes/categories", recipesController.categories);

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     summary: Détail d'une recette par son ID TheMealDB
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Détail de la recette
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Recette non trouvée
 */
router.get("/recipes/:id", recipesController.getById);

export { router as recipesRouter };
