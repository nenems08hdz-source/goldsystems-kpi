<script setup>
import api from '@/services/api'
import { useRoute } from 'vue-router'
import { useLayoutStore } from '@/stores/layout'
import FiltrosPrincipal from './FiltrosPrincipal.vue'
import { useAuthStore } from '@/stores/authStore' //para acceder a los datos del usuario logueado (foto, nombre, apellido)
import { useRouter }    from 'vue-router' //nos permite navegar a otra pantalla al hacer click sobre ello
import LoadingSpinner from './LoadingSpinner.vue' // ← EDICIÓN: Componente personalizado
import { ref } from 'vue'

const isLoading = ref(false)

const route       = useRoute()
const layout      = useLayoutStore()
const auth        = useAuthStore()
const router      = useRouter()  //instancias de cada uno para usarlos en el template
const STORAGE_URL = (import.meta.env.VITE_API_URL ?? '').replace('/api', '/storage')

async function cargarDatos() {
  // Mostrar loading SOLO si tarda más de 500ms
  const timeout = setTimeout(() => {
    isLoading.value = true
  }, 500) // milisegundos
  
  try {
    const res = await api.get('/datos')
    // Procesar datos
  } finally {
    clearTimeout(timeout) // Cancelar el timeout
    isLoading.value = false
  }
}
</script>

<template>
  <!-- ← EDICIÓN: Modo esquina (no fullPage) -->
  <LoadingSpinner :isActive="isLoading" :fullPage="false" />

  <header
    class="h-16 border-b px-6 flex items-center justify-between shadow-sm"
    style="background-color: var(--navbar-bg); border-color: var(--navbar-border)"
  >
    <div class="flex items-center gap-6">
      <button
        @click="layout.toggleSidebar"
        class="p-2 rounded-lg transition-colors"
        style="color: var(--navbar-icon)"
      >
        <i class="fi fi-sr-menu-burger text-lg"></i>
      </button>
      <div class="flex items-center gap-4">
        <FiltrosPrincipal v-if="route.name === 'principal'" />
      </div>
    </div>

    <div class="flex items-center gap-4">
      
      <button
        @click="layout.toggleDarkMode()"
        class="p-2 rounded-full transition-colors"
        :title="layout.isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
      >
        <i
          :class="layout.isDarkMode
            ? 'fi fi-sr-sun text-yellow-400 text-lg'
            : 'fi fi-sr-moon-stars text-lg'"
          :style="!layout.isDarkMode ? 'color: var(--navbar-icon)' : ''"
        ></i>
      </button>

      <div
        class="border-l pl-4 cursor-pointer"
        style="border-color: var(--navbar-border)" 
        @click="router.push('/Ajustes')"                 
          >
      <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold overflow-hidden"
        style="background: var(--sidebar-active-bg); color: var(--sidebar-active-text);">

        <img
             v-if="auth.user?.profile_photo"
             :src="`${STORAGE_URL}/${auth.user.profile_photo}`"
             class="w-full h-full object-cover"
            />
                   
        <span v-else>
          {{ (auth.user?.name?.charAt(0) || '') + (auth.user?.paternal?.charAt(0) || '') }}
        </span>
       </div>
     </div>
    </div>
  </header>
</template>