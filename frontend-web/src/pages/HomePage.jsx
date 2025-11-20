import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Users, Clock, Home, Calendar, List, User, LogOut, AlertCircle, CheckCircle, XCircle, Timer } from 'lucide-react';
import ProfileSection from './ProfileSection';
import ReservationForm from '../components/ReservationForm';
import RescheduleModal from '../components/RescheduleModal'; // <--- NUEVO COMPONENTE
import './HomePage.css';

const API_BASE = 'http://localhost:8081/api';

export default function HomePage() {
  const navigate = useNavigate();
  const [espacios, setEspacios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Todos');
  const [activeTab, setActiveTab] = useState('inicio');

  // ESTADOS DE RESERVA
  const [miReservas, setMiReservas] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [reservaToEdit, setReservaToEdit] = useState(null); // <--- Para el modal de reprogramar

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.firstName || 'Usuario';
  const email = localStorage.getItem('email');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    cargarDatos();
  }, [navigate]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const resEspacios = await axios.get(`${API_BASE}/espacios`);
      setEspacios(resEspacios.data);

      if (email) {
        const resReservas = await axios.get(`${API_BASE}/reservas/mi?email=${email}`);
        setMiReservas(resReservas.data);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // --- ACCIONES DE RESERVAS ---
  const handleReservarClick = (espacio) => setSelectedSpace(espacio);
  const handleBackFromReservation = () => setSelectedSpace(null);

  const handleReservationSuccess = () => {
    setSelectedSpace(null);
    cargarDatos();
    alert("¡Reserva creada exitosamente!");
  };

  const handleCancelarReserva = async (id) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) return;
    try {
      await axios.delete(`${API_BASE}/reservas/${id}?email=${email}`);
      alert('Reserva cancelada correctamente');
      cargarDatos(); // Recargar lista
    } catch (error) {
      alert('Error al cancelar: ' + (error.response?.data || error.message));
    }
  };

  // --- FILTROS ---
  const reservasActivas = miReservas.filter(r => ['PENDIENTE', 'CONFIRMADA'].includes(r.estado));
  const reservasHistorial = miReservas.filter(r => ['CANCELADA', 'COMPLETADA', 'RECHAZADA'].includes(r.estado));

  const getCategoryInfo = (nombre) => {
    const n = (nombre || '').toLowerCase();
    if (n.includes('futbol') || n.includes('voley') || n.includes('basquet') || n.includes('cancha')) return { label: 'Deportivo', img: '/cancha de futbol.jpg', type: 'Deportivos' };
    if (n.includes('fab') || n.includes('taller') || n.includes('impresora')) return { label: 'Fab Lab', img: '/fablab.jpg', type: 'Fab Lab' };
    if (n.includes('laboratorio') || n.includes('computación')) return { label: 'Laboratorio', img: '/fablab.jpg', type: 'Fab Lab' };
    if (n.includes('estudio') || n.includes('biblioteca')) return { label: 'Sala de Estudio', img: '/sala de estudio.png', type: 'Sala de Estudio' };
    return { label: 'Espacio', img: '/sala de estudio.png', type: 'Otros' };
  };

  const filteredEspacios = espacios.filter(espacio => {
    const info = getCategoryInfo(espacio.nombre);
    const matchesSearch = espacio.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesType = true;
    if (filterType !== 'Todos') matchesType = info.type === filterType;
    return matchesSearch && matchesType;
  });

  const SpaceCard = ({ espacio }) => {
    const info = getCategoryInfo(espacio.nombre);
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
        <div className="relative h-48">
          <img src={info.img} alt={espacio.nombre} className="w-full h-full object-cover" />
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700">
            {info.label}
          </div>
          <div className="absolute top-3 right-3 bg-green-400 text-white px-3 py-1 rounded-full text-xs font-bold">Disponible</div>
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug" title={espacio.nombre}>{espacio.nombre}</h3>
          <div className="space-y-3 text-sm text-gray-500 mb-6 flex-1">
            <div className="flex items-center gap-3"><Users className="w-4 h-4 text-[#0099CC]" /><span>{espacio.capacidad} personas</span></div>
            <div className="flex items-center gap-3"><Clock className="w-4 h-4 text-[#0099CC]" /><span>08:00 AM - 10:00 PM</span></div>
            <div className="flex items-center gap-3 text-green-600 font-medium"><span className="text-xs bg-green-50 px-2 py-1 rounded">S/. {espacio.precioHora || '0.00'}/hora</span></div>
          </div>
          <button className="w-full bg-[#0099CC] hover:bg-[#0088b5] text-white font-semibold py-2.5 rounded-xl transition-colors shadow-sm" onClick={() => handleReservarClick(espacio)}>Reservar ahora</button>
        </div>
      </div>
    );
  };

  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'CONFIRMADA': return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-bold"><CheckCircle className="w-3 h-3" /> Confirmada</span>;
      case 'PENDIENTE': return <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md text-xs font-bold"><Timer className="w-3 h-3" /> Pendiente</span>;
      case 'CANCELADA': return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-md text-xs font-bold"><XCircle className="w-3 h-3" /> Cancelada</span>;
      default: return <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded-md text-xs font-bold">{estado}</span>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-10 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => { setActiveTab('inicio'); setSelectedSpace(null); }}>
          <img src="/TU2.png" alt="Logo" className="h-10" />
          <span className="text-2xl font-bold text-[#0099CC]">TecUnify</span>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-6">
          {[{ id: 'inicio', icon: Home, label: 'Inicio' }, { id: 'horario', icon: Calendar, label: 'Horario' }, { id: 'reservas', icon: List, label: 'Mis Reservas' }].map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSelectedSpace(null); }} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-blue-50 text-[#0099CC]' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-[#0099CC]' : 'text-gray-400'}`} /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={() => { setActiveTab('perfil'); setSelectedSpace(null); }} className={`flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-gray-50 rounded-xl transition-all mb-2 ${activeTab === 'perfil' ? 'bg-blue-50 text-[#0099CC]' : 'text-gray-600'}`}>
            <User className="w-5 h-5" /> <span className="text-sm font-medium">Mi Perfil</span>
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 rounded-xl transition-all"><LogOut className="w-5 h-5" /><span className="text-sm font-medium">Cerrar Sesión</span></button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 p-8">
        {selectedSpace ? (
          <div className="animate-fade-in">
            <ReservationForm espacio={selectedSpace} onBack={handleBackFromReservation} onReservationSuccess={handleReservationSuccess} />
          </div>
        ) : (
          <>
            {/* --- VISTA INICIO --- */}
            {activeTab === 'inicio' && (
              <div className="max-w-7xl mx-auto animate-fade-in">
                <header className="flex justify-between items-center mb-8">
                  <div><h1 className="text-3xl font-bold text-gray-900">Bienvenido de nuevo, {userName}</h1><p className="text-gray-500 mt-2">Encuentra y reserva el espacio perfecto para ti</p></div>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-[#0099CC] font-bold">{userName.charAt(0)}</div>
                </header>
                <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-8">
                  <div className="relative"><Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" placeholder="Buscar espacios..." className="w-full pl-12 pr-4 py-4 bg-transparent outline-none text-gray-700" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                  <div className="flex gap-2 px-2 pb-2 mt-2 border-t border-gray-100 pt-3 overflow-x-auto">{['Todos', 'Deportivos', 'Sala de Estudio', 'Fab Lab'].map((type) => (<button key={type} onClick={() => setFilterType(type)} className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${filterType === type ? 'bg-[#0099CC] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{type}</button>))}</div>
                </div>
                {loading ? <div className="flex justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0099CC]"></div></div> :
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{filteredEspacios.map((espacio) => (<SpaceCard key={espacio.id} espacio={espacio} />))}</div>}
              </div>
            )}

            {/* --- VISTA MIS RESERVAS (ACTUALIZADA) --- */}
            {activeTab === 'reservas' && (
              <div className="max-w-5xl mx-auto animate-fade-in">
                <h2 className="text-3xl font-bold mb-8 text-gray-900">Mis Reservas</h2>

                {/* SECCIÓN 1: PRÓXIMAS RESERVAS */}
                <div className="mb-10">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[#0099CC]"><Clock className="w-5 h-5" /> Próximas Reservas</h3>
                  {reservasActivas.length === 0 ? (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 text-center text-blue-800">No tienes reservas activas en este momento.</div>
                  ) : (
                    <div className="space-y-4">
                      {reservasActivas.map(r => (
                        <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm hover:shadow-md transition">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="text-lg font-bold text-gray-900">{r.espacio?.nombre}</h4>
                              {getStatusBadge(r.estado)}
                            </div>
                            <p className="text-gray-500 text-sm flex items-center gap-2"><Calendar className="w-4 h-4" /> {r.fechaReserva} <span className="mx-1">|</span> <Clock className="w-4 h-4" /> {r.horaInicio} - {r.horaFin}</p>
                            <p className="text-gray-500 text-sm mt-1">Motivo: {r.motivo}</p>
                          </div>
                          <div className="flex gap-2 w-full md:w-auto">
                            <button onClick={() => setReservaToEdit(r)} className="flex-1 md:flex-none px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition">Reprogramar</button>
                            <button onClick={() => handleCancelarReserva(r.id)} className="flex-1 md:flex-none px-4 py-2 bg-red-50 text-red-700 rounded-lg font-medium hover:bg-red-100 transition">Cancelar</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* SECCIÓN 2: HISTORIAL */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-500"><List className="w-5 h-5" /> Historial Pasado</h3>
                  {reservasHistorial.length === 0 ? <p className="text-gray-400 text-sm italic">No hay historial disponible.</p> : (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                          <tr><th className="p-4">Espacio</th><th className="p-4">Fecha</th><th className="p-4">Estado</th></tr>
                        </thead>
                        <tbody>
                          {reservasHistorial.map(r => (
                            <tr key={r.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                              <td className="p-4 font-medium text-gray-900">{r.espacio?.nombre}</td>
                              <td className="p-4 text-gray-500">{r.fechaReserva}</td>
                              <td className="p-4">{getStatusBadge(r.estado)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'perfil' && <ProfileSection />}

            {/* MODAL DE REPROGRAMACIÓN */}
            {reservaToEdit && (
              <RescheduleModal
                reserva={reservaToEdit}
                onClose={() => setReservaToEdit(null)}
                onSuccess={() => {
                  setReservaToEdit(null);
                  cargarDatos();
                }}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}