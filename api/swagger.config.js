import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MyRecipes API",
      version: "1.0.0",
      description:
        "API REST MyRecipes — proxy TheMealDB, authentification JWT, favoris PostgreSQL",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Serveur de développement",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        RecipeSummary: {
          type: "object",
          properties: {
            id: { type: "string", example: "52772" },
            name: { type: "string", example: "Teriyaki Chicken Casserole" },
            thumbnail: { type: "string", example: "https://www.themealdb.com/images/media/meals/..." },
          },
        },
        Recipe: {
          type: "object",
          properties: {
            id: { type: "string", example: "52772" },
            name: { type: "string", example: "Teriyaki Chicken Casserole" },
            category: { type: "string", example: "Chicken" },
            area: { type: "string", example: "Japanese" },
            instructions: { type: "string", example: "Cook the chicken..." },
            thumbnail: { type: "string", example: "https://..." },
            tags: { type: "array", items: { type: "string" } },
            youtube: { type: "string", example: "https://www.youtube.com/watch?v=..." },
            ingredients: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string", example: "soy sauce" },
                  measure: { type: "string", example: "3/4 cup" },
                },
              },
            },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "string", example: "1" },
            name: { type: "string", example: "Beef" },
            thumbnail: { type: "string" },
            description: { type: "string" },
          },
        },
        Favorite: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            recipe_id: { type: "string", example: "52772" },
            recipe_name: { type: "string", example: "Teriyaki Chicken Casserole" },
            recipe_thumb: { type: "string", example: "https://..." },
            user_id: { type: "integer", example: 1 },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            pseudo: { type: "string", example: "alice" },
            email: { type: "string", example: "alice@myrecipes.com" },
          },
        },
      },
    },
  },
  apis: ["./routers/*.router.js", "./app.js"],
};

export const swaggerSpecification = swaggerJSDoc(options);
