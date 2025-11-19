import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/AdminDashboard";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage"; // <--- IMPORTAR LANDING
import "./App.css";

function App() {
  return (
    <Routes>
      {/* La ruta raíz "/" ahora carga LandingPage */}
      <Route path="/" element={<LandingPage />} />

      {/* Rutas de autenticación */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage onBack={() => window.history.back()} />} />

      {/* Rutas protegidas - Admin */}
      <Route
        path="/admin/dashboard"
        element={
          localStorage.getItem("role") === "ADMIN" ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Rutas protegidas - Usuario */}
      <Route
        path="/home"
        element={
          localStorage.getItem("user") ? (
            <HomePage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Cualquier otra ruta redirige a la Landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;