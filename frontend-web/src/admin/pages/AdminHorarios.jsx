import React, { useEffect, useState } from "react";
import { Calendar, Clock, Plus, Edit, Trash, X, Save, Copy, Zap, AlertCircle } from "lucide-react";

const API_BASE = "http://localhost:8081/api/horarios";

const DIAS_SEMANA = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

// Plantillas predefinidas de horarios
const PLANTILLAS_HORARIOS = [
  {
    nombre: "Horario Laboral Estándar",
    descripcion: "Lunes a Viernes, 8:00 - 18:00",
    horarios: [
      { diaSemana: 1, horaInicio: "08:00", horaFin: "18:00" },
      { diaSemana: 2, horaInicio: "08:00", horaFin: "18:00" },
      { diaSemana: 3, horaInicio: "08:00", horaFin: "18:00" },
      { diaSemana: 4, horaInicio: "08:00", horaFin: "18:00" },
      { diaSemana: 5, horaInicio: "08:00", horaFin: "18:00" },
    ],
  },
  {
    nombre: "Horario Extendido",
    descripcion: "Lunes a Sábado, 7:00 - 22:00",
    horarios: [
      { diaSemana: 1, horaInicio: "07:00", horaFin: "22:00" },
      { diaSemana: 2, horaInicio: "07:00", horaFin: "22:00" },
      { diaSemana: 3, horaInicio: "07:00", horaFin: "22:00" },
      { diaSemana: 4, horaInicio: "07:00", horaFin: "22:00" },
      { diaSemana: 5, horaInicio: "07:00", horaFin: "22:00" },
      { diaSemana: 6, horaInicio: "07:00", horaFin: "22:00" },
    ],
  },
  {
    nombre: "Fin de Semana",
    descripcion: "Sábado y Domingo, 10:00 - 16:00",
    horarios: [
      { diaSemana: 0, horaInicio: "10:00", horaFin: "16:00" },
      { diaSemana: 6, horaInicio: "10:00", horaFin: "16:00" },
    ],
  },
  {
    nombre: "24/7",
    descripcion: "Todos los días, todo el día",
    horarios: [
      { diaSemana: 0, horaInicio: "00:00", horaFin: "23:59" },
      { diaSemana: 1, horaInicio: "00:00", horaFin: "23:59" },
      { diaSemana: 2, horaInicio: "00:00", horaFin: "23:59" },
      { diaSemana: 3, horaInicio: "00:00", horaFin: "23:59" },
      { diaSemana: 4, horaInicio: "00:00", horaFin: "23:59" },
      { diaSemana: 5, horaInicio: "00:00", horaFin: "23:59" },
      { diaSemana: 6, horaInicio: "00:00", horaFin: "23:59" },
    ],
  },
];

function AdminHorarios() {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [plantillasOpen, setPlantillasOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({
    diaSemana: 1,
    horaInicio: "08:00",
    horaFin: "18:00",
  });

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE);
      const data = res.ok ? await res.json() : [];
      setHorarios(data);
    } catch (e) {
      console.error(e);
      setHorarios([]);
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (horario = null) => {
    if (horario) {
      setEditando(horario.id);
      setForm({
        diaSemana: horario.diaSemana,
        horaInicio: horario.horaInicio,
        horaFin: horario.horaFin,
      });
    } else {
      setEditando(null);
      setForm({ diaSemana: 1, horaInicio: "08:00", horaFin: "18:00" });
    }
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setEditando(null);
  };

  const guardar = async () => {
    try {
      const url = editando ? `${API_BASE}/${editando}` : API_BASE;
      const method = editando ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error al guardar");
      await cargar();
      cerrarModal();
    } catch (e) {
      console.error(e);
      alert("Error al guardar horario");
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este horario?")) return;

    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      await cargar();
    } catch (e) {
      console.error(e);
      alert("Error al eliminar horario");
    }
  };

  const aplicarPlantilla = async (plantilla) => {
    if (!window.confirm(`¿Aplicar la plantilla "${plantilla.nombre}"? Esto creará múltiples horarios.`)) {
      return;
    }

    try {
      // Crear todos los horarios de la plantilla
      for (const horario of plantilla.horarios) {
        await fetch(API_BASE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(horario),
        });
      }

      await cargar();
      setPlantillasOpen(false);
      alert("Plantilla aplicada exitosamente");
    } catch (e) {
      console.error(e);
      alert("Error al aplicar plantilla");
    }
  };

  const duplicarHorario = async (horario) => {
    try {
      const nuevoDia = (horario.diaSemana + 1) % 7;
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diaSemana: nuevoDia,
          horaInicio: horario.horaInicio,
          horaFin: horario.horaFin,
        }),
      });

      if (!res.ok) throw new Error("Error al duplicar");
      await cargar();
    } catch (e) {
      console.error(e);
      alert("Error al duplicar horario");
    }
  };

  // Agrupar horarios por día
  const horariosPorDia = DIAS_SEMANA.map((dia, index) => ({
    dia,
    index,
    horarios: horarios.filter((h) => h.diaSemana === index),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Gestión de Horarios
            </h1>
            <p className="text-gray-400 mt-2">
              Configura los horarios disponibles para cada día de la semana
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setPlantillasOpen(true)}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl flex items-center gap-2 font-medium transition-all"
            >
              <Zap className="w-5 h-5" />
              Plantillas
            </button>
            <button
              onClick={() => abrirModal()}
              className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-xl flex items-center gap-2 font-medium transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Nuevo Horario
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 border border-gray-700">
            <p className="text-gray-400 text-xs mb-1">Total Horarios</p>
            <p className="text-2xl font-bold text-white">{horarios.length}</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 border border-gray-700">
            <p className="text-gray-400 text-xs mb-1">Días Configurados</p>
            <p className="text-2xl font-bold text-white">
              {new Set(horarios.map((h) => h.diaSemana)).size}
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 border border-gray-700">
            <p className="text-gray-400 text-xs mb-1">Hora Más Temprana</p>
            <p className="text-2xl font-bold text-white">
              {horarios.length > 0
                ? horarios.reduce((min, h) => (h.horaInicio < min ? h.horaInicio : min), "23:59")
                : "--:--"}
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 border border-gray-700">
            <p className="text-gray-400 text-xs mb-1">Hora Más Tardía</p>
            <p className="text-2xl font-bold text-white">
              {horarios.length > 0
                ? horarios.reduce((max, h) => (h.horaFin > max ? h.horaFin : max), "00:00")
                : "--:--"}
            </p>
          </div>
        </div>

        {/* Horarios por Día */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-gray-600 border-t-white rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">Cargando horarios...</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {horariosPorDia.map((grupo) => (
                <div key={grupo.index} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      {grupo.dia}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {grupo.horarios.length} horario(s)
                    </span>
                  </div>

                  {grupo.horarios.length === 0 ? (
                    <div className="text-center py-6 bg-gray-900 bg-opacity-50 rounded-xl">
                      <p className="text-gray-500 text-sm">No hay horarios para este día</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {grupo.horarios.map((h) => (
                        <div
                          key={h.id}
                          className="bg-gray-900 bg-opacity-50 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all group"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-gray-300">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="font-medium">
                                {h.horaInicio} - {h.horaFin}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => duplicarHorario(h)}
                              className="flex-1 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all text-xs text-gray-300 flex items-center justify-center gap-1"
                              title="Duplicar"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => abrirModal(h)}
                              className="flex-1 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all text-xs text-gray-300 flex items-center justify-center gap-1"
                              title="Editar"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => eliminar(h.id)}
                              className="flex-1 p-2 bg-gray-800 hover:bg-red-900 hover:bg-opacity-30 rounded-lg transition-all text-xs text-gray-300 hover:text-red-400 flex items-center justify-center gap-1"
                              title="Eliminar"
                            >
                              <Trash className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Crear/Editar */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  {editando ? "Editar Horario" : "Nuevo Horario"}
                </h2>
                <button
                  onClick={cerrarModal}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Día de la Semana
                  </label>
                  <select
                    value={form.diaSemana}
                    onChange={(e) => setForm({ ...form, diaSemana: Number(e.target.value) })}
                    className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
                  >
                    {DIAS_SEMANA.map((dia, index) => (
                      <option key={index} value={index}>
                        {dia}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hora de Inicio
                  </label>
                  <input
                    type="time"
                    value={form.horaInicio}
                    onChange={(e) => setForm({ ...form, horaInicio: e.target.value })}
                    className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hora de Fin
                  </label>
                  <input
                    type="time"
                    value={form.horaFin}
                    onChange={(e) => setForm({ ...form, horaFin: e.target.value })}
                    className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
                  />
                </div>

                {form.horaInicio >= form.horaFin && (
                  <div className="flex items-start gap-2 p-3 bg-red-900 bg-opacity-20 border border-red-800 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-300">
                      La hora de fin debe ser posterior a la hora de inicio
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={cerrarModal}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-medium transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={guardar}
                  disabled={form.horaInicio >= form.horaFin}
                  className="flex-1 px-4 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Plantillas */}
        {plantillasOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Zap className="w-6 h-6" />
                  Plantillas de Horarios
                </h2>
                <button
                  onClick={() => setPlantillasOpen(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                {PLANTILLAS_HORARIOS.map((plantilla, index) => (
                  <div
                    key={index}
                    className="bg-gray-900 bg-opacity-50 rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {plantilla.nombre}
                        </h3>
                        <p className="text-sm text-gray-400">{plantilla.descripcion}</p>
                      </div>
                      <button
                        onClick={() => aplicarPlantilla(plantilla)}
                        className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-900 rounded-lg text-sm font-medium transition-all"
                      >
                        Aplicar
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {plantilla.horarios.map((h, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-xs"
                        >
                          {DIAS_SEMANA[h.diaSemana]}: {h.horaInicio}-{h.horaFin}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminHorarios;