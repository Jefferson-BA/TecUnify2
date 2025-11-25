import React from "react";
import { MapPin } from "lucide-react";

export default function MapEspacios({ espacios }) {
  // Mapa genérico de Tecsup / Lima (puedes cambiar center y zoom)
  const mapUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.5355207875806!2d-77.0365249!3d-12.0818633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c8c1a8c8a0f7%3A0x7f18a08d4a6c0f2!2sTECSUP!5e0!3m2!1ses!2spe!4v1700000000000";

  return (
    <div className="w-full p-2">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-500" />
          Mapa de Espacios
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 h-64 md:h-80 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
          <iframe
            src={mapUrl}
            className="w-full h-full"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

        <div className="space-y-2 max-h-80 overflow-auto text-sm">
          {espacios.slice(0, 8).map(e => (
            <div
              key={e.id}
              className="border border-gray-200 dark:border-gray-800 rounded-xl p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <div className="font-semibold">{e.nombre}</div>
              <div className="text-gray-500 dark:text-gray-400">
                {e.ubicacion}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Capacidad: {e.capacidad} • S/. {e.precioPorHora ?? e.precioHora ?? 0}/h
              </div>
            </div>
          ))}
          {espacios.length === 0 && (
            <p className="text-gray-500">No hay espacios registrados.</p>
          )}
        </div>
      </div>
    </div>
  );
}
