<script setup>

const props = defineProps({
  tipo:  { type: String, required: true }, 
  texto: { type: String, default: '' },
})

const config = {
  success: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot:   'bg-emerald-500',
    label: 'Saludable',
  },
  warning: {
    badge: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    dot:   'bg-yellow-500',
    label: 'En riesgo',
  },
  danger: {
    badge: 'bg-red-50 text-red-700 border-red-200',
    dot:   'bg-red-500',
    label: 'Crítico',
  },
}

const current = config[props.tipo] ?? config.danger
const label   = props.texto || current.label
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wide"
    :class="current.badge"
  >
    <span class="w-1.5 h-1.5 rounded-full animate-pulse" :class="current.dot" />
    {{ label }}
  </span>
</template>
