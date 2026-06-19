# Documentation Technique — Projet MyRecipes

## 9. Guide de reproduction du projet

### 9.1 Prérequis

| Outil          | Version minimale     |
| -------------- | -------------------- |
| Node.js        | 22                   |
| npm            | 10                   |
| Docker         | 27                   |
| Docker Compose | 2.x (plugin intégré) |
| Git            | 2.x                  |

### 9.2 Installation rapide (Docker Compose)

Méthode recommandée : stack complète en une commande.

```bash
# 1. Cloner le dépôt
git clone <url-du-depot>
cd myrecipes

# 2. Créer le fichier d'environnement
cp .env.example .env
# Éditer .env : changer DB_PASSWORD et JWT_SECRET

# 3. Lancer la stack complète
docker compose up --build
```

**Accès :**

| Service  | URL                            |
| -------- | ------------------------------ |
| Frontend | http://localhost               |
| API      | http://localhost:3000          |
| Swagger  | http://localhost:3000/api-docs |
| Adminer  | http://localhost:8080          |

> **Base de données :** `docker compose up` crée automatiquement les tables au démarrage (`sequelize.sync()`). Pas de migration manuelle.

### 9.3 Installation en mode développement (dev local)

#### Étape 1 — Démarrer l'infra Docker (BDD uniquement)

```bash
docker compose up postgres postgres_test adminer
```

#### Étape 2 — API (`api/`)

```bash
cd api

# Installer les dépendances
npm install

# Créer le .env (si non existant)
# Les variables nécessaires :
DATABASE_URL=postgres://myrecipes:myrecipes@localhost:5432/myrecipes
JWT_SECRET=change_this_to_a_long_random_secret
PORT=3000
NODE_ENV=development

# Créer les tables
node migrations/createTables.js

# Démarrer en développement
npm run dev     # nodemon
# ou
npm start       # node server.js
```

API disponible sur http://localhost:3000

#### Étape 3 — Frontend (`frontend/`)

```bash
cd frontend

# Installer les dépendances
npm install

# Démarrer le dev server
npm run dev
```

Frontend disponible sur http://localhost:5173

> `VITE_API_URL` n'est pas nécessaire en dev local (fallback : `http://localhost:3000`).

### 9.4 Variables d'environnement

Fichier `.env.example` à copier en `.env` à la racine :

```env
# Base de données
DB_USER=myrecipes
DB_PASSWORD=myrecipes          # Changer en production
DB_NAME=myrecipes

# API
JWT_SECRET=change_this_to_a_long_random_secret_minimum_32_chars
PORT=3000

# Docker — ports exposés sur l'hôte
API_PORT=3000
FRONTEND_PORT=80

# Frontend — URL de l'API injectée au build Docker
VITE_API_URL=http://localhost:3000
```

> `JWT_SECRET` doit faire au moins 32 caractères. En production, utiliser `openssl rand -base64 48`.

### 9.5 Lancer les tests

#### Prérequis

`postgres_test` doit tourner sur le port 5433 :

```bash
docker compose up postgres_test
```

#### Exécution

```bash
cd api
npm test          # vitest run (un seul run)
npm run test:ui   # vitest --ui (interface graphique)
```

**Résultats attendus :** 20/20 tests

```
 ✓ tests/auth.test.js (7)
 ✓ tests/recipes.test.js (5)
 ✓ tests/favorites.test.js (8)

Test Files  3 passed (3)
Tests       20 passed (20)
```

### 9.6 Linter

```bash
cd api
npm run lint         # eslint
npm run lint:fix     # eslint --fix
```

### 9.7 Build production du frontend

```bash
cd frontend
npm run build        # Vite → dist/
```

> En Docker, le build est déclenché automatiquement lors du `docker compose up --build`.

### 9.8 Accès Adminer

- URL : http://localhost:8080
- Système : PostgreSQL
- Serveur : `postgres`
- Utilisateur : valeur de `DB_USER` (par défaut `myrecipes`)
- Mot de passe : valeur de `DB_PASSWORD`
- Base : valeur de `DB_NAME`

### 9.9 Workflow CI/CD (GitHub Actions)

Fichier : `.github/workflows/ci.yml`

Déclenché sur : push et pull request vers `main`.

Étapes :
1. `npm install` (dans `api/`)
2. `npm run lint`
3. `npm test` (avec service PostgreSQL sur port 5433)

Pas de déploiement automatique configuré (projet portfolio local).

### 9.10 Arborescence complète du projet

```plaintext
myrecipes/
├── .env.example
├── .gitignore
├── docker-compose.yml
├── README.md
│
├── api/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   ├── server.js
│   ├── app.js
│   ├── swagger.config.js
│   ├── vitest.config.js
│   ├── eslint.config.js
│   ├── controllers/
│   ├── routers/
│   ├── middlewares/
│   ├── models/
│   ├── services/
│   ├── validations/
│   ├── migrations/
│   └── tests/
│
├── frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── nginx.conf
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.app.json
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── @types/
│       ├── services/
│       ├── context/
│       ├── components/
│       ├── lib/
│       └── pages/
│
├── docs/
│   ├── 0.Maquettes/
│   │   └── myrecipes.pen
│   └── 1.Documentation/
│       ├── 0-Table-des-matieres.md
│       ├── 1-Introduction.md
│       └── … (fichiers 2 à 10)
│
└── .github/
    └── workflows/
        └── ci.yml
```

---
