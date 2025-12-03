import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";

import DashboardLayout from "./dashboard/DashboardLayout";

import Inicio from "./dashboard/pages/Inicio";
import Espacios from "./dashboard/pages/Espacios";
import MisReservas from "./dashboard/pages/MisReservas";
import Horarios from "./dashboard/pages/Horarios";
import TecIA from "./dashboard/pages/TecIA";
import Perfil from "./dashboard/pages/Perfil";

/* ⭐ imports de admin */
import AdminLayout from "./admin/AdminLayout";
import RequireAdmin from "./admin/RequireAdmin";

import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminReservas from "./admin/pages/AdminReservas";
import AdminUsuarios from "./admin/pages/AdminUsuarios";
import AdminEspacios from "./admin/pages/AdminEspacios";
import AdminHorarios from "./admin/pages/AdminHorarios";
import EspacioFormPage from "./admin/pages/EspacioFormPage";   // ⭐ NUEVO

function App() {
  return (
    <Routes>
      {/* LANDING + LOGIN */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* USUARIO */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="inicio" element={<Inicio />} />
        <Route path="espacios" element={<Espacios />} />
        <Route path="reservas" element={<MisReservas />} />
        <Route path="horarios" element={<Horarios />} />
        <Route path="chat" element={<TecIA />} />
        <Route path="perfil" element={<Perfil />} />
      </Route>

      {/* ADMINISTRADOR */}
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="reservas" element={<AdminReservas />} />
        <Route path="usuarios" element={<AdminUsuarios />} />
        <Route path="espacios" element={<AdminEspacios />} />
        <Route path="horarios" element={<AdminHorarios />} />

        {/* ⭐ CRUD DE ESPACIOS */}
        <Route path="espacios/crear" element={<EspacioFormPage />} />
        <Route path="espacios/:id" element={<EspacioFormPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
