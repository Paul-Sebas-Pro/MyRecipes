import { Router } from "express";
import { authRouter } from "./auth.router.js";
import { recipesRouter } from "./recipes.router.js";
import { favoritesRouter } from "./favorites.router.js";

const router = Router();

router.use(authRouter);
router.use(recipesRouter);
router.use(favoritesRouter);

export { router as apiRouter };
