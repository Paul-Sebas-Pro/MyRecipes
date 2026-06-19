# Documentation Technique — Projet MyRecipes

## 8. Choix techniques et justifications

### 8.1 Backend

#### Express 5 + ESM (`"type": "module"`)

**Choix :** Express 5 (stable) avec modules natifs ES2022.

**Justifications :**

- Express 5 : gestion des erreurs asynchrones native (plus besoin de `next(err)` explicite)
- ESM : syntaxe `import/export` cohérente avec le frontend TypeScript
- Node 22 : support LTS des ES modules et `import.meta.dirname`

#### Sequelize 6 + PostgreSQL

**Choix :** ORM Sequelize plutôt que SQL brut.

**Justifications :**

- Synchronisation des tables via `sequelize.sync()` (migrations légères pour un portfolio)
- Association `hasMany/belongsTo` déclarée une seule fois
- Portabilité : facile de changer de SGBD si besoin
- Compatibilité avec les tests (recréation de schéma dans `globalSetup`)

#### TheMealDB comme source de données

**Choix :** API externe gratuite plutôt que données statiques.

**Justifications :**

- Plusieurs milliers de recettes réelles avec photos, ingrédients, instructions, YouTube
- Pas besoin de base de données pour les recettes → moins de maintenance
- Démontre la capacité à normaliser des données d'une API tierce
- Gratuite, sans clé API, sans rate limiting bloquant

**Normalisation nécessaire :**

TheMealDB utilise `strIngredient1…strIngredient20` au lieu d'un tableau. La normalisation dans `mealdb.service.js` crée un tableau `[{name, measure}]` filtré sur les valeurs non vides.

#### Argon2 pour les mots de passe

**Choix :** Argon2 plutôt que bcrypt.

**Justifications :**

- Gagnant de la Password Hashing Competition (2015)
- Résistant aux attaques GPU et side-channel
- Interface Node.js simple (`argon2.hash`, `argon2.verify`)

#### JWT signé depuis `.env`

**Choix :** JWT avec secret dans variable d'environnement.

**Justifications :**

- Secret jamais versionné dans le code source
- Durée de vie de 24h (équilibre sécurité / UX)
- `jsonwebtoken` : bibliothèque éprouvée, API simple

#### Joi pour la validation

**Choix :** Joi plutôt qu'une validation manuelle.

**Justifications :**

- Schémas déclaratifs lisibles et maintenables
- `Joi.ref("password")` pour vérifier la confirmation de mot de passe
- Middleware `validate(schema)` réutilisable sur toutes les routes
- Messages d'erreur explicites retournés au client

#### ESLint flat config

**Choix :** ESLint (flat config, `eslint.config.js`) côté API.

**Justifications :**

- Nouvelle configuration recommandée depuis ESLint 9
- Support ESM natif (pas de `module.exports`)
- Cohérence avec les projets Node 22 modernes

### 8.2 Tests

#### Vitest 4 + Supertest

**Choix :** Tests d'intégration HTTP sur une base de test dédiée.

**Justifications :**

- Tests d'intégration > tests unitaires : valident la vraie chaîne (middleware → controller → DB)
- Base `postgres_test` (port 5433) isolée → pas de pollution de données dev
- `globalSetup` : `drop + sync` avant chaque run → état déterministe
- `vi.stubGlobal("fetch", vi.fn())` : mock ciblé de TheMealDB sans toucher au reste

#### `npm install` vs `npm ci` en CI

**Choix :** `npm install` dans le workflow GitHub Actions.

**Justification :** Le projet est développé sur ARM64 (WSL2 Apple Silicon). Les binaires natifs (Rollup/Oxide via Vite) sont compilés pour ARM64 en local. `npm ci` sur x64 (GitHub Actions) recréerait les binaires correctement, mais peut générer un `package-lock.json` différent. `npm install` évite tout conflit de lockfile inter-architectures.

### 8.3 Frontend

#### React 19 + TypeScript

**Choix :** React 19 avec TypeScript strict.

**Justifications :**

- React 19 : nouvelles APIs (actions, use hook) même si non utilisées ici
- TypeScript strict : détection d'erreurs à la compilation, autocomplétion
- Types alignés sur le format de données normalisé par l'API

#### Tailwind CSS v4 (plugin Vite)

**Choix :** Tailwind v4 avec `@tailwindcss/vite` (pas de `tailwind.config.js`).

**Justifications :**

- Configuration zero : `@import "tailwindcss"` dans `index.css`
- Plugin Vite natif : intégration directe, HMR instantané
- Pas de fichier de config séparé

#### shadcn/ui (setup manuel)

**Choix :** shadcn/ui plutôt qu'une bibliothèque de composants packagée.

**Justifications :**

- Composants **copiés dans le projet** → contrôle total du code
- Basés sur Radix UI (accessibilité) + CVA (variants) + tailwind-merge
- Pas de dépendance à une bibliothèque externe à mettre à jour
- CLI shadcn non utilisable sur ce projet (nécessite Next.js ou CRA configuré)

#### Context API + services/api.ts

**Choix :** Context API + fetch wrapper typé, pas de bibliothèque externe (React Query, Zustand…).

**Justifications :**

- Projet de taille modeste : 3 contextes bien séparés suffisent
- `services/api.ts` centralise tous les appels HTTP → pas de duplication
- Démontre la maîtrise des primitives React sans dépendances tierces

#### Pas de localStorage pour le token JWT

**Choix :** Token stocké en mémoire React (state).

**Justification :** Évite les vulnérabilités XSS liées à `localStorage`. Le token est perdu au rechargement, ce qui est acceptable pour un démonstrateur portfolio. Une solution production utiliserait des cookies `httpOnly`.

#### `VITE_API_URL` comme variable d'environnement

**Choix :** URL de l'API configurable au build via `import.meta.env.VITE_API_URL`.

**Justification :** Permet de déployer le frontend sur n'importe quel hébergeur en pointant vers l'API distante, sans modifier le code source.

### 8.4 Infrastructure

#### Docker Compose complet

**Choix :** Docker Compose pour la base **et** l'application (api + frontend).

**Justifications :**

- `docker compose up --build` → stack complète en une commande
- Frontend servi par nginx (production-ready, pas le dev server Vite)
- Frontend Dockerfile multi-stage : image légère (~25MB nginx vs ~900MB node)
- Variables d'environnement centralisées dans `.env`

#### nginx pour le frontend

**Choix :** nginx Alpine avec `try_files` pour le routing React.

**Justification :** React Router utilise l'historique HTML5. Sans `try_files $uri $uri/ /index.html`, une navigation directe vers `/recette/12345` retournerait une 404 nginx.

---
