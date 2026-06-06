<script setup>
import { ref } from 'vue'
import plantillatabla from '../components/PlantillaTabla.vue' 

const encabezados = ['Indicador', 'Fecha', 'Valor', 'Acciones']
const metricas = ref([
  { 
    id: 1, 
    nombre: "Latencia API Gateway", 
    fecha: "2026-05-22",
    valor: "0.14 ms"
 },
  { 
    id: 2, 
    nombre: "Uso de Memoria (Node A)", 
    fecha: "2026-05-24", 
    valor: "78.4 GB" 
}
])
</script>

<template>
  <div class="flex justify-center p-8 w-full">
    
    <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 w-full max-w-4xl">
      
      <div class="mb-6 border-b border-gray-100 pb-6">
        <h1 class="text-2xl font-black text-gray-900">Captura de Métricas</h1>
        <p class="text-xs text-gray-500">Gestión de indicadores operativos</p>
      </div>

      <div class="overflow-hidden">
        <plantillatabla 
          titulo="Registro de Métricas" 
          :encabezados="encabezados" 
          :datos="metricas"
        >
          <template #default="{ fila }">
            <td class="p-4 text-xs font-bold text-gray-800 whitespace-nowrap">{{ fila.nombre }}</td>
            <td class="p-4 text-xs text-gray-600 whitespace-nowrap">{{ fila.fecha }}</td>
            <td class="p-4 text-xs font-black text-[#3f2a52]">{{ fila.valor }}</td>
            <td class="p-4 text-center">
              <button class="text-[10px] bg-gray-100 px-3 py-1 rounded-lg hover:bg-[#beaed8] transition-colors">
                Editar
              </button>
            </td>
          </template>
        </plantillatabla>
      </div>
      
    </div>
  </div>
</template>