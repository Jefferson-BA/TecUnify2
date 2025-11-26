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

  if (!user) return <p className="text-center mt-10 text-[var(--text-main)]">Cargando...</p>;

  return (
    <div
      className="
        perfil-container 
        max-w-4xl mx-auto p-10 rounded-2xl shadow-xl border
        bg-[var(--bg-card)] text-[var(--text-main)]
      "
      style={{ borderColor: "var(--border-main)" }}
    >
      {/* Título */}
      <h1 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-blue-500 to-indigo-500 text-transparent bg-clip-text">
        Mi Perfil
      </h1>

      {/* HEADER */}
      <div className="flex items-center gap-6 mb-10">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
          {email.charAt(0).toUpperCase()}
        </div>

        <div>
          <p className="text-xl font-semibold">{user.firstName} {user.lastName}</p>
          <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
        </div>
      </div>

      {/* DATOS NO EDITABLES */}
      <div className="grid grid-cols-2 gap-8 mb-10">
        
        <div>
          <label className="perfil-label text-sm font-semibold">Nombre</label>
          <p className="perfil-input p-3 rounded-lg border mt-1">{user.firstName}</p>
        </div>

        <div>
          <label className="perfil-label text-sm font-semibold">Apellido</label>
          <p className="perfil-input p-3 rounded-lg border mt-1">{user.lastName}</p>
        </div>

        <div>
          <label className="perfil-label text-sm font-semibold">Correo</label>
          <p className="perfil-input p-3 rounded-lg border mt-1">{user.email}</p>
        </div>

        <div>
          <label className="perfil-label text-sm font-semibold">Rol</label>
          <p className="perfil-input p-3 rounded-lg border mt-1">{user.role}</p>
        </div>

      </div>

      {/* CAMPO EDITABLE */}
      <div className="mb-8">
        <label className="perfil-label text-sm font-semibold">Número de teléfono</label>
        <input
          className="
            perfil-input 
            w-full p-3 rounded-lg border mt-1
            bg-gray-100 text-gray-900
            dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600
          "
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Ej: 900123456"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="
          px-8 py-3 rounded-xl font-semibold 
          bg-gradient-to-r from-blue-600 to-indigo-600 
          text-white hover:scale-105 transition-all shadow-lg
        "
      >
        {saving ? "Guardando..." : "Guardar Cambios"}
      </button>
    </div>
  );
}
