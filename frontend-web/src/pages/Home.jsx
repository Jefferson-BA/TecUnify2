import { useState } from 'react';
import { Search, Users, Clock, MapPin, Dumbbell, BookOpen, Wrench, LogOut } from 'lucide-react';

export default function HomePage({ user, onLogout }) {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  
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
      schedule: '09:00 AM - 08:00 PM',
      status: 'Disponible',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=250&fit=crop'
    },
    {
      id: 8,
      name: 'Corte laser',
      category: 'Fab Lab',
      capacity: 2,
      type: 'Fab Lab',
      schedule: '09:00 AM - 08:00 PM',
      status: 'Disponible',
      image: 'https://images.unsplash.com/photo-1562408590-e32931084e23?w=400&h=250&fit=crop'
    }
  ];

  const filteredSpaces = selectedCategory === 'Todos' 
    ? spaces 
    : spaces.filter(space => space.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Welcome Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido a tecUnify</h1>
              <p className="text-gray-500">Encuentra y reserva el espacio perfecto para ti</p>
            </div>
            <div className="text-right flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-700">
                  <span className="font-normal">Bienvenido de nuevo, </span>
                  <span className="font-semibold">{user?.firstName || user?.email || 'Usuario'}</span>
                </p>
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-4 h-4" />
                  Salir
                </button>
              )}
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
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition ${
                    selectedCategory === category.id
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
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                    space.status === 'Disponible' 
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
                  className={`w-full py-2 rounded-lg text-sm font-medium transition ${
                    space.status === 'Ocupado'
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