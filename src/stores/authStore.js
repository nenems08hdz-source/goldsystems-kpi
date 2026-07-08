import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {

  state: () => ({
    // Solo el token persiste en localStorage — es una llave sin valor sin el backend.
    // user, role y permisos viven SOLO en memoria para que nadie pueda modificarlos
    // desde las DevTools del navegador.
    token:    localStorage.getItem('token') || null,
    user:     null,
    role:     null,
    permisos: [],
  }),

  actions: {
    // Se llama al hacer login. Solo guarda el token en localStorage.
    setAuth(token, user, role, permisos = []) {
      this.token    = token
      this.user     = user
      this.role     = role
      this.permisos = permisos
      localStorage.setItem('token', token)
    },

    // Se llama al recargar la página, después de consultar /api/me.
    // Restaura los datos en memoria sin tocar localStorage.
    setUserData(user, role, permisos = []) {
      this.user     = user
      this.role     = role
      this.permisos = permisos
    },

    logout() {
      this.token    = null
      this.user     = null
      this.role     = null
      this.permisos = []
      localStorage.removeItem('token')
    },
  },
})
