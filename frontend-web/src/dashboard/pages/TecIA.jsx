import React from "react";
import TecIAChat from "../../components/TecIAChat";
import { Bot, Sparkles, MessageSquare } from "lucide-react";

export default function TecIA() {
  return (
    <div
      className="min-h-screen p-6"
      style={{ background: "var(--bg-main)", color: "var(--text-color)" }}
    >
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      {/* Header con gradiente y animación */}
      

      {/* Contenedor del Chat con estilo mejorado */}
      <div
        className="rounded-2xl p-6 border transition-all duration-300"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--border-color)",
          boxShadow: "var(--shadow)",
          animation: "slideIn 0.6s ease-out 0.1s both"
        }}
      >
        

        <div className="w-full">
          <TecIAChat />
        </div>
      </div>

      {/* Info cards opcionales */}
      <div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
        style={{ animation: "slideIn 0.7s ease-out 0.2s both" }}
      >
        {[
          
        ].map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl p-4 border flex items-center gap-3 
                       transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "var(--card-bg)",
              borderColor: "var(--border-color)",
              boxShadow: "var(--shadow)",
            }}
          >
            <div
              className="p-2 rounded-lg text-white"
              style={{ 
                background: `linear-gradient(135deg, ${item.color[0]}, ${item.color[1]})` 
              }}
            >
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">{item.title}</p>
              <p className="text-xs opacity-60">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}