import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Utensils, Heart, LogOut } from "lucide-react";

export default function Header() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn, pseudo, error, login, logout } = useAuth();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await login(email, password);
      setEmail("");
      setPassword("");
    } catch {
      // error affiché via context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="bg-[#7c3aed] h-16 sticky top-0 z-50 shrink-0">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-white no-underline hover:opacity-90 transition-opacity"
        >
          <div className="w-9.5 h-9.5 bg-[#ede9fe] rounded-lg flex items-center justify-center shrink-0">
            <Utensils size={20} className="text-[#7c3aed]" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[18px] font-bold">MyRecipes</span>
            <span className="text-[11px] text-[#c4b5fd]">
              Vos recettes du monde
            </span>
          </div>
        </Link>

        {/* Nav droite */}
        <div className="flex items-center gap-4 relative">
          <NavLink
            to="/favoris"
            className={({ isActive }) =>
              `flex items-center gap-1.5 h-8 px-2.5 rounded-md text-[13px] transition-colors ${
                isActive
                  ? "bg-white/25 text-white"
                  : "bg-white/10 text-[#e9d5ff] hover:bg-white/20"
              }`
            }
          >
            <Heart size={14} />
            <span>Mes Favoris</span>
          </NavLink>

          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-white text-sm font-semibold">
                Bienvenue {pseudo} !
              </span>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setEmail("");
                  setPassword("");
                }}
                className="flex items-center gap-1.5 h-8.5 px-3.5 bg-white text-[#7c3aed] rounded-md text-[13px] font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <LogOut size={14} />
                Déconnexion
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-37 h-8.5 px-2.5 bg-white/10 border border-white/30 rounded-md text-white text-[13px] placeholder:text-white/60 outline-none focus:bg-white/20 focus:border-white/60 transition-colors disabled:opacity-60"
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-32 h-8.5 px-2.5 bg-white/10 border border-white/30 rounded-md text-white text-[13px] placeholder:text-white/60 outline-none focus:bg-white/20 focus:border-white/60 transition-colors disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="h-8.5 px-3.5 bg-white text-[#7c3aed] rounded-md text-[13px] font-semibold hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-60"
              >
                {isLoading ? "..." : "Connexion"}
              </button>
            </form>
          )}

          {error && !isLoggedIn && (
            <span className="absolute -bottom-7 right-0 text-xs bg-red-600/90 text-red-100 px-3 py-1 rounded whitespace-nowrap">
              {error}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
