import { User } from "./user.model.js";
import { Favorite } from "./favorite.model.js";
import { sequelize } from "./sequelize.client.js";

User.hasMany(Favorite, {
  as: "favorites",
  foreignKey: "user_id",
});

Favorite.belongsTo(User, {
  as: "user",
  foreignKey: "user_id",
});

export { sequelize, User, Favorite };
