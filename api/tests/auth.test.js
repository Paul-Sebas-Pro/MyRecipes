import { describe, it, expect, afterEach } from "vitest";
import request from "supertest";
import { app } from "../app.js";
import { User } from "../models/index.js";

const BASE = "/api/auth";
const TEST_EMAIL = "test@myrecipes.com";

const VALID_PAYLOAD = {
  pseudo: "Testeur",
  email: TEST_EMAIL,
  password: "Password123!",
  passwordConfirm: "Password123!",
};

afterEach(async () => {
  await User.destroy({ where: { email: TEST_EMAIL } });
});

describe("POST /api/auth/signup", () => {
  it("crée un utilisateur et retourne 201", async () => {
    const res = await request(app).post(`${BASE}/signup`).send(VALID_PAYLOAD);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ pseudo: "Testeur", email: TEST_EMAIL });
    expect(res.body.password).toBeUndefined();
  });

  it("retourne 409 si email déjà utilisé", async () => {
    await request(app).post(`${BASE}/signup`).send(VALID_PAYLOAD);
    const res = await request(app).post(`${BASE}/signup`).send(VALID_PAYLOAD);

    expect(res.status).toBe(409);
  });

  it("retourne 400 si la validation Joi échoue (email invalide)", async () => {
    const res = await request(app).post(`${BASE}/signup`).send({
      pseudo: "X",
      email: "pas-un-email",
      password: "court",
      passwordConfirm: "court",
    });

    expect(res.status).toBe(400);
  });

  it("retourne 400 si les mots de passe ne correspondent pas", async () => {
    const res = await request(app).post(`${BASE}/signup`).send({
      pseudo: "Testeur",
      email: TEST_EMAIL,
      password: "Password123!",
      passwordConfirm: "AutrePassword!",
    });

    expect(res.status).toBe(400);
  });
});

describe("POST /api/auth/login", () => {
  it("retourne un token JWT en cas de succès", async () => {
    await request(app).post(`${BASE}/signup`).send(VALID_PAYLOAD);

    const res = await request(app).post(`${BASE}/login`).send({
      email: TEST_EMAIL,
      password: "Password123!",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toMatchObject({ email: TEST_EMAIL });
  });

  it("retourne 401 si mot de passe incorrect", async () => {
    await request(app).post(`${BASE}/signup`).send(VALID_PAYLOAD);

    const res = await request(app).post(`${BASE}/login`).send({
      email: TEST_EMAIL,
      password: "MauvaisMotDePasse!",
    });

    expect(res.status).toBe(401);
  });

  it("retourne 401 si email inconnu", async () => {
    const res = await request(app).post(`${BASE}/login`).send({
      email: "inconnu@myrecipes.com",
      password: "Password123!",
    });

    expect(res.status).toBe(401);
  });
});
