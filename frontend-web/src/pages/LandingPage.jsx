import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Componente NavbarLanding
function NavbarLanding({ isDark, toggleTheme }) {

  // Estado para detectar scroll y activar efecto "glass"
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`
      fixed top-0 w-full z-50 transition-all duration-500
      backdrop-blur-2xl 
      ${isScrolled
          ? `${isDark
            ? "bg-gray-900/40 border-gray-700/30 shadow-xl"
            : "bg-white/40 border-gray-300/30 shadow-lg"
          } border-b`
          : "bg-transparent border-transparent shadow-none"
        }
    `}
    >
      <div className="max-w-7xl mx-auto px-6 py-2">
        <div className="flex items-center justify-between">

          {/* LOGO */}
          <div className="flex items-center gap-3">
            <img
              src="./logo1.png"
              alt="TecUnify Logo"
              className="h-12 w-auto object-contain drop-shadow-lg"
              style={{ transform: "scale(1.35)" }}
            />
          </div>

          {/* ELEMENTOS DERECHA */}
          <div className="flex items-center gap-4">

            {/* BOTÓN TECSUP */}
            <a
              href="https://www.tecsup.edu.pe/"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-4 py-2 border rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-sm sm:text-base ${isDark
                ? 'bg-gray-800/50 hover:bg-blue-500/20 border-gray-700/50 hover:border-blue-500 text-gray-300 hover:text-blue-400'
                : 'bg-white/60 hover:bg-blue-50 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600'
                }`}
            >
              Tecsup Oficial
            </a>

            

            {/* LOGIN */}
            <Link
              to="/login"
              className="no-underline group/btn inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r 
              from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl 
              font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30"
            >
              <span>Iniciar Sesión</span>
              <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            {/* SWITCH TEMA */}
            {/* Botón de cambio de tema */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-105 ${isDark
                ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              aria-label="Cambiar tema"
            >
              {isDark ? (
                // Icono de Sol (Modo Claro)
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                // Icono de Luna (Modo Oscuro)
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Componente LandingPage principal
export default function LandingPage() {
  // Estados y lógica del carrusel y tema (del código 2)
  const [isDark, setIsDark] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Imágenes para el carrusel (del código 2)
  const bannerImages = [
    './landing/banner.png',
    '/landing/biblioteca.png',
    '/landing/deporte.png',
    '/landing/fablab.png'
  ];

  // Efecto para el cambio automático de imágenes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % bannerImages.length
      );
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  // Función para cambiar el tema
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      // Clases del contenedor principal adaptadas al tema
      isDark
        ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-200'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-800'
      }`}>
      <style>{`
        /* Animaciones mantenidas */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
        /* No necesitamos fadeImage ya que usamos transición de opacidad de Tailwind */
      `}</style>

      <NavbarLanding isDark={isDark} toggleTheme={toggleTheme} />

      {/* HERO */}
      <section className="relative w-full h-[70vh] overflow-hidden flex items-center justify-center">
        {/* Carrusel de imágenes (del código 2) */}
        {bannerImages.map((img, index) => (
          <img
            key={index}
            src={img}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            alt={`Banner TecUnify ${index + 1}`}
          />
        ))}

        {/* Overlays adaptados al tema */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${isDark
          ? 'bg-gradient-to-b from-gray-900/80 via-gray-900/70 to-gray-950'
          : 'bg-gradient-to-b from-white/85 via-white/75 to-gray-50'
          }`}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-indigo-900/20"></div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 animate-fade-in-up">
          <div className="inline-block mb-4">
            <span className={`px-4 py-2 border rounded-full text-sm font-semibold backdrop-blur-sm transition-colors duration-300 ${isDark
              ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
              : 'bg-blue-50 border-blue-300 text-blue-600'
              }`}>
              Plataforma Oficial de Tecsup
            </span>
          </div>

          <h1 className={`text-5xl md:text-7xl font-bold drop-shadow-2xl mb-6 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
            }`}>
            ¿Qué es <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 text-transparent bg-clip-text">TecUnify?</span>
          </h1>

          <p className={`max-w-3xl text-xl md:text-2xl leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
            La plataforma oficial de reservas de Tecsup. Gestiona salas de estudio, FabLab,
            polideportivos y espacios de innovación en un solo lugar.
          </p>
        </div>

        {/* Indicadores de carrusel */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
          {bannerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex
                ? 'w-8 bg-blue-500'
                : 'bg-gray-400 hover:bg-gray-300'
                }`}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>

        {/* Gradiente decorativo inferior adaptado al tema */}
        <div className={`absolute bottom-0 left-0 right-0 h-32 transition-opacity duration-300 ${isDark
          ? 'bg-gradient-to-t from-gray-950 to-transparent'
          : 'bg-gradient-to-t from-gray-50 to-transparent'
          }`}></div>
      </section>

      {/* DESCRIPCIÓN */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <p className={`text-xl md:text-2xl leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
          Accede a <span className="text-blue-400 font-semibold">salas de biblioteca</span>, <span className="text-purple-400 font-semibold">impresoras 3D</span>, <span className="text-emerald-400 font-semibold">cortadoras láser</span>,
          <span className="text-orange-400 font-semibold"> laboratorios de innovación</span>, <span className="text-cyan-400 font-semibold">canchas deportivas</span> para fútbol, vóley y básquet.
          <br />
          <span className={`font-bold text-2xl transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
            }`}>¡Todo desde una sola plataforma unificada!</span>
        </p>
      </section>

      {/* SECCIONES DE RESERVAS - Reintroducción de Link */}
      <section className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto px-6 pb-20">
        {/* Biblioteca */}
        <div className="group relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2">
          <img
            src="/landing/biblioteca.png"
            className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
            alt="Biblioteca"
          />
          <div className={`absolute inset-0 transition-opacity duration-300 ${isDark
            ? 'bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent'
            : 'bg-gradient-to-t from-gray-800/80 via-gray-800/50 to-transparent'
            }`}></div>

          <div className="absolute inset-0 flex flex-col justify-end p-8">
            <h3 className="text-3xl font-bold text-white mb-3">Reserva salas en la Biblioteca</h3>
            <p className="text-gray-200 text-base mb-6">
              Salas de estudio grupales e individuales.
            </p>

            <Link
              to="/login"
              className="no-underline group/btn inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl w-fit font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30"
            >
              <span>Reservar Sala</span>
              <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Polideportivos */}
        <div className="group relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:-translate-y-2">
          <img
            src="/landing/deporte.png"
            className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
            alt="Polideportivos"
          />
          <div className={`absolute inset-0 transition-opacity duration-300 ${isDark
            ? 'bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent'
            : 'bg-gradient-to-t from-gray-800/80 via-gray-800/50 to-transparent'
            }`}></div>

          <div className="absolute inset-0 flex flex-col justify-end p-8">
            <h3 className="text-3xl font-bold text-white mb-3">Reserva de Polideportivos</h3>
            <p className="text-gray-200 text-base mb-6">
              Fútbol, vóley y básquet para la comunidad Tecsup.
            </p>

            <Link
              to="/login"
              className="no-underline group/btn inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl w-fit font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30"
            >
              <span>Reservar Cancha</span>
              <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* FabLabs */}
        <div className="group relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2 md:col-span-2">
          <img
            src="/landing/fablab.png"
            className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-500"
            alt="FabLab"
          />
          <div className={`absolute inset-0 transition-opacity duration-300 ${isDark
            ? 'bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent'
            : 'bg-gradient-to-t from-gray-800/80 via-gray-800/50 to-transparent'
            }`}></div>

          <div className="absolute inset-0 flex flex-col justify-end p-8">
            <h3 className="text-3xl font-bold text-white mb-3">Reserva de FabLabs</h3>
            <p className="text-gray-200 text-base mb-6">
              Accede a impresoras 3D, cortadoras láser y máquinas de innovación.
            </p>

            <Link
              to="/login"
              className="no-underline group/btn inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl w-fit font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30"
            >
              <span>Reservar Máquina</span>
              <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>


      {/* BENEFICIOS (Adaptado al tema) */}
      <section className={`py-20 transition-colors duration-300 ${isDark
        ? 'bg-gradient-to-b from-gray-900 to-gray-950'
        : 'bg-gradient-to-b from-gray-100 to-white'
        }`}>
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 text-transparent bg-clip-text">
            Beneficios / Ventajas
          </span>
        </h2>
        <p className={`text-center mb-16 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>Por qué elegir TecUnify</p>

        <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto px-6">
          {/* Tarjeta 1 */}
          <div className={`group rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 ${isDark
            ? 'bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-gray-700/50 hover:border-blue-500/50'
            : 'bg-white border border-gray-200 hover:border-blue-500/50 shadow-lg'
            }`}>
            <div className="relative inline-block mb-6">
              <img src="/landing/icon1.png" className="w-16 mx-auto group-hover:scale-110 transition-transform duration-300" alt="Icono 1" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 blur-xl opacity-0 group-hover:opacity-50 transition-opacity rounded-full"></div>
            </div>
            <h3 className={`font-bold text-lg mb-3 group-hover:text-blue-400 transition-colors ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              Rápido y fácil de usar
            </h3>
            <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
              Reserva en segundos.
            </p>
          </div>


          {/* Tarjeta 2 */}
          <div className={`group rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 ${isDark
            ? 'bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-gray-700/50 hover:border-purple-500/50'
            : 'bg-white border border-gray-200 hover:border-purple-500/50 shadow-lg'
            }`}>
            <div className="relative inline-block mb-6">
              <img src="/landing/icon2.png" className="w-16 mx-auto group-hover:scale-110 transition-transform duration-300" alt="Icono 2" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 blur-xl opacity-0 group-hover:opacity-50 transition-opacity rounded-full"></div>
            </div>
            <h3 className={`font-bold text-lg mb-3 group-hover:text-purple-400 transition-colors ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              Reservas en tiempo real
            </h3>
            <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
              Consulta disponibilidad al instante.
            </p>
          </div>

          {/* Tarjeta 3 */}
          <div className={`group rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20 ${isDark
            ? 'bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-gray-700/50 hover:border-emerald-500/50'
            : 'bg-white border border-gray-200 hover:border-emerald-500/50 shadow-lg'
            }`}>
            <div className="relative inline-block mb-6">
              <img src="/landing/icon3.png" className="w-16 mx-auto group-hover:scale-110 transition-transform duration-300" alt="Icono 3" />
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 blur-xl opacity-0 group-hover:opacity-50 transition-opacity rounded-full"></div>
            </div>
            <h3 className={`font-bold text-lg mb-3 group-hover:text-emerald-400 transition-colors ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              Horarios organizados
            </h3>
            <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
              Canchas, cubículos y FabLab.
            </p>
          </div>

          {/* Tarjeta 4 */}
          <div className={`group rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/20 ${isDark
            ? 'bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-gray-700/50 hover:border-orange-500/50'
            : 'bg-white border border-gray-200 hover:border-orange-500/50 shadow-lg'
            }`}>
            <div className="relative inline-block mb-6">
              <img src="/landing/icon4.png" className="w-16 mx-auto group-hover:scale-110 transition-transform duration-300" alt="Icono 4" />
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 blur-xl opacity-0 group-hover:opacity-50 transition-opacity rounded-full"></div>
            </div>
            <h3 className={`font-bold text-lg mb-3 group-hover:text-orange-400 transition-colors ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              Acceso desde cualquier dispositivo
            </h3>
            <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
              Optimizado para la comunidad Tecsup.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER (Adaptado al tema y reintroduciendo <a> para redes) */}
      <footer className={`border-t py-12 px-6 transition-colors duration-300 ${isDark
        ? 'bg-gray-950 border-gray-800'
        : 'bg-gray-50 border-gray-200'
        }`}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 text-transparent bg-clip-text">
                TecUnify
              </h3>
            </div>

            <div className={`space-y-3 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
              <p>Av. Cascanueces 2221, Santa Anita, Lima – Perú</p>
              <p>reservas@tecsup.edu.pe</p>
              <p>(01) 317-3900</p>
            </div>

            <div className="mt-6 flex gap-4">
              {/* Enlaces de Redes Sociales */}
              <a href="#" className={`px-4 py-2 border rounded-xl transition-all duration-300 ${isDark
                ? 'bg-gray-800/50 hover:bg-blue-500/20 border-gray-700/50 hover:border-blue-500/50 text-gray-400 hover:text-blue-400'
                : 'bg-white hover:bg-blue-50 border-gray-200 hover:border-blue-300 text-gray-600 hover:text-blue-600'
                }`}>
                Facebook
              </a>
              <a href="#" className={`px-4 py-2 border rounded-xl transition-all duration-300 ${isDark
                ? 'bg-gray-800/50 hover:bg-pink-500/20 border-gray-700/50 hover:border-pink-500/50 text-gray-400 hover:text-pink-400'
                : 'bg-white hover:bg-pink-50 border-gray-200 hover:border-pink-300 text-gray-600 hover:text-pink-600'
                }`}>
                Instagram
              </a>
              <a href="#" className={`px-4 py-2 border rounded-xl transition-all duration-300 ${isDark
                ? 'bg-gray-800/50 hover:bg-blue-500/20 border-gray-700/50 hover:border-blue-500/50 text-gray-400 hover:text-blue-400'
                : 'bg-white hover:bg-blue-50 border-gray-200 hover:border-blue-300 text-gray-600 hover:text-blue-600'
                }`}>
                LinkedIn
              </a>
            </div>
          </div>

          <div className="flex justify-end items-center">
            <img src="/logo1.png" className="w-48 opacity-80 hover:opacity-100 transition-opacity" alt="Logo Tecsup" />
          </div>
        </div>

        <div className={`border-t mt-8 pt-8 text-center transition-colors duration-300 ${isDark ? 'border-gray-800' : 'border-gray-200'
          }`}>
          <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-gray-500'
            }`}>
            © 2025 TecUnify. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}