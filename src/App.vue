<script setup>
// 1. Importamos el archivo usando Mayúscula inicial para el nombre del componente
import Sidebar from './components/sidebar.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    
    <Sidebar />

    <main class="flex-1 p-8">
    </main>

  </div>
</template>

<style scoped>
</style>