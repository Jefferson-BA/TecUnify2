const API = "http://localhost:8081/api/tipos-espacios";

export async function getTiposEspacios() {
  const res = await fetch(API);
  if (!res.ok) throw new Error("Error obteniendo tipos de espacio");
  return res.json();
}
