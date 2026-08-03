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
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept':       'application/json',
    },
})

// Antes de cada petición, agrega el token y la empresa activa si existen
api.interceptors.request.use(config => {
    const token = sessionStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    // Si el developer tiene una empresa seleccionada, se manda en cada petición
    // El backend lo usa para filtrar datos de esa empresa específica
    const companyId = sessionStorage.getItem('active_company_id')
    if (companyId) {
        config.headers['X-Company-Id'] = companyId
    }

    return config
})

// Si el servidor responde 401, la sesión expiró →  redirigir al login
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            sessionStorage.removeItem('token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api
