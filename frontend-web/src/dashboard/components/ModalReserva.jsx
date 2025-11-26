import React, { useState } from "react";
import { Calendar, Clock, MessageSquare, X } from "lucide-react";

export default function ModalReserva({ espacio, onClose, onConfirm }) {
  const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [motivo, setMotivo] = useState("");

  if (!espacio) return null;

  const validarReserva = () => {
    if (!horaInicio.endsWith(":00") || !horaFin.endsWith(":00")) {
      alert("Solo se permiten horas exactas (sin minutos)");
      return false;
    }
    return true;
  };

  const handleConfirm = () => {
    if (!validarReserva()) return;

    onConfirm({
      fechaReserva: fecha,
      horaInicio,
      horaFin,
      motivo,
    });
  };

  return (
    <div
      className="
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/40 dark:bg-black/70 backdrop-blur-sm
        animate-fadeIn
      "
    >
      <style>{`
        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.95) }
          to   { opacity: 1; transform: scale(1) }
        }

        .animate-pop { animation: modalPop 0.25s ease-out }
        .animate-fadeIn { animation: fadeIn 0.25s ease-out }
      `}</style>

      <div
        className="
          animate-pop w-full max-w-md p-6 rounded-2xl shadow-xl
          border transition-all
        "
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--border-color)",
          color: "var(--text-color)",
        }}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Reservar: {espacio.nombre}
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORMULARIO */}
        <div className="space-y-4">
          {/* Fecha */}
          <div>
            <label className="block text-sm mb-1 opacity-70">Fecha</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-4 h-4 opacity-60" />

              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="
                  w-full pl-10 pr-3 py-2 rounded-lg
                  border focus:outline-none focus:ring-2
                  focus:ring-blue-500/50
                "
                style={{
                  background: "var(--card-bg)",
                  color: "var(--text-color)",
                  borderColor: "var(--border-color)",
                }}
              />
            </div>
          </div>

          {/* Horas */}
          <div className="flex gap-3">
            {/* Inicio */}
            <div className="flex-1">
              <label className="block text-sm mb-1 opacity-70">Inicio</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 w-4 h-4 opacity-60" />

                <input
                  type="time"
                  step="3600"
                  min="07:00"
                  max="22:00"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  className="
                    w-full pl-10 pr-3 py-2 rounded-lg border
                    focus:outline-none focus:ring-2
                    focus:ring-blue-500/50
                  "
                  style={{
                    background: "var(--card-bg)",
                    color: "var(--text-color)",
                    borderColor: "var(--border-color)",
                  }}
                />
              </div>
            </div>

            {/* Fin */}
            <div className="flex-1">
              <label className="block text-sm mb-1 opacity-70">Fin</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 w-4 h-4 opacity-60" />

                <input
                  type="time"
                  step="3600"
                  min="07:00"
                  max="22:00"
                  value={horaFin}
                  onChange={(e) => setHoraFin(e.target.value)}
                  className="
                    w-full pl-10 pr-3 py-2 rounded-lg border
                    focus:outline-none focus:ring-2
                    focus:ring-blue-500/50
                  "
                  style={{
                    background: "var(--card-bg)",
                    color: "var(--text-color)",
                    borderColor: "var(--border-color)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Motivo */}
          <div>
            <label className="block text-sm mb-1 opacity-70">Motivo</label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 w-4 h-4 opacity-60" />

              <input
                type="text"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Ej: entrenamiento, reunión..."
                className="
                  w-full pl-10 pr-3 py-2 rounded-lg border
                  focus:outline-none focus:ring-2
                  focus:ring-blue-500/50
                "
                style={{
                  background: "var(--card-bg)",
                  color: "var(--text-color)",
                  borderColor: "var(--border-color)",
                }}
              />
            </div>
          </div>
        </div>

        {/* BOTONES */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="
              px-4 py-2 rounded-lg font-medium
              bg-gray-200 dark:bg-gray-700
              hover:bg-gray-300 dark:hover:bg-gray-600
            "
          >
            Cancelar
          </button>

          <button
            onClick={handleConfirm}
            className="
              px-5 py-2 rounded-lg font-semibold text-white
              shadow-md shadow-blue-500/20
              hover:shadow-blue-500/40 hover:brightness-110
              bg-gradient-to-r from-blue-600 to-indigo-600
            "
          >
            Confirmar Reserva
          </button>
        </div>
      </div>
    </div>
  );
}
