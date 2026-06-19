import "dotenv/config.js";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  },
  logging: false,
});

async function testConnexion() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connexion à PostgreSQL établie avec succès.");
  } catch (error) {
    console.error("❌ Impossible de se connecter à la base de données:", error);
  }
}

if (process.env.NODE_ENV !== "test") {
  testConnexion();
}

export { sequelize };
