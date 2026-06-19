import { app } from "./app.js";

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`🚀 Serveur MyRecipes démarré sur le port ${port}`)
);
