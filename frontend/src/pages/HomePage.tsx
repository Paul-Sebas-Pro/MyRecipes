import { useState } from "react";
import RecipeCard from "../components/RecipeCard";
import { useRecipesContext } from "../context/RecipesContext";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 12;

export default function HomePage() {
  const { recipes } = useRecipesContext();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = search.trim()
    ? recipes.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))
    : recipes;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Barre de recherche */}
      <div className="flex items-center gap-3">
        <h2 className="text-[22px] font-bold text-[#111827] whitespace-nowrap">
          Explorer les recettes
        </h2>
        <div className="flex-1 flex items-center gap-2 h-10 bg-white rounded-lg border border-[#e5e7eb] px-3">
          <Search size={16} className="text-[#6b7280] shrink-0" />
          <input
            type="text"
            placeholder="Rechercher une recette..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 text-[14px] text-[#111827] outline-none placeholder:text-[#6b7280] bg-transparent"
          />
          {search && (
            <button
              type="button"
              onClick={() => handleSearch("")}
              className="text-[#6b7280] hover:text-[#111827] text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
        <button
          type="button"
          className="h-10 px-4.5 bg-[#7c3aed] text-white rounded-lg text-[14px] font-semibold hover:bg-violet-800 transition-colors cursor-pointer whitespace-nowrap"
        >
          Rechercher
        </button>
      </div>

      {/* Grille */}
      {filtered.length === 0 ? (
        <p className="text-[#6b7280] text-center py-12">Aucune recette trouvée.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#e5e7eb]">
          <span className="text-[13px] text-[#6b7280]">
            {filtered.length} recette{filtered.length > 1 ? "s" : ""} —
            page {safePage} / {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-[#e5e7eb] text-[#6b7280] hover:bg-[#f3f4f6] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              aria-label="Page précédente"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
              .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…");
                acc.push(p);
                return acc;
              }, [])
              .map((item, idx) =>
                item === "…" ? (
                  <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-[#6b7280] text-[13px]">
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPage(item as number)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-[13px] font-medium transition-colors cursor-pointer ${
                      safePage === item
                        ? "bg-[#7c3aed] text-white"
                        : "border border-[#e5e7eb] text-[#374151] hover:bg-[#f3f4f6]"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-[#e5e7eb] text-[#6b7280] hover:bg-[#f3f4f6] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              aria-label="Page suivante"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
