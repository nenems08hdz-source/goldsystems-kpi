import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLayoutStore = defineStore('layout', () => {
  const isSidebarOpen = ref(true)

 
  const isDarkMode = ref(
    localStorage.getItem('darkMode') === 'true'
  )

  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  }

  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value

    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    localStorage.setItem('darkMode', isDarkMode.value)
  }

  return { isSidebarOpen, toggleSidebar, isDarkMode, toggleDarkMode }
})