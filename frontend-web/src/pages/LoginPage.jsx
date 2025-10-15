import React, { useState } from 'react';
import { ArrowLeft, LogIn, Mail, Lock } from 'lucide-react';
import { authAPI } from '../services/api';

function LoginPage({ onBack, onLoginSuccess, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

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
      alert(`¡Bienvenido ${user.firstName}!`);
      onLoginSuccess(user);
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    alert('Función de Google Login próximamente');
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Columna Izquierda - Imagen Tecsup */}
      <div className="hidden lg:block lg:w-1/2 relative animate-slide-in-left">
        <div className="absolute inset-0">
          {/* Aquí va la imagen real de Tecsup */}
          <img 
            src="https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=1000&fit=crop" 
            alt="Campus Tecsup" 
            className="w-full h-full object-cover"
          />
          {/* Overlay con logo */}
          <div className="absolute inset-0 bg-blue-900/40 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <div className="mb-6">
                <div className="w-32 h-32 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
                  <span className="text-white text-6xl font-bold">T</span>
                </div>
              </div>
              <h2 className="text-4xl font-bold mb-3">TECSUP</h2>
              <p className="text-xl">Sistema de Reservas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Columna Derecha - Formulario */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 relative animate-slide-in-right">
        {/* Botón Volver */}
        <button 
          onClick={onBack} 
          className="absolute top-8 left-8 text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="w-full max-w-md">
          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Iniciar sesión
          </h1>

          {/* Botón Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white border-2 border-gray-300 rounded-full py-3 px-6 flex items-center justify-center gap-3 hover:bg-gray-50 transition mb-4 mt-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-gray-700 font-medium text-sm">iniciar sesión con google</span>
          </button>

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
          <form onSubmit={handleSubmit} className="space-y-3">
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
                  placeholder="EMAIL O TELÉFONO"
                  className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-lg focus:border-cyan-400 focus:outline-none text-sm text-gray-700 placeholder-gray-500"
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
                  placeholder="CONTRASEÑA"
                  className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-lg focus:border-cyan-400 focus:outline-none text-sm text-gray-700 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Links adicionales */}
            <div className="flex justify-between items-center text-xs">
              <button type="button" className="text-gray-500 hover:text-cyan-500">
                ¿Has olvidado tu contraseña?
              </button>
              <button 
                type="button"
                onClick={onSwitchToRegister}
                className="text-cyan-500 hover:text-cyan-600 font-semibold"
              >
                Registrarse
              </button>
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="keepLoggedIn"
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                className="w-4 h-4 text-green-500 border-2 border-gray-300 rounded focus:ring-0"
              />
              <label htmlFor="keepLoggedIn" className="text-gray-700 text-sm">
                Mantener la sesión iniciada
              </label>
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-400 text-white py-3 rounded-full font-medium hover:bg-cyan-500 transition disabled:opacity-50 disabled:cursor-not-allowed mt-4 text-sm"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          {/* Link a Register alternativo */}
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-xs">
              ¿No tienes cuenta?{' '}
              <button 
                onClick={onSwitchToRegister} 
                className="text-blue-600 font-semibold hover:underline"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.6s ease-out;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default LoginPage;