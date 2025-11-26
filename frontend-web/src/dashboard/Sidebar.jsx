import React from "react";
import {
  Home,
  LayoutGrid,
  Calendar,
  ListCheck,
  MessageCircle,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ collapsed, setCollapsed }) {
  return (
    <div
      className={`sidebar-tec h-full shadow-xl transition-all duration-300
        text-[var(--text-main)]
        ${collapsed ? "w-20" : "w-64"}
      `}
      style={{
        backgroundColor: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border-main)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <div
        className="flex items-center justify-between p-4 border-b"
        style={{ borderColor: "var(--border-main)" }}
      >
        {!collapsed && (
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            TecUnify
          </h2>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-full transition"
          style={{
            backgroundColor: "var(--bg-main)",
            border: "1px solid var(--border-main)",
            color: "var(--text-main)",
          }}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      {/* LINKS DEL MENÚ */}
      <nav className="mt-6 space-y-2 flex-1">
        <SidebarItem collapsed={collapsed} icon={<Home />} label="Inicio" to="/dashboard/inicio" />
        <SidebarItem collapsed={collapsed} icon={<LayoutGrid />} label="Espacios" to="/dashboard/espacios" />
        <SidebarItem collapsed={collapsed} icon={<ListCheck />} label="Mis Reservas" to="/dashboard/reservas" />
        <SidebarItem collapsed={collapsed} icon={<Calendar />} label="Horarios" to="/dashboard/horarios" />
        <SidebarItem collapsed={collapsed} icon={<MessageCircle />} label="TecIA Chat" to="/dashboard/chat" />
      </nav>

      {/* PERFIL (ABAJO DEL TODO) */}
      <div className="mb-4 px-2">
        <SidebarItem
          collapsed={collapsed}
          icon={<User />}
          label="Mi Perfil"
          to="/dashboard/perfil"
        />
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, to, collapsed }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        flex items-center gap-3 p-3 rounded-lg transition font-medium
        ${isActive
          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
          : "hover:bg-gray-200 dark:hover:bg-gray-700"}
      `
      }
      style={{
        color: "var(--text-main)",
      }}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
}
