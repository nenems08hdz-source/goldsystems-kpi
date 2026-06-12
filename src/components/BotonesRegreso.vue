<template>
  <button
    @click="router.push('/kpis')"
    type="button"
    class="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-all flex items-center gap-2"
  >
    ← Volver al Listado
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
</script>