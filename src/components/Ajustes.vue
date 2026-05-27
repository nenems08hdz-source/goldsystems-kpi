<script setup>
import { ref } from 'vue'
import AjustesPerfil from '../pantallas/AjustesPerfil.vue' 
import ConfiguracionNotificacion from '../pantallas/ConfiguracionNotificacion.vue'
import ConfiguracionSeguridad from '../pantallas/ConfiguracionSeguridad.vue'

const categoriaActiva = ref('perfil')
</script>

<template>
  <div class="p-6 min-h-screen bg-white text-left text-black w-full flex flex-col gap-6">
    <div class="grid gap-2 grid-cols-1 lg:grid-cols-4">
      <div class="lg:col-span-1 w-full">
        <h1 class="text-3xl font-bold text-[#3f2a52] tracking-tight">Ajustes</h1>
        <p class="text-xs text-gray-500 mt-0.5">Gestione las preferencias y la configuración general de su cuenta.</p>
        <div class="md:col-span-1 flex flex-col gap-1 w-full text-left bg-white p-1">
          <span class="text-[10px] font-black text-gray-400 tracking-widest uppercase px-3 mb-2 block">
            Categorías
          </span>
          
          <button v-for="cat in ['perfil', 'seguridad', 'notificaciones']" 
                  :key="cat"
                  @click="categoriaActiva = cat"
                  type="button"
                  :class="[
                    'flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 w-full text-left',
                    categoriaActiva === cat ? 'bg-[#beaed8] text-[#3f2a52] shadow-sm' : 'bg-[#3f2a52] text-white hover:bg-[#2d1e3b]'
                  ]">
            {{ cat === 'perfil' ? '👤 Perfil' : cat === 'seguridad' ? '🔒 Seguridad' : '🔔 Notificaciones' }}
          </button>
        </div>
      </div>
 
      <div class="lg:col-span-3 w-full items-start mt-2">
        <div class="md:col-span-3 w-full">
          
          <div v-if="categoriaActiva === 'perfil'" class="animate-fade-in w-full">
            <AjustesPerfil />
          </div>
          
          <div v-if="categoriaActiva === 'notificaciones'" class="animate-fade-in w-full">
            <ConfiguracionNotificacion />
          </div>

          <div v-if="categoriaActiva === 'seguridad'" class="animate-fade-in w-full">
           <ConfiguracionSeguridad />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>