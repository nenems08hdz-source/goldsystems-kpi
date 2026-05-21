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
        <RouterView />
      </main>
    </div>
  </div>
</template>