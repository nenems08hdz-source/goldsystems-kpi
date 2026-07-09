<script setup>
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useLayoutStore } from '@/stores/layout'
import { useKpiStore } from '@/stores/kpiStore'
import sidebar from './components/Sidebar.vue'
import navbar from './components/Navbar.vue'
import { onMounted, onUnmounted } from 'vue'

const layout  = useLayoutStore()
const kpiStore = useKpiStore()
const route   = useRoute()
const router  = useRouter()

router.afterEach(() => {
  document.getElementById('main-content')?.scrollTo({ top: 0 })
})

// Auto-colapsa el sidebar en pantallas pequeñas (<1024px)
const handleResize = () => {
  if (window.innerWidth < 1024) {
    layout.isSidebarOpen = false
  }
}

onMounted(() => {
  document.documentElement.classList.add('dark')
  handleResize()
  window.addEventListener('resize', handleResize)
  // La inicialización de sesión (/api/me) la maneja el router guard en beforeEach.
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div
    class="flex h-screen w-screen overflow-hidden transition-colors duration-300"
    style="background-color: var(--layout-bg); color: var(--layout-text);"
  >

    <aside
      v-if="route.path !== '/login'"
      :class="layout.isSidebarOpen ? 'w-64' : 'w-20'"
      class="transition-all duration-300 ease-in-out flex-shrink-0"
    >
      <sidebar />
    </aside>

    <div class="flex-1 flex flex-col min-w-0 transition-all duration-300">
      <navbar v-if="route.path !== '/login'" />

      <main id="main-content" :class="['flex-1 overflow-y-auto', route.path === '/login' || route.meta.fullWidth ? '' : 'p-4 md:p-6 lg:p-8']">
        <RouterView />
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