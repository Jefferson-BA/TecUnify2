import { useState } from 'react';
import { Search, Users, Clock, MapPin, Dumbbell, BookOpen, Wrench } from 'lucide-react';

export default function HomePage() {
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg"></div>
            <span className="text-2xl font-bold text-blue-600">TecUnify</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#" className="text-gray-700 hover:text-blue-600">Inicio</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Horario</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Mis Reservas</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Mi Perfil</a>
          </nav>
        </div>
      </header>

      {/* Welcome Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bienvenido a tecUnify</h1>
              <p className="text-gray-600 mt-1">Encuentra y reserva el espacio perfecto para ti</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Bienvenido de nuevo, <strong>Jefferson</strong></p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar espacios por nombre o ubicación..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filters */}
          <div className="flex gap-4 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg whitespace-nowrap transition ${
                    selectedCategory === category.id
                      ? 'bg-gray-200 text-gray-900 font-medium'
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpaces.map((space) => (
            <div key={space.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
              {/* Image with badges */}
              <div className="relative h-48">
                <img 
                  src={space.image} 
                  alt={space.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                    {space.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    space.status === 'Disponible' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {space.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{space.name}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Capacidad: {space.capacity} personas</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{space.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Horario: {space.schedule}</span>
                  </div>
                </div>

                <button 
                  disabled={space.status === 'Ocupado'}
                  className={`w-full py-2.5 rounded-lg font-medium transition ${
                    space.status === 'Ocupado'
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
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