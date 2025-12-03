class RealAIService {
  constructor() {
    this.backendURL = "http://localhost:8081/api/ia/chat";
  }

  async sendMessage(message) {
    try {
      const response = await fetch(this.backendURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        throw new Error("Error comunicando con la IA real");
      }

      return await response.text();

    } catch (error) {
      console.error("❌ Error en RealAIService:", error);
      throw new Error("No pude obtener respuesta de la IA real.");
    }
  }
}

export const realAIService = new RealAIService();
