import React, { useEffect, useState } from "react";
import { Shapes, Edit, Trash2, Plus } from "lucide-react";

const API_BASE = "http://localhost:8081/api/tipos-espacios";

export default function AdminTiposEspacios() {
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE);
      const data = res.ok ? await res.json() : [];
      setTipos(data);
    } catch (e) {
      console.error(e);
      setTipos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-transparent bg-clip-text">
            Tipos de Espacios
          </span>
        </h1>
        <p className="text-sm text-gray-400">
          Gestión de categorías de espacios (laboratorios, salas, auditorios…).
        </p>
      </div>

      {/* BOTÓN SUPERIOR */}
      <div className="flex justify-end">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition"
        >
          <Plus className="w-4 h-4" />
          Nuevo Tipo
        </button>
      </div>

      {/* LISTA */}
      <div
        className="rounded-2xl border p-4 md:p-6 space-y-4"
        style={{
          borderColor: "var(--border-color)",
          background: "var(--card-bg)",
        }}
      >
        {loading ? (
          <p className="text-sm text-gray-400">Cargando...</p>
        ) : tipos.length === 0 ? (
          <p className="text-sm text-gray-400">No hay tipos registrados.</p>
        ) : (
          tipos.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between border rounded-xl px-4 py-3"
              style={{ borderColor: "var(--border-color)" }}
            >
              <div className="flex items-center gap-3">
                <Shapes className="w-5 h-5 text-purple-400" />
                <div>
                  <h3 className="font-medium text-gray-100">{t.nombre}</h3>
                  <p className="text-xs text-gray-400">{t.descripcion}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="p-2 rounded-lg hover:bg-blue-500/20 transition">
                  <Edit className="w-4 h-4 text-blue-400" />
                </button>
                <button className="p-2 rounded-lg hover:bg-red-500/20 transition">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
