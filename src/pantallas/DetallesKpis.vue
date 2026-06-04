<script setup>
import { ref, computed } from 'vue'
import GraficaDetalles from '../components/GraficaDetalles.vue'

const historial = ref([
  { 
    id: 1, 
    titulo: 'Actualización de Meta SLA', 
    desc: 'El umbral de Óptimo se elevó...', 
    fecha: '2024-06-12', 
    autor: 'Carlos M.' 
},
  { 
    id: 2, 
    titulo: 'Nuevo Responsable', 
    desc: 'Asignación del equipo SRE-A...', 
    fecha: '2024-05-05', 
    autor: 'Admin' 
},
  { 
    id: 3, 
    titulo: 'Nuevo Responsable', 
    desc: 'Asignación del Kpi de desarrollo', 
    fecha: '2024-03-05', 
    autor: 'Usuario' 
},
  { id: 4, 
    titulo: 'Cambio de fecha', 
    desc: 'Asignación del Kpi de desarrollo', 
    fecha: '2024-12-09', 
    autor: 'Admin' 
},
  { 
    id: 5, 
    titulo: 'Nuevo Responsable', 
    desc: 'Asignación del Kpi de desarrollo', 
    fecha: '2024-01-05', 
    autor: 'Usuario' 
},
  { 
    id: 6, 
    titulo: 'Actualización de Meta SLA',
    desc: 'El umbral de Óptimo se elevó...', 
    fecha: '2024-10-12',
    autor: 'Carlos M.'
},
])

const filtro = ref('todos')

const historialFiltrado = computed(() => {
  if (filtro.value === 'todos') return historial.value
  return historial.value.filter(h => h.fecha.startsWith(filtro.value))
})
</script>

<template>
  <div class="flex flex-col gap-6 w-full px-6">

    <div class="flex flex-col">

    <button @click="$router.push('/kpis')"
       type="button" class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors flex items-center w-35">
        ← Volver al Listado
      </button>
</div>

  <div class="bg-[#3f2a52] border border-[#beaed8]/70 rounded-2xl p-6 w-full shadow-lg items-center justify-center">
    <p class="text-[11px] font-bold text-[#beaed8] uppercase tracking-wider mb-4">Registro de Mediciones</p>
    
  <div class="w-full h-120 flex items-center justify-center">
    <GraficaDetalles />
  </div>

</div>
    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm w-full">
      <div class="mb-6 flex justify-between items-center w-full">
        <div>
          <h2 class="text-lg font-bold text-black">Historial de Cambios</h2>
          <p class="text-xs text-gray-500">Auditoría de umbrales y responsabilidades</p>
        </div>
        
        <select v-model="filtro" class="text-white bg-[#3f2a52] px-4 py-2 rounded-lg hover:bg-[#5a3f73] transition-colors cursor-pointer outline-none">
          <option value="todos">Todos los meses</option>
          <option value="2024-01">Enero</option>
          <option value="2024-02">Febrero</option>
          <option value="2024-03">Marzo</option>
          <option value="2024-04">Abril</option>
          <option value="2024-05">Mayo</option>
          <option value="2024-06">Junio</option>
          <option value="2024-07">Julio</option>
          <option value="2024-08">Agosto</option>
          <option value="2024-09">Septiembre</option>
          <option value="2024-10">Octubre</option>
          <option value="2024-11">Noviembre</option>
          <option value="2024-12">Diciembre</option>
        </select>
      </div>

      <div class="space-y-4 w-full">
        <div v-for="h in historialFiltrado" :key="h.id" class="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors w-full">
          <div class="flex justify-between items-start w-full gap-4">
            <div class="flex gap-4 flex-grow">
              <div class="p-2 bg-gray-100 rounded-lg text-gray-600 flex-shrink-0">
                <i class="fi fi-rr-pencil text-sm"></i>
              </div>
              <div class="w-full">
                <p class="text-sm font-bold text-black">{{ h.titulo }}</p>
                <p class="text-xs text-gray-600 mt-1">{{ h.desc }}</p>
                <p class="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-wider">Por: {{ h.autor }}</p>
              </div>
            </div>
            <span class="text-[10px] text-gray-500 font-bold bg-gray-100 px-2 py-1 rounded whitespace-nowrap">{{ h.fecha }}</span>
          </div>
        </div>
        <p v-if="historialFiltrado.length === 0" class="text-center text-gray-400 py-4">No hay cambios en este periodo.</p>
      </div>
    </div>
  </div>
</template>