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
  },
  eficiencia: {
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
        <i class="fi fi-sr-checkbox text-emerald-400 text-base"></i> 
      </div>
      <div class="my-2">
        <span class="text-4xl font-extrabold tracking-tight text-white">
          {{ saludables < 10 ? '0' + saludables : saludables }}
        </span>
      </div>
      <div class="mt-2 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class=" text-[11px] font-bold text-emerald-400 uppercase tracking-wide">Estado: Óptimo</span>
      </div>
    </div>

    <div class="bg-[#3f2a52] text-[#beaed8] rounded-xl shadow-lg p-5 border border-[#beaed8]/20 flex flex-col justify-between">
      <div class="flex justify-between items-center mb-4">
        <span class="text-xs font-bold tracking-wider text-[#beaed8] uppercase">KPIs en alerta</span>
        <i class="fi fi-sr-exclamation text-yellow-400 text-base"></i> 
      </div>
      <div class="my-2">
        <span class="text-4xl font-extrabold tracking-tight text-white">
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
        <i class="fi fi-sr-cross-circle text-red-400 text-base"></i>
      </div>
      <div class="my-2">
        <span class="text-4xl font-extrabold tracking-tight text-white">
          {{ criticos < 10 ? '0' + criticos : criticos }}
        </span>
      </div>
      <div class="mt-2 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
        <span class="text-[11px] font-bold text-red-400 uppercase tracking-wide">Estado: preventivo</span>
      </div>
    </div>
       
    <div class="bg-white rounded-xl shadow-lg p-5 border border-[#beaed8]/50 flex flex-col justify-between h-full">
      
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-[#beaed8]/20 flex items-center justify-center text-[#3f2a52]">
            <i class="fi fi-sr-building text-sm"></i>
          </div>
          <div class="flex flex-col">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Unidad de Negocio</span>
            <span class="text-sm font-bold text-gray-800 mt-0.5">Área Central</span>
          </div>
        </div>
      </div>

      <div class="my-3 border-t border-gray-100 pt-3">
        <div class="text-[11px] text-gray-500 flex justify-between items-center mb-1">
          <span class="font-bold uppercase tracking-wider text-[9px]">Eficiencia del Área</span>
          <span class="font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
            {{ eficiencia }}%
          </span>
        </div>

        <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
          <div class="h-full bg-emerald-500 rounded-full transition-all duration-500" :style="{ width: eficiencia + '%' }"></div>
        </div>

        <p class="text-[10px] text-gray-400 mt-2 font-medium flex items-center gap-1">
          <i class="fi fi-sr-info text-[9px] text-gray-400"></i>
          Cumplimiento: <span class="font-bold text-gray-700">{{ saludables }} de {{ saludables + alerta + criticos }}</span> KPIs óptimos.
        </p>
      </div>

    </div>

  </div>
</template>