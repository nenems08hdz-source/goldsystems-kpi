import { defineStore } from 'pinia'
import api from '@/services/api'
import { useOrgStore } from './orgStore'

export const useAuthStore = defineStore('auth', {

  state: () => ({
    // Solo el token persiste en localStorage.
    // user, role y permisos viven solo en memoria.
    token:       sessionStorage.getItem('token') || null,
    user:        null,
    role:        null,
    permisos:    [],
    initialized: false, // bandera para no llamar /me dos veces
  }),

  actions: {
  async init() {
  if (this.initialized) return

  if (this.token) {
    try {
      const res = await api.get('/me')
      this.user     = res.data.user
      this.role     = res.data.role
      this.permisos = res.data.permisos ?? []
    } catch {
      this.logout()
    }
  }

  this.initialized = true
},

    setAuth(token, user, role, permisos = []) {
      this.token       = token
      this.user        = user
      this.role        = role
      this.permisos    = permisos
      this.initialized = true
      sessionStorage.setItem('token', token)
    },

    setUserData(user, role, permisos = []) {
      this.user     = user
      this.role     = role
      this.permisos = permisos
    },

    logout() {
      // Limpiar contexto de empresa (para que el guard restaure la fijada en el próximo login)
      useOrgStore().limpiarSesion()

      this.token       = null
      this.user        = null
      this.role        = null
      this.permisos    = []
      this.initialized = false
      sessionStorage.removeItem('token')
    },
  },
})
