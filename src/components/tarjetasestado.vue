<script setup>
defineProps({
  saludables: {
    type: Number,
    default: 0
  },
  alerta: {
    type: Number,
    default: 0
  },
  criticos: {
    type: Number,
    default: 0
  }
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-1">
    
    <div class="bg-[#3f2a52] text-[#beaed8] rounded-xl shadow-lg p-5 border border-[#beaed8]/20 flex flex-col justify-between">
      <div class="flex justify-between items-center mb-4">
        <span class="text-xs font-bold tracking-wider text-[#beaed8] uppercase">KPIs Saludables</span>
        <span class="text-emerald-400 text-lg">✓</span> 
      </div>
      <div class="my-2">
        <span class="text-4xl font-extrabold tracking-tight">
          {{ saludables < 10 ? '0' + saludables : saludables }}
        </span>
      </div>
      <div class="mt-2 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">Estado: Óptimo</span>
      </div>
    </div>

    <div class="bg-[#3f2a52] text-[#beaed8] rounded-xl shadow-lg p-5 border border-[#beaed8]/20 flex flex-col justify-between">
      <div class="flex justify-between items-center mb-4">
        <span class="text-xs font-bold tracking-wider text-[#beaed8] uppercase">KPIs en alerta</span>
        <span class="text-yellow-400 text-lg">⚠</span> 
      </div>
      <div class="my-2">
        <span class="text-4xl font-extrabold tracking-tight">
          {{ alerta < 10 ? '0' + alerta : alerta }}
        </span>
      </div>
      <div class="mt-2 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
        <span class="text-[11px] font-bold text-yellow-400 uppercase tracking-wide">Estado: preventivo</span>
      </div>
    </div>

    <div class="bg-[#3f2a52] text-[#beaed8] rounded-xl p-5 shadow-lg border border-[#beaed8]/20 flex flex-col justify-between">
      <div class="flex justify-between items-center mb-4">
        <span class="text-xs font-bold tracking-wider text-[#beaed8] uppercase">kpis críticas</span>
        <span class="text-red-400 text-lg">✕</span>
      </div>
      <div class="my-2">
        <span class="text-4xl font-extrabold tracking-tight">
          {{ criticos < 10 ? '0' + criticos : criticos }}
        </span>
      </div>
      <div class="mt-2 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
        <span class="text-[11px] font-bold text-red-400 uppercase tracking-wide">Estado: preventivo</span>
      </div>
    </div>
    
    <div class="bg-white rounded-xl shadow-lg p-5 border border-[#beaed8]/50 flex flex-col justify-between h-full">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-[#beaed8]/20 flex items-center justify-center text-[#3f2a52] font-bold text-lg">
          🏢
        </div>
        <div class="flex flex-col">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Unidad de Negocio</span>
          <span class="text-sm font-bold text-gray-800 mt-0.5">Planta Central</span>
        </div>
      </div>
      <div class="my-3 border-t border-gray-100 pt-3">
        <div class="text-xs text-gray-600 flex justify-between">
          <span>Eficiencia General:</span>
          <span class="font-bold text-emerald-600">94.2%</span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Sincronizado en Tiempo Real</span>
      </div>
    </div>

  </div>
</template>