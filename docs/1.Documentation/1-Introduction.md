# Documentation Technique — Projet MyRecipes

## 1. Introduction

### 1.1 Contexte du projet

**MyRecipes** est une application web full-stack de consultation et gestion de recettes de cuisine. Les recettes sont récupérées en temps réel depuis l'API externe **TheMealDB** (gratuite, sans clé API). L'authentification JWT et la persistance des favoris sont gérées par une API REST maison adossée à une base PostgreSQL.

Ce projet est réalisé comme démonstrateur portfolio couvrant l'ensemble de la chaîne : API MVC, base de données, tests automatisés, CI/CD, dockerisation et frontend moderne.

### 1.2 Objectifs techniques

- API REST Express 5 en ESM (`"type": "module"`) avec pattern MVC complet
- Proxy et normalisation d'une API externe (TheMealDB → format unifié)
- Authentification JWT + hachage Argon2
- Persistance PostgreSQL via Sequelize 6 (modèles `User` + `Favorite`)
- Tests d'intégration Vitest 4 + Supertest (20/20 tests, fetch mocké pour recettes)
- CI GitHub Actions (lint + tests) + Docker Compose (infra + app)
- Frontend React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui

### 1.3 Technologies utilisées

**Backend (`api/`) :**

| Outil                | Version | Rôle                                |
| -------------------- | ------- | ----------------------------------- |
| Node.js              | 22      | Runtime (requis ≥ 22)               |
| Express              | 5       | Framework web                       |
| Sequelize            | 6       | ORM PostgreSQL                      |
| PostgreSQL           | 17      | Base de données (users + favorites) |
| Argon2               | 0.44    | Hachage des mots de passe           |
| jsonwebtoken         | 9       | Authentification JWT                |
| Joi                  | 17      | Validation des payloads             |
| swagger-jsdoc        | 6       | Spec OpenAPI générée depuis JSDoc   |
| swagger-ui-express   | 5       | UI Swagger sur `/api-docs`          |
| ESLint (flat config) | 10      | Linting ESM                         |

**Tests (`api/tests/`) :**

| Outil     | Version | Rôle                     |
| --------- | ------- | ------------------------ |
| Vitest    | 4       | Runner de tests          |
| Supertest | 7       | Tests HTTP d'intégration |

**Frontend (`frontend/`) :**

| Outil                    | Version | Rôle                                |
| ------------------------ | ------- | ----------------------------------- |
| React                    | 19      | Bibliothèque UI                     |
| TypeScript               | 5       | Typage statique                     |
| Vite                     | 7       | Bundler et dev server               |
| React Router DOM         | 7       | Routing côté client                 |
| Tailwind CSS             | v4      | Framework CSS (plugin Vite natif)   |
| shadcn/ui (setup manuel) | —       | Composants UI basés sur Radix + CVA |

**Infra :**

| Outil          | Rôle                                                |
| -------------- | --------------------------------------------------- |
| Docker Compose | postgres + postgres_test + Adminer + api + frontend |
| GitHub Actions | CI : lint + tests (Node 22, npm install)            |

---
