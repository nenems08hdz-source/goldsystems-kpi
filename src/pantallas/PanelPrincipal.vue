<script setup>
import MedidorKpi from '../components/MedidorKpi.vue'
import ProgresoKpi from '../components/ProgresoKpi.vue'
import { ref, computed } from 'vue'

const misIndicadores = ref([
  {
    "id": 1,
    "departamento": "Backend & API",
    "subtitulo": "Uptime & Latencia",
    "icono": "database",
    "objetivo": "99.95%",
    "progreso": 99.98,
    "estado": "Óptimo",
    "estadoTipo": "success"
  },
  {
    "id": 2,
    "departamento": "Frontend Architecture",
    "subtitulo": "Web Vitals",
    "icono": "browser",
    "objetivo": "85 pts",
    "progreso": 78,
    "estado": "En Riesgo",
    "estadoTipo": "warning"
  },
  {
    "id": 3,
    "departamento": "Ciberseguridad",
    "subtitulo": "Vulnerabilidades",
    "icono": "shield",
    "objetivo": "0 Críticas",
    "progreso": 45,
    "estado": "Crítico",
    "estadoTipo": "danger"
  } ,
  {
    "id": 4,
    "departamento": "Cloud Infrastructure",
    "subtitulo": "Uso de CPU & Memoria",
    "icono": "server",
    "objetivo": "< 75%",
    "progreso": 88,
    "estado": "Crítico",
    "estadoTipo": "danger"
  },
  {
    "id": 5,
    "departamento": "DevOps & CI/CD",
    "subtitulo": "Despliegues Exitosos",
    "icono": "rocket",
    "objetivo": "95%",
    "progreso": 96.5,
    "estado": "Óptimo",
    "estadoTipo": "success"
  },
  {
    "id": 6,
    "departamento": "Database Cluster",
    "subtitulo": "Optimización de Queries",
    "icono": "database-settings",
    "objetivo": "< 200ms",
    "progreso": 60,
    "estado": "En Riesgo",
    "estadoTipo": "warning"
  },
  {
    "id": 7,
    "departamento": "QA & Automation",
    "subtitulo": "Cobertura de Pruebas",
    "icono": "test-tube",
    "objetivo": "> 80%",
    "progreso": 84,
    "estado": "Óptimo",
    "estadoTipo": "success"
  },
  {
    "id": 8,
    "departamento": "FinOps & Costos",
    "subtitulo": "Presupuesto Mensual",
    "icono": "credit-card",
    "objetivo": "$5,000 USD",
    "progreso": 92,
    "estado": "En Riesgo",
    "estadoTipo": "warning"
  }
]) 

const kpisCriticas = computed(() => {
  return misIndicadores.value.filter(ind => ind.estadoTipo === 'danger' || ind.estadoTipo === 'warning')
})
</script>

<template>
  <div class="p-6 min-h-screen bg-[#f8fafc] font-sans antialiased text-slate-900">

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-7xl mx-auto">
      
      <div class="lg:col-span-5 flex flex-col gap-6">
        <div class="bg-[#77a9d4] border border-slate-800 rounded-2xl p-6 w-full shadow-sm h-60 flex flex-col justify-between transition-all">
          <p class="text-xs font-bold text-black uppercase tracking-widest">Resumen de KPIs</p>
          <MedidorKpi />
        </div>

        <div class="bg-[#77a9d4] border border-slate-800 rounded-2xl p-6 w-full shadow-sm h-60 flex flex-col justify-between transition-all">
          <p class="text-xs font-bold text-black uppercase tracking-widest">Progreso General de las KPIs</p>
          <ProgresoKpi />
        </div>
      </div>

      <div class="lg:col-span-7">
        <div class="rounded-2xl bg-white border border-[#e2e8f0] overflow-hidden p-6 w-full shadow-sm">
          
          <div class="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
            <span class="text-slate-800 font-bold text-xs uppercase tracking-wider">
              Resumen de KPIs Críticos y en Riesgo
            </span>
          </div>

          <div class="overflow-y-auto max-h-[365px] pr-1">
            <table class="w-full border-collapse">
              <tbody class="divide-y divide-slate-100">
                <tr 
                  v-for="kpi in kpisCriticas" 
                  :key="'critica-' + kpi.id" 
                  class="hover:bg-[#beaed8] transition-colors duration-200 group"
                >
                  <td class="py-3.5 px-2 flex justify-between items-center rounded-xl transition-all">
                    <span class="text-slate-700 font-semibold text-sm group-hover:text-slate-900">{{ kpi.departamento }} — {{ kpi.subtitulo }}</span>
                    <span 
                      class="px-3 py-1 text-[10px] font-bold tracking-wider rounded-full uppercase border shadow-xs"
                      :class="{
                        'text-amber-600 bg-amber-50 border-amber-100 group-hover:bg-white/80': kpi.estadoTipo === 'warning',
                        'text-rose-600 bg-rose-50 border-rose-100 group-hover:bg-white/80': kpi.estadoTipo === 'danger'
                      }"
                    >
                      {{ kpi.estado }}
                    </span>
                  </td>
                </tr>
                <tr v-if="kpisCriticas.length === 0">
                  <td class="py-4 text-center text-sm text-slate-400 font-medium">No hay alertas críticas en este ciclo.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white border border-[#e2e8f0] rounded-2xl p-6 w-full shadow-sm mt-8 max-w-7xl mx-auto">
      
      <div class="flex justify-between items-center w-full border-b border-slate-100 pb-4 mb-5">
        <h3 class="text-lg font-bold tracking-tight text-slate-900">
          Métricas Detalladas por Departamento
        </h3>
        <button class="py-1.5 px-4 text-xs font-bold tracking-wide rounded-xl text-white bg-[#77a9d4] hover:bg-[#beaed8] shadow-sm transition-all duration-300 active:scale-95">
          Ver Historial
        </button>
      </div>

      <div class="overflow-x-auto overflow-y-auto max-h-[420px] pr-1">
        <table class="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr class="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 sticky top-0 bg-white z-10">
              <th class="pb-3 pl-2">Departamento</th>
              <th class="pb-3 text-center">Objetivo</th>
              <th class="pb-3 text-center">Progreso</th>
              <th class="pb-3 text-center">Estado</th>
              <th class="pb-3 text-right pr-4">Tendencia</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr 
              v-for="indicador in misIndicadores" 
              :key="indicador.id" 
              class="hover:bg-[#beaed8] transition-colors duration-200 group"
            >
              
              <td class="py-4 pl-2">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-600 shadow-xs flex-shrink-0 group-hover:bg-white/60 transition-colors">
                    <svg v-if="indicador.icono === 'database'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.3" stroke="currentColor" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                    </svg>
                    <svg v-else-if="indicador.icono === 'browser'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.3" stroke="currentColor" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.3" stroke="currentColor" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.956 11.956 0 0 1 12 2.714Z" />
                    </svg>
                  </div>
                  <div>
                    <div class="font-bold text-sm text-slate-800 tracking-tight group-hover:text-slate-900">{{ indicador.departamento }}</div>
                    <div class="text-[12px] text-slate-400 font-medium mt-0.5 group-hover:text-slate-600">{{ indicador.subtitulo }}</div>
                  </div>
                </div>
              </td>

              <td class="py-4 text-center font-bold text-sm text-slate-800 group-hover:text-slate-900">
                {{ indicador.objetivo }}
              </td>

              <td class="py-4">
                <div class="flex items-center justify-center gap-3">
                  <span class="font-bold text-sm text-slate-800 group-hover:text-slate-900">{{ indicador.progreso }}%</span>
                  <div class="w-24 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/40 group-hover:bg-white/50">
                    <div class="bg-[#2a1b40] h-full rounded-full transition-all duration-500" :style="{ width: indicador.progreso + '%' }"></div>
                  </div>
                </div>
              </td>

              <td class="py-4 text-center">
                <span 
                  class="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border shadow-xs"
                  :class="{
                    'text-emerald-600 bg-emerald-50/60 border-emerald-100 group-hover:bg-white/80': indicador.estadoTipo === 'success',
                    'text-amber-600 bg-amber-50/60 border-amber-100 group-hover:bg-white/80': indicador.estadoTipo === 'warning',
                    'text-rose-600 bg-rose-50/60 border-rose-100 group-hover:bg-white/80': indicador.estadoTipo === 'danger'
                  }"
                >
                  <span class="w-1.5 h-1.5 rounded-full" 
                    :class="{
                      'bg-emerald-500': indicador.estadoTipo === 'success',
                      'bg-amber-500': indicador.estadoTipo === 'warning',
                      'bg-rose-500': indicador.estadoTipo === 'danger'
                    }">
                  </span>
                  {{ indicador.estado }}
                </span>
              </td>

              <td class="py-4 text-right text-slate-400 pr-4 group-hover:text-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 inline opacity-80 hover:text-slate-900 transition-colors cursor-pointer">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
              </td>

            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>