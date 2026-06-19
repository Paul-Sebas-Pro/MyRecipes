# Documentation Technique — Projet MyRecipes

## 10. Conclusion technique

### 10.1 Bilan

MyRecipes est un projet full-stack complet, conçu comme démonstrateur portfolio couvrant l'ensemble de la chaîne de développement web moderne.

**Ce qui est réalisé :**

| Domaine          | Réalisation                                                  |
| ---------------- | ------------------------------------------------------------ |
| API REST         | Express 5 ESM, MVC, proxy TheMealDB + normalisation          |
| Authentification | JWT + Argon2, validation Joi                                 |
| Base de données  | PostgreSQL + Sequelize, 2 modèles + association              |
| Tests            | 20/20 Vitest + Supertest, base test dédiée                   |
| CI               | GitHub Actions, lint + tests automatisés                     |
| Conteneurisation | Docker Compose complet (5 services), Dockerfiles multi-stage |
| Frontend         | React 19 + TypeScript + Tailwind v4 + shadcn/ui              |
| UX               | Contexts React, fetch wrapper typé, routing SPA              |
| Maquettes        | 4 écrans Pencil (Home, Detail, Favoris, Login)               |
| Documentation    | README portfolio + documentation technique complète          |

### 10.2 Décisions architecturales clés

**Proxy TheMealDB côté serveur.** Les recettes ne transitent pas directement du client vers TheMealDB — l'API agit comme intermédiaire. Cela permet de normaliser les données une seule fois, de contrôler les erreurs, et de changer de source sans toucher au frontend.

**Pas de base de données pour les recettes.** Seuls `User` et `Favorite` sont persistés. Les recettes restent "stateless" côté serveur : TheMealDB est la source de vérité. Cela simplifie la synchronisation et élimine le besoin de pipeline d'ingestion.

**Context API sans bibliothèque externe.** Trois contextes bien séparés (`Auth`, `Recipes`, `Favorites`) suffisent pour la taille du projet. L'ajout de React Query ou Zustand aurait apporté des abstractions non justifiées.

**Token JWT en mémoire.** Choix délibéré de ne pas utiliser `localStorage` pour éviter les vulnérabilités XSS. La perte du token au rechargement est acceptable pour un portfolio.

### 10.3 Points d'amélioration possibles

Ces améliorations sont identifiées mais volontairement hors scope du projet portfolio :

| Amélioration                               | Bénéfice                                       |
| ------------------------------------------ | ---------------------------------------------- |
| Refresh token (cookie httpOnly)            | Persistance de session sans vulnérabilité XSS  |
| Pagination de la liste de recettes         | Réduction du payload initial                   |
| Cache Redis pour TheMealDB                 | Réduction des appels externes, latence moindre |
| Rate limiting sur l'API                    | Protection contre l'abus                       |
| Tests E2E (Playwright/Cypress)             | Couverture frontend                            |
| Déploiement cloud (Fly.io, Render)         | Demo live portfolio                            |
| Variables d'environnement en runtime nginx | Permet de changer `VITE_API_URL` sans rebuild  |

### 10.4 Stack de référence

Ce projet peut servir de base ou de référence pour des projets similaires utilisant :

- **Backend :** Node 22 + Express 5 + ESM + MVC + Sequelize + PostgreSQL
- **Tests :** Vitest 4 + Supertest + base test dédiée + mock fetch
- **CI :** GitHub Actions + npm install (ARM64 safe)
- **Frontend :** React 19 + TypeScript + Vite 7 + Tailwind v4 + shadcn/ui (manuel)
- **Infra :** Docker Compose + Dockerfiles multi-stage + nginx SPA

---
