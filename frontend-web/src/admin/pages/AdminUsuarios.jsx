import React, { useEffect, useState } from "react";
import { Shield, Mail, User, Search, UserPlus, MoreVertical } from "lucide-react";

const API_BASE = "http://localhost:8081/api";

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/users`);
      const data = res.ok ? await res.json() : [];
      setUsuarios(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsuarios = usuarios.filter((u) =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeStyle = (role) => {
    const styles = {
      ADMIN: "bg-purple-900 bg-opacity-30 text-purple-400 border-purple-800",
      USER: "bg-blue-900 bg-opacity-30 text-blue-400 border-blue-800",
      MODERATOR: "bg-green-900 bg-opacity-30 text-green-400 border-green-800",
    };
    return styles[role] || "bg-gray-700 text-gray-400 border-gray-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Gestión de Usuarios
            </h1>
            <p className="text-gray-400 mt-2">
              Administra todos los usuarios registrados en TecUnify
            </p>
          </div>

          
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Usuarios</p>
                <p className="text-3xl font-bold text-white mt-1">{usuarios.length}</p>
              </div>
              <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-gray-300" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Administradores</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {usuarios.filter((u) => u.role === "ADMIN").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-900 bg-opacity-30 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Usuarios Regulares</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {usuarios.filter((u) => u.role === "USER").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-900 bg-opacity-30 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gradient-to-br from-gray-800 to-gray-900 text-white pl-12 pr-4 py-4 rounded-2xl border border-gray-700 focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-all"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-gray-600 border-t-white rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">Cargando usuarios...</p>
            </div>
          ) : filteredUsuarios.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-300 text-lg font-medium mb-2">
                {searchTerm ? "No se encontraron usuarios" : "No hay usuarios registrados"}
              </p>
              <p className="text-gray-500 text-sm">
                {searchTerm
                  ? "Intenta con otro término de búsqueda"
                  : "Los usuarios aparecerán aquí cuando se registren"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {filteredUsuarios.map((u) => (
                <div
                  key={u.id}
                  className="p-6 hover:bg-gray-800 hover:bg-opacity-50 transition-all group"
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Avatar y Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-gray-600 group-hover:border-gray-500 transition-all">
                        <User className="w-6 h-6 text-gray-300" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white truncate">
                          {u.firstName} {u.lastName || ""}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{u.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Role y Actions */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 ${getRoleBadgeStyle(
                          u.role
                        )}`}
                      >
                        <Shield className="w-3.5 h-3.5" />
                        {u.role}
                      </span>

                      <span className="text-xs text-gray-500 hidden sm:block">
                        ID: {u.id}
                      </span>

                      <button className="p-2 hover:bg-gray-700 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Info */}
        {!loading && filteredUsuarios.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Mostrando {filteredUsuarios.length} de {usuarios.length} usuarios
          </div>
        )}
      </div>
    </div>
  );
}