import React, { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getGoogleAccessToken } from "../utils/googleAuth.js";

import { Moon, Sun, Mail, Shield, CheckCircle, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const API_BASE = "http://localhost:8081/api";

  const [error, setError] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) navigate("/dashboard/inicio", { replace: true });
  }, []);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError("");
      setIsLoading(true);

      const base64Url = credentialResponse.credential.split(".")[1];
      const googleUser = JSON.parse(atob(base64Url));

      if (!googleUser.email.endsWith("@tecsup.edu.pe")) {
        setError("❌ Solo se permite correo institucional @tecsup.edu.pe");
        setIsLoading(false);
        return;
      }

      const accessToken = await getGoogleAccessToken();
      localStorage.setItem("google_access_token", accessToken);

      const response = await axios.post(`${API_BASE}/auth/google`, {
        googleId: googleUser.sub,
        email: googleUser.email,
        firstName: googleUser.given_name,
        lastName: googleUser.family_name,
        picture: googleUser.picture,
      });

      const user = response.data.user;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("email", user.email);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", user.id);

      navigate("/dashboard/inicio", { replace: true });
    } catch (err) {
      console.error(err);
      setError("❌ Error al iniciar sesión con Google");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("❌ Error al conectar con Google");
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
    >
      {/* === BOTÓN PARA REGRESAR A LA LANDING === */}
      <button
        onClick={() => navigate("/")}
        className={`fixed top-6 left-6 p-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg z-50 flex items-center gap-2 ${
          isDark
            ? "bg-gray-800 hover:bg-gray-700 text-white"
            : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
        }`}
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Volver</span>
      </button>

      {/* Botón dark/light */}
      <button
        onClick={() => setIsDark(!isDark)}
        className={`fixed top-6 right-6 p-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg z-50 ${
          isDark
            ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
            : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
        }`}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div
        className={`rounded-3xl shadow-2xl max-w-5xl w-full flex overflow-hidden transition-all duration-300 ${
          isDark
            ? "bg-gradient-to-br from-gray-900/95 to-gray-800/95 border border-gray-700/50"
            : "bg-white"
        }`}
      >
        {/* Left Section */}
        <div className="w-full lg:w-1/2 p-10 lg:p-12">
          <h1
            className={`text-4xl font-bold mb-3 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Iniciar Sesión
          </h1>

          <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Accede a la plataforma de reservas de Tecsup
          </p>

          {/* Features */}
          <div className="space-y-3 mt-6 mb-8">
            {[
              { icon: Shield, text: "Acceso seguro con tu cuenta institucional" },
              { icon: CheckCircle, text: "Reserva espacios en tiempo real" },
              { icon: Mail, text: "Solo correos @tecsup.edu.pe" },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isDark ? "bg-blue-500/10" : "bg-blue-50"
                    }`}
                  >
                    <Icon className="w-5 h-5 text-blue-500" />
                  </div>
                  <span
                    className={`${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Google Login */}
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            scope="https://www.googleapis.com/auth/calendar.events.readonly"
            prompt="consent"
          />

          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-blue-500 mt-3">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Iniciando sesión...</span>
            </div>
          )}

          {error && (
            <div
              className={`mt-4 p-4 rounded-xl border ${
                isDark
                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              {error}
            </div>
          )}

          <p
            className={`mt-8 pt-6 border-t text-sm text-center ${
              isDark
                ? "border-gray-700 text-gray-500"
                : "border-gray-200 text-gray-500"
            }`}
          >
            Al continuar, aceptas los términos y condiciones de uso
          </p>
        </div>

        {/* Right Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img
            src="/imglogin.jpg"
            className="w-full h-full object-cover"
            alt="Tecsup"
          />
        </div>
      </div>

      {/* Background decor */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div
          className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-20 ${
            isDark ? "bg-blue-500" : "bg-blue-300"
          }`}
        ></div>

        <div
          className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-20 ${
            isDark ? "bg-indigo-500" : "bg-purple-300"
          }`}
        ></div>
      </div>
    </div>
  );
}
