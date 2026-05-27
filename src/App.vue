<script setup>
import { RouterView } from 'vue-router'
import sidebar from './components/sidebar.vue'
import navbar from './components/navbar.vue'
</script>

<template>
  <div class="flex min-h-screen bg-gray-50 text-gray-800">
    <sidebar />

    <div class="flex-1 flex flex-col w-full">
      <navbar />

      <main class="flex-1 p-8 overflow-y-auto">
        
        <RouterView v-slot="{ Component }">
          <transition name="slide-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </RouterView>
        
      </main>
    </div>
  </div>
</template>

<style>
/* --- TRANSICIÓN PROFESIONAL SLIDE-FADE --- */

/* Duración y curva de aceleración suave al entrar */
.slide-fade-enter-active {
  transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Duración y curva de aceleración al salir */
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Estado inicial: viene desde 15px abajo y totalmente transparente */
.slide-fade-enter-from {
  transform: translateY(15px);
  opacity: 0;
}

/* Estado final al salir: se desvanece subiendo sutilmente */
.slide-fade-leave-to {
  transform: translateY(-8px);
  opacity: 0;
}
</style>