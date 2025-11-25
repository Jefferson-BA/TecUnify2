import React from "react";
import { Users, Clock, Calendar, Layers } from "lucide-react";

export default function StatsCards({ data }) {
  const cards = [
    { title: "Espacios Disponibles", value: data.espacios, icon: <Layers />, color: "blue" },
    { title: "Reservas Hoy", value: data.reservasHoy, icon: <Calendar />, color: "green" },
    { title: "Pendientes", value: data.reservasPendientes, icon: <Clock />, color: "yellow" },
    { title: "Usuarios Activos", value: data.usuariosActivos, icon: <Users />, color: "purple" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-bold text-gray-800 dark:text-gray-200">{card.title}</div>
            <div>{card.icon}</div>
          </div>

          <div className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}
