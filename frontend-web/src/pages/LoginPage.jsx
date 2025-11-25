import React, { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getGoogleAccessToken } from "../utils/googleAuth.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const API_BASE = "http://localhost:8081/api";

  const [error, setError] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) navigate("/dashboard/inicio", { replace: true });
  }, []);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError("");

      // Decodificar identidad
      const base64Url = credentialResponse.credential.split(".")[1];
      const googleUser = JSON.parse(atob(base64Url));

      if (!googleUser.email.endsWith("@tecsup.edu.pe")) {
        setError("❌ Solo correo institucional @tecsup.edu.pe");
        return;
      }

      // Obtener Access Token válido para todos los calendarios
      const accessToken = await getGoogleAccessToken();
      localStorage.setItem("google_access_token", accessToken);

      // Registrar en backend
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
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full flex">
        <div className="w-full lg:w-1/2 p-10">
          <h1 className="text-3xl font-bold mb-6">INICIAR SESIÓN</h1>

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("❌ Error con Google")}

            // SOLO scope que tu consola autoriza
            scope="https://www.googleapis.com/auth/calendar.events.readonly"
            prompt="consent"
          />

          {error && (
            <div className="bg-red-100 text-red-700 p-2 mt-3 rounded">
              {error}
            </div>
          )}
        </div>

        <div className="hidden lg:block lg:w-1/2">
          <img src="/Rectangle 2.png" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}
