import React from "react";
import { Sun, Moon, ShieldCheck } from "lucide-react";

export default function AdminTopbar() {
  const email = localStorage.getItem("email") || "admin@tecsup.edu.pe";

  return (
    <header
      className="h-16 flex items-center justify-between px-6 border-b"
      style={{
        borderColor: "var(--border-color)",
        background: "var(--bg-header, rgba(6, 10, 25, 0.9))",
        backdropFilter: "blur(18px)",
      }}
    >
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-blue-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          Administrador
        </p>
        <p className="text-sm text-gray-300">Gestión centralizada de reservas y espacios</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-xs text-right">
          <p className="font-medium text-gray-100">{email}</p>
          <p className="text-[11px] text-emerald-400">Sesión administrativa</p>
        </div>

        <button className="w-9 h-9 rounded-xl border flex items-center justify-center text-yellow-400 border-yellow-500/40">
          {/* aquí podrías conectar con tu toggle de tema si ya lo tienes */}
          <Sun className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
