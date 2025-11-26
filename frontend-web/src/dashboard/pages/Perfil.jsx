import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Perfil() {
  const email = localStorage.getItem("email");
  const [user, setUser] = useState(null);
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8081/api/auth/me?email=${email}`)
      .then((res) => {
        setUser(res.data);
        setPhone(res.data.phone || "");
      })
      .catch((err) => console.error(err));
  }, [email]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);

    try {
      await axios.put(`http://localhost:8081/api/users/${user.id}`, {
        ...user,
        phone: phone,
      });

      alert("Número actualizado correctamente");
    } catch (err) {
      alert("Error al actualizar");
    }

    setSaving(false);
  };

  if (!user) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-[var(--bg-card)] p-8 shadow-xl rounded-2xl border"
      style={{ borderColor: "var(--border-main)" }}>
      
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-transparent bg-clip-text">
        Mi Perfil
      </h1>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
          {email.charAt(0).toUpperCase()}
        </div>

        <div>
          <p className="text-lg font-semibold">{user.firstName} {user.lastName}</p>
          <p className="text-gray-400">{user.email}</p>
        </div>
      </div>

      {/* Datos bloqueados */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <label className="text-sm text-gray-500">Nombre</label>
          <p className="p-3 rounded-lg bg-gray-200 dark:bg-gray-800">{user.firstName}</p>
        </div>

        <div>
          <label className="text-sm text-gray-500">Apellido</label>
          <p className="p-3 rounded-lg bg-gray-200 dark:bg-gray-800">{user.lastName}</p>
        </div>

        <div>
          <label className="text-sm text-gray-500">Correo</label>
          <p className="p-3 rounded-lg bg-gray-200 dark:bg-gray-800">{user.email}</p>
        </div>

        <div>
          <label className="text-sm text-gray-500">Rol</label>
          <p className="p-3 rounded-lg bg-gray-200 dark:bg-gray-800">{user.role}</p>
        </div>
      </div>

      {/* ÚNICO CAMPO EDITABLE */}
      <div className="mb-6">
        <label className="text-sm text-gray-500">Número de teléfono</label>
        <input
          className="w-full p-3 rounded-lg border border-gray-400 dark:bg-gray-800"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Ej: 900123456"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:scale-105 transition-all"
      >
        {saving ? "Guardando..." : "Guardar Cambios"}
      </button>
    </div>
  );
}
