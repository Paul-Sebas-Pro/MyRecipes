import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { signIn, signUp as apiSignUp } from "../services/api";

type AuthContextType = {
  isLoggedIn: boolean;
  token: string | null;
  pseudo: string | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (pseudo: string, email: string, password: string, passwordConfirm: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [pseudo, setPseudo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function login(email: string, password: string): Promise<void> {
    try {
      const data = await signIn(email, password);
      setIsLoggedIn(true);
      setToken(data.token);
      setPseudo(data.user.pseudo);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
      throw err;
    }
  }

  async function signup(
    pseudo: string,
    email: string,
    password: string,
    passwordConfirm: string
  ): Promise<void> {
    try {
      await apiSignUp(pseudo, email, password, passwordConfirm);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur d'inscription");
      throw err;
    }
  }

  function logout(): void {
    setIsLoggedIn(false);
    setToken(null);
    setPseudo(null);
    setError(null);
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, token, pseudo, error, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
}
