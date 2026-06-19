# MyRecipes

Application de recettes full-stack — proxy TheMealDB, authentification JWT, favoris PostgreSQL.

## Stack technique

| Couche     | Technologie                              |
| ---------- | ---------------------------------------- |
| Runtime    | Node.js 22 (ESM)                         |
| Backend    | Express 5, pattern MVC                   |
| ORM        | Sequelize 6 + PostgreSQL 17              |
| Auth       | JWT (jsonwebtoken) + Argon2              |
| Validation | Joi                                      |
| API ext.   | TheMealDB (gratuite, sans clé)           |
| Docs API   | Swagger / OpenAPI 3.0 (swagger-jsdoc)   |
| Tests      | Vitest + Supertest (20 tests)            |
| Lint       | ESLint flat config ESM                   |
| Infra      | Docker Compose (postgres + adminer)      |
| CI/CD      | GitHub Actions                           |
| Frontend   | React 19 + TypeScript + Vite             |
| Style      | Tailwind CSS v4 + shadcn/ui              |
| Router     | React Router v7                          |
| Lint front | Biome                                    |

## Architecture

```
MyRecipes/
├── api/                          # Express 5, ESM, MVC
│   ├── app.js                    # Config Express (export)
│   ├── server.js                 # listen()
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── favorites.controller.js
│   │   └── recipes.controller.js # Proxy TheMealDB
│   ├── middlewares/
│   │   ├── auth.middleware.js    # Vérification JWT
│   │   └── validation.middleware.js
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
│   │   └── schemas.js
│   ├── migrations/
│   │   ├── createTables.js
│   │   └── seedUsers.js
│   └── tests/
│       ├── globalSetup.js
│       ├── auth.test.js          # 7 tests
│       ├── recipes.test.js       # 5 tests (fetch mocké)
│       └── favorites.test.js     # 8 tests
├── frontend/                     # React 19 + Vite + Tailwind v4
├── docs/0.Maquettes/             # Maquettes Pencil
├── docker-compose.yml
└── .github/workflows/ci.yml
```

## Endpoints API

| Méthode | Route                          | Auth | Description                       |
| ------- | ------------------------------ | ---- | --------------------------------- |
| GET     | `/api/recipes`                 | —    | Liste recettes (proxy TheMealDB)  |
| GET     | `/api/recipes/search?q={name}` | —    | Recherche par nom                 |
| GET     | `/api/recipes/categories`      | —    | Liste des catégories              |
| GET     | `/api/recipes/:id`             | —    | Détail d'une recette              |
| GET     | `/api/favorites`               | JWT  | Favoris de l'utilisateur          |
| POST    | `/api/favorites`               | JWT  | Ajouter un favori                 |
| DELETE  | `/api/favorites/:recipeId`     | JWT  | Retirer un favori                 |
| POST    | `/api/auth/signup`             | —    | Créer un compte                   |
| POST    | `/api/auth/login`              | —    | Se connecter (retourne un JWT)    |

## API externe — TheMealDB

Base URL : `https://www.themealdb.com/api/json/v1/1/`
Gratuite, sans clé, sans inscription.

Le service `mealdb.service.js` normalise les réponses TheMealDB (strMeal → name, idMeal → id, ingrédients strIngredient1…20 → tableau `ingredients`).

## Lancer le projet

### Prérequis

- Node.js 22
- Docker + Docker Compose

### Backend

```bash
# 1. Démarrer les conteneurs (postgres + postgres_test + adminer)
docker-compose up -d

# 2. Installer les dépendances
cd api && npm install

# 3. Configurer l'environnement
cp .env.example .env  # Remplir les variables

# 4. Créer les tables et insérer les données de test
npm run db:reset

# 5. Démarrer le serveur de développement
npm run dev
```

API disponible sur `http://localhost:3000`
Documentation Swagger sur `http://localhost:3000/api-docs`
Adminer sur `http://localhost:8080`

### Frontend

```bash
cd frontend && npm install && npm run dev
```

Frontend disponible sur `http://localhost:5173`

## Tests

```bash
cd api

# Tests unitaires + intégration (nécessite postgres_test sur :5433)
npm test

# Avec couverture
npm run test:coverage
```

20 tests — auth (7), recipes (5), favorites (8).

## CI/CD

GitHub Actions déclenché sur push `main` / `develop` et PR vers `main`.

Pipeline :
1. Démarrage d'un service PostgreSQL sur :5433
2. `npm install`
3. `npm run lint` (ESLint flat config)
4. `npm test` (Vitest + Supertest)

## Variables d'environnement

```env
DATABASE_URL=postgres://myrecipes:myrecipes@localhost:5432/myrecipes
DATABASE_URL_TEST=postgres://myrecipes:myrecipes@localhost:5433/myrecipes_test
JWT_SECRET=your_super_long_random_secret_min_32_chars_here
PORT=3000
NODE_ENV=development
```
