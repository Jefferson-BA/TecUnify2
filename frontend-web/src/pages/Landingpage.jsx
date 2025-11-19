import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, Calendar, Laptop, MapPin, Phone, Mail, Facebook, Instagram, Linkedin } from 'lucide-react';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white font-sans">

            {/* ================= NAVBAR ================= */}
            <nav className="bg-white shadow-sm fixed w-full z-50 top-0 h-20 flex items-center">
                <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                        <img className="h-12 w-auto" src="/TU2.png" alt="TecUnify Logo" />
                        <span className="ml-2 text-2xl font-bold text-[#0056b3]">TecUnify</span>
                    </div>

                    {/* Menú Derecha (Sin Registrarse) */}
                    <div className="hidden md:flex items-center space-x-8">
                        <button onClick={() => navigate('/login')} className="text-gray-600 hover:text-[#0099CC] font-medium">
                            Nosotros
                        </button>

                        {/* Botón Registrarse ELIMINADO */}

                        <button
                            onClick={() => navigate('/login')}
                            className="bg-[#0099CC] hover:bg-[#0077a3] text-white px-6 py-2 rounded font-bold transition-colors"
                        >
                            Iniciar Sesión
                        </button>
                    </div>
                </div>
            </nav>

            {/* ================= HERO SECTION (¿Qué es TecUnify?) ================= */}
            <div className="relative mt-20 bg-white">
                {/* Imagen Hero */}
                <div className="h-[400px] w-full overflow-hidden relative">
                    <img
                        src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                        alt="Estudiantes Tecsup"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-blue-900/20"></div>
                </div>

                {/* Texto Central */}
                <div className="max-w-5xl mx-auto text-center py-16 px-4 relative">
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">¿Qué es TecUnify?</h2>
                    <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
                        TecUnify es la plataforma oficial de reservas de Tecsup. Aquí podrás acceder a salas de la biblioteca,
                        espacios de innovación en el FabLab (impresoras 3D, corte láser) y polideportivos para fútbol,
                        vóley o básquet. Todo organizado en un solo lugar.
                    </p>
                    <img src="/TU.png" alt="Marca de agua" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 opacity-5 pointer-events-none" />
                </div>
            </div>

            {/* ================= GRID DE SERVICIOS ================= */}
            <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2">

                    {/* 1. Biblioteca */}
                    <div className="h-80 relative">
                        <img src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" alt="Biblioteca" />
                    </div>
                    <div className="bg-[#4da6ff] p-12 flex flex-col justify-center text-white h-80">
                        <h3 className="text-3xl font-bold mb-4">Reserva salas en la Biblioteca</h3>
                        <p className="mb-8 text-blue-50 text-sm">Reserva salas de estudio para tus trabajos grupales o individuales</p>
                        <button onClick={() => navigate('/login')} className="bg-white text-[#0077cc] px-8 py-2 rounded font-bold hover:bg-gray-100 transition w-fit">
                            Reservar Sala
                        </button>
                    </div>

                    {/* 2. Polideportivos */}
                    <div className="bg-[#4da6ff] p-12 flex flex-col justify-center text-white h-80">
                        <h3 className="text-3xl font-bold mb-4">Reserva de Polideportivos</h3>
                        <p className="mb-8 text-blue-50 text-sm">Separa canchas de fútbol, vóley o básquet y disfruta del deporte con tu comunidad.</p>
                        <button onClick={() => navigate('/login')} className="bg-white text-[#0077cc] px-8 py-2 rounded font-bold hover:bg-gray-100 transition w-fit">
                            Reservar Polideportivo
                        </button>
                    </div>
                    <div className="h-80 relative">
                        <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" alt="Deportes" />
                    </div>

                    {/* 3. FabLabs */}
                    <div className="h-80 relative">
                        <img src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" alt="FabLab" />
                    </div>
                    <div className="bg-[#4da6ff] p-12 flex flex-col justify-center text-white h-80">
                        <h3 className="text-3xl font-bold mb-4">Reserva de FabLabs</h3>
                        <p className="mb-8 text-blue-50 text-sm">Accede a impresoras 3D, cortadoras láser y herramientas de innovación.</p>
                        <button onClick={() => navigate('/login')} className="bg-white text-[#0077cc] px-8 py-2 rounded font-bold hover:bg-gray-100 transition w-fit">
                            Reservar máquina
                        </button>
                    </div>

                </div>
            </div>

            {/* ================= BENEFICIOS ================= */}
            <div className="py-20 bg-white">
                <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Beneficios / Ventajas</h2>

                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { icon: Clock, title: "Rápido y fácil de usar", desc: "Sistema intuitivo para reservar en segundos" },
                        { icon: CheckCircle, title: "Reservas en tiempo real", desc: "Consulta horarios disponibles en tiempo real" },
                        { icon: Calendar, title: "Horarios organizados", desc: "Accede a canchas, cubículos y salones" },
                        { icon: Laptop, title: "Acceso desde cualquier dispositivo", desc: "Diseñado especialmente para la comunidad TECSUP" },
                    ].map((item, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-xl p-8 text-center hover:shadow-lg transition duration-300 flex flex-col items-center h-full">
                            <div className="w-20 h-20 mb-6 rounded-full border-4 border-[#0099CC] flex items-center justify-center">
                                <item.icon className="w-10 h-10 text-[#0099CC]" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-gray-800">{item.title}</h3>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ================= FOOTER CON MAPA REAL ================= */}
            <footer className="bg-[#1a1a1a] text-white">
                <div className="grid grid-cols-1 md:grid-cols-2 h-[400px]">

                    {/* MAPA REAL - Google Maps Embed */}
                    <div className="w-full h-full relative">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3902.345074089163!2d-76.95486362587645!3d-12.046524441393514!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c6816145853d%3A0xc45f7d834757768!2sTecsup%20-%20Santa%20Anita!5e0!3m2!1ses!2spe!4v1710354892134!5m2!1ses!2spe"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Mapa Tecsup Santa Anita"
                            className="grayscale hover:grayscale-0 transition-all duration-500"
                        ></iframe>
                    </div>

                    {/* Información de Contacto */}
                    <div className="bg-[#111] p-12 flex flex-col justify-center items-center text-center md:items-start md:text-left">
                        <div className="mb-8">
                            <h4 className="text-xl font-bold text-[#0099CC] mb-4">Ubicación</h4>
                            <p className="flex items-center gap-2 text-gray-300 mb-2">
                                <MapPin className="w-5 h-5 text-[#0099CC]" /> Av. Cascanueces 2221, Santa Anita, Lima, Perú
                            </p>
                        </div>

                        <div className="mb-8">
                            <h4 className="text-xl font-bold text-[#0099CC] mb-4">Contacto</h4>
                            <p className="flex items-center gap-2 text-gray-300 mb-2">
                                <Mail className="w-5 h-5 text-[#0099CC]" /> reservas@tecsup.edu.pe
                            </p>
                            <p className="flex items-center gap-2 text-gray-300">
                                <Phone className="w-5 h-5 text-[#0099CC]" /> (01) 317-3900
                            </p>
                        </div>

                        <div className="w-full border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex gap-4">
                                <Facebook className="w-6 h-6 cursor-pointer hover:text-blue-500 transition" />
                                <Instagram className="w-6 h-6 cursor-pointer hover:text-pink-500 transition" />
                                <Linkedin className="w-6 h-6 cursor-pointer hover:text-blue-400 transition" />
                            </div>
                            <div className="flex items-center gap-3 opacity-50">
                                <img src="/TU2.png" alt="Logo" className="h-10" />
                                <span className="text-sm">© 2025 TecUnify</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}