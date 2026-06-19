# Documentation Technique — Projet MyRecipes

## 7. Étapes de développement

### Phase 1 — Refactoring API (Express 4 → Express 5 ESM, MVC)

**Objectif :** Transformer l'API originale (fichier plat, CommonJS) en architecture MVC propre avec ESM.

**Actions :**

- Renommage `back_api/` → `api/`
- `package.json` : ajout `"type": "module"`, migration vers Express 5, Sequelize, Argon2, JWT, Joi, Swagger
- Suppression des fichiers obsolètes : `api/api/index.js`, `recipes.json`, `users.js`, `public/index.html`
- Création de `app.js` + `server.js` (séparation application/serveur)
- Création de la structure MVC complète : `controllers/` `routers/` `middlewares/` `models/` `services/` `validations/`
- Implémentation de `mealdb.service.js` : proxy TheMealDB + normalisation des données
- Remplacement des recettes JSON statiques par des appels TheMealDB
- Modèles Sequelize : `User` + `Favorite` avec association `hasMany/belongsTo`
- Authentification : Argon2 pour les mots de passe, JWT depuis `.env`
- Validation Joi + middleware `validate(schema)`
- Swagger sur `/api-docs`
- ESLint flat config ESM

### Phase 2 — Docker Compose (infra)

**Objectif :** Fournir l'environnement de développement via Docker.

**Services créés :**

| Service         | Image              | Port | Rôle            |
| --------------- | ------------------ | ---- | --------------- |
| `postgres`      | postgres:17-alpine | 5432 | Base principale |
| `postgres_test` | postgres:17-alpine | 5433 | Base de test    |
| `adminer`       | adminer            | 8080 | Interface DB    |

**Détails :**

- Variables d'environnement via `.env` (`DB_USER`, `DB_PASSWORD`, `DB_NAME`)
- Healthcheck sur les deux instances PostgreSQL
- Volumes persistants pour les données

### Phase 3 — Tests Vitest + Supertest

**Objectif :** Couverture complète de l'API par des tests d'intégration.

**Stratégie :**

- Base de test dédiée (port 5433) créée et synchronisée dans `globalSetup.js`
- `NODE_ENV=test` → connexion Sequelize sur `DATABASE_URL` (port 5433)
- Mock de `fetch` via `vi.stubGlobal` pour les tests recettes (isolation TheMealDB)

**Résultats : 20/20 tests**

| Fichier             | Tests | Couverture                                      |
| ------------------- | ----- | ----------------------------------------------- |
| `auth.test.js`      | 7     | signup, login, erreurs validation               |
| `recipes.test.js`   | 5     | list, search, categories, getById (fetch mocké) |
| `favorites.test.js` | 8     | CRUD favoris + garde JWT                        |

### Phase 4 — CI GitHub Actions

**Objectif :** Automatiser lint + tests à chaque push.

**Fichier :** `.github/workflows/ci.yml`

**Points clés :**

- Service PostgreSQL sur port 5433 avec `POSTGRES_DB: myrecipes_test`
- `npm install` (pas `npm ci`) — compatibilité ARM64 local vs x64 CI
- Node 22 requis (Vitest 4 nécessite Node ≥ 22)
- `DATABASE_URL` pointant sur `localhost:5433/myrecipes_test`

### Phase 5 — README portfolio

**Objectif :** Documentation README complète pour le portfolio.

**Contenu :**

- Table du stack technique
- Arbre d'architecture
- Tableau des endpoints API
- Instructions de setup (Docker Compose + dev local)
- Instructions de test

### Phase 6 — Maquettes Pencil

**Fichier :** `docs/0.Maquettes/myrecipes.pen`

**4 écrans :**

| Écran         | Route          | Contenu                                        |
| ------------- | -------------- | ---------------------------------------------- |
| Home          | `/`            | Grille recettes + barre de recherche           |
| Recipe Detail | `/recette/:id` | Image + badges + ingrédients + instructions    |
| Favoris       | `/favoris`     | État connecté, grille favoris + bouton retrait |
| Login         | `/login`       | Card centré, onglets Connexion / Inscription   |

### Phase 7 — Frontend React 19

**Objectif :** Mettre à jour le frontend pour consommer la nouvelle API.

**Actions :**

- Réécriture des types TypeScript (format TheMealDB normalisé)
- Création de `services/api.ts` : fetch wrapper typé, `VITE_API_URL` env var
- Mise à jour de `AuthContext` : ajout de `signup()`
- Mise à jour de `RecipesContext` : `RecipeSummary[]`, `getRecipeById` à la demande
- Réécriture de `FavoritesContext` : API-based (plus localStorage)
- Setup shadcn/ui manuel : Button, Card, Input, Badge, Skeleton + `lib/utils.ts`
- `RecipeCard` : shadcn Card + Button, cœur conditionnel si connecté
- `HomePage` : recherche inline avec shadcn Input + Button
- `RecipePage` : fetch detail par `id`, Skeleton, Badge, ingrédients `{name, measure}`
- `LoginPage` : onglets Connexion / Inscription, shadcn Card/Input/Button
- `FavoritesPage` : liste `Favorite[]` depuis context, garde auth, lien `/recette/:id`
- `Sidebar` : route `/recette/${recipe.id}` (était `:slug`), `recipe.name` (était `.title`)
- `App.tsx` : route `/recette/:id` (était `:slug`)
- `vite.config.ts` + `tsconfig.app.json` : alias `@/*`

---
