import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLayoutStore = defineStore('layout', () => {
  const isSidebarOpen = ref(true)

  // ── NUEVO: estado del modo oscuro ──────────────────────
  // Leemos si el usuario ya tenía una preferencia guardada.
  // localStorage es como una "memoria" del navegador.
  const isDarkMode = ref(
    localStorage.getItem('darkMode') === 'true'
  )

  // Aplicamos la clase al cargar la app (por si ya estaba en dark)
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  }
  // ────────────────────────────────────────────────────────

  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  // ── NUEVO: función para cambiar el modo ────────────────
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value

    if (isDarkMode.value) {
      // Agrega clase "dark" al elemento <html>
      document.documentElement.classList.add('dark')
    } else {
      // Quita la clase "dark" del elemento <html>
      document.documentElement.classList.remove('dark')
    }

    // Guardamos la preferencia para que se recuerde al recargar
    localStorage.setItem('darkMode', isDarkMode.value)
  }
  // ────────────────────────────────────────────────────────

  return { isSidebarOpen, toggleSidebar, isDarkMode, toggleDarkMode }
})