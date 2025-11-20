import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function RescheduleModal({ reserva, onClose, onSuccess }) {
    const [fecha, setFecha] = useState(reserva.fechaReserva);
    const [horaInicio, setHoraInicio] = useState(reserva.horaInicio);
    const [horaFin, setHoraFin] = useState(reserva.horaFin);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const API_BASE = 'http://localhost:8081/api';
    const email = localStorage.getItem('email');

    const handleReprogramar = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validación básica de horas
            if (horaFin <= horaInicio) {
                throw new Error('La hora de fin debe ser posterior al inicio');
            }

            await axios.put(
                `${API_BASE}/reservas/${reserva.id}/reprogramar?email=${email}`,
                {
                    nuevaFecha: fecha,
                    nuevaHoraInicio: horaInicio,
                    nuevaHoraFin: horaFin
                }
            );

            onSuccess();
            alert('¡Reserva reprogramada con éxito!');
            onClose(); // Cerramos el modal después del éxito

        } catch (err) {
            console.error("Error al reprogramar:", err);

            // --- CORRECCIÓN PARA EVITAR PANTALLA BLANCA ---
            let mensajeError = 'Error al reprogramar la reserva.';

            if (err.response) {
                // Si el backend nos manda un mensaje o error
                const data = err.response.data;
                // Si es un objeto (JSON de Spring Boot), extraemos el mensaje o lo convertimos
                if (typeof data === 'object') {
                    mensajeError = data.message || data.error || JSON.stringify(data);
                } else {
                    mensajeError = data; // Si es texto plano
                }
            } else if (err.message) {
                mensajeError = err.message;
            }

            setError(mensajeError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-gray-700">

                <div className="bg-[#0099CC] p-4 flex justify-between items-center text-white">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Calendar className="w-5 h-5" /> Reprogramar Reserva
                    </h3>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleReprogramar} className="p-6 space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm text-blue-800 dark:text-blue-200 mb-4">
                        Espacio: <strong>{reserva.espacio?.nombre}</strong>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nueva Fecha</label>
                        <input
                            type="date"
                            required
                            min={new Date().toISOString().split('T')[0]}
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#0099CC] outline-none dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Inicio</label>
                            <input type="time" required value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#0099CC] outline-none dark:bg-gray-700 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fin</label>
                            <input type="time" required value={horaFin} onChange={(e) => setHoraFin(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#0099CC] outline-none dark:bg-gray-700 dark:text-white" />
                        </div>
                    </div>

                    {/* Muestra el error de forma segura */}
                    {error && (
                        <div className="flex items-start gap-2 text-red-600 text-xs bg-red-50 dark:bg-red-900/20 p-3 rounded-lg break-words">
                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-medium">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-[#0099CC] text-white rounded-xl hover:bg-[#0088b5] font-medium flex justify-center items-center gap-2 disabled:opacity-50">
                            {loading ? 'Guardando...' : 'Confirmar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}