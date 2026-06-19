import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize.client.js";

export class Favorite extends Model {}

Favorite.init(
  {
    recipe_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    recipe_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    recipe_thumb: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "favorite",
    underscored: true,
  }
);
