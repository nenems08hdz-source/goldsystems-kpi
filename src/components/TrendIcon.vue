<script setup>
defineProps({
  tendencia: { type: String, required: true },
  size:      { type: String, default: 'sm' },
})

const config = { 
  subiendo: { icono: '↑', clase: 'text-emerald-500' },
  bajando:  { icono: '↓', clase: 'text-rose-500'    },
  estable:  { icono: '→', clase: 'text-slate-400'   },
}

function get(tendencia) {
  return config[tendencia] ?? config.estable
}
</script>

<template>
  <span
    class="font-bold"
    :class="[get(tendencia).clase, `text-${size}`]"
    :title="`Tendencia: ${tendencia}`"
  >
    {{ get(tendencia).icono }}
  </span>
</template>