import React, { useEffect, useState } from "react";
import { Activity, Users, CalendarDays, Building2, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";

const API_BASE = "http://localhost:8081/api";

function StatCard({ title, value, icon: Icon, subtitle, trend, color = "gray" }) {
  const colorClasses = {
    blue: "from-blue-600 to-blue-800",
    green: "from-green-600 to-green-800",
    purple: "from-purple-600 to-purple-800",
    orange: "from-orange-600 to-orange-800",
    gray: "from-gray-600 to-gray-800",
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs text-green-400">
            <TrendingUp className="w-3 h-3" />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">{title}</p>
        <p className="text-3xl font-bold text-white mb-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
}

function MiniStatCard({ label, value, icon: Icon, color = "gray" }) {
  const colorClasses = {
    yellow: "bg-yellow-900 bg-opacity-30 text-yellow-400 border-yellow-800",
    green: "bg-green-900 bg-opacity-30 text-green-400 border-green-800",
    blue: "bg-blue-900 bg-opacity-30 text-blue-400 border-blue-800",
    red: "bg-red-900 bg-opacity-30 text-red-400 border-red-800",
    gray: "bg-gray-700 text-gray-400 border-gray-600",
  };

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border ${colorClasses[color]}`}>
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        <span className="font-medium">{label}</span>
      </div>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    reservasHoy: 0,
    reservasPendientes: 0,
    reservasConfirmadas: 0,
    reservasCompletadas: 0,
    reservasCanceladas: 0,
    usuarios: 0,
    espacios: 0,
    totalReservas: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarStats();
  }, []);

  const cargarStats = async () => {
    try {
      const [resReservas, resUsuarios, resEspacios] = await Promise.all([
        fetch(`${API_BASE}/reservas`, {
          headers: { "X-User-Role": "ADMIN" },
        }),
        fetch(`${API_BASE}/users`),
        fetch(`${API_BASE}/espacios`),
      ]);

      const reservas = resReservas.ok ? await resReservas.json() : [];
      const usuarios = resUsuarios.ok ? await resUsuarios.json() : [];
      const espacios = resEspacios.ok ? await resEspacios.json() : [];

      const hoy = new Date().toISOString().split("T")[0];

      const reservasHoy = reservas.filter((r) => r.fechaReserva === hoy).length;
      const pendientes = reservas.filter((r) => r.estado === "PENDIENTE").length;
      const confirmadas = reservas.filter((r) => r.estado === "CONFIRMADA").length;
      const completadas = reservas.filter((r) => r.estado === "COMPLETADA").length;
      const canceladas = reservas.filter((r) => r.estado === "CANCELADA").length;

      setStats({
        reservasHoy,
        reservasPendientes: pendientes,
        reservasConfirmadas: confirmadas,
        reservasCompletadas: completadas,
        reservasCanceladas: canceladas,
        usuarios: usuarios.length,
        espacios: espacios.length,
        totalReservas: reservas.length,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Panel de Administración
            </h1>
            <p className="text-gray-400 mt-2">
              Resumen global del sistema TecUnify
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Actualizado hace un momento</span>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-40 rounded-2xl bg-gray-800 animate-pulse"
              />
            ))
          ) : (
            <>
              <StatCard
                title="Reservas Hoy"
                value={stats.reservasHoy}
                icon={CalendarDays}
                subtitle="Con fecha de hoy"
                color="blue"
                trend="+12%"
              />
              <StatCard
                title="Pendientes"
                value={stats.reservasPendientes}
                icon={Clock}
                subtitle="Esperando confirmación"
                color="orange"
              />
              <StatCard
                title="Usuarios"
                value={stats.usuarios}
                icon={Users}
                subtitle="Registrados en el sistema"
                color="purple"
                trend="+8%"
              />
              <StatCard
                title="Espacios"
                value={stats.espacios}
                icon={Building2}
                subtitle="Disponibles para reserva"
                color="green"
              />
            </>
          )}
        </div>

        {/* Secondary Stats - Estados de Reservas */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Estados de Reservas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-gray-700 animate-pulse" />
              ))
            ) : (
              <>
                <MiniStatCard
                  label="Pendientes"
                  value={stats.reservasPendientes}
                  icon={Clock}
                  color="yellow"
                />
                <MiniStatCard
                  label="Confirmadas"
                  value={stats.reservasConfirmadas}
                  icon={CheckCircle}
                  color="green"
                />
                <MiniStatCard
                  label="Completadas"
                  value={stats.reservasCompletadas}
                  icon={Activity}
                  color="blue"
                />
                <MiniStatCard
                  label="Canceladas"
                  value={stats.reservasCanceladas}
                  icon={XCircle}
                  color="red"
                />
              </>
            )}
          </div>
        </div>

        {/* Grid de 2 columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resumen Total */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">Resumen General</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-900 bg-opacity-50 rounded-xl">
                <span className="text-gray-300">Total de Reservas</span>
                <span className="text-2xl font-bold text-white">{stats.totalReservas}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-900 bg-opacity-50 rounded-xl">
                <span className="text-gray-300">Tasa de Confirmación</span>
                <span className="text-2xl font-bold text-green-400">
                  {stats.totalReservas > 0
                    ? Math.round((stats.reservasConfirmadas / stats.totalReservas) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-900 bg-opacity-50 rounded-xl">
                <span className="text-gray-300">Promedio por Espacio</span>
                <span className="text-2xl font-bold text-blue-400">
                  {stats.espacios > 0
                    ? Math.round(stats.totalReservas / stats.espacios)
                    : 0}
                </span>
              </div>
            </div>
          </div>

          {/* Próximas Mejoras */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">Próximas Funciones</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-900 bg-opacity-50 rounded-xl">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-200 font-medium text-sm">Gráficos de tendencias</p>
                  <p className="text-gray-500 text-xs">Visualización de reservas por mes</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-900 bg-opacity-50 rounded-xl">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-200 font-medium text-sm">Ranking de espacios</p>
                  <p className="text-gray-500 text-xs">Espacios más reservados</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-900 bg-opacity-50 rounded-xl">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-200 font-medium text-sm">Métricas por escuela</p>
                  <p className="text-gray-500 text-xs">Análisis de uso por facultad</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-900 bg-opacity-50 rounded-xl">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-200 font-medium text-sm">Reportes exportables</p>
                  <p className="text-gray-500 text-xs">Descarga de datos en PDF/Excel</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}