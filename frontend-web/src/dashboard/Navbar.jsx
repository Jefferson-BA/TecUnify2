import React from "react";
import { Sun, Moon, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const getInitials = (email) => {
    if (!email) return "U";
    return email.charAt(0).toUpperCase();
  };

  return (
    <header
      className={`
        sticky top-0 z-50
        backdrop-blur-xl 
        border-b transition-all
        ${darkMode
          ? // 🌙 MODO OSCURO
            "bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800 border-gray-700 shadow-black/30"
          : // 🌞 MODO CLARO
            "bg-white border-gray-300 shadow-gray-300"
        }
      `}
    >
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .navbar-animate { animation: slideDown 0.5s ease-out; }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between navbar-animate">

          {/* Usuario */}
          <div className="flex items-center gap-3">

            {/* Avatar */}
            <div className="relative group">
              <div
                className="
                  w-10 h-10 rounded-full 
                  bg-gradient-to-br from-blue-500 to-indigo-600
                  flex items-center justify-center text-white
                  font-bold shadow-lg shadow-blue-500/30
                  group-hover:scale-110 transition-all
                "
              >
                {getInitials(email)}
              </div>

              <div
                className="
                  absolute -bottom-1 -right-1 
                  w-3.5 h-3.5 bg-emerald-500 rounded-full
                  border-2 border-white dark:border-gray-900
                "
              ></div>
            </div>

            {/* Email */}
            <div>
              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Bienvenido
              </p>
              <h1 className={`text-sm font-semibold ${darkMode ? "text-white" : "text-black"}`}>
                {email || "Usuario"}
              </h1>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-3">

            {/* Toggle tema */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`
                group p-2.5 rounded-xl border transition-all
                ${darkMode
                  ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                  : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                }
              `}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-blue-600" />
              )}
            </button>

            <div
              className={`
                w-px h-8 
                ${darkMode ? "bg-gray-700" : "bg-gray-300"}
              `}
            />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all
                ${darkMode
                  ? "bg-red-500/10 text-red-300 border border-red-500/30 hover:bg-red-500/20"
                  : "bg-red-100 text-red-600 border border-red-300 hover:bg-red-200"
                }
              `}
            >
              <LogOut className="w-4 h-4" />
              <span className="font-semibold text-sm">Salir</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
