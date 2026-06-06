import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLayoutStore = defineStore('layout', () => {

  const isSidebarOpen = ref(true)

  // ── MODO OSCURO ──────────────────────────────────────────────────────
  // Al iniciar, leemos si el usuario había activado el modo oscuro antes.
  // localStorage guarda texto, por eso comparamos con el string 'true'.
  const modoOscuro = ref(localStorage.getItem('modoOscuro') === 'true')

  // Aplicamos el modo inmediatamente al cargar la app.
  // Esto evita el "flash" de modo claro antes de que Vue arranque.
  if (modoOscuro.value) {
    document.documentElement.classList.add('dark')
  }

  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  function toggleModoOscuro() {
    modoOscuro.value = !modoOscuro.value

    if (modoOscuro.value) {
      // Agrega la clase 'dark' al <html> → activa todas las variables CSS
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    // Guardamos la preferencia para que persista al recargar la página
    localStorage.setItem('modoOscuro', modoOscuro.value)
  }

  return {
    isSidebarOpen,
    modoOscuro,
    toggleSidebar,
    toggleModoOscuro,
  }
})