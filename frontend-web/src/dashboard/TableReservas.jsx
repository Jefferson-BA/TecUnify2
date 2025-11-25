import React, { useState, useMemo } from "react";
import { Calendar, Clock, FileText, CheckCircle, XCircle, Trash2 } from "lucide-react";

export default function TableReservas({ reservas, onCancelar }) {
  const [estadoFiltro, setEstadoFiltro] = useState("TODOS");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // ================================
  // FILTRO Y PAGINACIÓN
  // ================================
  const filtradas = useMemo(() => {
    let r = [...reservas];
    if (estadoFiltro !== "TODOS") r = r.filter((res) => res.estado === estadoFiltro);
    return r;
  }, [reservas, estadoFiltro]);

  const totalPages = Math.max(1, Math.ceil(filtradas.length / pageSize));
  const current = filtradas.slice((page - 1) * pageSize, page * pageSize);

  // ================================
  // BADGES DE ESTADO
  // ================================
  const getEstadoBadge = (estado) => {
    const base =
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold";

    const map = {
      CONFIRMADA: `
        ${base}
        bg-emerald-50 text-emerald-700 border-emerald-200
        dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30
      `,
      PENDIENTE: `
        ${base}
        bg-amber-50 text-amber-700 border-amber-200
        dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30
      `,
      CANCELADA: `
        ${base}
        bg-red-50 text-red-700 border-red-200
        dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30
      `,
      COMPLETADA: `
        ${base}
        bg-blue-50 text-blue-700 border-blue-200
        dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30
      `,
    };

    const Icon =
      estado === "CONFIRMADA"
        ? CheckCircle
        : estado === "CANCELADA"
          ? XCircle
          : Clock;

    return (
      <span className={map[estado] || map["PENDIENTE"]}>
        <Icon className="w-3.5 h-3.5" />
        {estado}
      </span>
    );
  };

  return (
    <div className="w-full">
      {/* ======================= */}
      {/* FILTRO DE ESTADO */}
      {/* ======================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span
            className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 
                       dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/30"
          >
            <FileText className="w-4 h-4" />
          </span>
          Lista de Reservas
        </h2>

        <select
          value={estadoFiltro}
          onChange={(e) => {
            setEstadoFiltro(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 rounded-lg text-sm transition-colors duration-300"
          style={{
            backgroundColor: "var(--card-bg)",
            color: "var(--text-color)",
            border: "1px solid var(--border-color)",
          }}
        >
          <option value="TODOS">Todos los estados</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="CONFIRMADA">Confirmada</option>
          <option value="CANCELADA">Cancelada</option>
          <option value="COMPLETADA">Completada</option>
        </select>

      </div>

      {/* ============================= */}
      {/* CONTENEDOR PRINCIPAL (FIX REAL) */}
      {/* ============================= */}
      <div
        className="rounded-2xl p-6 shadow-sm transition-colors duration-300"
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--border-color)",
          color: "var(--text-color)",
        }}
      >
        {/* ======================= */}
        {/* SI NO HAY RESULTADOS */}
        {/* ======================= */}
        {current.length === 0 ? (
          <div className="text-center py-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full 
                            bg-gray-100 dark:bg-gray-800 mb-4">
              <Calendar className="w-8 h-8 text-gray-400 dark:text-gray-600" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No se encontraron reservas.
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
              Intenta cambiar el filtro de estado
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {current.map((r, i) => (
              <div
                key={r.id}
                className="group rounded-xl p-5 transition-all duration-300 hover:shadow-md"
                style={{
                  backgroundColor: "var(--card-bg)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3
                      className="text-lg font-bold text-gray-900 dark:text-white mb-2
                                 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors"
                    >
                      {r.espacioNombre || r.espacio?.nombre}
                    </h3>

                    {getEstadoBadge(r.estado)}
                  </div>

                  {r.estado !== "CANCELADA" && (
                    <button
                      onClick={() => onCancelar(r)}
                      className="
                        p-2 rounded-lg 
                        bg-red-50 text-red-600 border border-red-100
                        hover:bg-red-100 hover:border-red-200
                        dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30
                        dark:hover:bg-red-500/20 dark:hover:border-red-500/50
                        transition-all duration-300 hover:scale-105
                      "
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* FECHA HORA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    <span>{r.fechaReserva}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                    <span>
                      {r.horaInicio} - {r.horaFin}
                    </span>
                  </div>
                </div>

                {/* MOTIVO */}
                {r.motivo && (
                  <div
                    className="mt-3 pt-3"
                    style={{ borderTop: "1px solid var(--border-color)" }}
                  >
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                      Motivo:
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {r.motivo}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ======================= */}
        {/* PAGINACIÓN */}
        {/* ======================= */}
        <div className="flex items-center justify-between mt-6 text-xs">
          <span className="text-gray-500 dark:text-gray-400">
            Página {page} de {totalPages}
          </span>

          <div className="space-x-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="
                px-3 py-1 rounded-lg 
                bg-gray-100 text-gray-700 border border-gray-200
                dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700
                disabled:opacity-40 disabled:cursor-not-allowed
              "
            >
              Anterior
            </button>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="
                px-3 py-1 rounded-lg 
                bg-gray-100 text-gray-700 border border-gray-200
                dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700
                disabled:opacity-40 disabled:cursor-not-allowed
              "
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
