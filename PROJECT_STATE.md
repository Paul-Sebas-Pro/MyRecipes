# MyRecipes — État du projet

> Dernière mise à jour : 2026-06-19 — Projet terminé (phases 1-7 + documentation)

## Vision

Application de recettes full-stack orientée portfolio. API REST Express 5 (MVC, ESM) + React 19 frontend. Les recettes sont récupérées depuis TheMealDB (API externe gratuite). Authentification JWT avec favoris persistés en base PostgreSQL.

---

## Stack technique

| Couche      | Technologie                           | Version       |
| ----------- | ------------------------------------- | ------------- |
| Runtime     | Node.js 22 (ESM)                      | 22 LTS        |
| Framework   | Express 5                             | ^5.x          |
| ORM         | Sequelize 6 + PostgreSQL              | ^6.x          |
| Auth        | JWT (jsonwebtoken) + Argon2           | ^9.x / ^0.44  |
| Validation  | Joi                                   | ^17.x         |
| API externe | TheMealDB (gratuite, sans clé)        | v1            |
| Docs        | Swagger / OpenAPI 3.0 (swagger-jsdoc) | ^6.x          |
| Tests       | Vitest 4 + Supertest                  | ^4.x / ^7.x   |
| Lint        | ESLint flat config (ESM)              | ^10.x         |
| Infra       | Docker Compose (5 services)           | —             |
| CI          | GitHub Actions                        | —             |
| Frontend    | React 19 + TypeScript + Vite 7        | ^19.x         |
| Style       | Tailwind CSS v4 + shadcn/ui (manuel)  | ^4.x          |
| Router      | React Router v7                       | ^7.x          |
| Icons       | lucide-react                          | ^1.x          |

---

## Architecture

```
MyRecipes/
├── .env.example
├── .gitignore
├── docker-compose.yml
├── README.md
├── PROJECT_STATE.md
│
├── api/                          # Express 5, ESM, pattern MVC
│   ├── Dockerfile
│   ├── app.js
│   ├── server.js
│   ├── swagger.config.js
│   ├── vitest.config.js
│   ├── eslint.config.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── favorites.controller.js
│   │   └── recipes.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── validation.middleware.js
│   ├── models/
│   │   ├── index.js
│   │   ├── sequelize.client.js
│   │   ├── user.model.js
│   │   └── favorite.model.js
│   ├── routers/
│   │   ├── index.router.js
│   │   ├── auth.router.js
│   │   ├── favorites.router.js
│   │   └── recipes.router.js
│   ├── services/
│   │   └── mealdb.service.js     # Proxy TheMealDB + normalisation
│   ├── validations/
│   │   └── schemas.js
│   ├── migrations/
│   │   ├── createTables.js
│   │   └── seedUsers.js
│   └── tests/
│       ├── globalSetup.js
│       ├── auth.test.js          # 7 tests
│       ├── recipes.test.js       # 5 tests
│       └── favorites.test.js     # 8 tests
│
├── frontend/                     # React 19 + Vite + Tailwind v4
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
│       ├── App.tsx
│       ├── @types/recipe.ts      # RecipeSummary, Recipe, Favorite, AuthUser
│       ├── services/api.ts       # Fetch wrapper typé (VITE_API_URL)
│       ├── lib/
│       │   ├── utils.ts          # cn()
│       │   └── translations.ts   # TheMealDB → français (catégories + zones)
│       ├── context/
│       │   ├── AuthContext.tsx
│       │   ├── RecipesContext.tsx
│       │   └── FavoritesContext.tsx
│       ├── components/
│       │   ├── Header.tsx        # Header violet fixe + nav inline
│       │   ├── Sidebar.tsx       # Sidebar sombre + NavLink actif
│       │   ├── Layout.tsx
│       │   ├── RecipeCard.tsx    # Carte cliquable + Heart lucide
│       │   ├── Loader.tsx
│       │   └── ui/               # shadcn/ui manuel
│       └── pages/
│           ├── HomePage.tsx      # Titre + barre recherche + grille
│           ├── RecipePage.tsx    # Fil d'ariane + 2 colonnes + badges FR
│           ├── LoginPage.tsx     # Onglets Connexion / Inscription
│           └── FavoritesPage.tsx # Grille favoris + badge ❤ + bouton X
│
├── docs/
│   ├── 0.Maquettes/
│   │   └── myrecipes.pen
│   └── 1.Documentation/
│       └── (11 fichiers markdown)
│
└── .github/
    └── workflows/ci.yml
```

---

## API externe — TheMealDB

Base URL : `https://www.themealdb.com/api/json/v1/1/`

| Endpoint                   | Description              |
| -------------------------- | ------------------------ |
| `/search.php?s={name}`     | Recherche par nom        |
| `/categories.php`          | Liste des catégories     |
| `/filter.php?c={category}` | Recettes par catégorie   |
| `/lookup.php?i={id}`       | Détail d'une recette     |
| `/random.php`              | Recette aléatoire        |

**Normalisation** : `strMeal→name`, `idMeal→id`, `strMealThumb→thumbnail`, `strIngredient1…20→ingredients[{name,measure}]`  
**Traduction** : catégories et zones converties en français via `lib/translations.ts`

---

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

---

## Phases réalisées

| Phase | Description | État |
| ----- | ----------- | ---- |
| 1 | Refactoring API (Express 4→5 ESM, MVC, TheMealDB, Sequelize, Argon2, JWT, Joi, Swagger) | ✅ |
| 2 | Docker Compose (postgres + postgres_test + adminer) | ✅ |
| 3 | Tests Vitest + Supertest — 20/20 | ✅ |
| 4 | CI GitHub Actions (lint + tests, Node 22) | ✅ |
| 5 | README portfolio | ✅ |
| 6 | Maquettes Pencil (4 écrans) | ✅ |
| 7 | Frontend React 19 — shadcn/ui, contexts, api.ts, pages | ✅ |
| 8 | Docker Compose complet (+ api + frontend services) | ✅ |
| 9 | Documentation technique (11 fichiers) | ✅ |
| 10 | Cohérence visuelle maquettes + traductions FR | ✅ |

---

## Démarrage rapide

```bash
# Docker Compose (stack complète)
cp .env.example .env
docker compose up --build

# Dev local
docker compose up postgres postgres_test adminer
cd api && npm install && npm run dev
cd frontend && npm install && npm run dev

# Tests
cd api && npm test
```
