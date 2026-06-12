<script setup>
const props = defineProps({
  tipo:  { type: String, required: true },  
  texto: { type: String, default: '' },
})

const config = {
  success: {
    badge: 'text-emerald-600 border-emerald-500 dark:text-emerald-400 dark:border-emerald-400',
    dot:   'bg-emerald-600 dark:bg-emerald-400',
    label: 'Saludable',
  },
  warning: {
    badge: 'text-amber-600 border-amber-500 dark:text-amber-400 dark:border-amber-400',
    dot:   'bg-amber-600 dark:bg-amber-400',
    label: 'En riesgo',
  },
  danger: {
    badge: 'text-rose-600 border-rose-500 dark:text-rose-400 dark:border-rose-400',
    dot:   'bg-rose-600 dark:bg-rose-400',
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