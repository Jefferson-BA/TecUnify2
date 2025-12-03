import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle, BadgeCheck, Loader2, Calendar, Clock, MapPin, User, Filter, Download } from "lucide-react";

const API_BASE = "http://localhost:8081/api";

export default function AdminReservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("TODOS");

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/reservas`, {
        headers: { "X-User-Role": "ADMIN" },
      });
      if (!res.ok) throw new Error("Error cargando reservas");
      const data = await res.json();
      setReservas(data);
    } catch (e) {
      console.error(e);
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (id, estado) => {
    try {
      setUpdatingId(id);

      const res = await fetch(
        `${API_BASE}/reservas/${id}/estado?estado=${encodeURIComponent(estado)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-User-Role": "ADMIN",
          },
          body: "{}",
        }
      );

      if (!res.ok) throw new Error("Error al actualizar estado");
      await cargarReservas();
    } catch (e) {
      console.error(e);
      alert("No se pudo actualizar la reserva");
    } finally {
      setUpdatingId(null);
    }
  };

  const badgeColor = (estado) => {
    switch (estado) {
      case "PENDIENTE":
        return "bg-yellow-900 bg-opacity-30 text-yellow-400 border-yellow-800";
      case "CONFIRMADA":
        return "bg-green-900 bg-opacity-30 text-green-400 border-green-800";
      case "CANCELADA":
        return "bg-red-900 bg-opacity-30 text-red-400 border-red-800";
      case "COMPLETADA":
        return "bg-blue-900 bg-opacity-30 text-blue-400 border-blue-800";
      default:
        return "bg-gray-700 text-gray-400 border-gray-600";
    }
  };

  const reservasFiltradas = filtroEstado === "TODOS"
    ? reservas
    : reservas.filter(r => r.estado === filtroEstado);

  const estadisticas = {
    total: reservas.length,
    pendientes: reservas.filter(r => r.estado === "PENDIENTE").length,
    confirmadas: reservas.filter(r => r.estado === "CONFIRMADA").length,
    completadas: reservas.filter(r => r.estado === "COMPLETADA").length,
    canceladas: reservas.filter(r => r.estado === "CANCELADA").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Gestión de Reservas
            </h1>
            <p className="text-gray-400 mt-2">
              Administra y controla todas las reservas del sistema
            </p>
          </div>

          <button className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-xl flex items-center gap-2 font-medium transition-all shadow-lg hover:shadow-xl w-fit">
            <Download className="w-5 h-5" />
            Exportar
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 border border-gray-700">
            <p className="text-gray-400 text-xs mb-1">Total</p>
            <p className="text-2xl font-bold text-white">{estadisticas.total}</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 border border-gray-700">
            <p className="text-gray-400 text-xs mb-1">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-400">{estadisticas.pendientes}</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 border border-gray-700">
            <p className="text-gray-400 text-xs mb-1">Confirmadas</p>
            <p className="text-2xl font-bold text-green-400">{estadisticas.confirmadas}</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 border border-gray-700">
            <p className="text-gray-400 text-xs mb-1">Completadas</p>
            <p className="text-2xl font-bold text-blue-400">{estadisticas.completadas}</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 border border-gray-700">
            <p className="text-gray-400 text-xs mb-1">Canceladas</p>
            <p className="text-2xl font-bold text-red-400">{estadisticas.canceladas}</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-400" />
          <div className="flex gap-2 flex-wrap">
            {["TODOS", "PENDIENTE", "CONFIRMADA", "COMPLETADA", "CANCELADA"].map((estado) => (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filtroEstado === estado
                  ? "bg-white text-gray-900 shadow-lg"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                  }`}
              >
                {estado}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Cargando reservas...</p>
            </div>
          ) : reservasFiltradas.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-300 text-lg font-medium mb-2">
                No hay reservas {filtroEstado !== "TODOS" && `con estado ${filtroEstado}`}
              </p>
              <p className="text-gray-500 text-sm">
                Las reservas aparecerán aquí cuando se registren
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-900 bg-opacity-50 border-b border-gray-700">
                  <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Usuario</th>
                    <th className="px-6 py-4">Espacio</th>
                    <th className="px-6 py-4">Fecha</th>
                    <th className="px-6 py-4">Horario</th>
                    <th className="px-6 py-4">Motivo</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {reservasFiltradas.map((r) => (
                    <tr
                      key={r.id}
                      className="hover:bg-gray-800 hover:bg-opacity-50 transition-all"
                    >
                      <td className="px-6 py-4">
                        <span className="text-gray-400 font-mono text-xs">#{r.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-white font-medium">{r.usuarioNombre}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-300">{r.espacioNombre}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-300">{r.fechaReserva}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-300 whitespace-nowrap">
                            {r.horaInicio} - {r.horaFin}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-400 line-clamp-1 max-w-xs">
                          {r.motivo || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full border text-xs font-medium ${badgeColor(
                            r.estado
                          )}`}
                        >
                          {r.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          {r.estado !== "CONFIRMADA" && (
                            <button
                              disabled={updatingId === r.id}
                              onClick={() => cambiarEstado(r.id, "CONFIRMADA")}
                              className="p-2 bg-green-900 bg-opacity-30 hover:bg-opacity-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                              title="Confirmar"
                            >
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                            </button>
                          )}
                          {r.estado !== "CANCELADA" && (
                            <button
                              disabled={updatingId === r.id}
                              onClick={() => cambiarEstado(r.id, "CANCELADA")}
                              className="p-2 bg-red-900 bg-opacity-30 hover:bg-opacity-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                              title="Cancelar"
                            >
                              <XCircle className="w-4 h-4 text-red-400" />
                            </button>
                          )}
                          {r.estado !== "COMPLETADA" && (
                            <button
                              disabled={updatingId === r.id}
                              onClick={() => cambiarEstado(r.id, "COMPLETADA")}
                              className="p-2 bg-blue-900 bg-opacity-30 hover:bg-opacity-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                              title="Completar"
                            >
                              <BadgeCheck className="w-4 h-4 text-blue-400" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Info */}
        {!loading && reservasFiltradas.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Mostrando {reservasFiltradas.length} de {reservas.length} reservas
          </div>
        )}
      </div>
    </div>
  );
}