import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

type Mode = "login" | "signup";

export default function LoginPage() {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setMessage("");
    try {
      if (mode === "login") {
        await login(email, password);
        setMessage("Connexion réussie ! Redirection...");
        setIsError(false);
        setTimeout(() => navigate("/"), 1000);
      } else {
        await signup(pseudo, email, password, passwordConfirm);
        setMessage("Compte créé ! Vous pouvez vous connecter.");
        setIsError(false);
        setMode("login");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Une erreur est survenue");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setMessage("");
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="border border-[#e5e7eb] shadow-sm">
        <CardContent className="pt-6">
          {/* Onglets */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`flex-1 h-10 rounded-lg text-[14px] font-semibold transition-colors cursor-pointer ${
                mode === "login"
                  ? "bg-[#7c3aed] text-white"
                  : "bg-transparent border border-[#e5e7eb] text-[#6b7280] hover:bg-gray-50"
              }`}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`flex-1 h-10 rounded-lg text-[14px] font-semibold transition-colors cursor-pointer ${
                mode === "signup"
                  ? "bg-[#7c3aed] text-white"
                  : "bg-transparent border border-[#e5e7eb] text-[#6b7280] hover:bg-gray-50"
              }`}
            >
              Inscription
            </button>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
            className="space-y-4"
          >
            {mode === "signup" && (
              <div className="space-y-1">
                <label htmlFor="pseudo" className="text-[13px] font-medium text-[#374151]">
                  Pseudo
                </label>
                <Input
                  id="pseudo"
                  type="text"
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                  placeholder="Votre pseudo"
                  required
                />
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="email" className="text-[13px] font-medium text-[#374151]">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-[13px] font-medium text-[#374151]">
                Mot de passe
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {mode === "signup" && (
              <div className="space-y-1">
                <label htmlFor="passwordConfirm" className="text-[13px] font-medium text-[#374151]">
                  Confirmer le mot de passe
                </label>
                <Input
                  id="passwordConfirm"
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[#7c3aed] hover:bg-violet-800"
              disabled={isLoading}
            >
              {isLoading
                ? "Chargement..."
                : mode === "login"
                  ? "Se connecter"
                  : "Créer mon compte"}
            </Button>
          </form>

          {message && (
            <div
              className={`mt-4 p-3 rounded-lg text-[13px] text-center ${
                isError ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
              }`}
            >
              {message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
