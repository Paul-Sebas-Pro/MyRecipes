import { sequelize } from "../models/index.js";

async function setupDatabase() {
  try {
    console.log("⏳ Suppression des tables existantes...");
    await sequelize.drop();

    console.log("⏳ Création des tables...");
    await sequelize.sync();

    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log("✅ Tables créées :", tables);
  } catch (error) {
    console.error("❌ Erreur lors de la configuration de la base de données :", error);
  } finally {
    await sequelize.close();
    console.log("🔒 Connexion fermée.");
  }
}

setupDatabase();
