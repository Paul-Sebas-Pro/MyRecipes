import { describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { app } from "../app.js";
import { User, Favorite } from "../models/index.js";

const BASE = "/api";
const TEST_EMAIL = "fav_test@myrecipes.com";

let token;

beforeEach(async () => {
  await request(app).post(`${BASE}/auth/signup`).send({
    pseudo: "FavTesteur",
    email: TEST_EMAIL,
    password: "Password123!",
    passwordConfirm: "Password123!",
  });

  const loginRes = await request(app).post(`${BASE}/auth/login`).send({
    email: TEST_EMAIL,
    password: "Password123!",
  });
  token = loginRes.body.token;
});

afterEach(async () => {
  await Favorite.destroy({ where: {} });
  await User.destroy({ where: { email: TEST_EMAIL } });
});

describe("GET /api/favorites", () => {
  it("retourne 401 sans token", async () => {
    const res = await request(app).get(`${BASE}/favorites`);
    expect(res.status).toBe(401);
  });

  it("retourne la liste des favoris (vide au départ)", async () => {
    const res = await request(app)
      .get(`${BASE}/favorites`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });
});

describe("POST /api/favorites", () => {
  it("retourne 401 sans token", async () => {
    const res = await request(app)
      .post(`${BASE}/favorites`)
      .send({ recipe_id: "52772", recipe_name: "Test Recipe" });

    expect(res.status).toBe(401);
  });

  it("ajoute un favori et retourne 201", async () => {
    const res = await request(app)
      .post(`${BASE}/favorites`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        recipe_id: "52772",
        recipe_name: "Teriyaki Chicken Casserole",
        recipe_thumb: "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
      });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ recipe_id: "52772" });
  });

  it("retourne 200 si le favori existe déjà (idempotent)", async () => {
    const payload = {
      recipe_id: "52772",
      recipe_name: "Teriyaki Chicken Casserole",
      recipe_thumb: "",
    };
    await request(app)
      .post(`${BASE}/favorites`)
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    const res = await request(app)
      .post(`${BASE}/favorites`)
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    expect(res.status).toBe(200);
  });
});

describe("DELETE /api/favorites/:recipeId", () => {
  it("retourne 401 sans token", async () => {
    const res = await request(app).delete(`${BASE}/favorites/52772`);
    expect(res.status).toBe(401);
  });

  it("supprime un favori et retourne 204", async () => {
    await request(app)
      .post(`${BASE}/favorites`)
      .set("Authorization", `Bearer ${token}`)
      .send({ recipe_id: "52772", recipe_name: "Test", recipe_thumb: "" });

    const res = await request(app)
      .delete(`${BASE}/favorites/52772`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(204);
  });

  it("retourne 404 si le favori n'existe pas", async () => {
    const res = await request(app)
      .delete(`${BASE}/favorites/99999`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
