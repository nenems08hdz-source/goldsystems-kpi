<script setup>


defineProps({
  variante: { type: String, default: 'edit' },
  titulo:   { type: String, default: '' },
})

defineEmits(['click'])

const iconos = {
  edit:  'fi fi-sr-pencil',
  trash: 'fi fi-sr-trash',
  eye:   'fi fi-sr-eye',
  stats: 'fi fi-sr-stats',
  kpis:  'fi fi-sr-chart-histogram',
  close: 'fi fi-sr-cross',
  menu:  'fi fi-sr-menu-dots-vertical',
}

const estilos = {
  edit:  'hover:text-[var(--sidebar-bg)] hover:bg-[var(--tabla-hover)]',
  trash: 'hover:text-red-500 hover:bg-red-50',
  eye:   'hover:text-[var(--sidebar-bg)] hover:bg-[var(--tabla-hover)]',
  stats: 'hover:text-[#77a9d4] hover:bg-[rgba(119,169,212,0.12)]',
  kpis:  'hover:text-[#77a9d4] hover:bg-[rgba(119,169,212,0.12)]',
  close: 'hover:text-red-500 hover:bg-red-50',
  menu:  'hover:text-[var(--sidebar-bg)] hover:bg-[var(--tabla-hover)]',
}
</script>

<template>
  <button
    :title="titulo"
    type="button"
    class="inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors text-sm flex-shrink-0"
    :class="[estilos[variante] ?? estilos.edit]"
    style="color: var(--card-text-hint); background: var(--tabla-header-bg);"
    @click="$emit('click')"
  >
    <i :class="iconos[variante] ?? iconos.edit" />
  </button>
</template>
