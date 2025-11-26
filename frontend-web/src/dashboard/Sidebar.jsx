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
      className={`
        fixed top-0 left-0
        h-screen
        flex flex-col justify-between
        shadow-xl transition-all duration-300
        bg-[var(--bg-sidebar)]
        border-r border-[var(--border-main)]
        ${collapsed ? "w-20" : "w-64"}
      `}
    >

      {/* HEADER con logo alineado y del tamaño correcto */}
      <div
        className="flex items-center justify-between p-4 border-b"
        style={{ borderColor: "var(--border-main)" }}
      >
        {!collapsed && (
          <div className="flex items-center gap-3">
            <img
              src="/logo1.png"
              alt="TecUnify Logo"
              className="h-12 w-auto object-contain scale-125"
              style={{ transformOrigin: "left center" }}
            />

          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-full transition hover:scale-110"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border-main)",
            color: "var(--text-main)",
          }}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>



      {/* MENÚ */}
      <nav className="flex-1 mt-6 px-2 space-y-2 overflow-hidden">
        <SidebarItem to="/dashboard/inicio" icon={<Home />} collapsed={collapsed} label="Inicio" />
        <SidebarItem to="/dashboard/espacios" icon={<LayoutGrid />} collapsed={collapsed} label="Espacios" />
        <SidebarItem to="/dashboard/reservas" icon={<ListCheck />} collapsed={collapsed} label="Mis Reservas" />
        <SidebarItem to="/dashboard/horarios" icon={<Calendar />} collapsed={collapsed} label="Horarios" />
        <SidebarItem to="/dashboard/chat" icon={<MessageCircle />} collapsed={collapsed} label="TecIA Chat" />
      </nav>

      {/* BOTÓN FIJO ABAJO */}
      <div className="px-2 pb-4">
        <SidebarItem
          to="/dashboard/perfil"
          icon={<User />}
          collapsed={collapsed}
          label="Mi Perfil"
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
      sidebar-item flex items-center gap-3 p-3 mx-2 font-medium
      
      ${isActive
          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
          : "text-[var(--text-main)]"}
    `
      }
    >

      <div className={`${collapsed ? "mx-auto" : ""}`}>
        {icon}
      </div>

      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
}

