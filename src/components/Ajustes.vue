<script setup>
import { ref } from 'vue'
import AjustesPerfil from '../pantallas/AjustesPerfil.vue' 

const categoriaActiva = ref('perfil')
</script>

<template>
  <div class="p-6 min-h-screen bg-white text-left text-black w-full flex flex-col gap-6">
    
    <div class="w-full">
      <h1 class="text-3xl font-bold text-[#3f2a52] tracking-tight">Ajustes</h1>
      <p class="text-xs text-gray-500 mt-0.5">Gestione las preferencias y la configuración general de su cuenta.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-8 w-full items-start mt-2">
      
      <div class="md:col-span-1 flex flex-col gap-1 w-full text-left bg-white p-1">
        <span class="text-[10px] font-black text-gray-400 tracking-widest uppercase px-3 mb-2 block">
          Categorías
        </span>
        
        <button 
          @click="categoriaActiva = 'perfil'"
          type="button"
          :class="[
            'flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 w-full text-left',
            categoriaActiva === 'perfil' ? 'bg-[#beaed8] text-[#3f2a52] shadow-sm' : 'bg-[#3f2a52] text-white hover:bg-[#2d1e3b]'
          ]"
        >
          👤 Perfil de Usuario
        </button>

        <button 
          @click="categoriaActiva = 'seguridad'"
          type="button"
          :class="[
            'flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 w-full text-left',
            categoriaActiva === 'seguridad' ? 'bg-[#beaed8] text-[#3f2a52] shadow-sm' : 'bg-[#3f2a52] text-white hover:bg-[#2d1e3b]'
          ]"
        >
          🔒 Seguridad
        </button>

        <button 
          @click="categoriaActiva = 'notificaciones'"
          type="button"
          :class="[
            'flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 w-full text-left',
            categoriaActiva === 'notificaciones' ? 'bg-[#beaed8] text-[#3f2a52] shadow-sm' : 'bg-[#3f2a52] text-white hover:bg-[#2d1e3b]'
          ]"
        >
          🔔 Notificaciones
        </button>

        <button 
          @click="categoriaActiva = 'apariencia'"
          type="button"
          :class="[
            'flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 w-full text-left',
            categoriaActiva === 'apariencia' ? 'bg-[#beaed8] text-[#3f2a52] shadow-sm' : 'bg-[#3f2a52] text-white hover:bg-[#2d1e3b]'
          ]"
        >
          🎨 Apariencia
        </button>
      </div>

      <div class="md:col-span-3 w-full">
        
        <div v-if="categoriaActiva === 'perfil'" class="animate-fade-in w-full">
          <AjustesPerfil />
        </div>

        <div v-if="categoriaActiva === 'seguridad'" class="p-6 border border-dashed border-gray-200 rounded-xl text-center text-gray-400 text-sm animate-fade-in">
          🔒 Configuración de seguridad y credenciales.
        </div>

        <div v-if="categoriaActiva === 'notificaciones'" class="p-6 border border-dashed border-gray-200 rounded-xl text-center text-gray-400 text-sm animate-fade-in">
          🔔 Configuraciones avanzadas de alertas y reportes.
        </div>

        <div v-if="categoriaActiva === 'apariencia'" class="p-6 border border-dashed border-gray-200 rounded-xl text-center text-gray-400 text-sm animate-fade-in">
          🎨 Opciones de temas visuales e interfaz de usuario.
        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>