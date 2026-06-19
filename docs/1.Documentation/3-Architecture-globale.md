# Documentation Technique — Projet MyRecipes

## 3. Architecture globale

### 3.1 Diagramme d'architecture

```plaintext
┌──────────────────────────────────────────────────────────────────┐
│                        NAVIGATEUR CLIENT                          │
│                                                                    │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │              FRONTEND React 19 (Port 80 / 5173)            │   │
│  │                                                             │   │
│  │  ┌──────────┐   ┌──────────────────────────────────────┐  │   │
│  │  │  Router  │──▶│  Pages                                │  │   │
│  │  │ React    │   │  - HomePage        (/)                │  │   │
│  │  │ Router   │   │  - RecipePage      (/recette/:id)     │  │   │
│  │  └──────────┘   │  - LoginPage       (/login)           │  │   │
│  │                  │  - FavoritesPage   (/favoris)         │  │   │
│  │                  └──────────────────────────────────────┘  │   │
│  │                             │                               │   │
│  │                             ▼                               │   │
│  │  ┌───────────────────────────────────────────────────┐    │   │
│  │  │  Context API (state global)                        │    │   │
│  │  │  - AuthContext    (login / signup / logout / JWT)  │    │   │
│  │  │  - RecipesContext (RecipeSummary[], loading)       │    │   │
│  │  │  - FavoritesContext (Favorite[], add / remove)     │    │   │
│  │  └───────────────────────────────────────────────────┘    │   │
│  │                             │                               │   │
│  │                             ▼                               │   │
│  │  ┌───────────────────────────────────────────────────┐    │   │
│  │  │  services/api.ts  (fetch wrapper typé)             │    │   │
│  │  │  VITE_API_URL = http://localhost:3000              │    │   │
│  │  └───────────────────────────────────────────────────┘    │   │
│  └───────────────────────────────────────────────────────────┘   │
└───────────────────────────────────┬──────────────────────────────┘
                                    │ HTTP / Fetch (JSON)
                                    │ Authorization: Bearer <JWT>
                                    ▼
┌──────────────────────────────────────────────────────────────────┐
│              BACKEND Express 5 ESM — API (Port 3000)              │
│                                                                    │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │  app.js                                                    │   │
│  │  ├── cors()  express.json()  swagger-ui-express            │   │
│  │  └── /api → index.router.js                                │   │
│  │       ├── /auth     → authRouter                           │   │
│  │       ├── /recipes  → recipesRouter                        │   │
│  │       └── /favorites → favoritesRouter (JWT requis)        │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                    │
│  ┌───────────────────────┐   ┌──────────────────────────────┐   │
│  │  controllers/          │   │  services/                    │   │
│  │  - auth.controller.js  │   │  - mealdb.service.js          │   │
│  │  - recipes.controller  │   │    (proxy TheMealDB + norm.)  │   │
│  │  - favorites.controller│   └──────────────┬───────────────┘   │
│  └───────────┬───────────┘                   │ fetch()            │
│              │                                ▼                    │
│  ┌───────────▼───────────┐   ┌──────────────────────────────┐   │
│  │  models/ (Sequelize)   │   │  TheMealDB API (externe)      │   │
│  │  - User                │   │  www.themealdb.com/api/json   │   │
│  │  - Favorite            │   └──────────────────────────────┘   │
│  └───────────┬───────────┘                                        │
│              │                                                     │
│              ▼                                                     │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │  PostgreSQL (port 5432)                                    │   │
│  │  - users      (id, pseudo, email, password_hash)           │   │
│  │  - favorites  (id, user_id, recipe_id, recipe_name, thumb) │   │
│  └───────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 Flux de communication

1. **Chargement initial**
   - Le frontend monte et `RecipesProvider` appelle `GET /api/recipes`
   - L'API appelle TheMealDB, normalise les données, renvoie `RecipeSummary[]`
   - Le state React est mis à jour ; les cartes s'affichent

2. **Navigation vers une recette**
   - Clic sur une carte → React Router navigue vers `/recette/:id`
   - `RecipePage` appelle `GET /api/recipes/:id` → TheMealDB → objet `Recipe` complet
   - Affichage avec Skeleton pendant le chargement

3. **Authentification**
   - `POST /api/auth/login` → Argon2 vérifie le hash → JWT (24h) retourné
   - Le token est stocké dans `AuthContext` (mémoire)
   - Toutes les requêtes favoris incluent `Authorization: Bearer <token>`

4. **Gestion des favoris**
   - `GET /api/favorites` → liste depuis PostgreSQL
   - `POST /api/favorites` → `Favorite.findOrCreate`
   - `DELETE /api/favorites/:recipeId` → `Favorite.destroy`

---
