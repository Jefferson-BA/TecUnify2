import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Phone, Mail, Save, BarChart3, Calendar, Clock } from 'lucide-react';

const API_BASE = 'http://localhost:8081/api';

export default function ProfileSection() {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({});
    const email = localStorage.getItem('email');

    useEffect(() => {
        cargarPerfil();
    }, []);

    const cargarPerfil = async () => {
        try {
            const res = await axios.get(`${API_BASE}/users/profile?email=${email}`);
            setProfile(res.data);
            setFormData(res.data);
        } catch (error) {
            console.error("Error cargando perfil", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await axios.put(`${API_BASE}/users/profile?email=${email}`, formData);
            setIsEditing(false);
            setProfile(formData);

            // Actualizar localStorage para mantener consistencia
            const currentUser = JSON.parse(localStorage.getItem('user'));
            localStorage.setItem('user', JSON.stringify({ ...currentUser, ...formData }));

            alert("Perfil actualizado correctamente");
        } catch (error) {
            alert("Error al actualizar");
        }
    };

    if (loading) return <div className="p-8 text-center">Cargando perfil...</div>;

    return (
        <div className="max-w-5xl mx-auto animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi Perfil</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* COLUMNA IZQUIERDA: Tarjeta de Usuario */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                        <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center text-[#0099CC] text-4xl font-bold mx-auto mb-6">
                            {profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{profile.firstName} {profile.lastName}</h2>
                        <p className="text-gray-500 mb-6">{profile.role === 'ADMIN' ? 'Administrador' : 'Estudiante'}</p>

                        <div className="border-t border-gray-100 pt-6 text-left space-y-4">
                            <div className="flex items-center gap-3 text-gray-600">
                                <Mail className="w-5 h-5 text-[#0099CC]" />
                                <span className="text-sm">{profile.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <Phone className="w-5 h-5 text-[#0099CC]" />
                                <span className="text-sm">{profile.phone || 'Sin teléfono'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA: Estadísticas y Edición */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-2 text-gray-500">
                                <BarChart3 className="w-5 h-5" />
                                <span className="text-sm font-medium">Total Reservas</span>
                            </div>
                            <p className="text-3xl font-bold text-[#0099CC]">{profile.totalReservas}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-2 text-gray-500">
                                <Calendar className="w-5 h-5" />
                                <span className="text-sm font-medium">Activas</span>
                            </div>
                            <p className="text-3xl font-bold text-green-500">{profile.reservasActivas}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-2 text-gray-500">
                                <Clock className="w-5 h-5" />
                                <span className="text-sm font-medium">Horas de Uso</span>
                            </div>
                            <p className="text-3xl font-bold text-purple-500">~{profile.horasReservadas}h</p>
                        </div>
                    </div>

                    {/* Formulario de Edición */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Información Personal</h3>
                            <button
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${isEditing
                                        ? 'bg-green-500 hover:bg-green-600 text-white'
                                        : 'bg-[#0099CC] hover:bg-[#0088b5] text-white'
                                    }`}
                            >
                                {isEditing ? <><Save className="w-4 h-4" /> Guardar</> : 'Editar Perfil'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                                <input
                                    type="text"
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0099CC]/20 outline-none"
                                    value={formData.firstName}
                                    disabled={!isEditing}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                                <input
                                    type="text"
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0099CC]/20 outline-none"
                                    value={formData.lastName}
                                    disabled={!isEditing}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono de Contacto</label>
                                <input
                                    type="tel"
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0099CC]/20 outline-none"
                                    value={formData.phone || ''}
                                    placeholder="Ingrese su número"
                                    disabled={!isEditing}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}