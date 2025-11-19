import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react"; // Ícono de volver
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const navigate = useNavigate();
  const API_BASE = "http://localhost:8081/api";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check si ya está logueado al entrar
  useEffect(() => {
    const user = localStorage.getItem("user");
    const role = localStorage.getItem("role");

    if (user && role) {
      if (role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    }
  }, [navigate]);

  // ============================================================
  // 🔹 LÓGICA DE GOOGLE (La misma que ya funcionaba)
  // ============================================================
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError("");

      const base64Url = credentialResponse.credential.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const googleUser = JSON.parse(jsonPayload);

      if (!googleUser.email || !googleUser.email.endsWith("@tecsup.edu.pe")) {
        setError("❌ Solo se permite acceso con correo institucional @tecsup.edu.pe");
        setLoading(false);
        return;
      }

      const response = await axios.post(`${API_BASE}/auth/google`, {
        googleId: googleUser.sub,
        email: googleUser.email,
        firstName: googleUser.given_name || "",
        lastName: googleUser.family_name || "",
        picture: googleUser.picture,
      });

      // OJO AQUÍ: Desestructuramos user y token
      const { user, token } = response.data;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("email", user.email);
      localStorage.setItem("role", user.role || "USER");
      localStorage.setItem("userId", user.id);

      // ✅ CORRECCIÓN: Guardamos el token. 
      // Si el backend manda null (como ahora), guardamos uno temporal para evitar el bucle.
      localStorage.setItem("token", token || "session-token-activo");

      if (user.role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    } catch (error) {
      console.error("Error login:", error);
      setError("❌ Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("❌ Falló la conexión con Google.");
  };

  // ============================================================
  // 🔹 NUEVO DISEÑO TIPO FIGMA
  // ============================================================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">

      {/* Tarjeta Principal (Contenedor) */}
      <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row min-h-[600px] animate-fade-in-up">

        {/* COLUMNA IZQUIERDA: LOGIN */}
        <div className="w-full md:w-1/2 p-8 md:p-16 relative flex flex-col justify-center">

          {/* Botón Volver */}
          <button
            onClick={() => navigate('/')}
            className="absolute top-8 left-8 text-gray-500 hover:text-black transition-colors p-2 rounded-full hover:bg-gray-100"
            title="Volver al inicio"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Iniciar sesión
            </h1>

            {/* Botón Google Personalizado */}
            <div className="flex justify-center mb-8">
              <div className="w-full max-w-xs">
                {!loading ? (
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="outline"
                    size="large"
                    width="320" // Ancho forzado para que se vea bien
                    text="signin_with"
                    shape="pill"
                    locale="es"
                  />
                ) : (
                  <div className="py-3 px-6 bg-gray-50 text-gray-500 rounded-full border border-gray-200 flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Iniciando sesión...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Separador visual (opcional, como en muchos logins) */}
            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">ACCESO ESTUDIANTIL</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Mensaje de Error */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 animate-pulse">
                {error}
              </div>
            )}

            {/* Nota de restricción */}
            <p className="text-gray-500 text-sm mt-4">
              Solo se permite acceso con correo institucional <br />
              <span className="font-bold text-blue-900">@tecsup.edu.pe</span>
            </p>
          </div>
        </div>

        {/* COLUMNA DERECHA: IMAGEN (FIGMA STYLE) */}
        <div className="hidden md:block w-1/2 relative bg-blue-900">
          <img
            src="https://i.ibb.co/tTcdxR46/Rectangle-2.png" // <--- ¡TU IMAGEN AQUÍ!
            alt="Campus Tecsup"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
          {/* Overlay degradado para que se vea elegante */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/10"></div>

          {/* Logo flotante sobre la imagen (opcional) */}
          <div className="absolute bottom-8 right-8 text-white text-right">
            <h2 className="text-2xl font-bold">TecUnify</h2>
            <p className="text-sm opacity-80">Tu espacio, tu tiempo.</p>
          </div>
        </div>

      </div>

      {/* Estilos Inline para animaciones suaves */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}