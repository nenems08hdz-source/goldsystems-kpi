<script setup>
// Definimos los "props", que son los datos que este componente necesita recibir desde fuera
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
  <div class="flex h-45 w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-gray-700">
    
    <div 
      :class="{
        'bg-green-500': estado === 'saludable',
        'bg-amber-500': estado === 'en riesgo',
        'bg-red-500': estado === 'critico'
      }"
      class="w-2 h-full flex-shrink-0"
    ></div>

    <div class="flex-1 p-5 flex flex-col justify-between min-w-0">
      
      <div class="flex justify-between items-start gap-2 mb-2">
        <div class="min-w-0">
          <h3 class="text-xs font-bold tracking-wide uppercase text-[#3f2a52] truncate">
            {{ nombre }}
          </h3>
          <p class="text-xs text-gray-400 font-medium mt-0.5 truncate">
            Dep: {{ departamento }}
          </p>
        </div>
        
        <span class="text-[10px] bg-[#beaed8]/30 text-[#3f2a52] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider flex-shrink-0">
          {{ periodicidad }}
        </span>
      </div>

      <div class="my-2 flex items-baseline gap-2">
        <span class="text-3xl font-bold text-gray-900 tracking-tight">
          {{ valor }}
        </span>
        <span v-if="tendencia" class="text-[11px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded font-bold flex-shrink-0">
          {{ tendencia }}
        </span>
      </div>

      <div class="pt-2 border-t border-gray-50 flex items-center gap-1.5 text-xs text-gray-500 flex-shrink-0">
        <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span class="truncate">
          <strong class="font-medium text-gray-600">Resp:</strong> {{ responsable }}
        </span>
      </div>

    </div>
    
  </div>
</template>