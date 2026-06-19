import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { schemas } from "../validations/schemas.js";

const router = Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Créer un compte utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [pseudo, email, password, passwordConfirm]
 *             properties:
 *               pseudo: { type: string, example: alice }
 *               email: { type: string, example: alice@myrecipes.com }
 *               password: { type: string, example: MonMotDePasse123! }
 *               passwordConfirm: { type: string, example: MonMotDePasse123! }
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation échouée
 *       409:
 *         description: Email déjà utilisé
 */
router.post("/auth/signup", validate(schemas.signUp), authController.signUp);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Se connecter et obtenir un token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: alice@myrecipes.com }
 *               password: { type: string, example: MonMotDePasse123! }
 *     responses:
 *       200:
 *         description: Connexion réussie, retourne un JWT
 *       400:
 *         description: Validation échouée
 *       401:
 *         description: Identifiants incorrects
 */
router.post("/auth/login", validate(schemas.signIn), authController.signIn);

export { router as authRouter };
