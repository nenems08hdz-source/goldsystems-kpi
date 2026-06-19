<script setup>
/**
 * EtiquetaBadge — badge informativo neutral (sin color semántico).
 * Úsalo para campos como: periodicidad, departamento, tipoMétrica, módulo, rol, etc.
 *
 * Props:
 *   texto   string   Texto del badge (ignorado si se usa el slot)
 *   clase   string   Clases Tailwind extra (ej. colorPorRol)
 *
 * Uso simple:
 *   <EtiquetaBadge texto="Mensual" />
 *   <EtiquetaBadge :texto="fila.rol" :clase="store.colorPorRol(fila.rol)" />
 *
 * Uso con slot (permite añadir iconos):
 *   <EtiquetaBadge clase="flex items-center gap-1">
 *     <i class="fi fi-sr-calendar text-[9px]" /> Mensual
 *   </EtiquetaBadge>
 */
defineProps({
  texto: { type: String, default: '' },
  clase: { type: String, default: '' },
})
</script>

<template>
  <span class="table-badge" :class="clase">
    <slot>{{ texto }}</slot>
  </span>
</template>
