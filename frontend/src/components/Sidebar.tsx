import { NavLink } from "react-router-dom";
import { useRecipesContext } from "../context/RecipesContext";

export default function Sidebar() {
  const { recipes } = useRecipesContext();

  return (
    <aside className="w-55 h-full bg-[#1f2937] shrink-0 overflow-y-auto">
      <div className="px-4 pt-5 pb-4">
        <h2 className="text-white text-[15px] font-bold mb-2">Recettes</h2>
        <div className="w-full h-px bg-[#374151] mb-2" />
        <nav className="flex flex-col">
          {recipes.map((recipe) => (
            <NavLink
              key={recipe.id}
              to={`/recette/${recipe.id}`}
              className={({ isActive }) =>
                `h-8 px-2 flex items-center rounded-sm text-[13px] transition-colors ${
                  isActive
                    ? "bg-[#374151] text-white"
                    : "text-[#d1d5db] hover:bg-[#374151] hover:text-white"
                }`
              }
            >
              <span className="line-clamp-1">{recipe.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
