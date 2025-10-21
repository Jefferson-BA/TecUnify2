import React, { useState, useEffect } from 'react';
import {
  Home,
  Calendar,
  Clock,
  User,
  Bot,
  Search,
  Users,
  MapPin,
  Dumbbell,
  BookOpen,
  Wrench,
  Mail,
  Phone
} from 'lucide-react';
import TecIAChat from '../components/TecIAChat';
import { getEspacios, updateUserProfile } from '../services/api';

// Componente para la sección de Inicio (dashboard principal)
export function InicioSection({ user }) {
  const [selectedCategory, setSelectedCategory] = useState('Todos'); // CORREGIDO: sin React.

  const categories = [
    { id: 'Todos', label: 'Todos', icon: null },
    { id: 'Deportivos', label: 'Deportivos', icon: Dumbbell },
    { id: 'Sala de Estudio', label: 'Sala de Estudio', icon: BookOpen },
    { id: 'Fab Lab', label: 'Fab Lab', icon: Wrench }
  ];

  const spaces = [
    {
      id: 1,
      name: 'Cancha de Fútbol',
      category: 'Deportivos',
      capacity: 22,
      type: 'Polideportivo',
      schedule: '09:00 AM - 08:00 PM',
      status: 'Disponible',
      image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400&h=250&fit=crop'
    },
    {
      id: 2,
      name: 'Cancha de Vóley y Básquet',
      category: 'Deportivos',
      capacity: 20,
      type: 'Polideportivo',
      schedule: '09:00 AM - 08:00 PM',
      status: 'Disponible',
      image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=250&fit=crop'
    },
    {
      id: 3,
      name: 'Sala de Estudio 1',
      category: 'Sala de Estudio',
      capacity: 6,
      type: 'Biblioteca',
      schedule: '09:00 AM - 08:00 PM',
      status: 'Disponible',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=250&fit=crop'
    },
    {
      id: 4,
      name: 'Sala de Estudio 2',
      category: 'Sala de Estudio',
      capacity: 6,
      type: 'Biblioteca',
      schedule: '09:00 AM - 08:00 PM',
      status: 'Disponible',
      image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=250&fit=crop'
    },
    {
      id: 5,
      name: 'Sala de Estudio 3',
      category: 'Sala de Estudio',
      capacity: 6,
      type: 'Biblioteca',
      schedule: '09:00 AM - 08:00 PM',
      status: 'Ocupado',
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=250&fit=crop'
    },
    {
      id: 6,
      name: 'Sala de Estudio 4',
      category: 'Sala de Estudio',
      capacity: 6,
      type: 'Biblioteca',
      schedule: '09:00 AM - 08:00 PM',
      status: 'Disponible',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&h=250&fit=crop'
    },
    {
      id: 7,
      name: 'Impresora 3D',
      category: 'Fab Lab',
      capacity: 6,
      type: 'Fab Lab',
      schedule: '09:00 AM - 06:00 PM',
      status: 'Disponible',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=250&fit=crop'
    },
    {
      id: 8,
      name: 'Corte laser',
      category: 'Fab Lab',
      capacity: 2,
      type: 'Fab Lab',
      schedule: '09:00 AM - 06:00 PM',
      status: 'Disponible',
      image: 'https://images.unsplash.com/photo-1562408590-e32931084e23?w=400&h=250&fit=crop'
    }
  ];

  const filteredSpaces = selectedCategory === 'Todos'
    ? spaces
    : spaces.filter(space => space.category === selectedCategory);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Welcome Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido a tecUnify</h1>
              <p className="text-gray-500">Encuentra y reserva el espacio perfecto para ti</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-700">
                <span className="font-normal">Bienvenido de nuevo, </span>
                <span className="font-semibold">{user?.firstName || user?.email || 'Usuario'}</span>
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar espacios por nombre o ubicación..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <button className="px-6 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              Todos
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Category Filters */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition ${selectedCategory === category.id
                    ? 'bg-gray-200 text-gray-900'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Spaces Grid */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSpaces.map((space) => (
            <div key={space.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Image with badges */}
              <div className="relative h-40">
                <img
                  src={space.image}
                  alt={space.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-medium text-gray-700">
                    {space.category}
                  </span>
                </div>
                <div className="absolute top-2.5 right-2.5">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${space.status === 'Disponible'
                    ? 'bg-emerald-400 text-white'
                    : 'bg-red-400 text-white'
                    }`}>
                    {space.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-base font-bold text-gray-900 mb-3">{space.name}</h3>

                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Users className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Capacidad: {space.capacity} personas</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                    <span>{space.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Horario: {space.schedule}</span>
                  </div>
                </div>

                <button
                  disabled={space.status === 'Ocupado'}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition ${space.status === 'Ocupado'
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-cyan-500 text-white hover:bg-cyan-600'
                    }`}
                >
                  {space.status === 'Ocupado' ? 'No disponible' : 'Reservar ahora'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Componente para la sección de Horario
// --- Componente Horario (Crear Reserva) ---
export function HorarioSection() { // CORREGIDO: añadido 'export'
  const [espacios, setEspacios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Esto se ejecuta una vez cuando el componente carga
  useEffect(() => {
    const loadEspacios = async () => {
      try {
        setLoading(true); // Empezamos a cargar
        const data = await getEspacios(); // Llamamos a la API
        setEspacios(data); // Guardamos los datos recibidos
        setError(null); // Limpiamos errores previos
      } catch (err) {
        setError('No se pudieron cargar los espacios.'); // Guardamos el error
        console.error(err);
      } finally {
        setLoading(false); // Terminamos de cargar (sea éxito o error)
      }
    };

    loadEspacios();
  }, []); // El [] vacío significa "ejecútate solo una vez"

  // 1. Muestra "Cargando..." mientras esperamos los datos
  if (loading) {
    return <div className="p-6">Cargando espacios...</div>;
  }

  // 2. Muestra un error si la llamada a la API falló
  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  // 3. Si todo salió bien, muestra los espacios
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Crear una Reserva</h2>
      <p className="mb-6 text-gray-600">Selecciona un espacio disponible para ver el horario y reservar.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {espacios.length > 0 ? (
          // Recorremos la lista de espacios y creamos una "tarjeta" por cada uno
          espacios.map((espacio) => (
            <div
              key={espacio.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer"
            >
              <h3 className="text-xl font-bold text-blue-600 mb-2">{espacio.nombre}</h3>
              <p className="text-gray-700 mb-3">{espacio.descripcion}</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li><strong>Tipo:</strong> {espacio.tipo}</li>
                <li><strong>Capacidad:</strong> {espacio.capacidad} personas</li>
                <li><strong>Ubicación:</strong> {espacio.ubicacion}</li>
              </ul>
            </div>
          ))
        ) : (
          // Mensaje si no se encontraron espacios
          <p>No hay espacios disponibles para reservar en este momento.</p>
        )}
      </div>
    </div>
  );
}

// Componente para la sección de Mis Reservas
export function MisReservasSection() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Mis Reservas</h1>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-center text-gray-500">
              <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold mb-2">Tus Reservas</h2>
              <p>Aquí podrás ver y gestionar todas tus reservas.</p>
              <p className="text-sm mt-2">Próximamente disponible...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para la sección de Mi Perfil (AHORA CON FORMULARIO)
export function MiPerfilSection({ user }) {
  // 1. Creamos un estado para el formulario
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    telefono: user?.telefono || '' // 2. Usamos los datos del 'user' para rellenar
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); // Para mensajes de éxito/error

  // 3. Función que actualiza el estado cuando el usuario escribe
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 4. Función que se llama al guardar
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    setLoading(true);
    setMessage('');
    try {
      // 5. Llamamos a nuestra nueva función de la API
      const updatedUser = await updateUserProfile(formData);
      setMessage('¡Perfil actualizado con éxito!');
      // Opcional: Aquí podrías actualizar el estado 'user' global de App.jsx
    } catch (err) {
      setMessage('Error al actualizar el perfil. Inténtalo de nuevo.');
    } finally {
      setLoading(false); // Detiene la animación de carga
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Mi Perfil</h2>

      {/* Este es el contenedor "chévere" del formulario */}
      <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto">

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">

            {/* Encabezado con foto (estática por ahora) */}
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center ring-4 ring-blue-200">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {/* Usa los datos del formulario para que se actualice al escribir */}
                  {formData.firstName || 'Usuario'} {formData.lastName || ''}
                </h3>
                <p className="text-gray-500">Actualiza tus datos personales.</p>
              </div>
            </div>

            <hr />

            {/* Fila de Nombre y Apellido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Email (deshabilitado) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Teléfono (Nuevo campo) */}
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                Número de Teléfono
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  name="telefono"
                  id="telefono"
                  placeholder="Ej: +51 987654321"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Botón de Guardar */}
            <div className="text-right">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>

            {/* Mensaje de éxito/error */}
            {message && (
              <p className={`text-sm text-center ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                {message}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente para la sección de TecIA
export function TecIASection() {
  return <TecIAChat />;
}

// --- Componente Principal (El "Cerebro") ---
// Este es el componente que faltaba.
export default function DashboardSections({ activeSection, user }) {
  // 1. Recibe la sección activa ('inicio', 'horario', etc.) y el usuario como props.

  // 2. Usa un switch para decidir qué componente de sección mostrar.
  const renderSection = () => {
    switch (activeSection) {
      case 'inicio':
        return <InicioSection user={user} />;
      case 'horario':
        return <HorarioSection />;
      case 'mis-reservas':
        return <MisReservasSection />;
      case 'tecia':
        return <TecIASection />;
      case 'mi-perfil':
        return <MiPerfilSection user={user} />;
      default:
        // 3. Por defecto (o si algo falla), muestra la sección de Inicio.
        return <InicioSection user={user} />;
    }
  };

  return <div className="flex-1 overflow-y-auto">{renderSection()}</div>;
}