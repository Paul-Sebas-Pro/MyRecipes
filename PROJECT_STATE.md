# MyRecipes — État du projet

> Dernière mise à jour : 2026-06-18 — Préparation portfolio (démarrage)

## Vision

Application de recettes full-stack orientée portfolio. API REST Express 5 (MVC, ESM) + React 19 frontend. Les recettes sont récupérées depuis TheMealDB (API externe gratuite). Authentification JWT avec favoris persistés en base PostgreSQL.

---

## Stack technique

| Couche      | Technologie                               | Version cible |
| ----------- | ----------------------------------------- | ------------- |
| Runtime     | Node.js 22 (ESM)                          | 22 LTS        |
| Framework   | Express 5                                 | ^5.x          |
| ORM         | Sequelize 6 + PostgreSQL                  | ^6.x          |
| Auth        | JWT (jsonwebtoken) + Argon2               | ^9.x / ^0.44  |
| Validation  | Joi                                       | ^17.x         |
| API externe | TheMealDB (gratuite, sans clé)            | v1            |
| Docs        | Swagger / OpenAPI 3.0 (swagger-jsdoc)     | ^6.x          |
| Tests       | Vitest + Supertest                        | ^4.x / ^7.x   |
| Lint        | ESLint flat config (ESM)                  | ^10.x         |
| Dev         | Docker Compose (postgres + adminer)       | —             |
| CI          | GitHub Actions                            | —             |
| Frontend    | React 19 + TypeScript + Vite              | ^19.x         |
| Style       | Tailwind CSS v4 + shadcn/ui (React)       | ^4.x          |
| Router      | React Router v7                           | ^7.x          |
| Lint front  | Biome                                     | ^2.x          |

---

## Architecture cible

```
MyRecipes/
├── api/                          # Express 5, ESM, pattern MVC
│   ├── app.js                    # Config Express (export)
│   ├── server.js                 # listen()
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── favorites.controller.js
│   │   └── recipes.controller.js # Proxy TheMealDB
│   ├── middlewares/
│   │   └── auth.middleware.js    # Vérification JWT
│   ├── models/
│   │   ├── index.js              # Sequelize init + associations
│   │   ├── sequelize.client.js
│   │   ├── user.model.js
│   │   └── favorite.model.js
│   ├── routers/
│   │   ├── index.router.js
│   │   ├── auth.router.js
│   │   ├── favorites.router.js
│   │   └── recipes.router.js
│   ├── services/
│   │   └── mealdb.service.js     # Appels TheMealDB + normalisation
│   ├── validations/
│   │   └── auth.validation.js
│   ├── migrations/
│   │   ├── createTables.js
│   │   └── seedUsers.js
│   ├── tests/
│   │   ├── globalSetup.js
│   │   ├── auth.test.js
│   │   ├── recipes.test.js
│   │   └── favorites.test.js
│   ├── .env.example
│   ├── eslint.config.js
│   ├── vitest.config.js
│   └── package.json
├── frontend/                     # React 19 + Vite + Tailwind v4
│   ├── src/
│   │   ├── components/ui/        # shadcn/ui (button, card, input…)
│   │   ├── components/           # Header, RecipeCard, Sidebar…
│   │   ├── pages/                # HomePage, RecipePage, LoginPage, FavoritesPage
│   │   ├── hooks/                # useRecipes, useFavorites, useAuth
│   │   ├── services/             # api.ts (fetch wrapper)
│   │   ├── stores/               # Zustand ou Context
│   │   └── types/                # Recipe, User, Favorite interfaces
│   └── package.json
├── docs/
│   └── 0.Maquettes/
│       └── myrecipes.pen         # Pencil MCP
├── docker-compose.yml            # postgres (5432) + adminer (8080)
├── .github/
│   └── workflows/ci.yml
└── README.md
```

---

## API externe — TheMealDB

Base URL : `https://www.themealdb.com/api/json/v1/1/`  
Gratuite, sans clé, sans inscription.

| Endpoint                         | Description                         |
| -------------------------------- | ----------------------------------- |
| `/search.php?s={name}`           | Recherche par nom                   |
| `/categories.php`                | Liste des catégories                |
| `/filter.php?c={category}`       | Recettes par catégorie              |
| `/filter.php?i={ingredient}`     | Recettes par ingrédient             |
| `/lookup.php?i={id}`             | Détail d'une recette                |
| `/random.php`                    | Recette aléatoire                   |

Les images des recettes sont fournies par TheMealDB (champ `strMealThumb`).

---

## État actuel (avant refactoring)

### ✅ Existant

- Frontend React 19 + TypeScript + Vite + Tailwind v4 + React Router v7 + Biome
- Pages : HomePage, RecipePage, LoginPage, FavoritesPage
- Context API : RecipesContext, AuthContext, FavoritesContext
- Backend Express 4 (CommonJS), JWT (secret hardcodé), recettes depuis JSON statique
- Swagger via express-jsdoc-swagger

### ❌ À faire

- Renommer `back_api/` → `api/` ✅ (fait par l'utilisateur)
- Migrer backend CommonJS → ESM
- Upgrade Express 4 → Express 5
- Restructurer en MVC
- Remplacer JSON statique par TheMealDB (service dédié)
- Ajouter PostgreSQL pour users + favoris (Sequelize)
- Remplacer secret JWT hardcodé par variable d'env + argon2 pour les mots de passe
- Ajouter Joi (validation), Swagger (swagger-jsdoc + swagger-ui-express)
- Docker Compose (postgres + adminer)
- CI/CD GitHub Actions
- Tests Vitest + Supertest
- Réécrire README portfolio
- Maquettes Pencil (4 écrans minimum)
- Frontend : intégrer shadcn/ui React + consommer la nouvelle API

---

## Endpoints cibles

| Méthode | Route                          | Auth | Description                        |
| ------- | ------------------------------ | ---- | ---------------------------------- |
| GET     | `/api/recipes`                 | —    | Liste recettes (proxy TheMealDB)   |
| GET     | `/api/recipes/search?q={name}` | —    | Recherche par nom                  |
| GET     | `/api/recipes/categories`      | —    | Liste des catégories               |
| GET     | `/api/recipes/:id`             | —    | Détail d'une recette               |
| GET     | `/api/favorites`               | JWT  | Favoris de l'utilisateur connecté  |
| POST    | `/api/favorites`               | JWT  | Ajouter un favori                  |
| DELETE  | `/api/favorites/:recipeId`     | JWT  | Retirer un favori                  |
| POST    | `/api/auth/signup`             | —    | Créer un compte                    |
| POST    | `/api/auth/login`              | —    | Se connecter (retourne un JWT)     |

---

## Roadmap portfolio

### Phase 1 — Refactoring backend ❌

- [ ] Renommer `back_api/` → `api/`
- [ ] Migrer CommonJS → ESM (`"type": "module"`)
- [ ] Upgrade Express 4 → 5, ajouter nodemon
- [ ] Restructurer en MVC (controllers / routers / middlewares / models / services / validations)
- [ ] Créer `mealdb.service.js` — proxy TheMealDB + normalisation du format
- [ ] Remplacer JSON statique par appels TheMealDB
- [ ] Ajouter Sequelize + PostgreSQL (users + favorites)
- [ ] Argon2 pour hachage des mots de passe
- [ ] Joi pour validation des entrées
- [ ] JWT via variable d'env
- [ ] Séparer `app.js` (config) / `server.js` (listen)
- [ ] Swagger (swagger-jsdoc + swagger-ui-express)
- [ ] ESLint flat config

### Phase 2 — Infra & tests ❌

- [ ] Docker Compose (postgres + adminer)
- [ ] Vitest + Supertest (auth + recipes + favorites)
- [ ] CI/CD GitHub Actions (lint + tests)
- [ ] `.env.example`

### Phase 3 — Documentation ❌

- [ ] README portfolio complet

### Phase 4 — Maquettes ❌

- [ ] 4 écrans Pencil MCP (Home, Détail recette, Favoris, Login)
- [ ] Composants réutilisables (Navbar, RecipeCard)

### Phase 5 — Frontend ❌

- [ ] shadcn/ui React (button, card, input, badge, skeleton…)
- [ ] Consommer la nouvelle API (fetch wrapper + types TS)
- [ ] Pages : Home (liste + search + catégories), Détail, Favoris, Login/Signup
- [ ] Loader, gestion d'erreurs

---

## Dépôt de référence (pattern)

Voir `/home/pablo/projects/pro/MyPokedex/` pour les patterns appliqués :
- Structure MVC Express 5 ESM
- Tests Vitest + Supertest
- Docker Compose infra-only
- CI/CD GitHub Actions
- shadcn-vue (ici shadcn React)
