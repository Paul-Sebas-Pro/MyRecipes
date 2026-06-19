# Documentation Technique — Projet MyRecipes

## 6. Flux de données

### 6.1 Chargement initial de l'application

```plaintext
Navigateur → index.html → main.tsx → App.tsx
     │
     ▼ mount Providers
AuthProvider      → état vide (non connecté)
RecipesProvider   → useEffect → GET /api/recipes
                              → mealdb.service.search("c") → TheMealDB
                              → RecipeSummary[] → setRecipes()
FavoriteProvider  → état vide (chargé après connexion)
     │
     ▼ AppContent
loading=true  → <Loader />
loading=false → <HomePage /> avec RecipeSummary[]
```

### 6.2 Navigation vers une recette

```plaintext
Clic RecipeCard  → Link to="/recette/:id"
     │
     ▼ React Router
ScrollToTop      → window.scrollTo(0, 0)
RecipePage       → useParams() → id
                → getRecipeById(id)
                → GET /api/recipes/:id
                → mealdb.service.getById(id) → TheMealDB
                → Recipe complet → render
     │
     ▼ Pendant le fetch
<Skeleton /> (image + titre + badges)
```

### 6.3 Authentification

```plaintext
LoginPage / Header → handleSubmit()
     │
     ▼
useAuth().login(email, password)
     │
     ▼
signIn(email, password) → POST /api/auth/login
auth.controller.signIn :
  - User.findOne({ where: { email } })
  - argon2.verify(user.password, password)
  - jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" })
  - res.json({ token, user: { id, pseudo, email } })
     │
     ▼
AuthContext :
  setToken(token)
  setIsLoggedIn(true)
  setPseudo(user.pseudo)
     │
     ▼
FavoritesContext réagit au changement de token :
  loadFavorites() → GET /api/favorites
                  → Favorite[] → setFavorites()
```

### 6.4 Gestion des favoris

```plaintext
RecipeCard / RecipePage → bouton ❤️
     │
     ▼
useFavorites().toggleFavorite(recipeId, recipeName, recipeThumb)
     │
     ├─ isFavorite(recipeId) = false
     │     → addFavorite(token, recipe_id, recipe_name, recipe_thumb)
     │     → POST /api/favorites
     │     → Favorite.findOrCreate({ where: { user_id, recipe_id } })
     │     → 201 créé / 200 déjà existant
     │     → setFavorites([...favorites, newFav])
     │
     └─ isFavorite(recipeId) = true
           → removeFavorite(token, recipeId)
           → DELETE /api/favorites/:recipeId
           → Favorite.destroy({ where: { user_id, recipe_id } })
           → 204 No Content
           → setFavorites(favorites.filter(f => f.recipe_id !== recipeId))
```

### 6.5 État global (Context API)

```plaintext
App
├─ AuthProvider
│   ├─ isLoggedIn : boolean
│   ├─ token : string | null        ← JWT en mémoire
│   ├─ pseudo : string | null
│   ├─ error : string | null
│   ├─ login(email, password)
│   ├─ signup(pseudo, email, pw, pwConfirm)
│   └─ logout()
│
├─ RecipesProvider
│   ├─ recipes : RecipeSummary[]    ← liste légère (id, name, thumbnail)
│   ├─ loading : boolean
│   ├─ error : string | null
│   └─ getRecipeById(id)            ← fetch à la demande
│
└─ FavoriteProvider
    ├─ favorites : Favorite[]        ← depuis l'API (besoin JWT)
    ├─ toggleFavorite(id, name, thumb)
    └─ isFavorite(recipeId)
```

### 6.6 Stratégie de récupération des données

#### Recettes (liste)

- Fetch unique au montage du `RecipesProvider`
- Retourne des `RecipeSummary` (id + name + thumbnail uniquement)
- Pas de re-fetch lors des navigations → navigation instantanée

#### Recette (détail)

- Fetch individuel dans `RecipePage` à chaque visite
- Données complètes : ingrédients, instructions, YouTube, tags
- Skeleton pendant le chargement

#### Favoris

- Chargés depuis l'API à la connexion (token disponible)
- Mis à jour localement dans le state après chaque ajout/suppression
- Pas de re-fetch complet : optimistic update via `setFavorites`

### 6.7 Persistance

| Donnée    | Stockage                                              |
| --------- | ----------------------------------------------------- |
| Token JWT | Mémoire React (`AuthContext`) — perdu au rechargement |
| Favoris   | PostgreSQL (`favorites` table) via l'API              |
| Recettes  | Aucun — TheMealDB appelé à la demande                 |

> **Note :** Le token n'est pas stocké en `localStorage` par choix de simplicité portfolio. En production, un refresh token ou une stratégie `httpOnly cookie` serait approprié.

---
