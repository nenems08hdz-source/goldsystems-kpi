<script setup>
defineProps(['isOpen', 'titulo', 'mensaje'])
defineEmits(['confirmar', 'cancelar'])
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center"
      style="background: rgba(0,0,0,0.5);">
      <div class="p-6 rounded-xl shadow-2xl w-80"
        style="background: var(--card-bg);">
        <h3 class="text-lg font-bold" style="color: var(--card-text);">{{ titulo }}</h3>
        <p class="text-sm mt-2 mb-6" style="color: var(--card-text-muted);">{{ mensaje }}</p>
        <div class="flex justify-end gap-2">
          <button @click="$emit('cancelar')"
            class="px-4 py-2"
            style="color: var(--card-text-muted);">Cancelar</button>
          <button @click="$emit('confirmar')"
            class="px-4 py-2 bg-red-500 text-white rounded-lg">Eliminar</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
