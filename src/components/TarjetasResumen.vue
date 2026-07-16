<script setup>
defineProps({
  titulo: String,
  valor: String,
  subtexto: String,
  icono: String,
  colorBarra: String,    
  badgeTexto: String,      
  badgeColorClass: String  
})
</script>

<template>
  <div class="p-5 rounded-xl border-l-4 shadow-sm flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-md"
    style="background: var(--card-bg);"
    :class="colorBarra">

    <div class="flex justify-between items-start gap-2">
      <p class="text-[10px] font-bold uppercase tracking-wider"
        style="color: var(--text-general);">{{ titulo }}</p>
      <i v-if="icono && icono.startsWith('fi ')"
        :class="[icono, 'text-base flex-shrink-0']"
        style="color: var(--text-encabezado);">
      </i>
      <span v-else class="text-sm font-bold flex-shrink-0">{{ icono }}</span>
    </div>

    <div class="mt-4">
      <div class="flex items-baseline gap-2">
        <span class="text-2xl font-bold" style="color: var(--text-general);">{{ valor }}</span>
        <span v-if="badgeTexto"
          class="text-[11px] font-bold px-1.5 py-0.5 rounded"
          :class="badgeColorClass">{{ badgeTexto }}</span>
      </div>
      <p class="text-xs mt-1" style="color: var(--card-text-muted);">{{ subtexto }}</p>
    </div>
  </div>
</template>