import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, MapPin, Users, DollarSign, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getEspacios, deleteEspacio } from "../services/espaciosService";

export default function AdminEspacios() {
  const [espacios, setEspacios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  const cargar = async () => {
    setLoading(true);
    const data = await getEspacios();
    setEspacios(data);
    setLoading(false);
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar el espacio "${nombre}"?`)) return;
    
    setDeleting(id);
    try {
      await deleteEspacio(id);
      await cargar();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el espacio");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Gestión de Espacios
            </h1>
            <p className="text-gray-400 mt-2">
              Administra todos los espacios disponibles para reserva
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/espacios/crear")}
            className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-xl flex items-center gap-2 font-medium transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Nuevo Espacio
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Espacios</p>
                <p className="text-3xl font-bold text-white mt-1">{espacios.length}</p>
              </div>
              <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-gray-300" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Activos</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {espacios.filter(e => e.activo).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-900 bg-opacity-30 rounded-xl flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Capacidad Total</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {espacios.reduce((sum, e) => sum + (e.capacidad || 0), 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-gray-600 border-t-white rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">Cargando espacios...</p>
            </div>
          ) : espacios.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-300 text-lg font-medium mb-2">No hay espacios registrados</p>
              <p className="text-gray-500 text-sm mb-6">Comienza creando tu primer espacio</p>
              <button
                onClick={() => navigate("/admin/espacios/crear")}
                className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-xl inline-flex items-center gap-2 font-medium transition-all"
              >
                <Plus className="w-5 h-5" />
                Crear Espacio
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {espacios.map((e) => (
                <div
                  key={e.id}
                  className="p-6 hover:bg-gray-800 hover:bg-opacity-50 transition-all group"
                >
                  <div className="flex items-center gap-6">
                    {/* Imagen */}
                    <div className="flex-shrink-0">
                      {e.imagenUrl ? (
                        <img
                          src={e.imagenUrl}
                          className="w-24 h-24 rounded-xl object-cover border-2 border-gray-700 group-hover:border-gray-600 transition-all shadow-lg"
                          alt={e.nombre}
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-700 rounded-xl flex items-center justify-center border-2 border-gray-700">
                          <Package className="w-8 h-8 text-gray-500" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-1">
                            {e.nombre}
                          </h3>
                          {e.descripcion && (
                            <p className="text-gray-400 text-sm line-clamp-1">
                              {e.descripcion}
                            </p>
                          )}
                        </div>
                        
                        {/* Estado */}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          e.activo 
                            ? 'bg-green-900 bg-opacity-30 text-green-400 border border-green-800' 
                            : 'bg-gray-700 text-gray-400 border border-gray-600'
                        }`}>
                          {e.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>

                      {/* Detalles en grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        {e.ubicacion && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-300">{e.ubicacion}</span>
                          </div>
                        )}
                        
                        {e.capacidad && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-300">{e.capacidad} personas</span>
                          </div>
                        )}
                        
                        {e.precioPorHora && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-300">S/. {e.precioPorHora}/hora</span>
                          </div>
                        )}

                        {e.tipoEspacioId && (
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-300">Tipo {e.tipoEspacioId}</span>
                          </div>
                        )}
                      </div>

                      {/* Equipamiento */}
                      {e.equipamiento && (
                        <div className="flex items-start gap-2 mt-2">
                          <Package className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-400 line-clamp-1">{e.equipamiento}</p>
                        </div>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => navigate(`/admin/espacios/${e.id}`)}
                        className="p-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-all group/btn"
                        title="Editar"
                      >
                        <Edit className="w-5 h-5 text-gray-300 group-hover/btn:text-white" />
                      </button>

                      <button
                        onClick={() => handleDelete(e.id, e.nombre)}
                        disabled={deleting === e.id}
                        className="p-3 bg-gray-700 hover:bg-red-900 hover:bg-opacity-30 rounded-xl transition-all group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5 text-gray-300 group-hover/btn:text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}