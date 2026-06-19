<script setup>
import AppButton from './ui/AppButton.vue'
defineProps(['isOpen', 'titulo', 'mensaje', 'textoConfirmar'])
defineEmits(['confirmar', 'cancelar'])
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center"
      style="background: rgba(0,0,0,0.5);">
      <div class="p-6 rounded-xl shadow-2xl w-80"
        style="background: var(--card-bg); border: 1px solid var(--tabla-borde);">
        <h3 class="text-sm font-bold mb-1" style="color: var(--text-general);">{{ titulo }}</h3>
        <p class="text-xs mb-6" style="color: var(--subtext-general);">{{ mensaje }}</p>
        <div class="flex justify-end gap-2">
          <AppButton variant="ghost" @click="$emit('cancelar')">Cancelar</AppButton>
          <AppButton variant="primary" @click="$emit('confirmar')">{{ textoConfirmar ?? 'Confirmar' }}</AppButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>
