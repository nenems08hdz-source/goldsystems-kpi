<script setup>
import MedidorKpi from '../components/MedidorKpi.vue'
import ProgresoKpi from '../components/ProgresoKpi.vue'
import { ref } from 'vue'

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
</script>

<template>
  <div class="p-6 min-h-screen">

    <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
      
      <div class="md:col-span-5 flex flex-col">
    
        <div class="bg-[#77a9d4] border border-slate-500 rounded-2xl p-6 w-full max-w-md shadow-xl mt-7 h-64 flex flex-col justify-between">
          <p class="text-xs font-bold text-slate-100 uppercase tracking-widest mb-4">Resumen de Kpis</p>
          <MedidorKpi />
        </div>

        <div class="bg-[#77a9d4] border border-slate-500 rounded-2xl p-6 w-full max-w-md shadow-xl h-64 flex flex-col justify-between mt-6">
          <p class="text-xs font-bold text-slate-100 uppercase tracking-widest mb-4">Proceso general de las Kpis</p>
          <ProgresoKpi />
        </div>
      </div>

     <div class="md:col-span-7 mt-7">
  <div class="rounded-xl bg-white border border-slate-200 overflow-y-auto max-h-[530px] min-h-[256px] p-6 w-full shadow-xl">
    
    <div class="flex items-center gap-2 pb-3 mb-4 border-b border-slate-200">
      <i class="fi fi-sr-summary-check text-lg text-slate-700"></i>
      <span class="text-slate-800 font-bold text-sm uppercase tracking-wider">
        Resumen de Kpis criticos
      </span>
    </div>

    <table class="w-full border-collapse">
      <tbody class="divide-y divide-slate-100">
        
        <tr class="hover:bg-[#beaed8] transition-colors duration-150">
          <td class="py-4 px-2 flex justify-between items-center">
            <span class="text-slate-900 font-medium text-sm">Ciclo de Deployment</span>
            <button class="p-3 py-1 text-xs font-bold tracking-wider rounded border border-slate-300 shadow-sm active:scale-95 transition-transform uppercase bg-[#3f2a52] hover:bg-[#beaed8] text-white">
              estable
            </button>
          </td>
        </tr>

        <tr class="hover:bg-[#beaed8] transition-colors duration-150">
          <td class="py-4 px-2 flex justify-between items-center">
            <span class="text-slate-900 font-medium text-sm">Tasa de Errores (Error Rate)</span>
            <button class="p-3 py-1 text-xs font-bold tracking-wider rounded border border-slate-300 shadow-sm active:scale-95 transition-transform uppercase bg-[#3f2a52] hover:bg-[#beaed8] text-white">
              estable
            </button>
          </td>
        </tr>

        <tr class="hover:bg-[#beaed8] transition-colors duration-150">
          <td class="py-4 px-2 flex justify-between items-center">
            <span class="text-slate-900 font-medium text-sm">Uso de Infraestructura</span>
            <button class="p-3 py-1 text-xs font-bold tracking-wider rounded border border-slate-300 shadow-sm active:scale-95 transition-transform uppercase bg-[#3f2a52] hover:bg-[#beaed8] text-white">
              estable
            </button>
          </td>
        </tr>

        <tr class="hover:bg-[#beaed8] transition-colors duration-150">
          <td class="py-4 px-2 flex justify-between items-center">
            <span class="text-slate-900 font-medium text-sm">Cobertura de Tests</span>
            <button class="p-3 py-1 text-xs font-bold tracking-wider rounded border border-slate-300 shadow-sm active:scale-95 transition-transform uppercase bg-[#3f2a52] hover:bg-[#beaed8] text-white">
              estable
            </button>
          </td>
        </tr>

        <tr class="hover:bg-[#beaed8] transition-colors duration-150">
          <td class="py-4 px-2 flex justify-between items-center">
            <span class="text-slate-900 font-medium text-sm">MTTR (Media de Reparación)</span>
            <button class="p-3 py-1 text-xs font-bold tracking-wider rounded border border-slate-300 shadow-sm active:scale-95 transition-transform uppercase bg-[#df2222] hover:bg-[#be4d4d] text-white">
              estable
            </button>
          </td>
        </tr>
        
        <tr class="hover:bg-[#beaed8] transition-colors duration-150">
          <td class="py-4 px-2 flex justify-between items-center">
            <span class="text-slate-900 font-medium text-sm">Falta de seguridad</span>
            <button class="p-3 py-1 text-xs font-bold tracking-wider rounded border border-slate-300 shadow-sm active:scale-95 transition-transform uppercase bg-[#3f2a52] hover:bg-[#beaed8] text-white">
              estable
            </button>
          </td>
        </tr>
        
        <tr class="hover:bg-[#beaed8] transition-colors duration-150">
          <td class="py-4 px-2 flex justify-between items-center">
            <span class="text-slate-900 font-medium text-sm">mantenimiento</span>
            <button class="p-3 py-1 text-xs font-bold tracking-wider rounded border border-slate-300 shadow-sm active:scale-95 transition-transform uppercase bg-[#3f2a52] hover:bg-[#beaed8] text-white">
              estable
            </button>
          </td>
        </tr>
        
        <tr class="hover:bg-[#beaed8] transition-colors duration-150">
          <td class="py-4 px-2 flex justify-between items-center">
            <span class="text-slate-900 font-medium text-sm">vencida hace no se</span>
            <button class="p-3 py-1 text-xs font-bold tracking-wider rounded border border-slate-300 shadow-sm active:scale-95 transition-transform uppercase bg-[#3f2a52] hover:bg-[#beaed8] text-white">
              estable
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

    </div> <div class="bg-white border border-slate-200 rounded-2xl p-6 w-full shadow-xl mt-7">
      <div class="flex justify-between items-center w-full border-b border-slate-600/40 pb-4 mb-6">
        <h3 class="text-xl font-bold tracking-wide text-slate-900">
          Métricas Detalladas por Departamento
        </h3>
        <div class="flex gap-3">
          <button class="p-3 py-1 text-xs font-bold tracking-wider rounded border border-slate-700 shadow-sm active:scale-95 transition-transform uppercase bg-[#3f2a52] hover:bg-[#beaed8] text-white">
            Ver historial
          </button>
        </div>
      </div>

   <div class="overflow-y-auto overflow-x-auto max-h-[300px] pr-2 scrollbar-delgada">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-black">
          <th class="pb-3 text-center sticky top-0 bg-white z-10">Departamento</th>
          <th class="pb-3 text-center sticky top-0 bg-white z-10">Objetivo</th>
          <th class="pb-3 text-center sticky top-0 bg-white z-10">Progreso</th>
          <th class="pb-3 text-center sticky top-0 bg-white z-10">Estado</th>
          <th class="pb-3 text-center sticky top-0 bg-white z-10">Tendencia</th>
        </tr>
      </thead>

   <tbody class="divide-y divide-slate-600/30">
  
  <tr v-for="indicador in misIndicadores" :key="indicador.id" class="hover:bg-[#beaed8] transition-colors duration-150 group">
    
    <td class="py-4">
      <div class="flex items-start gap-3">
        <div class="p-2 bg-slate-900/10 rounded text-slate-900 mt-0.5 flex items-center justify-center">
          <svg v-if="indicador.icono === 'database'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
          </svg>
          <svg v-else-if="indicador.icono === 'browser'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.956 11.956 0 0 1 12 2.714Z" />
          </svg>
        </div>
        <div>
          <div class="font-bold text-sm text-slate-900">{{ indicador.departamento }}</div>
          <div class="text-xs text-slate-800 font-medium">{{ indicador.subtitulo }}</div>
        </div>
      </div>
    </td>

    <td class="py-4 text-center font-bold text-sm text-slate-900">
      {{ indicador.objetivo }}
    </td>

    <td class="py-4">
      <div class="flex items-center justify-center gap-3">
        <span class="font-bold text-sm text-slate-900">{{ indicador.progreso }}%</span>
        <div class="w-24 bg-slate-900/10 h-1.5 rounded-full overflow-hidden">
          <div class="bg-[#3f2a52] h-full rounded-full" :style="{ width: indicador.progreso + '%' }"></div>
        </div>
      </div>
    </td>

    <td class="py-4 text-center">
      <span class="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full bg-slate-900/10 text-slate-900 border border-slate-400/60">
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

    <td class="py-4 text-right text-slate-700 pr-4">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 inline">
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