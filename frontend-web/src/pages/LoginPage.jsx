import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { authAPI } from '../services/api';

function LoginPage({ onBack, onLoginSuccess, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await authAPI.login(formData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      alert(`¡Login exitoso! Bienvenido ${user.firstName || user.email}`);
      onLoginSuccess(user);
    } catch (err) {
      setError(err.response?.data || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    
    try {
      // Decodificar el token JWT de Google para obtener información del usuario
      const payload = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      
      console.log('Token de Google recibido:', credentialResponse.credential);
      console.log('Información del usuario:', payload);
      
      // Crear usuario simulado basado en la información de Google
      const mockUser = {
        email: payload.email,
        firstName: payload.given_name || 'Usuario',
        lastName: payload.family_name || 'Google',
        picture: payload.picture,
        googleId: payload.sub
      };
      
      // Simular login exitoso (temporal para testing)
      localStorage.setItem('token', 'mock-google-token-' + Date.now());
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      alert(`¡Login exitoso con Google! Bienvenido ${mockUser.firstName} ${mockUser.lastName}`);
      onLoginSuccess(mockUser);
      
      // TODO: Implementar llamada real al backend cuando esté listo
      // const response = await authAPI.loginWithGoogle(credentialResponse.credential);
      // const { token, user } = response.data;
      
    } catch (err) {
      console.error('Error procesando token de Google:', err);
      setError('Error al procesar la información de Google');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Error al iniciar sesión con Google');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      {/* Card Principal con dos columnas */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full flex animate-scale-in">
        
        {/* Columna Izquierda - Formulario */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 relative">
          {/* Botón Volver */}
          <button 
            onClick={onBack} 
            className="absolute top-6 left-6 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="mt-8">
            {/* Título */}
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              INICIAR SESIÓN
            </h1>

            {/* Botón Google */}
            <div className="mb-4 w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                text="signin_with"
                shape="pill"
                logo_alignment="left"
                locale="es"
              />
            </div>

            {/* Separador */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-500 text-sm">o</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="tu-email@tecsup.edu.pe"
                    className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-lg focus:border-cyan-400 focus:outline-none text-sm text-gray-700"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-lg focus:border-cyan-400 focus:outline-none text-sm text-gray-700"
                  />
                </div>
              </div>

              {/* Botón Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-400 text-white py-3 rounded-full font-medium hover:bg-cyan-500 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6 text-sm"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </form>

            {/* Link a Registro */}
            <div className="mt-4 text-center">
              <p className="text-gray-600 text-xs">
                ¿No tienes cuenta?{' '}
                <button 
                  onClick={onSwitchToRegister} 
                  className="text-cyan-500 font-semibold hover:underline"
                >
                  Regístrate aquí
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Columna Derecha - Imagen Tecsup */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img 
            src="/Rectangle 2.png" 
            alt="Campus Tecsup" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-scale-in {
          animation: scaleIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

export default LoginPage;