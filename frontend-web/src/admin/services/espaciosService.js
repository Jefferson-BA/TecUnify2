// src/admin/services/espaciosService.js

const API = "http://localhost:8081/api/espacios";

// ===================================
// GET ALL
// ===================================
export async function getEspacios() {
  const res = await fetch(API);
  if (!res.ok) throw new Error("Error al obtener espacios");
  return res.json(); // List<EspacioDTO>
}

// ===================================
// GET BY ID
// ===================================
export async function getEspacio(id) {
  const res = await fetch(`${API}/${id}`);
  if (!res.ok) throw new Error("Error al obtener espacio");
  return res.json(); // EspacioDTO
}

// ===================================
// CREATE → devuelve EspacioDTO
// ===================================
export async function createEspacio(data) {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Role": "ADMIN",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error creando espacio: ${text}`);
  }

  return res.json();
}

// ===================================
// UPDATE → devuelve EspacioDTO
// ===================================
export async function updateEspacio(id, data) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-User-Role": "ADMIN",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error actualizando espacio: ${text}`);
  }

  return res.json();
}

// ===================================
// DELETE
// ===================================
export async function deleteEspacio(id) {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: { "X-User-Role": "ADMIN" },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error eliminando espacio: ${text}`);
  }
}

// ===================================
// UPLOAD IMAGE (ARCHIVO REAL)
//   → devuelve EspacioDTO con imagenUrl
// ===================================
export async function uploadImagenEspacio(id, file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API}/${id}/imagen`, {
    method: "POST",
    headers: {
      "X-User-Role": "ADMIN",
    },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error subiendo imagen: ${text}`);
  }

  return res.json(); // EspacioDTO con imagenUrl
}
