<script setup>
defineProps({
  nombre: { type: String, required: true },
  departamento: { type: String, required: true },
  responsable: { type: String, required: true },
  valor: { type: [String, Number], required: true },
  periodicidad: { type: String, required: true },
  estado: { type: String, default: 'estable' }, 
  tendencia: { type: String, default: '' }    
})
</script>

<template>
  <div class="flex h-45 w-full rounded-xl shadow-sm overflow-hidden"
    style="background: var(--card-bg); border: 1px solid var(--card-border); color: var(--card-text);">

    <div :class="{
        'bg-green-500': estado === 'saludable',
        'bg-amber-500': estado === 'en riesgo',
        'bg-red-500': estado === 'critico'
      }"
      class="w-2 h-full flex-shrink-0">
    </div>

    <div class="flex-1 p-5 flex flex-col justify-between min-w-0">
      <div class="flex justify-between items-start gap-2 mb-2">
        <div class="min-w-0">
          <h3 class="text-sm font-bold tracking-wide uppercase truncate"
            style="color: var(--text-general);">{{ nombre }}</h3>
          <p class="text-xs font-medium mt-0.5 truncate"
            style="color: var(--subtext-general);">Dep: {{ departamento }}</p>
        </div>
        <span class="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider flex-shrink-0"
          style="background: rgba(190,174,216,0.3); color: var(--subtext-general);">
          {{ periodicidad }}
        </span>
      </div>

      <div class="my-2 flex items-baseline gap-2">
        <span class="text-3xl font-bold tracking-tight" style="color: var(--text-general);">
          {{ valor }}
        </span>
        <span v-if="tendencia"
          class="text-[11px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded font-bold flex-shrink-0">
          {{ tendencia }}
        </span>
      </div>

      <div class="pt-2 flex items-center gap-1.5 text-xs flex-shrink-0"
        style="border-top: 1px solid var(--card-border); color: var(--subtext-general);">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
        <span class="truncate">
          <strong class="font-medium" style="color: var(--subtext-general);">Resp:</strong> {{ responsable }}
        </span>
      </div>
    </div>
  </div>
</template>