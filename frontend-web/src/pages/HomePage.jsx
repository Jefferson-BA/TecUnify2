import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Users, Clock, Home, Calendar, List, User, LogOut } from 'lucide-react';
import './HomePage.css';

const API_BASE = 'http://localhost:8081/api';

export default function HomePage() {
  const navigate = useNavigate();
  const [espacios, setEspacios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Todos');
  const [activeTab, setActiveTab] = useState('inicio');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.firstName || 'Usuario';

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    cargarEspacios();
  }, [navigate]);

  const cargarEspacios = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/espacios`);
      setEspacios(response.data);
    } catch (error) {
      console.error('Error cargando espacios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const getImageForSpace = (nombre) => {
    const n = (nombre || '').toLowerCase();

    if (n.includes('fútbol') || n.includes('futbol')) return '/cancha de futbol.jpg';
    if (n.includes('vóley') || n.includes('voley') || n.includes('básquet') || n.includes('basquet')) return '/cancha de voley.jpg';
    if (n.includes('fab') || n.includes('taller') || n.includes('laboratorio') || n.includes('computación') || n.includes('redes') || n.includes('electrónica')) return '/fablab.jpg';
    if (n.includes('estudio') || n.includes('biblioteca')) return '/sala de estudio.png';

    return '/sala de estudio.png';
  };

  const filteredEspacios = espacios.filter(espacio => {
    // PROTECCIÓN CONTRA FALLOS: Usamos || '' para evitar que explote si es null
    const n = (espacio.nombre || '').toLowerCase();
    const u = (espacio.ubicacion || '').toLowerCase(); // <--- ESTO ARREGLA LA PANTALLA BLANCA
    const s = searchTerm.toLowerCase();

    const matchesSearch = n.includes(s) || u.includes(s);

    let matchesType = true;
    if (filterType === 'Deportivos') {
      matchesType = n.includes('cancha') || n.includes('futbol') || n.includes('voley') || n.includes('basquet');
    } else if (filterType === 'Sala de Estudio') {
      matchesType = n.includes('sala') || n.includes('estudio') || n.includes('biblioteca');
    } else if (filterType === 'Fab Lab') {
      matchesType = n.includes('taller') || n.includes('laboratorio') || n.includes('fab') || n.includes('computación') || n.includes('redes') || n.includes('electrónica');
    }

    return matchesSearch && matchesType;
  });

  const SpaceCard = ({ espacio }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      <div className="relative h-48">
        <img
          src={getImageForSpace(espacio.nombre)}
          alt={espacio.nombre}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-green-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
          Disponible
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight min-h-[3rem] line-clamp-2" title={espacio.nombre}>
          {espacio.nombre}
        </h3>

        <div className="space-y-3 text-sm text-gray-500 mb-6 flex-1">
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-[#0099CC]" />
            <span>Capacidad: {espacio.capacidad} personas</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-[#0099CC]" />
            {/* Si no hay ubicación, mostramos un texto por defecto */}
            <span className="line-clamp-1">{espacio.ubicacion || 'Campus Tecsup'}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-[#0099CC]" />
            <span>Horario: 08:00 AM - 10:00 PM</span>
          </div>
        </div>

        <button
          className="w-full bg-[#0099CC] hover:bg-[#0088b5] text-white font-semibold py-2.5 rounded-xl transition-colors shadow-sm"
          onClick={() => alert(`Reservar ${espacio.nombre}`)}
        >
          Reservar ahora
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-10 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/TU2.png" alt="Logo" className="h-10" />
          <span className="text-2xl font-bold text-[#0099CC]">TecUnify</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-6">
          {[
            { id: 'inicio', icon: Home, label: 'Inicio' },
            { id: 'horario', icon: Calendar, label: 'Horario' },
            { id: 'reservas', icon: List, label: 'Mis Reservas' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${activeTab === item.id
                ? 'bg-blue-50 text-[#0099CC]'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-[#0099CC]' : 'text-gray-400'}`} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-gray-50 rounded-xl transition-all mb-2 text-gray-600">
            <User className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium">Mi Perfil</span>
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 rounded-xl transition-all">
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 p-8">
        {activeTab === 'inicio' && (
          <div className="max-w-7xl mx-auto animate-fade-in">
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Bienvenido de nuevo, {userName}</h1>
                <p className="text-gray-500 mt-2">Encuentra y reserva el espacio perfecto para ti</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-[#0099CC] font-bold">
                {userName.charAt(0)}
              </div>
            </header>

            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar espacios por nombre o ubicación..."
                  className="w-full pl-12 pr-4 py-4 bg-transparent outline-none text-gray-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-2 px-2 pb-2 mt-2 border-t border-gray-100 pt-3">
                {['Todos', 'Deportivos', 'Sala de Estudio', 'Fab Lab'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${filterType === type
                      ? 'bg-[#0099CC] text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0099CC]"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEspacios.length > 0 ? (
                  filteredEspacios.map((espacio) => (
                    <SpaceCard key={espacio.id} espacio={espacio} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-gray-500">
                    No se encontraron espacios para esta categoría.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {activeTab === 'reservas' && (
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Mis Reservas</h2>
            <p className="text-gray-500">Sección en construcción...</p>
          </div>
        )}
      </main>
    </div>
  );
}