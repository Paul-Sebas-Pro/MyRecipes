import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Utilisation du contexte AuthContext
  const { isLoggedIn, pseudo, error, login, logout } = useAuth();

  // Créer une référence pour l'input email
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Placer le focus sur l'input email après le premier rendu
  useEffect(() => {
    // On vérifie que l'utilisateur n'est pas déjà connecté
    if (!isLoggedIn) {
      emailInputRef.current?.focus();
    }
  }, [isLoggedIn]); // Se déclenche quand isLoggedIn change

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      // Réinitialiser les champs après connexion réussie
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Erreur lors de la connexion:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setEmail("");
    setPassword("");
  };

  return (
    <header className="bg-linear-to-r from-purple-600 to-purple-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center gap-8 flex-wrap">
        <Link
          to="/"
          className="flex items-center gap-4 text-white no-underline hover:opacity-90 transition-opacity"
        >
          <img
            src="/logo.png"
            alt="O'Recipes Logo"
            className="h-12 w-12 rounded-lg"
          />
          <div>
            <h1 className="text-2xl font-bold m-0 leading-tight">O'Recipes</h1>
            <p className="text-sm m-0 opacity-90">Les recettes oRecipes</p>
          </div>
        </Link>

        <div className="flex items-center gap-4 relative">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <span className="font-semibold text-white">
                Bienvenue {pseudo} !
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white/20 text-white border-2 border-white rounded-lg font-semibold text-sm cursor-pointer transition-all hover:bg-white hover:text-purple-700 hover:-translate-y-0.5"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 flex-wrap"
            >
              <input
                ref={emailInputRef}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="px-3 py-2 border-2 border-white/30 rounded-lg bg-white/10 text-white text-sm outline-none transition-all min-w-37.5 placeholder:text-white/70 focus:bg-white/20 focus:border-white/60 disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="px-3 py-2 border-2 border-white/30 rounded-lg bg-white/10 text-white text-sm outline-none transition-all min-w-37.5 placeholder:text-white/70 focus:bg-white/20 focus:border-white/60 disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 bg-white text-purple-700 border-none rounded-lg font-semibold text-sm cursor-pointer transition-all whitespace-nowrap hover:bg-gray-100 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? "..." : "Connexion"}
              </button>
            </form>
          )}
          {error && !isLoggedIn && (
            <span className="absolute -bottom-6 right-0 text-red-200 text-sm font-medium bg-red-600/90 px-3 py-1 rounded">
              {error}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
