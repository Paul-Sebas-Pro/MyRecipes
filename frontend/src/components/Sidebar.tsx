import { NavLink } from "react-router-dom";
import { useRecipesContext } from "../context/RecipesContext";

export default function Sidebar() {
	const { recipes } = useRecipesContext();

	return (
		<aside className="w-64 bg-gray-800 text-white min-h-screen p-6">
			<nav>
				<h2 className="text-xl font-bold mb-4">Recettes</h2>
				<ul className="space-y-2">
					{recipes.map((recipe) => (
						<li key={recipe.id}>
							<NavLink
								to={`/recette/${recipe.id}`}
								className="block px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
							>
								{recipe.name}
							</NavLink>
						</li>
					))}
				</ul>
			</nav>
		</aside>
	);
}
