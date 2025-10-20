
import React from 'react';
import { BookOpen, Dumbbell, Cpu, Zap, Clock, Calendar, Monitor, Users, MapPin } from 'lucide-react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  const [selectedSpace, setSelectedSpace] = React.useState(null);
  const [view, setView] = React.useState('home'); // 'home', 'login', 'register'
  const [user, setUser] = React.useState(null); // usuario logueado

  const spaces = [
    {
      id: 1,
      title: 'Biblioteca',
      description: 'Reserva salas de estudio para tus trabajos grupales o individuales',
      icon: <BookOpen className="w-12 h-12 text-blue-600" />,
      color: 'bg-blue-50',
      btnColor: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 2,
      title: 'Polideportivo',
      description: 'Separa canchas de fútbol, vóley o básquet y disfruta del deporte',
      icon: <Dumbbell className="w-12 h-12 text-green-600" />,
      color: 'bg-green-50',
      btnColor: 'bg-green-600 hover:bg-green-700'
    },
    {
      id: 3,
      title: 'FabLab',
      description: 'Accede a impresoras 3D, cortadoras láser y herramientas de innovación',
      icon: <Cpu className="w-12 h-12 text-purple-600" />,
      color: 'bg-purple-50',
      btnColor: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  const benefits = [
    {
      icon: <Zap className="w-10 h-10 text-blue-600" />,
      title: 'Rápido y fácil de usar',
      desc: 'Sistema intuitivo para reservar en segundos'
    },
    {
      icon: <Clock className="w-10 h-10 text-blue-600" />,
      title: 'Reservas en tiempo real',
      desc: 'Consulta horarios disponibles en tiempo real'
    },
    {
      icon: <Calendar className="w-10 h-10 text-blue-600" />,
      title: 'Horarios organizados',
      desc: 'Accede a canchas, cubículos y salones'
    },
    {
      icon: <Monitor className="w-10 h-10 text-blue-600" />,
      title: 'Acceso desde cualquier dispositivo',
      desc: 'Diseñado especialmente para la comunidad TECSUP'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={() => setView('home')}>
                TecUnify
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#nosotros" className="text-gray-700 hover:text-blue-600">Nosotros</a>
              <a href="#zona-reserva" className="text-gray-700 hover:text-blue-600">Zona Reserva</a>

              {!user && (
                <button
                  className="text-gray-700 hover:text-blue-600"
                  onClick={() => setView('register')}
                >
                  Registrarse
                </button>
              )}

              {!user && (
                <button
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  onClick={() => setView('login')}
                >
                  Iniciar Sesión
                </button>
              )}

              {user && (
                <span className="text-blue-600 font-semibold">
                  Hola, {user.firstName || user.email}
                </span>
              )}

              {user && (
                <button
                  className="ml-4 text-gray-700 hover:text-red-600"
                  onClick={() => {
                    setUser(null);
                    setView('home');
                  }}
                >
                  Cerrar sesión
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Renderizado condicional según la vista */}
      {view === 'home' && (
        <>
          {/* Hero Section */}
          <div className="pt-16 relative bg-gradient-to-r from-blue-500 to-cyan-500 text-white overflow-hidden">
            {/* Imagen de fondo */}
            <div className="absolute inset-0 opacity-30">
              <img
                src="/logo_landing.png"
                alt="Estudiantes de Tecsup" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Contenido encima de la imagen */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Reserva tus espacios en Tecsup de manera rápida y sencilla
                </h2>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 mb-6">
                  <p className="text-xl mb-4">
                    Biblioteca, FabLab y Polideportivo EN UN SOLO CLICK ✓
                  </p>
                  <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                    Reservar ahora
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ¿Qué es TecUnify? */}
          <section id="nosotros" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-8">¿Qué es TecUnify?</h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                TecUnify es la plataforma oficial de reservas de Tecsup. Aquí podrás acceder a salas de la biblioteca,
                espacios de innovación en el FabLab (impresoras 3D, corte láser) y polideportivos para fútbol, vóley o básquet.
                Todo organizado en un solo lugar.
              </p>
            </div>
          </section>

          {/* Zona de Reserva */}
          <section id="zona-reserva" className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-3 gap-8">
                {spaces.map((space) => (
                  <div
                    key={space.id}
                    className={`${space.color} rounded-lg p-8 shadow-lg hover:shadow-2xl transition-all`}
                  >
                    <div className="flex justify-center mb-6">
                      {space.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                      Reserva salas en la {space.title}
                    </h3>
                    <p className="text-gray-700 mb-6 text-center">
                      {space.description}
                    </p>
                    <div className="text-center">
                      <button className={`${space.btnColor} text-white px-6 py-3 rounded-lg font-semibold transition`}>
                        Reservar {space.title}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Beneficios */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
                Beneficios / Ventajas
              </h2>
              <div className="grid md:grid-cols-4 gap-8">
                {benefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="text-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition"
                  >
                    <div className="flex justify-center mb-4">
                      {benefit.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">{benefit.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Mapa y Footer */}
          <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4">TecUnify</h3>
                  <p className="text-gray-400 mb-4">
                    <MapPin className="inline w-5 h-5 mr-2" />
                    Av. Cascanueces 2221, Santa Anita, Lima, Perú
                  </p>
                  <p className="text-gray-400 mb-4">reservas@tecsup.edu.pe</p>
                  <p className="text-gray-400">(01) 317-3900</p>
                  <div className="mt-6 space-x-4">
                    <span className="text-gray-400">Síguenos en: Facebook | Instagram | LinkedIn</span>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg h-64 flex items-center justify-center">
                  <MapPin className="w-16 h-16 text-blue-500" />
                </div>
              </div>
              <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                <p>© 2025 TecUnify. Todos los derechos reservados.</p>
                <p className="mt-2">TecUnify - Plataforma de reservas de Tecsup</p>
              </div>
            </div>
          </footer>
        </>
      )}

      {view === 'register' && (
        <RegisterPage
          onBack={() => setView('home')}
          onRegisterSuccess={(user) => {
            setUser(user);
            setView('home');
          }}
          onSwitchToLogin={() => setView('login')}
        />
      )}

      {view === 'login' && (
        <LoginPage
          onBack={() => setView('home')}
          onLoginSuccess={(user) => {
            setUser(user);
            setView('home');
          }}
          onSwitchToRegister={() => setView('register')}
        />
      )}
    </div>
  );
}



export default App;