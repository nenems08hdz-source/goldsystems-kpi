<script setup>
import { RouterView } from 'vue-router'
import { useLayoutStore } from '@/stores/layout' 
import sidebar from './components/sidebar.vue'
import navbar from './components/navbar.vue'

const layout = useLayoutStore() 
</script>

<template>
  <div class="flex h-screen w-screen overflow-hidden bg-gray-50 text-gray-800">
    
    <aside 
      :class="layout.isSidebarOpen ? 'w-64' : 'w-20'" 
      class="transition-all duration-300 ease-in-out flex-shrink-0"
    >
      <sidebar />
    </aside>

    <div class="flex-1 flex flex-col w-full transition-all duration-300">
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

.slide-fade-enter-active {
  transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.slide-fade-enter-from {
  transform: translateY(15px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateY(-8px);
  opacity: 0;
}
</style>