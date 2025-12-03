import React, { useEffect, useState } from "react";
import {
  Save,
  X,
  Upload,
  Image as ImageIcon,
  MapPin,
  Users,
  DollarSign,
  Tag,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getEspacio,
  createEspacio,
  updateEspacio,
  uploadImagenEspacio,
} from "../services/espaciosService";

import { getTiposEspacios } from "../services/tipoEspacioService";

export default function EspacioFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    ubicacion: "",
    capacidad: "",
    tipoEspacioId: "",
    precioPorHora: "",
    equipamiento: "",
    imagenUrl: "",
    archivoImagen: null,
    activo: true,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tipos, setTipos] = useState([]);

  // ==========================================
  // Cargar tipos de espacio del backend
  // ==========================================
  useEffect(() => {
    const loadTipos = async () => {
      try {
        const data = await getTiposEspacios();
        setTipos(data);
      } catch (err) {
        console.error("Error cargando tipos:", err);
      }
    };
    loadTipos();
  }, []);

  // ==========================================
  // Cargar datos si es edición
  // ==========================================
  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const data = await getEspacio(id);
        setForm((prev) => ({
          ...prev,
          ...data,
          capacidad: data.capacidad ?? "",
          tipoEspacioId: data.tipoEspacioId ?? "",
          precioPorHora: data.precioPorHora ?? "",
          equipamiento: data.equipamiento ?? "",
          imagenUrl: data.imagenUrl ?? "",
          archivoImagen: null,
        }));
        setPreview(data.imagenUrl || null);
      } catch (err) {
        console.error(err);
        alert("Error cargando espacio");
      }
    };

    load();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const subirImagenLocal = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setForm((prev) => ({
      ...prev,
      archivoImagen: file,
    }));
  };

  // ==========================================
  // GUARDAR ESPACIO (Crear o Editar)
  // ==========================================
  const guardar = async () => {
    setLoading(true);
    try {
      const payload = {
        nombre: form.nombre || "",
        descripcion: form.descripcion || "",
        ubicacion: form.ubicacion || "",
        capacidad: form.capacidad ? Number(form.capacidad) : null,
        tipoEspacioId: form.tipoEspacioId
          ? Number(form.tipoEspacioId)
          : null,
        precioPorHora: form.precioPorHora
          ? Number(form.precioPorHora)
          : null,
        equipamiento: form.equipamiento || null,
        imagenUrl:
          form.imagenUrl && form.imagenUrl.trim() !== ""
            ? form.imagenUrl.trim()
            : null,
        activo: form.activo === true || form.activo === "true",
      };

      const espacioGuardado = id
        ? await updateEspacio(id, payload)
        : await createEspacio(payload);

      let espacioFinal = espacioGuardado;

      if (form.archivoImagen) {
        espacioFinal = await uploadImagenEspacio(
          espacioGuardado.id,
          form.archivoImagen
        );
      }

      console.log("Espacio final guardado:", espacioFinal);
      navigate("/admin/espacios");
    } catch (err) {
      console.error(err);
      alert("Error guardando espacio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/espacios")}
            className="text-gray-400 hover:text-white transition-colors mb-4 flex items-center gap-2 text-sm"
          >
            <X className="w-4 h-4" />
            Volver a Espacios
          </button>

          <h1 className="text-4xl font-bold text-white tracking-tight">
            {id ? "Editar Espacio" : "Nuevo Espacio"}
          </h1>
          <p className="text-gray-400 mt-2">
            {id
              ? "Actualiza la información del espacio"
              : "Completa los datos para crear un nuevo espacio"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Imagen */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-2xl sticky top-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-gray-400" />
                Imagen del Espacio
              </h2>

              <div className="relative mb-4 group">
                {preview ? (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Vista previa"
                      className="w-full h-64 object-cover rounded-xl border-2 border-gray-700"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gray-700 rounded-xl border-2 border-dashed border-gray-600 flex flex-col items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-500 mb-2" />
                    <p className="text-gray-400 text-sm">Sin imagen</p>
                  </div>
                )}
              </div>

              <label className="block cursor-pointer">
                <div className="bg-gray-700 hover:bg-gray-600 transition-all px-4 py-3 rounded-xl text-center text-white font-medium flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" />
                  Subir Imagen
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={subirImagenLocal}
                  className="hidden"
                />
              </label>

              {form.imagenUrl && (
                <div className="mt-4 p-3 bg-gray-950 rounded-lg border border-gray-700">
                  <p className="text-xs text-gray-500 mb-1">URL Actual</p>
                  <p className="text-xs text-gray-400 break-all font-mono">
                    {form.imagenUrl}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Columna derecha */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-2xl">
              <h2 className="text-lg font-semibold text-white mb-6">
                Información del Espacio
              </h2>

              <div className="space-y-5">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre del Espacio
                  </label>
                  <input
                    name="nombre"
                    value={form.nombre ?? ""}
                    onChange={handleChange}
                    placeholder="Ej: Sala de Conferencias A"
                    className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700"
                  />
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={form.descripcion ?? ""}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Describe el espacio..."
                    className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Ubicación */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      Ubicación
                    </label>
                    <input
                      name="ubicacion"
                      value={form.ubicacion ?? ""}
                      onChange={handleChange}
                      placeholder="Piso 2, Ala Norte"
                      className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700"
                    />
                  </div>

                  {/* Capacidad */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      Capacidad
                    </label>
                    <input
                      name="capacidad"
                      type="number"
                      value={form.capacidad ?? ""}
                      onChange={handleChange}
                      placeholder="20"
                      className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700"
                    />
                  </div>

                  {/* Tipo de Espacio (SELECT) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gray-400" />
                      Tipo de Espacio
                    </label>

                    <select
                      name="tipoEspacioId"
                      value={form.tipoEspacioId}
                      onChange={handleChange}
                      className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700"
                    >
                      <option value="">Seleccione un tipo...</option>
                      {tipos.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Precio por hora */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      Precio por Hora (S/.)
                    </label>
                    <input
                      name="precioPorHora"
                      type="number"
                      step="0.01"
                      value={form.precioPorHora ?? ""}
                      onChange={handleChange}
                      placeholder="50.00"
                      className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700"
                    />
                  </div>
                </div>

                {/* Equipamiento */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Equipamiento <span className="text-gray-500 text-xs">(opcional)</span>
                  </label>
                  <textarea
                    name="equipamiento"
                    value={form.equipamiento ?? ""}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Proyector, pizarra, parlantes..."
                    className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 resize-none"
                  />
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-700">
                <button
                  onClick={() => navigate("/admin/espacios")}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl flex items-center gap-2 text-white"
                  disabled={loading}
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>

                <button
                  onClick={guardar}
                  disabled={loading}
                  className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-xl flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Guardando..." : "Guardar Espacio"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
