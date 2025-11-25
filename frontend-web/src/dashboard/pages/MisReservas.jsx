import React, { useEffect, useState } from "react";
import TableReservas from "../TableReservas";
import CalendarReservas from "../CalendarReservas";
import { useToast } from "../toast";

const API_BASE = "http://localhost:8081/api";

export default function MisReservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    try {
      setLoading(true);
      const email = localStorage.getItem("email");
      const res = await fetch(`${API_BASE}/reservas/mi?email=${email}`);
      if (!res.ok) throw new Error("Error");
      const data = await res.json();
      setReservas(data);
    } catch {
      showToast("Usando datos mock.", "warning");
      setReservas([
        {
          id: 1,
          espacioNombre: "Laboratorio A",
          fechaReserva: "2025-01-15",
          horaInicio: "09:00",
          horaFin: "11:00",
          motivo: "Estudio",
          estado: "CONFIRMADA",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (reserva) => {
    try {
      const res = await fetch(`${API_BASE}/reservas/${reserva.id}/cancelar`, {
        method: "PATCH",
      });

      if (!res.ok) throw new Error();
      showToast("Reserva cancelada.", "success");
      cargarReservas();
    } catch {
      showToast("Error al cancelar.", "error");
    }
  };

  if (loading)
    return (
      <div
        className="w-full flex items-center justify-center py-16"
        style={{ color: "var(--text-main)" }}
      >
        <div className="text-center">
          <div className="inline-block w-14 h-14 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
          <p className="text-sm">Cargando reservas...</p>
        </div>
      </div>
    );

  return (
    <div
      className="w-full px-6 py-6 space-y-8"
      style={{
        backgroundColor: "var(--bg-main)",
        color: "var(--text-main)",
      }}
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-1">
          <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-transparent bg-clip-text">
            Mis Reservas
          </span>
        </h1>
        <p className="text-sm opacity-80">
          Gestiona y visualiza todas tus reservas en un solo lugar.
        </p>
      </div>

      {/* Grid principal */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 w-full">
          <TableReservas reservas={reservas} onCancelar={handleCancelar} />
        </div>

        <div className="w-full">
          <CalendarReservas reservas={reservas} />
        </div>
      </div>
    </div>
  );
}
