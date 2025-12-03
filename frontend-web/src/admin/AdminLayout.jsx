import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Calendar, DoorOpen, Settings, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/admin/reservas", label: "Reservas", icon: Calendar },
    { to: "/admin/usuarios", label: "Usuarios", icon: Users },
    { to: "/admin/espacios", label: "Espacios", icon: DoorOpen },
    { to: "/admin/horarios", label: "Horarios", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* OVERLAY MOBILE */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 bg-gradient-to-b from-gray-900 to-black 
          border-r border-gray-800 
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Admin Panel
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <p className="text-gray-500 text-sm">Sistema de Gestión</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                      isActive
                        ? "bg-white text-gray-900 shadow-lg"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                          isActive ? "text-gray-900" : "text-gray-500"
                        }`}
                      />
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 bg-gray-900 rounded-full" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800">
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all w-full group">
              <LogOut className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar Mobile */}
        <div className="lg:hidden bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 p-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-lg font-bold text-white">Admin Panel</h1>
            <div className="w-10" />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}