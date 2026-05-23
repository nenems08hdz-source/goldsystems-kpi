<script setup>
import { ref } from 'vue'
import plantillatabla from '../components/plantillatabla.vue'


const metricasAsignadas = ref([
  {
    id: 1,
    nombre: "Métrica de Latencia API Gateway",
    info: "Hace 2 días | Ing. Arantxa",
    estado: "RETRASADA",
    claseEstado: "text-red-500 bg-red-50 border-red-100",
    icono: "📊"
  },
  {
    id: 2,
    nombre: "Uso de Memoria (Production Node A)",
    info: "En 4 horas | Servidor-PRD",
    estado: "POR VENCER",
    claseEstado: "text-amber-500 bg-amber-50 border-amber-100",
    icono: "💻"
  },
  {
    id: 3,
    nombre: "Tasa de Error HTTP 5xx",
    info: "Hoy, 18:00 | Monitoring Lab",
    estado: "A TIEMPO",
    claseEstado: "text-emerald-500 bg-emerald-50 border-emerald-100",
    icono: "🛡️"
  }
])
</script>

<template>
  <div class="p-3 min-h-screen">
    
    <div class="mb-6">
      <h1 class="text-4xl font-bold text-[#3f2a52] tracking-tight text-left">
        Captura de Métricas Operativas
      </h1>
      <p class="text-xs text-gray-500 mt-1 text-left">
        Registre los indicadores técnicos del ciclo actual y gestione las tareas de monitoreo.
      </p>
    </div>

    <div>
      <plantillatabla 
        titulo="KPIs ASIGNADAS"
        :encabezados="['Indicador Operativo', 'Estado de Entrega', 'Acción']"
        :datos="metricasAsignadas"
      >
        <template #default="{ fila }">
          
          <td class="p-4 align-middle">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center text-lg border border-gray-100 shadow-sm bg-gray-50">
                {{ fila.icono }}
              </div>
              <div class="text-left">
                <div class="font-bold text-gray-800 text-sm tracking-tight">{{ fila.nombre }}</div>
                <div class="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                  <span>Formato: {{ fila.info }}</span>
                </div>
              </div>
            </div>
          </td>
          
          <td class="p-4 align-middle">
            <span 
              class="text-[10px] font-black px-3 py-1 rounded border uppercase tracking-widest inline-block"
              :class="fila.claseEstado"
            >
              {{ fila.estado }}
            </span>
          </td>
          
          <td class="p-4 align-middle text-right">
            <button class="bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-[#3f2a52] p-2 rounded-lg border border-gray-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </td>

        </template>
      </plantillatabla>

      <div class="mt-4 flex justify-end">
        <button class="bg-[#3f2a52] hover:bg-[#77a9d4] text-white text-xs font-bold py-2.5 px-5 rounded-lg flex items-center gap-2 shadow-sm transition-all duration-300">
          <span>+</span> Registrar Nueva Métrica
        </button>
      </div>
    </div>

  </div>
</template>