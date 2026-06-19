const CATEGORIES_FR: Record<string, string> = {
  Beef: "Bœuf",
  Breakfast: "Petit-déjeuner",
  Chicken: "Poulet",
  Dessert: "Dessert",
  Goat: "Chèvre",
  Lamb: "Agneau",
  Miscellaneous: "Divers",
  Pasta: "Pâtes",
  Pork: "Porc",
  Seafood: "Fruits de mer",
  Side: "Accompagnement",
  Starter: "Entrée",
  Vegan: "Vegan",
  Vegetarian: "Végétarien",
};

const AREAS_FR: Record<string, string> = {
  American: "Américaine",
  British: "Britannique",
  Canadian: "Canadienne",
  Chinese: "Chinoise",
  Croatian: "Croate",
  Dutch: "Néerlandaise",
  Egyptian: "Égyptienne",
  French: "Française",
  Greek: "Grecque",
  Indian: "Indienne",
  Irish: "Irlandaise",
  Italian: "Italienne",
  Jamaican: "Jamaïcaine",
  Japanese: "Japonaise",
  Kenyan: "Kényane",
  Malaysian: "Malaisienne",
  Mexican: "Mexicaine",
  Moroccan: "Marocaine",
  Polish: "Polonaise",
  Portuguese: "Portugaise",
  Russian: "Russe",
  Spanish: "Espagnole",
  Thai: "Thaïlandaise",
  Tunisian: "Tunisienne",
  Turkish: "Turque",
  Ukrainian: "Ukrainienne",
  Unknown: "Inconnue",
  Vietnamese: "Vietnamienne",
};

export function translateCategory(cat: string | null): string {
  if (!cat) return "";
  return CATEGORIES_FR[cat] ?? cat;
}

export function translateArea(area: string | null): string {
  if (!area) return "";
  return AREAS_FR[area] ?? area;
}
