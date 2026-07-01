import axios from 'axios'

/**
 * Instancia centralizada de axios para el API de KPI360.
 *
 * - Lee la URL base del archivo .env (VITE_API_URL)
 * - Agrega automáticamente el token de sesión en cada petición
 * - Redirige al login si el servidor responde 401 (sesión expirada)
 *
 * @author Mariel Medina <nenem08hdz@gmail.com>
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept':       'application/json',
    },
})

// Antes de cada petición, agrega el token si existe
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Si el servidor responde 401, la sesión expiró → redirigir al login
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem('role')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api
