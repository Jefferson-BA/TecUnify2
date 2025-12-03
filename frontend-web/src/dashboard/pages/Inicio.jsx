import React, { useEffect, useState } from "react";
import { Activity, TrendingUp, Clock, Users, Bell } from "lucide-react";

function StatCard({ title, value, icon: Icon, color, trend }) {
  return (
    <div
      className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 border"
      style={{
        background: "var(--card-bg)",
        color: "var(--text-color)",
        borderColor: "var(--border-color)",
        boxShadow: "var(--shadow)",
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm opacity-70">{title}</p>
          <h3 className="text-4xl font-bold">{value}</h3>

          {trend && (
            <div className="flex items-center gap-1 text-xs text-emerald-500">
              <TrendingUp className="w-3 h-3" />
              <span>{trend}</span>
            </div>
          )}
        </div>

        <div
          className="p-3 rounded-xl bg-gradient-to-br text-white shadow-md"
          style={{ background: `linear-gradient(135deg, ${color[0]}, ${color[1]})` }}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

function NotificationItem({ notification, index }) {
  return (
    <div
      className="rounded-xl p-4 border transition-all duration-300"
      style={{
        borderColor: "var(--border-color)",
        background: "var(--card-bg)",
        animation: `slideIn 0.3s ease-out ${index * 0.05}s both`,
        color: "var(--text-color)",
      }}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 w-2 h-2 rounded-full bg-blue-500" />

        <div className="flex-1">
          <p className="font-medium">{notification.accion}</p>

          {notification.detalle && (
            <p className="text-xs opacity-60">{notification.detalle}</p>
          )}

          <div className="text-[11px] opacity-50 mt-1 flex items-center gap-2">
            <Clock className="w-3 h-3" />
            {notification.timestamp
              ? new Date(notification.timestamp).toLocaleString()
              : "Sin fecha"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Inicio() {
  const [stats, setStats] = useState({
    espacios: 0,
    reservasHoy: 0,
    reservasPendientes: 0,
    usuariosActivos: 0,
  });

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem("email");
    const userId = localStorage.getItem("userId");

    cargarEstadisticas(email);
    cargarNotificaciones(email);
    const es = suscribirseSSE(userId);

    return () => {
      if (es) es.close();
    };
  }, []);

  const cargarEstadisticas = async (email) => {
    try {
      const resEspacios = await fetch("http://localhost:8081/api/espacios");
      const espacios = await resEspacios.json();

      const resReservas = await fetch(
        `http://localhost:8081/api/reservas/mi?email=${email}`
      );
      const reservas = await resReservas.json();

      const hoy = new Date().toISOString().split("T")[0];
      const reservasHoy = reservas.filter((r) => r.fechaReserva === hoy).length;
      const pendientes = reservas.filter((r) => r.estado === "PENDIENTE").length;

      setStats({
        espacios: espacios.length,
        reservasHoy,
        reservasPendientes: pendientes,
        usuariosActivos: 1,
      });
    } catch (e) {
      console.error("Error cargando estadísticas", e);
      setStats({
        espacios: 10,
        reservasHoy: 0,
        reservasPendientes: 0,
        usuariosActivos: 1,
      });
    } finally {
      setLoading(false);
    }
  };

  const cargarNotificaciones = async (email) => {
    try {
      const res = await fetch(
        `http://localhost:8081/api/actividad?email=${email}`
      );
      if (!res.ok) throw new Error("Error al cargar actividad");

      const data = await res.json();
      setNotifications(data);
    } catch (e) {
      console.error("Error cargando notificaciones", e);
      setNotifications([]);
    }
  };

  const suscribirseSSE = (userId) => {
  if (!userId) return null;

  let es = new EventSource("http://localhost:8081/api/actividad/stream");

  es.onmessage = () => {};  

  es.addEventListener("actividad", (event) => {
    try {
      const data = JSON.parse(event.data);
      const myId = Number(localStorage.getItem("userId"));

      if (data.usuarioId === myId) {
        setNotifications((prev) => [data, ...prev].slice(0, 50));
      }
    } catch (err) {
      console.error("Error parsing SSE data:", err);
    }
  });

  es.onerror = () => {
    console.warn("⚠ SSE desconectado. Reintentando...");
    es.close();

    // Reintenta en 3 segundos
    setTimeout(() => suscribirseSSE(userId), 3000);
  };

  return es;
};


  const statsConfig = [
    {
      title: "Espacios Disponibles",
      value: stats.espacios,
      icon: Activity,
      color: ["#3b82f6", "#2563eb"],
      trend: "+1 esta semana",
    },
    {
      title: "Reservas Hoy",
      value: stats.reservasHoy,
      icon: TrendingUp,
      color: ["#10b981", "#059669"],
    },
    {
      title: "Reservas Pendientes",
      value: stats.reservasPendientes,
      icon: Clock,
      color: ["#f59e0b", "#d97706"],
    },
    {
      title: "Usuarios Activos",
      value: stats.usuariosActivos,
      icon: Users,
      color: ["#a855f7", "#9333ea"],
    },
  ];

  return (
    <div
      className="min-h-screen p-6"
      style={{ background: "var(--bg-main)", color: "var(--text-color)" }}
    >
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <h1
        className="text-4xl font-bold mb-6 bg-gradient-to-r 
          from-blue-500 to-indigo-500 bg-clip-text text-transparent"
      >
        Dashboard General
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {loading
          ? [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-2xl animate-pulse"
                style={{ background: "var(--card-bg)" }}
              />
            ))
          : statsConfig.map((stat, i) => (
              <div key={i} style={{ animation: `slideIn 0.3s ${i * 0.1}s both` }}>
                <StatCard {...stat} />
              </div>
            ))}
      </div>

      <div
        className="border rounded-2xl p-6"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold">Actividad Reciente</h2>
        </div>

        {notifications.length === 0 ? (
          <p className="opacity-70">Aún no hay actividad reciente.</p>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {notifications.map((n, idx) => (
              <NotificationItem key={n.id ?? idx} notification={n} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
