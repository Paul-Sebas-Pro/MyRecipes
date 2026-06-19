import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { RecipesProvider, useRecipesContext } from "./context/RecipesContext";
import { AuthProvider } from "./context/AuthContext";
import { FavoriteProvider } from "./context/FavoritesContext";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import RecipePage from "./pages/RecipePage";
import LoginPage from "./pages/LoginPage";
import FavoritesPage from "./pages/FavoritesPage";
import Loader from "./components/Loader";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const { loading, error } = useRecipesContext();

  if (loading) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-100">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-semibold">Erreur de chargement</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recette/:id" element={<RecipePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/favoris" element={<FavoritesPage />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RecipesProvider>
          <FavoriteProvider>
            <ScrollToTop />
            <AppContent />
          </FavoriteProvider>
        </RecipesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
