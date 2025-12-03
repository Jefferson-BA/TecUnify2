import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, CalendarDays, Users, Building2, Clock, Tags, Shapes } from "lucide-react";

const linkBase =
  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const logout = () => {
    // si quieres, limpia solo cosas de admin
    // localStorage.removeItem("role");
    navigate("/dashboard/inicio");
  };

  const navItemClass = ({ isActive }) =>
    `${linkBase} ${
      isActive
        ? "bg-blue-600/90 text-white shadow-lg shadow-blue-500/30"
        : "text-gray-400 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <aside
      className="w-64 min-h-screen border-r px-4 py-6 flex flex-col"
      style={{ borderColor: "var(--border-color)", background: "var(--bg-sidebar, #050816)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/40">
          <span className="text-white font-bold text-lg">T</span>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Panel</p>
          <p className="font-semibold text-white text-sm">TecUnify Admin</p>
        </div>
      </div>

      {/* Links */}
      <nav className="space-y-1 flex-1">
        <NavLink to="/admin" end className={navItemClass}>
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/reservas" className={navItemClass}>
          <CalendarDays className="w-4 h-4" />
          <span>Reservas</span>
        </NavLink>

        <NavLink to="/admin/usuarios" className={navItemClass}>
          <Users className="w-4 h-4" />
          <span>Usuarios</span>
        </NavLink>

        <NavLink to="/admin/espacios" className={navItemClass}>
          <Building2 className="w-4 h-4" />
          <span>Espacios</span>
        </NavLink>

        <NavLink to="/admin/horarios" className={navItemClass}>
          <Clock className="w-4 h-4" />
          <span>Horarios</span>
        </NavLink>

        <NavLink to="/admin/motivos" className={navItemClass}>
          <Tags className="w-4 h-4" />
          <span>Motivos de reserva</span>
        </NavLink>

        <NavLink to="/admin/tipos-espacios" className={navItemClass}>
          <Shapes className="w-4 h-4" />
          <span>Tipos de espacios</span>
        </NavLink>
      </nav>

      {/* Footer */}
      <button
        onClick={logout}
        className="mt-4 text-xs text-gray-400 hover:text-red-400 transition-colors"
      >
        Volver al panel de usuario
      </button>
    </aside>
  );
}
