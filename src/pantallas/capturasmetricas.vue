<script setup>
import { ref } from 'vue'
const misIndicadores = ref([
{
    id: 1,
    titulo: 'Métrica de Latencia API Gateway',
    tiempo: 'Hace 2 días',
    rol: 'Ing. Arq. Software',
    estado: 'RETRASADA',
    colorClase: 'bg-rose-400' 
  },
]) 
</script>

<template>
<div class="text-black p-8 min-h-screen font-sans">
<div class="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 w-full max-w-5xl"></div>

<div class="max-w-xl">
    <h1 class="text-3x1 font-bold tracking-tight text-black mb-2">Captura de Metricas Operativas</h1>
</div>

 <div class="overflow-y-auto overflow-x-auto max-h-[300px] pr-2 scrollbar-delgada"></div>
<div class="border-b border-slate-800 rounded-xl p-6 w-full max-w-5x1 shadow-x1">

    <div class="flex justify-between items-center pb-4 mb-4 border-b border-slate-600">
        <h2 class=" text-black font-bold  uppercase tracking-wider text-black">
            Kpis asignadas
        </h2>
        <button class="p-3 py-1 text-xs font-bold tracking-wider rounded border border-slate-700 shadow-sm active:scale-95 transition-transform uppercase bg-[#3f2a52] hover:bg-[#beaed8] text-white">
        </button>
        <i class="fi fi-sr-bars-filter text-lg"></i>
    </div>
</div>


</div>






</template>