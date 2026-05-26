<script setup>
import { ref, computed } from 'vue'
import MedidorKpi from '../components/MedidorKpi.vue'
import ProgresoKpi from '../components/ProgresoKpi.vue'
import EncabezadoPantalla from '../components/EncabezadoPantalla.vue'
import plantillatabla from '../components/plantillatabla.vue'

// Listado de indicadores detallados
const misIndicadores = ref([
  {
    "id": 1,
    "departamento": "Backend & API",
    "subtitulo": "Uptime & Latencia",
    "icono": "database",
    "objetivo": "99.95%",
    "progreso": 99.98,
    "estado": "SALUDABLE",
    "estadoTipo": "success"
  },
  {
    "id": 2,
    "departamento": "Frontend Architecture",
    "subtitulo": "Web Vitals",
    "icono": "browser",
    "objetivo": "85 pts",
    "progreso": 78,
    "estado": "EN RIESGO",
    "estadoTipo": "warning"
  },
  {
    "id": 3,
    "departamento": "Ciberseguridad",
    "subtitulo": "Vulnerabilidades",
    "icono": "shield",
    "objetivo": "0 Críticas",
    "progreso": 45,
    "estado": "CRÍTICO",
    "estadoTipo": "danger"
  },
  {
    "id": 4,
    "departamento": "Cloud Infrastructure",
    "subtitulo": "Uso de CPU & Memoria",
    "icono": "server",
    "objetivo": "< 75%",
    "progreso": 88,
    "estado": "CRÍTICO",
    "estadoTipo": "danger"
  },
  {
    "id": 5,
    "departamento": "DevOps & CI/CD",
    "subtitulo": "Despliegues Exitosos",
    "icono": "rocket",
    "objetivo": "95%",
    "progreso": 96.5,
    "estado": "SALUDABLE",
    "estadoTipo": "success"
  },
  {
    "id": 6,
    "departamento": "Database Cluster",
    "subtitulo": "Optimización de Queries",
    "icono": "database-settings",
    "objetivo": "< 200ms",
    "progreso": 60,
    "estado": "EN RIESGO",
    "estadoTipo": "warning"
  },
  {
    "id": 7,
    "departamento": "QA & Automation",
    "subtitulo": "Cobertura de Pruebas",
    "icono": "test-tube",
    "objetivo": "> 80%",
    "progreso": 84,
    "estado": "SALUDABLE",
    "estadoTipo": "success"
  },
  {
    "id": 8,
    "departamento": "FinOps & Costos",
    "subtitulo": "Presupuesto Mensual",
    "icono": "credit-card",
    "objetivo": "$5,000 USD",
    "progreso": 92,
    "estado": "EN RIESGO",
    "estadoTipo": "warning"
  }
]) 

// Cabeceras exactas para la tabla detallada
const cabecerasDetalle = ['Departamento', 'Objetivo', 'Progreso', 'Estado']
const cabecerasCriticos = ['Detalle del Indicador en Alerta']

// Computed para filtrar alertas y críticos
const kpisCriticas = computed(() => {
  return misIndicadores.value.filter(ind => ind.estadoTipo === 'danger' || ind.estadoTipo === 'warning')
})
</script>

<template>
  <div class="p-3 min-h-screen bg-slate-50/50">
  
      <EncabezadoPantalla 
        titulo="Panel Principal" 
        descripcion="Visualización general de la empresa e indicadores (Kpis)."
      />

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <div class="lg:col-span-5 flex flex-col gap-6">
          <div class="bg-[#3f2a52] border border-[#beaed8]/70 rounded-2xl p-5 w-full shadow-sm h-60 flex flex-col justify-between transition-all">
            <p class="text-[11px] font-bold text-[#beaed8] uppercase tracking-wider">Resumen de KPIs</p>
            <div class="flex-1 flex items-center justify-center">
              <MedidorKpi />
            </div>
          </div>

          <div class="bg-[#3f2a52] border border-[#beaed8]/70 rounded-2xl p-5 w-full shadow-sm h-60 flex flex-col justify-between transition-all">
            <p class="text-[11px] font-bold text-[#beaed8] uppercase tracking-wider">Progreso General de las KPIs</p>
            <div class="flex-1 flex items-center justify-center">
              <ProgresoKpi />
            </div>
          </div>
        </div>

        <div class="lg:col-span-7 h-full">
          <plantillatabla
            titulo="Resumen de KPIs Críticos y en Riesgo"
            :encabezados="cabecerasCriticos"
            :datos="kpisCriticas"
            :mostrarAcciones="false"
            class="!mt-0 min-h-[504px] [&_thead]:hidden"
          >
            <template #default="{ fila }">
              <td class="p-4 align-middle w-full">
                <div class="flex justify-between items-center w-full">
                  <div class="text-xs font-medium text-slate-700 tracking-wide">
                    <span class="font-bold uppercase text-slate-800">{{ fila.departamento }}</span>
                    <span class="mx-2 text-slate-400">—</span>
                    <span class="text-slate-500 font-normal">{{ fila.subtitulo }}</span>
                  </div>
                  
                  <span 
                    class="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border flex-shrink-0"
                    :class="{
                      'text-amber-500 bg-amber-50/60 border-amber-200/50': fila.estadoTipo === 'warning',
                      'text-rose-500 bg-rose-50/60 border-rose-200/50': fila.estadoTipo === 'danger'
                    }"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" 
                      :class="{
                        'bg-amber-500': fila.estadoTipo === 'warning',
                        'bg-rose-500': fila.estadoTipo === 'danger'
                      }">
                    </span>
                    {{ fila.estado }}
                  </span>
                </div>
              </td>
            </template>
          </plantillatabla>
        </div>

      </div>

      <plantillatabla
        titulo="Métricas Detalladas por Departamento"
        :encabezados="cabecerasDetalle"
        :datos="misIndicadores"
        :mostrarAcciones="true"
        class="mt-6 [&_th:nth-child(1)]:w-2/5 [&_th:nth-child(2)]:w-1/5 [&_th:nth-child(2)]:text-center [&_th:nth-child(3)]:w-1/5 [&_th:nth-child(3)]:text-center [&_th:nth-child(4)]:w-1/5 [&_th:nth-child(4)]:text-center"
      >
        <template #default="{ fila }">
          
          <td class="p-4 align-middle w-2/5">
            <div class="flex items-center gap-4">
              <div class="w-9 h-9 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-600 flex-shrink-0 shadow-3xs">
                <svg v-if="fila.icono === 'database' || fila.icono === 'database-settings'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.2" stroke="currentColor" class="w-4 h-4 text-[#3f2a52]">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694 4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                </svg>
                <svg v-else-if="fila.icono === 'browser'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.2" stroke="currentColor" class="w-4 h-4 text-[#3f2a52]">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                </svg>
                <svg v-else-if="fila.icono === 'server'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.2" stroke="currentColor" class="w-4 h-4 text-[#3f2a52]">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 0 6h13.5a3 3 0 1 0 0-6m-16.5-3a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3m-19.5 0v-1.5a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v1.5m-19.5 0a3 3 0 0 0 3 3m13.5 0a3 3 0 0 0 3-3M6.75 6.75h.008v.008H6.75V6.75Zm.008 9h-.008v-.008h.008v.008Zm3.742-9h.008v.008h-.008V6.75Zm.008 9h-.008v-.008h.008v.008Z" />
                </svg>
                <svg v-else-if="fila.icono === 'rocket'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.2" stroke="currentColor" class="w-4 h-4 text-[#3f2a52]">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L6 12Zm0 0h7.5" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.2" stroke="currentColor" class="w-4 h-4 text-[#3f2a52]">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.956 11.956 0 0 1 12 2.714Z" />
                </svg>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-bold text-slate-800 tracking-tight">{{ fila.departamento }}</span>
                <span class="text-xs font-normal text-slate-400 mt-0.5">{{ fila.subtitulo }}</span>
              </div>
            </div>
          </td>

          <td class="p-4 align-middle text-center font-bold text-sm text-slate-700 w-1/5">
            {{ fila.objetivo }}
          </td>

          <td class="p-4 align-middle w-1/5">
            <div class="flex items-center justify-center gap-3">
              <span class="font-bold text-sm text-slate-700 w-12 text-right">{{ fila.progreso }}%</span>
              <div class="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div class="bg-[#3f2a52] h-full rounded-full" :style="{ width: fila.progreso + '%' }"></div>
              </div>
            </div>
          </td>

          <td class="p-4 align-middle text-center w-1/5">
            <span 
              class="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border"
              :class="{
                'text-emerald-600 bg-emerald-50 border-emerald-200/50': fila.estadoTipo === 'success',
                'text-amber-500 bg-amber-50 border-amber-200/50': fila.estadoTipo === 'warning',
                'text-rose-500 bg-rose-50 border-rose-200/50': fila.estadoTipo === 'danger'
              }"
            >
              <span class="w-1.5 h-1.5 rounded-full" 
                :class="{
                  'bg-emerald-500': fila.estadoTipo === 'success',
                  'bg-amber-500': fila.estadoTipo === 'warning',
                  'bg-rose-500': fila.estadoTipo === 'danger'
                }">
              </span>
              {{ fila.estado }}
            </span>
          </td>
        </template>

        <template #iconos-acciones>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-slate-400 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
          </svg>
        </template>
      </plantillatabla>

  </div>
</template>