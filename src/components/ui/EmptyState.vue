<script setup>
defineProps({
  icono:     { type: String, default: 'fi-sr-exclamation' },
  titulo:    { type: String, required: true },
  subtexto:  { type: String, default: '' },
  // Texto del botón de acción opcional
  botonTexto:  { type: String, default: '' },
  botonIcono:  { type: String, default: '' },
})

defineEmits(['accion'])
</script>

<template>
  <div
    class="rounded-xl p-8 text-center"
    style="background: var(--card-bg); border: 1px solid var(--tabla-borde);"
  >
    <i
      :class="`fi ${icono} text-2xl mb-3 block`"
      style="color: var(--color-kpi-morado);"
    ></i>
    <p class="text-sm font-bold mb-1" style="color: var(--text-general);">
      {{ titulo }}
    </p>
    <p v-if="subtexto" class="text-xs" style="color: var(--subtext-general);">
      {{ subtexto }}
    </p>
    <button
      v-if="botonTexto"
      @click="$emit('accion')"
      class="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors"
      style="background: var(--sidebar-active-bg); color: var(--sidebar-active-text);"
    >
      <i v-if="botonIcono" :class="`fi ${botonIcono} text-xs`"></i>
      {{ botonTexto }}
    </button>
  </div>
</template>
