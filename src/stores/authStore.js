import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {

  state: () => ({
    token: sessionStorage.getItem('token') || null,
    user:  JSON.parse(sessionStorage.getItem('user') || 'null'),
    role:  sessionStorage.getItem('role') || null,
  }),                                            // "state", son los datos que guardaste en tu store este revisa si ya habian datos guardados alli dentro
                                                 // de no ser asi este este pone null

  actions: {          
    setAuth(token, user, role) {
      this.token = token
      this.user  = user
      this.role  = role
      sessionStorage.setItem('token', token)
      sessionStorage.setItem('user',  JSON.stringify(user))
      sessionStorage.setItem('role',  role)
    },                                     // Guarda el token, usuario y rol en el store Y en localStorage (para que persistan al recargar).

    logout() {
      this.token = null
      this.user  = null
      this.role  = null
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
      sessionStorage.removeItem('role')
    }                                 //Se ejecuta al cerrar sesión. Borra todo del store y del localStorage.
  }
})