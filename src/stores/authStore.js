import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {

  state: () => ({
    token: localStorage.getItem('token') || null,
    user:  JSON.parse(localStorage.getItem('user') || 'null'),
    role:  localStorage.getItem('role') || null,
  }),                                            // "state", son los datos que guardaste en tu store este revisa si ya habian datos guardados alli dentro
                                                 // de no ser asi este este pone null

  actions: {          
    setAuth(token, user, role) {
      this.token = token
      this.user  = user
      this.role  = role
      localStorage.setItem('token', token)
      localStorage.setItem('user',  JSON.stringify(user))
      localStorage.setItem('role',  role)
    },                                     // Guarda el token, usuario y rol en el store Y en localStorage (para que persistan al recargar).

    logout() {
      this.token = null
      this.user  = null
      this.role  = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('role')
    }                                 //Se ejecuta al cerrar sesión. Borra todo del store y del localStorage.
  }
})