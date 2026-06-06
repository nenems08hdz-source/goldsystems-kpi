<script setup>
import { useRoute } from 'vue-router'
import { useLayoutStore } from '@/stores/layout'
import FiltrosPrincipal from './FiltrosPrincipal.vue'

const route = useRoute()
const layout = useLayoutStore()

</script>

<template>
  <header 
    class="h-16 border-b px-6 flex items-center justify-between shadow-sm transition-colors duration-300"
    style="background-color: var(--navbar-bg); border-color: var(--navbar-border);"
  >
  
    <div class="flex items-center gap-6">
      <button 
        @click="layout.toggleSidebar" 
        class="p-2 rounded-lg transition-colors"
        style="color: var(--navbar-icon);"
      >
        <i class="fi fi-sr-menu-burger text-lg"></i>
      </button>
      
      <div class="flex items-center gap-4">
        <FiltrosPrincipal v-if="route.name === 'principal'" />
      </div>
    </div> 

    <div class="flex items-center gap-6">

      <button 
        @click="layout.toggleDarkMode" 
        class="p-2 rounded-full transition-colors"
        style="color: var(--navbar-icon);"
      >
        <i :class="layout.isDarkMode ? 'fi fi-sr-sun' : 'fi fi-sr-moon-stars'"></i>
      </button>
      
      <span 
        class="text-[11px] font-bold border-l pl-4 uppercase tracking-wider"
        style="color: var(--card-text-muted); border-color: var(--navbar-border);"
      >
        Perfil
      </span>
    </div>
  </header>
</template>