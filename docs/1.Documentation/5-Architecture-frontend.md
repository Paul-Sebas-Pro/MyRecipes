# Documentation Technique — Projet MyRecipes

## 5. Architecture Frontend

### 5.1 Structure des fichiers

```plaintext
frontend/
├── index.html
├── package.json
├── vite.config.ts               # Plugins react + tailwindcss + alias @/*
├── tsconfig.app.json            # paths: { "@/*": ["./src/*"] }
├── tsconfig.json
├── tsconfig.node.json
├── biome.json                   # Config linter (non utilisé en CI, ESLint côté api)
├── nginx.conf                   # Config nginx pour le build Docker
├── Dockerfile                   # Multi-stage : build Vite → nginx Alpine
└── src/
    ├── main.tsx
    ├── App.tsx                  # BrowserRouter + Providers + Routes
    ├── index.css                # @import "tailwindcss"
    ├── @types/
    │   └── recipe.ts            # Types TypeScript (format TheMealDB normalisé)
    ├── services/
    │   └── api.ts               # Fetch wrapper typé (auth + recettes + favoris)
    ├── context/
    │   ├── AuthContext.tsx      # login / signup / logout / token JWT
    │   ├── RecipesContext.tsx   # RecipeSummary[], loading, error
    │   └── FavoritesContext.tsx # Favorite[], toggleFavorite (API)
    ├── components/
    │   ├── Layout.tsx
    │   ├── Header.tsx           # Logo + formulaire connexion inline
    │   ├── Sidebar.tsx          # Liste recettes (NavLink → /recette/:id)
    │   ├── RecipeCard.tsx       # Carte avec bouton favori
    │   ├── Loader.tsx
    │   └── ui/                  # Composants shadcn/ui (setup manuel)
    │       ├── button.tsx       # CVA variants (default, secondary, outline…)
    │       ├── card.tsx         # Card, CardHeader, CardTitle, CardContent…
    │       ├── input.tsx
    │       ├── badge.tsx
    │       └── skeleton.tsx
    ├── lib/
    │   └── utils.ts             # cn() = clsx + tailwind-merge
    └── pages/
        ├── HomePage.tsx         # Grille + recherche inline
        ├── RecipePage.tsx       # Détail recette (/recette/:id), fetch API
        ├── LoginPage.tsx        # Onglets Connexion / Inscription
        └── FavoritesPage.tsx    # Liste favoris (garde auth)
```

### 5.2 Types TypeScript (`@types/recipe.ts`)

Tous les types reflètent le format **normalisé** par `mealdb.service.js` côté API :

```typescript
export interface Ingredient { name: string; measure: string; }

export interface RecipeSummary { id: string; name: string; thumbnail: string; }

export interface Recipe {
  id: string;
  name: string;
  category: string | null;
  area: string | null;
  instructions: string | null;
  thumbnail: string;
  tags: string[];
  youtube: string | null;
  ingredients: Ingredient[];
}

export interface Category {
  id: string; name: string; thumbnail: string; description: string;
}

export interface Favorite {
  id: number; recipe_id: string; recipe_name: string;
  recipe_thumb: string | null; user_id: number;
}

export interface AuthUser { id: number; pseudo: string; email: string; }
```

### 5.3 Service API (`services/api.ts`)

Fetch wrapper typé centralisé. `VITE_API_URL` est injecté au build via Vite :

```typescript
const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:3000") + "/api";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}
```

Fonctions exportées :

| Fonction                                           | Route API               | Auth |
| -------------------------------------------------- | ----------------------- | ---- |
| `signUp(pseudo, email, password, passwordConfirm)` | POST /auth/signup       | Non  |
| `signIn(email, password)`                          | POST /auth/login        | Non  |
| `getRecipes(params?)`                              | GET /recipes            | Non  |
| `searchRecipes(q)`                                 | GET /recipes/search     | Non  |
| `getCategories()`                                  | GET /recipes/categories | Non  |
| `getRecipeById(id)`                                | GET /recipes/:id        | Non  |
| `getFavorites(token)`                              | GET /favorites          | JWT  |
| `addFavorite(token, ...)`                          | POST /favorites         | JWT  |
| `removeFavorite(token, id)`                        | DELETE /favorites/:id   | JWT  |

### 5.4 Contextes React

#### AuthContext

```typescript
interface AuthContextType {
  isLoggedIn: boolean;
  token: string | null;
  pseudo: string | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (pseudo: string, email: string, password: string, passwordConfirm: string) => Promise<void>;
  logout: () => void;
}
```

- Token JWT stocké en mémoire (pas localStorage)
- `login` appelle `signIn()` → stocke token + user
- `signup` appelle `signUp()` puis bascule en mode connexion

#### RecipesContext

```typescript
interface RecipesContextType {
  recipes: RecipeSummary[];   // liste légère (pas le détail complet)
  loading: boolean;
  error: string | null;
  getRecipeById: (id: string) => Promise<Recipe>;
}
```

- Charge `RecipeSummary[]` au montage via `getRecipes()`
- `getRecipeById` effectue un fetch à la demande (dans `RecipePage`)

#### FavoritesContext

```typescript
interface FavoriteContextType {
  favorites: Favorite[];
  toggleFavorite: (recipeId: string, recipeName: string, recipeThumb: string) => Promise<void>;
  isFavorite: (recipeId: string) => boolean;
}
```

- Persistance **en base de données** via l'API (pas localStorage)
- `loadFavorites` déclenché avec `useCallback` quand le token change
- `toggleFavorite` appelle `addFavorite` ou `removeFavorite` selon l'état

### 5.5 Composants shadcn/ui (setup manuel)

shadcn/ui n'utilise pas de CLI (nécessite un projet CRA ou Next.js configuré). Les composants sont créés manuellement dans `components/ui/`.

**Dépendances :**

```bash
npm install class-variance-authority clsx tailwind-merge @radix-ui/react-slot
```

**`lib/utils.ts` :**

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
```

**Composants créés :**

| Composant  | Description                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------- |
| `Button`   | CVA : default, secondary, outline, ghost, destructive, link ; prop `asChild` via Radix Slot |
| `Card`     | Card + CardHeader + CardTitle + CardDescription + CardContent + CardFooter                  |
| `Input`    | Input stylé avec focus ring                                                                 |
| `Badge`    | CVA : default, secondary, outline, destructive                                              |
| `Skeleton` | `animate-pulse` pour les états de chargement                                                |

### 5.6 Pages

#### HomePage (`/`)

- Récupère `recipes: RecipeSummary[]` depuis `RecipesContext`
- Recherche inline (filtre client-side sur `recipe.name`)
- Grille de `RecipeCard` avec bouton favori conditionnel (`isLoggedIn`)

#### RecipePage (`/recette/:id`)

- Extrait `id` via `useParams`
- Appelle `getRecipeById(id)` → fetch vers `GET /api/recipes/:id`
- Affichage `Skeleton` pendant le chargement
- Badges pour catégorie, area, tags
- Liste d'ingrédients `{name, measure}`
- Instructions en texte brut
- Lien YouTube si disponible
- Bouton favori (cœur) si connecté

#### LoginPage (`/login`)

- Deux onglets : **Connexion** / **Inscription** (toggle via état local)
- Mode connexion : email + mot de passe → `useAuth().login()`
- Mode inscription : pseudo + email + mot de passe + confirmation → `useAuth().signup()`
- Feedback d'erreur ou de succès affiché sous le formulaire
- Redirection vers `/` après connexion réussie

#### FavoritesPage (`/favoris`)

- Garde d'authentification : redirige vers `/login` si non connecté
- Affiche `favorites: Favorite[]` depuis `FavoritesContext`
- Lien vers `/recette/${fav.recipe_id}` pour chaque favori

### 5.7 Configuration Vite (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
})
```

Alias `@/*` → `src/*` déclaré aussi dans `tsconfig.app.json` :

```json
{ "compilerOptions": { "paths": { "@/*": ["./src/*"] } } }
```

---
