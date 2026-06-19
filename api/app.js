import "dotenv/config.js";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpecification } from "./swagger.config.js";
import { apiRouter } from "./routers/index.router.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecification));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Page d'accueil de l'API MyRecipes
 *     responses:
 *       200:
 *         description: Message de bienvenue
 */
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue dans l'API MyRecipes !" });
});

app.use("/api", apiRouter);

export { app };
