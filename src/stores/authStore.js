import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {

  state: () => ({
    // Solo el token persiste en localStorage.
    // user, role y permisos viven solo en memoria.
    token:       localStorage.getItem('token') || null,
    user:        null,
    role:        null,
    permisos:    [],
    initialized: false, // bandera para no llamar /me dos veces
  }),

  actions: {
    /**
     * Inicializa la sesión leyendo /api/me desde el backend.
     * El router llama esto antes de cada navegación para garantizar
     * que los permisos estén cargados antes de decidir acceso.
     * Es idempotente: solo ejecuta una vez por sesión.
     */
    async init() {
      if (this.initialized) return

      if (this.token) {
        try {
          const res = await api.get('/me')
          this.user     = res.data.user
          this.role     = res.data.role
          this.permisos = res.data.permisos ?? []
        } catch {
          // Token inválido o expirado
          this.logout()
        }
      }

      this.initialized = true
    },

    /**
     * Llamado al hacer login exitoso.
     * Guarda el token en localStorage y los datos en memoria.
     * Marca como initialized para no llamar /me de nuevo.
     */
    setAuth(token, user, role, permisos = []) {
      this.token       = token
      this.user        = user
      this.role        = role
      this.permisos    = permisos
      this.initialized = true
      localStorage.setItem('token', token)
    },

    /**
     * Actualiza datos del usuario en memoria (sin tocar el token).
     * Usado en AjustesPerfil al guardar cambios del perfil.
     */
    setUserData(user, role, permisos = []) {
      this.user     = user
      this.role     = role
      this.permisos = permisos
    },

    logout() {
      this.token       = null
      this.user        = null
      this.role        = null
      this.permisos    = []
      this.initialized = false
      localStorage.removeItem('token')
    },
  },
})
