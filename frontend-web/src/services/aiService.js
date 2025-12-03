class AIService {
  constructor() {
    this.teciaURL = "http://localhost:8081/api/tecla/chat";
    this.geminiURL = "http://localhost:8081/api/ia/chat";
  }

  // Palabras clave para detectar TecUnify
  TECUNIFY_KEYWORDS = [
    "sala", "laboratorio", "laboratorios", "cancha", "espacio",
    "reservar", "reservado", "disponible", "horario", "hora",
    "agenda", "libre", "ocupado", "fechas", "reuniones"
  ];

  isTecUnifyQuestion(message) {
    if (!message || typeof message !== "string") return false;
    const msg = message.toLowerCase();
    return this.TECUNIFY_KEYWORDS.some(keyword => msg.includes(keyword));
  }

  // 📌 Router principal
  async sendMessage(message) {
    try {
      if (this.isTecUnifyQuestion(message)) {
        console.log("🤖 Usando IA interna TecIA");
        return await this.askTecIA(message);
      }

      console.log("⚡ Usando Gemini 2.5 Flash");
      return await this.askGemini(message);

    } catch (error) {
      console.error("❌ Error en AIService:", error);
      throw new Error("No pude obtener respuesta de la IA.");
    }
  }

  // ✔️ Llamada IA Interna
  async askTecIA(message) {
    const response = await fetch(this.teciaURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    if (!response.ok) throw new Error("Error comunicando con TecIA");

    return await response.text();
  }

  // ✔️ Llamada a tu backend con Gemini
  async askGemini(message) {
  const response = await fetch(this.geminiURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  if (!response.ok)
    throw new Error("Error comunicando con Gemini");

  // Backend devuelve un string, NO JSON
  const text = await response.text();
  return text;
}


  // Modelo usado
  getCurrentModelInfo(message) {
    return this.isTecUnifyQuestion(message)
      ? {
          name: "TecIA (Sistema de Reservas)",
          provider: "Backend TecUnify",
          available: true
        }
      : {
          name: "Gemini 2.5 Flash",
          provider: "Google AI Studio",
          available: true
        };
  }
}

export const aiService = new AIService();
