import React, { useState } from "react";

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
      horaInicio: horaInicio,
      horaFin: horaFin,
      motivo: motivo,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-md">

        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Reservar: {espacio.nombre}
        </h2>

        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Fecha</label>
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)}
              className="form-control w-full" />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm mb-1">Inicio</label>
              <input 
                type="time" 
                step="3600" 
                min="07:00" 
                max="22:00"
                value={horaInicio} 
                onChange={(e) => setHoraInicio(e.target.value)}
                className="form-control w-full" 
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm mb-1">Fin</label>
              <input 
                type="time" 
                step="3600" 
                min="07:00" 
                max="22:00"
                value={horaFin} 
                onChange={(e) => setHoraFin(e.target.value)}
                className="form-control w-full" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Motivo</label>
            <input type="text" value={motivo} onChange={(e) => setMotivo(e.target.value)}
              className="form-control w-full" />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>

          <button
            className="btn text-white"
            style={{ background: "linear-gradient(to right, #2563eb, #4f46e5)" }}
            onClick={handleConfirm}
          >
            Confirmar Reserva
          </button>
        </div>
      </div>
    </div>
  );
}
