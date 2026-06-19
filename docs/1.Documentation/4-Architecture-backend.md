# Documentation Technique — Projet MyRecipes

## 4. Architecture Backend

### 4.1 Structure des fichiers

```plaintext
api/
├── server.js                    # Démarrage du serveur (port 3000)
├── app.js                       # Configuration Express + middlewares + routes
├── swagger.config.js            # Spécification OpenAPI
├── package.json                 # ESM ("type": "module"), scripts, dépendances
├── vitest.config.js             # Config tests (globalSetup, env, timeout)
├── eslint.config.js             # ESLint flat config ESM
│
├── controllers/
│   ├── auth.controller.js       # signUp, signIn
│   ├── recipes.controller.js    # list, search, categories, getById
│   └── favorites.controller.js  # list, add, remove
│
├── routers/
│   ├── index.router.js          # Agrégation auth + recipes + favorites
│   ├── auth.router.js           # POST /signup, POST /login
│   ├── recipes.router.js        # GET /recipes, /search, /categories, /:id
│   └── favorites.router.js      # GET/POST/DELETE /favorites (JWT requis)
│
├── middlewares/
│   ├── auth.middleware.js       # Vérification JWT → req.userId
│   └── validation.middleware.js # validate(schema) → Joi → 400 si invalide
│
├── models/
│   ├── sequelize.client.js      # Connexion PostgreSQL (DATABASE_URL)
│   ├── user.model.js            # User : pseudo, email (unique), password
│   ├── favorite.model.js        # Favorite : recipe_id, recipe_name, recipe_thumb, user_id
│   └── index.js                 # Associations + export sequelize, User, Favorite
│
├── services/
│   └── mealdb.service.js        # Proxy TheMealDB + normalisation
│
├── validations/
│   └── schemas.js               # Joi schemas : signUp, signIn, addFavorite
│
├── migrations/
│   ├── createTables.js          # Création des tables (sequelize.sync)
│   └── seedUsers.js             # Données de test
│
└── tests/
    ├── globalSetup.js           # Setup BDD test (drop + sync + close)
    ├── auth.test.js             # 7 tests auth
    ├── recipes.test.js          # 5 tests recettes (fetch mocké)
    └── favorites.test.js        # 8 tests favoris
```

### 4.2 Point d'entrée

**`server.js`** — démarre le serveur HTTP :

```javascript
import { app } from "./app.js";
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Serveur démarré sur le port ${port}`));
```

**`app.js`** — configure Express :

```javascript
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
app.use("/api", apiRouter);
export { app };
```

### 4.3 Service TheMealDB (`services/mealdb.service.js`)

Ce service est le cœur du proxy vers TheMealDB. Il normalise les données de l'API externe vers un format interne cohérent.

**Normalisation `normalizeMeal(meal)` :**

```javascript
// TheMealDB retourne strIngredient1…strIngredient20 + strMeasure1…20
// → normalisation en tableau filtré
const ingredients = Array.from({ length: 20 }, (_, i) => ({
  name: meal[`strIngredient${i + 1}`],
  measure: meal[`strMeasure${i + 1}`],
})).filter(ing => ing.name && ing.name.trim());

return {
  id: meal.idMeal,
  name: meal.strMeal,
  category: meal.strCategory,
  area: meal.strArea,
  instructions: meal.strInstructions,
  thumbnail: meal.strMealThumb,
  tags: meal.strTags ? meal.strTags.split(",").map(t => t.trim()) : [],
  youtube: meal.strYoutube,
  ingredients,
};
```

**`normalizeSummary(meal)` :**

```javascript
return { id: meal.idMeal, name: meal.strMeal, thumbnail: meal.strMealThumb };
```

**Méthodes exposées :**

| Méthode                  | URL TheMealDB    | Rôle                    |
| ------------------------ | ---------------- | ----------------------- |
| `search(query)`          | `search.php?s=`  | Recherche par nom       |
| `searchByLetter(letter)` | `search.php?f=`  | Recherche par lettre    |
| `getCategories()`        | `categories.php` | Liste des catégories    |
| `filterByCategory(cat)`  | `filter.php?c=`  | Recettes par catégorie  |
| `getById(id)`            | `lookup.php?i=`  | Recette complète par ID |
| `getRandom()`            | `random.php`     | Recette aléatoire       |

### 4.4 Modèles de données (Sequelize)

#### User

```javascript
// models/user.model.js
{ pseudo: DataTypes.STRING(50),
  email: { type: DataTypes.STRING(255), unique: true, validate: { isEmail: true } },
  password: DataTypes.STRING(255) }
```

#### Favorite

```javascript
// models/favorite.model.js
{ recipe_id: DataTypes.STRING(50),       // idMeal TheMealDB
  recipe_name: DataTypes.STRING(255),
  recipe_thumb: DataTypes.TEXT           // nullable
  // user_id → FK vers User (via association) }
```

**Associations (`models/index.js`) :**

```javascript
User.hasMany(Favorite, { foreignKey: "user_id" });
Favorite.belongsTo(User, { foreignKey: "user_id" });
```

### 4.5 Routes API

#### Authentification (`/api/auth`)

| Méthode | Route              | Corps                                        | Réponse                                    |
| ------- | ------------------ | -------------------------------------------- | ------------------------------------------ |
| POST    | `/api/auth/signup` | `{pseudo, email, password, passwordConfirm}` | `{id, pseudo, email}` (201)                |
| POST    | `/api/auth/login`  | `{email, password}`                          | `{token, user: {id, pseudo, email}}` (200) |

**Validation Joi pour signup :**

```javascript
pseudo: Joi.string().min(2).max(50).required(),
email: Joi.string().email().required(),
password: Joi.string().min(8).required(),
passwordConfirm: Joi.valid(Joi.ref("password")).required()
```

**Hachage Argon2 :**

```javascript
// Inscription
const hashedPassword = await argon2.hash(password);

// Connexion
const isValid = await argon2.verify(user.password, password);
```

#### Recettes (`/api/recipes`)

> Toutes les données viennent de TheMealDB — aucun stockage en base.

| Méthode | Route                     | Paramètres             | Réponse           |
| ------- | ------------------------- | ---------------------- | ----------------- |
| GET     | `/api/recipes`            | `?q=` `?c=` `?letter=` | `RecipeSummary[]` |
| GET     | `/api/recipes/search`     | `?q=texte`             | `RecipeSummary[]` |
| GET     | `/api/recipes/categories` | —                      | `Category[]`      |
| GET     | `/api/recipes/:id`        | id TheMealDB           | `Recipe` complet  |

> **Important :** les routes `/search` et `/categories` sont déclarées **avant** `/:id` dans le router pour éviter les conflits de pattern Express.

#### Favoris (`/api/favorites`) — JWT requis

| Méthode | Route                      | Corps                                     | Réponse                              |
| ------- | -------------------------- | ----------------------------------------- | ------------------------------------ |
| GET     | `/api/favorites`           | —                                         | `Favorite[]` (200)                   |
| POST    | `/api/favorites`           | `{recipe_id, recipe_name, recipe_thumb?}` | `Favorite` (201 créé / 200 existant) |
| DELETE  | `/api/favorites/:recipeId` | —                                         | vide (204) / erreur (404)            |

### 4.6 Middlewares

**`auth.middleware.js`** — vérifie le JWT :

```javascript
export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token manquant" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token invalide" });
  }
};
```

**`validation.middleware.js`** — valide le body via Joi :

```javascript
export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};
```

### 4.7 Documentation Swagger

Accessible sur `http://localhost:3000/api-docs`.

Générée via `swagger-jsdoc` à partir des commentaires JSDoc dans les routers.

### 4.8 Tests (`api/tests/`)

**Configuration (`vitest.config.js`) :**

```javascript
export default defineConfig({ test: {
  globalSetup: ["./tests/globalSetup.js"],
  env: {
    DATABASE_URL: "postgres://myrecipes:myrecipes@localhost:5433/myrecipes_test",
    JWT_SECRET: "test_jwt_secret_min_32_chars_here_ok",
    NODE_ENV: "test"
  },
  testTimeout: 30000,
  sequence: { concurrent: false }
}});
```

**`globalSetup.js`** — recrée les tables avant chaque run :

```javascript
export async function setup() {
  // Importe les modèles → connexion → drop + sync → fermeture
  await sequelize.drop();
  await sequelize.sync();
  await sequelize.close();
}
```

**Stratégie de mock (recettes) :**

Les recettes viennent de TheMealDB via `fetch()`. En tests, `fetch` est remplacé par un mock Vitest :

```javascript
beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});
afterEach(() => {
  vi.unstubAllGlobals();
});
```

**Résultats :** 20/20 tests (7 auth + 5 recettes + 8 favoris)

---
