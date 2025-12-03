// Servicio oficial de TecIA conectado al backend de TecUnify
// Limpio, directo y funcional

class AIService {
  constructor() {
    this.backendURL = "http://localhost:8081/api/tecla/chat";
  }

  // Enviar mensaje al backend
  async sendMessage(message) {
    try {
      const response = await fetch(this.backendURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        throw new Error("Error comunicando con el servidor de TecIA");
      }

      const data = await response.text();
      return data;

    } catch (error) {
      console.error("❌ Error en aiService:", error);
      throw new Error("No pude obtener respuesta. Verifica que el backend esté ejecutándose.");
    }
  }

  // Solo para mostrar el nombre del modelo actual en tu UI
  getCurrentModelInfo() {
    return {
      name: "TecIA (Modelo interno inteligente)",
      provider: "TecUnify Backend",
      available: true
    };
  }
}

export const aiService = new AIService();
