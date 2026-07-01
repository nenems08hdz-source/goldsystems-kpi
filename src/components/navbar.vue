<script setup>
import { useRoute } from 'vue-router'
import { useLayoutStore } from '@/stores/layout'
import FiltrosPrincipal from './FiltrosPrincipal.vue'
import { useAuthStore } from '@/stores/authStore' //para acceder a los datos del usuario logueado (foto, nombre, apellido)
import { useRouter }    from 'vue-router' //nos permite navegar a otra pantalla al hacer click sobre ello 

const route = useRoute()
const layout = useLayoutStore()
const auth   = useAuthStore()
const router = useRouter()  //instancias de cada uno para usarlos en el template
</script>

<template>
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
             :src="`http://127.0.0.1:8000/storage/${auth.user.profile_photo}`"
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