# Documentation Technique — Projet MyRecipes

## 2. Vue d'ensemble du projet

### 2.1 Description fonctionnelle

MyRecipes permet aux utilisateurs de :

1. **Explorer les recettes** : grille de cartes depuis TheMealDB (recherche par mot-clé, catégorie ou lettre)
2. **Voir le détail d'une recette** : ingrédients normalisés, instructions, lien YouTube, tags
3. **S'inscrire / se connecter** : création de compte (pseudo + email + mot de passe) ou connexion
4. **Gérer ses favoris** : ajouter/retirer une recette, liste persistée en base de données (nécessite authentification)
5. **Naviguer** : sidebar avec liste des recettes, scroll automatique, routing SPA

### 2.2 Fonctionnalités implémentées

#### API (`api/`)

- ✅ Pattern MVC : `controllers/` `routers/` `middlewares/` `services/` `validations/` `models/`
- ✅ Proxy TheMealDB : search, categories, filterByCategory, getById, getRandom
- ✅ Normalisation des recettes : `idMeal→id`, `strMeal→name`, `strIngredient1…20→ingredients[{name,measure}]`
- ✅ Inscription (`POST /api/auth/signup`) avec validation Joi + hachage Argon2
- ✅ Connexion (`POST /api/auth/login`) avec vérification Argon2 + JWT signé (24h)
- ✅ Favoris CRUD protégé par JWT : liste, ajout (`findOrCreate`), suppression
- ✅ Documentation Swagger sur `/api-docs`
- ✅ 20/20 tests d'intégration (7 auth + 5 recettes + 8 favoris)
- ✅ ESLint flat config ESM

#### Frontend (`frontend/`)

- ✅ `services/api.ts` : fetch wrapper typé (auth + recettes + favoris)
- ✅ `AuthContext` : login + signup + logout, token JWT en mémoire
- ✅ `RecipesContext` : liste `RecipeSummary[]` depuis l'API au montage
- ✅ `FavoritesContext` : favoris depuis l'API (authentifié), add/remove
- ✅ shadcn/ui manuel : Button, Card, Input, Badge, Skeleton + `lib/utils.ts` (cn)
- ✅ HomePage : grille de cartes + barre de recherche inline
- ✅ RecipePage (`/recette/:id`) : fetch du détail complet, squelette Skeleton, badges
- ✅ LoginPage : formulaire à onglets Connexion / Inscription
- ✅ FavoritesPage : liste des favoris avec garde d'authentification

#### Infra

- ✅ Docker Compose : `postgres` (5432) + `postgres_test` (5433) + `adminer` (8080) + `api` (3000) + `frontend` (80)
- ✅ Dockerfiles multi-stage pour l'API et le frontend (nginx)
- ✅ `.env.example` à la racine avec toutes les variables
- ✅ CI GitHub Actions : lint + tests sur Node 22

### 2.3 Source de données

Les recettes proviennent exclusivement de **TheMealDB** (API REST gratuite, sans clé).  
Seuls les modèles `User` et `Favorite` sont stockés en base de données PostgreSQL.

---
