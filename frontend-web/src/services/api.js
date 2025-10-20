import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth endpoints
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  validateToken: () => api.get('/auth/validate'),
};

// Espacios endpoints
export const espaciosAPI = {
  getAll: () => api.get('/espacios'),
  getById: (id) => api.get(`/espacios/${id}`),
  getByTipo: (tipo) => api.get(`/espacios/tipo/${tipo}`),
  getDisponibles: () => api.get('/espacios/disponibles'),
};

// Reservas endpoints
export const reservasAPI = {
  getByUsuario: (usuarioId) => api.get(`/reservas/usuario/${usuarioId}`),
  getByEspacio: (espacioId) => api.get(`/reservas/espacio/${espacioId}`),
  create: (reserva) => api.post('/reservas', reserva),
  cancel: (id) => api.delete(`/reservas/${id}`),
};

export default api;
