import React, { useEffect, useState } from "react";
import { Tags } from "lucide-react";

const API_BASE = "http://localhost:8081/api";

export default function AdminMotivos() {
  const [motivos, setMotivos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/motivos`);
      const data = res.ok ? await res.json() : [];

      setMotivos(data);
    } catch (e) {
      console.error(e);
      setMotivos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-transparent bg-clip-text">
            Motivos de Reserva
          </span>
        </h1>
        <p className="text-sm text-gray-400">
          Listado de motivos disponibles en el sistema.
        </p>
      </div>

      <div
        className="rounded-2xl border p-4 md:p-6"
        style={{
          borderColor: "var(--border-color)",
          background: "var(--card-bg)",
        }}
      >
        {loading ? (
          <p className="text-sm text-gray-400">Cargando motivos...</p>
        ) : motivos.length === 0 ? (
          <p className="text-sm text-gray-400">No hay motivos registrados.</p>
        ) : (
          <div className="space-y-3">
            {motivos.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between border rounded-xl px-4 py-3"
                style={{ borderColor: "var(--border-color)" }}
              >
                <div className="flex items-center gap-2 text-gray-100">
                  <Tags className="w-4 h-4 text-blue-400" />
                  <span className="font-medium">{m.nombre}</span>
                </div>
                <span className="text-xs text-gray-400">ID: {m.id}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
