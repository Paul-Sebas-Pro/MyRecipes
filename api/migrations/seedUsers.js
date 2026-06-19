import argon2 from "argon2";
import { User, sequelize } from "../models/index.js";

async function seedUsers() {
  try {
    const hashedPassword = await argon2.hash("password123");

    await User.bulkCreate(
      [
        { pseudo: "Alice", email: "alice@myrecipes.com", password: hashedPassword },
        { pseudo: "Bob", email: "bob@myrecipes.com", password: hashedPassword },
      ],
      { ignoreDuplicates: true }
    );

    console.log("✅ Utilisateurs de test créés");
  } catch (error) {
    console.error("❌ Erreur lors du seed :", error);
  } finally {
    await sequelize.close();
    console.log("🔒 Connexion fermée.");
  }
}

seedUsers();
