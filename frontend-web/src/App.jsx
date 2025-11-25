import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage";   // ⭐ nueva landing page
import LoginPage from "./pages/LoginPage";

import DashboardLayout from "./dashboard/DashboardLayout";

import Inicio from "./dashboard/pages/Inicio";
import Espacios from "./dashboard/pages/Espacios";
import MisReservas from "./dashboard/pages/MisReservas";
import Horarios from "./dashboard/pages/Horarios";
import TecIA from "./dashboard/pages/TecIA";

function App() {
  return (
    <Routes>

      {/* ⭐ PAGINA PRINCIPAL (Landing antes de login) */}
      <Route path="/" element={<LandingPage />} />

      {/* LOGIN */}
      <Route path="/login" element={<LoginPage />} />

      {/* DASHBOARD PRINCIPAL */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="inicio" element={<Inicio />} />
        <Route path="espacios" element={<Espacios />} />
        <Route path="reservas" element={<MisReservas />} />
        <Route path="horarios" element={<Horarios />} />
        <Route path="chat" element={<TecIA />} />
      </Route>

      {/* 404 → redirigir a la landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;
