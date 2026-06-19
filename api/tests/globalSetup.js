const TEST_DB_URL = "postgres://myrecipes:myrecipes@localhost:5433/myrecipes_test";
const TEST_JWT_SECRET = "test_jwt_secret_min_32_chars_here_ok";

export async function setup() {
  process.env.DATABASE_URL = TEST_DB_URL;
  process.env.JWT_SECRET = TEST_JWT_SECRET;
  process.env.NODE_ENV = "test";

  const { sequelize } = await import("../models/index.js");

  await sequelize.drop();
  await sequelize.sync();
  await sequelize.close();
}

export async function teardown() {
  // Tables nettoyées au prochain setup() via sequelize.drop()
}
