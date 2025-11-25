import React, { useEffect, useState } from "react";
import CalendarReservas from "../CalendarReservas";
import { useToast } from "../toast";

const API_BASE = "http://localhost:8081/api";

export default function Horarios() {
  const [reservas, setReservas] = useState([]);
  const [googleEvents, setGoogleEvents] = useState([]);
  const { showToast } = useToast();

  const accessToken = localStorage.getItem("google_access_token");

  useEffect(() => {
    cargarReservas();
    window.addEventListener("reserva-completada", cargarReservas);

    // 🔵 Escuchar cuando se crea una nueva reserva en la página principal
    const listener = () => cargarReservas();
    window.addEventListener("reserva-creada", listener);

    // 🔵 SSE: escuchar eventos del backend de reservas
    const email = localStorage.getItem("email");
    const sse = new EventSource(`${API_BASE}/reservas/stream`);

    sse.addEventListener("reserva-cancelada-auto", (event) => {
      try {
        const payload = JSON.parse(event.data || "{}");

        // Si viene email y no es del usuario logueado, ignorar
        if (payload.usuarioEmail && payload.usuarioEmail !== email) return;

        // Toast para el usuario
        showToast("Tu reserva fue cancelada por inasistencia", "warning");

        // Guardar notificación en localStorage para mostrar en Inicio
        const detalle = `${payload.espacioNombre || "Espacio"} · ${
          payload.fechaReserva || ""
        } ${payload.horaInicio || ""}`;

        const nueva = {
          type: "AUTO_CANCEL",
          message: "Tu reserva fue cancelada por inasistencia",
          detalle,
          timestamp: new Date().toISOString(),
        };

        let prev = [];
        const prevRaw = localStorage.getItem("notificaciones");
        if (prevRaw) {
          try {
            prev = JSON.parse(prevRaw);
          } catch {
            prev = [];
          }
        }

        localStorage.setItem(
          "notificaciones",
          JSON.stringify([...prev, nueva])
        );

        // Refrescar reservas
        cargarReservas();
      } catch (err) {
        console.error("Error procesando SSE reserva-cancelada-auto", err);
      }
    });

    const stored = localStorage.getItem("google_events");
    if (stored) setGoogleEvents(JSON.parse(stored));

    return () => {
      window.removeEventListener("reserva-creada", listener);
      sse.close();
    };
  }, []);

  const cargarReservas = async () => {
    try {
      const email = localStorage.getItem("email");

      const res = await fetch(`${API_BASE}/reservas/mi?email=${email}`);
      const data = await res.json();

      setReservas(data);
    } catch (e) {
      showToast("Error cargando reservas", "warning");
    }
  };

  const cargarGoogleCalendar = async () => {
    if (!accessToken)
      return showToast("Debes vincular Google Calendar", "warning");

    try {
      const listRes = await fetch(
        "https://www.googleapis.com/calendar/v3/users/me/calendarList",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const listData = await listRes.json();
      if (!listData.items) return;

      let allEvents = [];

      for (const cal of listData.items) {
        const evRes = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
            cal.id
          )}/events`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        const evData = await evRes.json();

        if (evData.items) {
          const validEvents = evData.items
            .filter((ev) => ev.status !== "cancelled")
            .filter((ev) => ev.start)
            .map((ev) => ({
              ...ev,
              _calendarName: cal.summary,
            }));

          allEvents.push(...validEvents);
        }
      }

      localStorage.setItem("google_events", JSON.stringify(allEvents));
      setGoogleEvents(allEvents);

      showToast("Google Calendar cargado correctamente", "success");
    } catch (e) {
      console.error(e);
      showToast("Error obteniendo Google Calendar", "error");
    }
  };

  const desconectarGoogle = () => {
    localStorage.removeItem("google_access_token");
    localStorage.removeItem("google_events");
    setGoogleEvents([]);
  };

  return (
    <div className="w-full space-y-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
        Horarios de Espacios
      </h1>

      <div className="flex gap-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          onClick={cargarGoogleCalendar}
        >
           Cargar Google Calendar
        </button>

        <button
          className="px-4 py-2 bg-gray-400 text-white rounded-lg"
          onClick={desconectarGoogle}
        >
           Desconectar
        </button>
      </div>

      <CalendarReservas reservas={reservas} googleEvents={googleEvents} />
      
    </div>
  );
}
