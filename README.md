# MyRecipes

Application de recettes full-stack — proxy TheMealDB, authentification JWT, favoris PostgreSQL.

## Stack technique

| Couche     | Technologie                            |
| ---------- | -------------------------------------- |
| Runtime    | Node.js 22 (ESM)                       |
| Backend    | Express 5, pattern MVC                 |
| ORM        | Sequelize 6 + PostgreSQL 17            |
| Auth       | JWT (jsonwebtoken) + Argon2            |
| Validation | Joi                                    |
| API ext.   | TheMealDB (gratuite, sans clé)         |
| Docs API   | Swagger / OpenAPI 3.0 (swagger-jsdoc)  |
| Tests      | Vitest 4 + Supertest (20 tests)        |
| Lint       | ESLint flat config ESM                 |
| Infra      | Docker Compose (5 services)            |
| CI/CD      | GitHub Actions                         |
| Frontend   | React 19 + TypeScript + Vite 7         |
| Style      | Tailwind CSS v4 + shadcn/ui (manuel)   |
| Router     | React Router v7                        |
| Icons      | lucide-react                           |

## Architecture

```
MyRecipes/
├── .env.example                  # Variables d'environnement (copier → .env)
├── docker-compose.yml            # 5 services : postgres, postgres_test, adminer, api, frontend
├── api/                          # Express 5, ESM, MVC
│   ├── app.js / server.js
│   ├── controllers/              # auth, recipes, favorites
│   ├── middlewares/              # JWT, validation Joi
│   ├── models/                   # User, Favorite (Sequelize)
│   ├── routers/                  # auth, recipes, favorites
│   ├── services/
│   │   └── mealdb.service.js     # Proxy TheMealDB + normalisation
│   ├── validations/              # Schémas Joi
│   ├── migrations/               # createTables.js, seedUsers.js
│   └── tests/                   # 20 tests (auth 7 + recipes 5 + favorites 8)
├── frontend/                     # React 19 + Vite + Tailwind v4
│   └── src/
│       ├── context/              # AuthContext, RecipesContext, FavoritesContext
│       ├── services/api.ts       # Fetch wrapper typé (VITE_API_URL)
│       ├── lib/translations.ts   # TheMealDB → français (catégories + zones)
│       ├── components/           # Header, Sidebar, RecipeCard, shadcn/ui
│       └── pages/                # Home, RecipePage, LoginPage, FavoritesPage
├── docs/
│   ├── 0.Maquettes/myrecipes.pen # Maquettes Pencil (4 écrans)
│   └── 1.Documentation/          # Documentation technique (11 fichiers)
└── .github/workflows/ci.yml
```

## Endpoints API

| Méthode | Route                          | Auth | Description                      |
| ------- | ------------------------------ | ---- | -------------------------------- |
| GET     | `/api/recipes`                 | —    | Liste recettes (proxy TheMealDB) |
| GET     | `/api/recipes/search?q={name}` | —    | Recherche par nom                |
| GET     | `/api/recipes/categories`      | —    | Liste des catégories             |
| GET     | `/api/recipes/:id`             | —    | Détail d'une recette             |
| GET     | `/api/favorites`               | JWT  | Favoris de l'utilisateur         |
| POST    | `/api/favorites`               | JWT  | Ajouter un favori                |
| DELETE  | `/api/favorites/:recipeId`     | JWT  | Retirer un favori                |
| POST    | `/api/auth/signup`             | —    | Créer un compte                  |
| POST    | `/api/auth/login`              | —    | Se connecter (retourne un JWT)   |

## API externe — TheMealDB

Base URL : `https://www.themealdb.com/api/json/v1/1/` — gratuite, sans clé.

Le service `mealdb.service.js` normalise les réponses : `strMeal → name`, `idMeal → id`, `strIngredient1…20 → ingredients[{name, measure}]`.  
Le frontend traduit catégories et zones en français via `lib/translations.ts`.

## Lancer le projet

### Stack complète (Docker Compose)

```bash
cp .env.example .env        # Éditer DB_PASSWORD et JWT_SECRET
docker compose up --build
```

| Service  | URL                                        |
| -------- | ------------------------------------------ |
| Frontend | <http://localhost>                         |
| API      | <http://localhost:3000>                    |
| Swagger  | <http://localhost:3000/api-docs>           |
| Adminer  | <http://localhost:8080>                    |

### Dev local

```bash
# 1. Démarrer l'infra (BDD uniquement)
docker compose up postgres postgres_test adminer

# 2. API
cd api
npm install
# Créer api/.env avec DATABASE_URL, JWT_SECRET, PORT=3000
node migrations/createTables.js
npm run dev                 # nodemon → http://localhost:3000

# 3. Frontend
cd frontend
npm install
npm run dev                 # Vite → http://localhost:5173
```

## Tests

```bash
# Prérequis : postgres_test actif sur :5433
docker compose up postgres_test

cd api
npm test                    # 20 tests (vitest run)
npm run lint                # ESLint flat config
```

Résultats : 20/20 — auth (7), recipes (5), favorites (8).

## CI/CD

GitHub Actions déclenché sur push `main` et PR vers `main`.

Pipeline :

1. Service PostgreSQL sur :5433
2. `npm install`
3. `npm run lint`
4. `npm test`

## Variables d'environnement

Copier `.env.example` → `.env` à la racine :

```env
DB_USER=myrecipes
DB_PASSWORD=myrecipes          # Changer en production
DB_NAME=myrecipes
JWT_SECRET=change_this_to_a_long_random_secret_minimum_32_chars
API_PORT=3000
FRONTEND_PORT=80
VITE_API_URL=http://localhost:3000
```

> `JWT_SECRET` : minimum 32 caractères. Générer avec `openssl rand -base64 48`.
