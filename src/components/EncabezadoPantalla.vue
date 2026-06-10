<script setup>
defineProps({
  titulo: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="mb-6 text-left">
    <h1 class="text-4xl font-bold text-[#3f2a52] tracking-tight"
    style="color: var(--text-encabezado)">
      
      {{ titulo }}
    </h1>
    
    <p v-if="descripcion" class="text-m text-gray-500 mt-1"
    style="color: var(--subtext-encabezado)">
      {{ descripcion }}
    </p>
  </div>
</template>