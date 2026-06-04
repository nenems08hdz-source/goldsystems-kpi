<script setup>
defineProps(['isOpen', 'titulo', 'mensaje'])
defineEmits(['confirmar', 'cancelar'])
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div class="bg-white p-6 rounded-xl shadow-2xl w-80">
        <h3 class="text-lg font-bold text-gray-800">{{ titulo }}</h3>
        <p class="text-sm text-gray-500 mt-2 mb-6">{{ mensaje }}</p>
        <div class="flex justify-end gap-2">
          <button @click="$emit('cancelar')" class="px-4 py-2 text-gray-600">Cancelar</button>
          <button @click="$emit('confirmar')" class="px-4 py-2 bg-red-500 text-white rounded-lg">Eliminar</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
