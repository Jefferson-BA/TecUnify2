import React, { useState, useMemo } from "react";

export default function TableEspacios({ espacios, onReservar }) {
  const [busqueda, setBusqueda] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtrados = useMemo(() => {
    const q = busqueda.toLowerCase();
    return espacios.filter(e =>
      e.nombre.toLowerCase().includes(q) ||
      (e.ubicacion || "").toLowerCase().includes(q) ||
      (e.tipoEspacioNombre || "").toLowerCase().includes(q)
    );
  }, [espacios, busqueda]);

  const totalPages = Math.max(1, Math.ceil(filtrados.length / pageSize));
  const current = filtrados.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="w-full">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h2 className="text-xl font-semibold">Listado de Espacios</h2>
        <input
          type="text"
          value={busqueda}
          onChange={e => {
            setBusqueda(e.target.value);
            setPage(1);
          }}
          placeholder="Buscar por nombre, tipo o ubicación..."
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm w-full md:w-72"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b border-gray-200 dark:border-gray-700">
              <th className="py-2 pr-2">Nombre</th>
              <th className="py-2 px-2">Tipo</th>
              <th className="py-2 px-2">Ubicación</th>
              <th className="py-2 px-2">Capacidad</th>
              <th className="py-2 px-2">Precio/hora</th>
              <th className="py-2 pl-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {current.map(e => (
              <tr key={e.id} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-2 font-medium">{e.nombre}</td>
                <td className="py-2 px-2 text-gray-600 dark:text-gray-300">
                  {e.tipoEspacioNombre || "-"}
                </td>
                <td className="py-2 px-2 text-gray-600 dark:text-gray-300">
                  {e.ubicacion}
                </td>
                <td className="py-2 px-2">{e.capacidad}</td>
                <td className="py-2 px-2">S/. {e.precioPorHora ?? e.precioHora ?? 0}</td>
                <td className="py-2 pl-2 text-right">
                  <button
                    onClick={() => onReservar(e)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium"
                  >
                    Reservar
                  </button>
                </td>
              </tr>
            ))}
            {current.length === 0 && (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500">
                  No se encontraron espacios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between mt-4 text-xs">
        <span className="text-gray-500">
          Página {page} de {totalPages}
        </span>
        <div className="space-x-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-700 disabled:opacity-40"
          >
            Anterior
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-700 disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
