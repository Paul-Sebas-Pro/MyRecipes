import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globalSetup: ["./tests/globalSetup.js"],
    env: {
      DATABASE_URL: "postgres://myrecipes:myrecipes@localhost:5433/myrecipes_test",
      JWT_SECRET: "test_jwt_secret_min_32_chars_here_ok",
      NODE_ENV: "test",
    },
    testTimeout: 30000,
    hookTimeout: 30000,
    sequence: {
      concurrent: false,
    },
    reporters: ["verbose"],
  },
});
