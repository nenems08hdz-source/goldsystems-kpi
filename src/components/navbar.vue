<script setup>
import { ref } from 'vue'
import { useLayoutStore } from '@/stores/layout'

const layout = useLayoutStore()
const isDarkMode = ref(false)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  console.log('Modo oscuro:', isDarkMode.value)
}
</script>

<template>
  <header class="h-16 bg-white border-b border border-gray-200 px-8 flex items-center justify-between shadow-xl">
    
    <div class="flex items-center gap-6">
      <button 
        @click="layout.toggleSidebar" 
        class="p-2 rounded-lg hover:bg-gray-100 text-[#3f2a52] transition-all"
        title="Ocultar/Mostrar Menú"
      >
        <i class="fi fi-sr-menu-burger text-lg"></i>
      </button>

      <div class="flex flex-col gap-1">
        <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          area
        </label>
        <select class="bg-white border border-gray-300 rounded-md py-1 px-3 text-sm text-gray-700 focus:outline-none">
          <option>Todas las Areas</option>
          <option>Planta Norte</option>
          <option>Planta Sur</option>
        </select>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          departamento
        </label>
        <select class="bg-white border border-gray-300 rounded-md py-1 px-3 text-sm text-gray-700 focus:outline-none">
          <option>Todas los departamentos</option>
          <option>Producción</option>
          <option>Calidad</option>
          <option>Mantenimiento</option>
        </select>
      </div>

    </div>

    <div class="flex items-center gap-5">
      <button class="bg-[#3f2a52] hover:bg-[#beaed8] text-white text-sm font-medium py-2 px-4 rounded-md focus:outline-none">
        Personalizar Dashboard
      </button>

      <button 
        @click="toggleDarkMode"
        class="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
        aria-label="Toggle Dark Mode"
      >
        <svg v-if="!isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <circle cx="12" cy="12" r="5" />
        </svg>
      </button>
      
      <span class="text-gray-400 text-sm font-medium border-l pl-5">perfil</span>
    </div>

  </header>
</template>

