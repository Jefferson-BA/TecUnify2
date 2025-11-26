import React, { useState } from "react";
import { Calendar, X } from "lucide-react";

export default function CalendarReservas({ reservas = [], googleEvents = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const getDaysInMonth = (date) => {
    const y = date.getFullYear();
    const m = date.getMonth();
    return {
      daysInMonth: new Date(y, m + 1, 0).getDate(),
      startingDayOfWeek: new Date(y, m, 1).getDay(),
    };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const normalize = (d) => d.split("T")[0];

  // === RESERVAS ===
  const reservasDelDia = (iso) =>
    reservas.filter((r) => normalize(r.fechaReserva) === iso);

  // === GOOGLE CALENDAR ===
  const eventosGoogleDelDia = (iso) =>
    googleEvents.filter((ev) => {
      if (!ev.start) return false;
      const start =
        ev.start.date?.split("T")[0] ||
        ev.start.dateTime?.split("T")[0];
      return start === iso;
    });

  const clickDay = (day) => {
    const iso = normalize(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      ).toISOString()
    );

    setSelectedDay({
      iso,
      reservas: reservasDelDia(iso),
      google: eventosGoogleDelDia(iso),
      day,
    });
  };

  const changeMonth = (n) =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + n, 1)
    );

  const monthNames = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];

  const dayNames = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

  const today = new Date();

  return (
    <>
      {/* ======================== */}
      {/*       CALENDARIO         */}
      {/* ======================== */}
      <div
        className="calendar-container rounded-2xl p-6 shadow-lg sticky top-24 space-y-4 transition-colors duration-300"
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--border-color)"
        }}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="calendar-title flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <Calendar className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            Calendario
          </h2>

          <div className="flex gap-2">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
            >
              ‹
            </button>
            <button
              onClick={() => changeMonth(1)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
            >
              ›
            </button>
          </div>
        </div>

        {/* MES */}
        <div className="text-center text-lg font-semibold text-gray-900 dark:text-gray-200">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>

        {/* DÍAS DE LA SEMANA */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map((d) => (
            <div
              key={d}
              className="calendar-label text-center text-xs font-semibold text-gray-500 dark:text-gray-400"
            >
              {d}
            </div>
          ))}
        </div>

        {/* GRID DE DÍAS */}
        <div className="grid grid-cols-7 gap-2">
          {/* DÍAS VACÍOS AL INICIO */}
          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            <div key={`e-${i}`} className="aspect-square day-cell-empty" />
          ))}

          {/* DÍAS DEL MES */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;

            const iso = normalize(
              new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
              ).toISOString()
            );

            const rDay = reservasDelDia(iso);
            const gDay = eventosGoogleDelDia(iso);

            const isToday =
              today.getDate() === day &&
              today.getMonth() === currentDate.getMonth() &&
              today.getFullYear() === currentDate.getFullYear();

            const hasEvents = rDay.length > 0 || gDay.length > 0;

            return (
              <div
                key={day}
                onClick={() => clickDay(day)}
                className={`
                  day-cell cursor-pointer border flex flex-col
                  ${isToday
                    ? "bg-blue-600 text-white border-blue-400 shadow-md"
                    : hasEvents
                    ? "day-event"
                    : ""}
                `}
              >
                <span className="text-sm font-semibold">{day}</span>

                {/* Mini listado */}
                <div className="mt-1 space-y-1 overflow-hidden text-[10px] leading-tight">
                  {rDay.slice(0, 2).map((r, idx) => (
                    <div
                      key={idx}
                      className="bg-black/20 rounded px-1 py-[1px] truncate"
                    >
                      {r.horaInicio}-{r.horaFin}
                    </div>
                  ))}

                  {gDay.slice(0, 2).map((ev, idx) => (
                    <div
                      key={idx}
                      className="bg-blue-900/30 dark:bg-blue-700/30 rounded px-1 py-[1px] truncate"
                    >
                      {ev.summary || "(Evento)"}
                    </div>
                  ))}

                  {(rDay.length + gDay.length > 2) && (
                    <div className="opacity-60 truncate">(más...)</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================== */}
      {/*          MODAL          */}
      {/* ======================== */}

      {selectedDay && (
        <div
          className="
            fixed inset-0 bg-black/40 dark:bg-black/60 
            backdrop-blur-sm flex items-center justify-center 
            z-50 animate-fadeIn
          "
        >
          <div
            className="
              rounded-2xl p-6 w-[90%] max-w-lg shadow-2xl 
              transition-colors duration-300
            "
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
              color: "var(--text-color)",
            }}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                Detalles del {selectedDay.day}
              </h3>

              <button
                onClick={() => setSelectedDay(null)}
                className="
                  p-2 rounded-lg 
                  hover:bg-gray-200 dark:hover:bg-gray-700 
                  transition
                "
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* RESERVAS */}
            <h4 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">
              Reservas
            </h4>

            {selectedDay.reservas.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No hay reservas
              </p>
            ) : (
              selectedDay.reservas.map((r, i) => (
                <div
                  key={i}
                  className="p-3 mb-2 rounded-lg border transition"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <strong>{r.horaInicio} - {r.horaFin}</strong>
                  <br />
                  {r.espacioNombre}
                  {r.motivo && (
                    <div className="text-xs opacity-70">{r.motivo}</div>
                  )}
                </div>
              ))
            )}

            {/* GOOGLE CALENDAR */}
            <h4 className="font-semibold mt-4 mb-2 text-purple-600 dark:text-purple-400">
              Google Calendar
            </h4>

            {selectedDay.google.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No hay eventos
              </p>
            ) : (
              selectedDay.google.map((ev, i) => (
                <div
                  key={i}
                  className="p-3 mb-2 rounded-lg border transition"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <strong>{ev.summary || "(Sin título)"}</strong>
                  <div className="text-xs opacity-70">
                    {ev.start?.dateTime || ev.start?.date}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
