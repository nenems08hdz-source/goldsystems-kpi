<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useLayoutStore } from '@/stores/layout'
import FiltrosPrincipal from './FiltrosPrincipal.vue'

const route = useRoute()
const layout = useLayoutStore()
const isDarkMode = ref(false)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  console.log('Modo oscuro:', isDarkMode.value)
}
</script>

<template>
  <header class="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-sm">
  
  <div class="flex items-center gap-6">
    <button @click="layout.toggleSidebar" class="p-2 rounded-lg hover:bg-gray-100 text-[#3f2a52]">
      <i class="fi fi-sr-menu-burger text-lg"></i>
    </button>
    
    <div class="flex items-center gap-4">
      <FiltrosPrincipal v-if="route.name === 'principal'" />
    </div>
  </div>

  <div class="flex items-center gap-6">
 
    <button @click="toggleDarkMode" class="p-2 rounded-full hover:bg-gray-100">
       </button>
    
    <span class="text-gray-400 text-[11px] font-bold border-l pl-4 uppercase tracking-wider">Perfil</span>
  </div>
</header>
</template>