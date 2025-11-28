import React, { useEffect, useState } from "react";
import { useToast } from "../toast";
import ModalReserva from "../components/ModalReserva";

import {
  MapPin,
  Users,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  Calendar,
} from "lucide-react";

const API_BASE = "http://localhost:8081/api";

export default function Espacios() {
  const [espacios, setEspacios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalEspacio, setModalEspacio] = useState(null);
  const { showToast } = useToast();

  // ================================
  //   USE EFFECT → Cargar + SSE
  // ================================
  useEffect(() => {
    cargarEspacios();

    const sse = new EventSource(${API_BASE}/espacios/stream);

    // Evento general
    sse.addEventListener("espacio-update", (evt) => {
      cargarEspacios();
    });

    return () => sse.close();
  }, []);

  // ================================
  //       ENVIAR RESERVA
  // ================================
  const enviarReserva = async (form) => {
    const email = localStorage.getItem("email");

    const body = {
      espacioId: modalEspacio.id,
      fechaReserva: form.fechaReserva,
      horaInicio: form.horaInicio,
      horaFin: form.horaFin,
      motivo: form.motivo,
    };

    const res = await fetch(${API_BASE}/reservas?email=${email}, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      showToast("Reserva creada con éxito", "success");

      // Notificación global
      window.dispatchEvent(new Event("reserva-creada"));
    } else {
      showToast("Error al crear reserva", "error");
    }

    setModalEspacio(null);
  };

  // ================================
  //      CARGAR ESPACIOS
  // ================================
  const cargarEspacios = async () => {
    try {
      setLoading(true);

      const res = await fetch(${API_BASE}/espacios);
      if (!res.ok) throw new Error("Error al cargar espacios");

      const data = await res.json();

      const dataConImagen = data.map((e) => ({
        ...e,
        imagen:
  e.imagenUrl
    ? ${e.imagenUrl.startsWith("/") ? "" : "/"}${e.imagenUrl}
    : "https://images.unsplash.com/photo-1584270354949-1c72f4fda5f8?q=80",

        estado: e.estado || "Disponible",
      }));

      setEspacios(dataConImagen);
    } catch (err) {
      console.error(err);
      showToast("Falló la carga. Usando mock.", "warning");
      setEspacios([]);
    } finally {
      setLoading(false);
    }
  };

  // ================================
  //       LOADING PREMIUM
  // ================================
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg-main)" }}
      >
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p style={{ color: "var(--text-color)" }}>Cargando espacios...</p>
        </div>
      </div>
    );
  }

  // ================================
  //       RENDER PRINCIPAL
  // ================================
  return (
    <div
      className="min-h-screen px-6 py-8"
      style={{ background: "var(--bg-main)" }}
    >
      <style>{`
        @keyframes cardSlideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
      `}</style>

      {/* HEADER */}
      <div className="mb-8" style={{ animation: "fadeIn 0.6s ease-out" }}>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
          Espacios Disponibles
        </h1>
        <p style={{ color: "var(--text-color-secondary)" }}>
          Encuentra y reserva el espacio perfecto.
        </p>
      </div>

      {/* GRID DE ESPACIOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {espacios.map((esp, index) => {
          const ocupado = esp.estado !== "Disponible";

          return (
            <div
              key={esp.id}
              style={{
                animation: cardSlideIn 0.5s ease-out ${index * 0.1}s both,
              }}
            >
              <div
                className={`rounded-2xl overflow-hidden border transition-all duration-300 ${
                  ocupado
                    ? "opacity-60"
                    : "hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-2"
                }`}
                style={{
                  background: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                }}
              >
                {/* Imagen */}
                <div className="relative h-48">
                  <img
                    src={esp.imagen}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      ocupado ? "" : "hover:scale-110"
                    }`}
                  />

                  {/* Estado */}
                  <div className="absolute top-4 right-4">
                    <div
                      className={`px-3 py-1.5 rounded-full text-xs font-medium text-white flex items-center gap-1.5 backdrop-blur-md ${
                        esp.estado === "Disponible"
                          ? "bg-emerald-500/90"
                          : "bg-red-500/90"
                      }`}
                    >
                      {esp.estado === "Disponible" ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Disponible
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4" />
                          Ocupado
                        </>
                      )}
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>

                {/* CONTENIDO */}
                <div className="p-6" style={{ color: "var(--text-color)" }}>
                  <h3 className="text-xl font-bold mb-3">{esp.nombre}</h3>

                  {ocupado && (
                    <p className="text-red-400 text-sm font-semibold mb-4 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Reservado por otro usuario
                    </p>
                  )}

                  {/* DETALLES */}
                  <div className="space-y-3 mb-6">
                    {/* Tipo */}
                    <Detalle
                      icon={<Calendar className="w-4 h-4 text-blue-400" />}
                      label="Tipo"
                      value={esp.tipoEspacioNombre}
                    />

                    {/* Ubicación */}
                    <Detalle
                      icon={<MapPin className="w-4 h-4 text-purple-400" />}
                      label="Ubicación"
                      value={esp.ubicacion}
                    />

                    {/* Capacidad */}
                    <Detalle
                      icon={<Users className="w-4 h-4 text-emerald-400" />}
                      label="Capacidad"
                      value={${esp.capacidad} personas}
                    />

                    {/* Precio */}
                    <Detalle
                      icon={<DollarSign className="w-4 h-4 text-amber-400" />}
                      label="Precio"
                      value={S/. ${esp.precioPorHora}/hora}
                    />
                  </div>

                  {/* BOTÓN DE RESERVA */}
                  <button
                    disabled={ocupado}
                    onClick={() => setModalEspacio(esp)}
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      ocupado
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:brightness-110 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
                    }`}
                    style={{ color: "#fff" }}
                  >
                    {ocupado ? (
                      <span className="flex items-center justify-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        No disponible
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Clock className="w-5 h-5" />
                        Reservar ahora
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {modalEspacio && (
        <ModalReserva
          espacio={modalEspacio}
          onClose={() => setModalEspacio(null)}
          onConfirm={enviarReserva}
        />
      )}
    </div>
  );
}

// =====================================================
// COMPONENTE PARA DETALLES (Mantiene claridad del JSX)
// =====================================================
function Detalle({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: "var(--card-bg-2)" }}
      >
        {icon}
      </div>
      <div>
        <span
          className="text-xs opacity-70 block"
          style={{ color: "var(--text-color-secondary)" }}
        >
          {label}
        </span>
        <p className="font-medium" style={{ color: "var(--text-color)" }}>
          {value || "-"}
        </p>
      </div>
    </div>
  );
}