<script setup>
import { ref } from 'vue'

// 1. IMPORTACIÓN CORREGIDA: Ahora apunta al archivo en minúsculas
import plantillatabla from '../components/plantillatabla.vue'

const misIndicadores = ref([
  {
    id: 1,
    nombre: "Margen de Beneficio Neto",
    formula: "(Ingresos - Gastos) / Ingresos",
    departamento: "Finanzas",
    responsable: "Ing. Keila O.",
    valor: "24.8%",
    periodicidad: "Mensual",
    estado: "Óptimo"
  },
  {
    id: 2,
    nombre: "Uptime de Servidores",
    formula: "(Tiempo Activo / Tiempo Total) * 100",
    departamento: "Operaciones",
    responsable: "Ing. Marcos R.",
    valor: "99.2%",
    periodicidad: "Diario",
    estado: "Alerta"
  },
  {
    id: 3,
    nombre: "Tasa de Churn de Clientes",
    formula: "Clientes perdidos / Clientes totales",
    departamento: "Ventas",
    responsable: "Dra. Elena S.",
    valor: "5.2%",
    periodicidad: "Semanal",
    estado: "Saludable"
  },
  {
    id: 4,
    nombre: "Satisfacción de Empleados (eNPS)",
    formula: "% Promotores - % Detractores",
    departamento: "Recursos Humanos",
    responsable: "S. Gutierrez",
    valor: "5.2%",
    periodicidad: "Diario",
    estado: "Crítico"
  },
  {
    id: 4,
    nombre: "Satisfacción de Empleados (eNPS)",
    formula: "% Promotores - % Detractores",
    departamento: "Recursos Humanos",
    responsable: "S. Gutierrez",
    valor: "5.2%",
    periodicidad: "Diario",
    estado: "Crítico"
  }
])
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-1">
    
    <div class="bg-[#3f2a52] text-white rounded-xl shadow-lg p-5 border flex flex-col justify-between">
      <div class="flex justify-between items-center mb-4">
        <span class="text-xs font-bold tracking-wider text-[#beaed8] uppercase">KPIs Saludables</span>
        <span class="text-emerald-400 text-lg">✓</span> 
      </div>
      <div class="my-2">
        <span class="text-4xl font-extrabold tracking-tight">12</span>
      </div>
      <div class="mt-2 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">Estado: Óptimo</span>
      </div>
    </div>

    <div class="bg-[#3f2a52] text-white rounded-xl shadow-lg p-5 border flex flex-col justify-between">
      <div class="flex justify-between items-center mb-4">
        <span class="text-xs font-bold tracking-wider text-[#beaed8] uppercase">KPIs en alerta</span>
        <span class="text-yellow-400 text-lg">⚠</span> 
      </div>
      <div class="my-2">
        <span class="text-4xl font-extrabold tracking-tight">05</span>
      </div>
      <div class="mt-2 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
        <span class="text-[11px] font-bold text-yellow-400 uppercase tracking-wide">Estado: preventivo</span>
      </div>
    </div>

    <div class="bg-[#3f2a52] text-white rounded-xl p-5 shadow-lg border flex flex-col justify-between">
      <div class="flex justify-between items-center mb-4">
        <span class="text-xs font-bold tracking-wider text-[#beaed8] uppercase">kpis críticas</span>
        <span class="text-red-400 text-lg">✕</span>
      </div>
      <div class="my-2">
        <span class="text-4xl font-extrabold tracking-tight">02</span>
      </div>
      <div class="mt-2 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
        <span class="text-[11px] font-bold text-red-400 uppercase tracking-wide">Estado: preventivo</span>
      </div>
    </div>

  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-white rounded-xl shadow-md border border-[#beaed8]/90 mt-8">
    
    <div class="flex flex-col gap-1.5">
      <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Departamento</label>
      <select class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#77a9d4] cursor-pointer transition-colors">
        <option value="">Todos los departamentos</option>
        <option value="finanzas">Finanzas</option>
        <option value="ventas">Ventas</option>
        <option value="operaciones">Operaciones</option>
      </select>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tipo de Métrica</label>
      <select class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#77a9d4] cursor-pointer transition-colors">
        <option value="">Cualquier tipo</option>
        <option value="financiera">Financiera</option>
        <option value="proceso">Operaciones</option>
        <option value="calidad">Calidad</option>
      </select>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Estado</label>
      <select class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/90 p-2.5 outline-none focus:border-[#77a9d4] cursor-pointer transition-colors">
        <option value="">Todos los estados</option>
        <option value="saludable">Saludable</option>
        <option value="alerta">Alerta</option>
        <option value="critico">Crítico</option>
      </select>
    </div>

    <div class="flex items-end justify-end">
      <button class="bg-[#77a9d4] hover:bg-[#beaed8] text-gray-700 font-bold text-xs p-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors h-[38px] w-full sm:w-auto">
        Nuevo KPI
      </button>
    </div>

  </div>

  <plantillatabla 
    titulo="Listado Central de KPIs Empresariales"
    :encabezados="['Nombre del KPI', 'Departamento', 'Responsable', 'Valor Actual', 'Periodicidad', 'Estado', 'Acciones']"
    :datos="misIndicadores"
  >
    <template #default="{ fila }">
      
      <td class="p-4">
        <div class="font-bold text-gray-800 text-xs">{{ fila.nombre }}</div>
        <div class="text-[11px] text-gray-400 mt-0.5">Cálculo: {{ fila.formula }}</div>
      </td>
      
      <td class="p-4 text-gray-600 text-sm">{{ fila.departamento }}</td>
      <td class="p-4 text-gray-600 text-sm">{{ fila.responsable }}</td>
      <td class="p-4 font-semibold text-gray-800 text-sm">{{ fila.valor }}</td>
      
      <td class="p-4">
        <span class="text-[10px] font-bold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full uppercase tracking-wide border border-gray-200">
          {{ fila.periodicidad }}
        </span>
      </td>
      
      <td class="p-4">
        <div class="flex items-center gap-1.5 text-sm font-medium"
             :class="{
               'text-emerald-600': fila.estado === 'Óptimo' || fila.estado === 'Saludable',
               'text-yellow-600': fila.estado === 'Alerta',
               'text-red-600': fila.estado === 'Crítico'
             }">
          <span class="w-2 h-2 rounded-full animate-pulse" 
                :class="{
                  'bg-emerald-500': fila.estado === 'Óptimo' || fila.estado === 'Saludable',
                  'bg-yellow-400': fila.estado === 'Alerta',
                  'bg-red-500': fila.estado === 'Crítico'
                }"></span>
          {{ fila.estado }}
        </div>
      </td>
      
      <td class="p-4 text-right">
        <button class="text-gray-400 hover:text-gray-600 font-bold px-2 text-lg">⋮</button>
      </td>

    </template>
  </plantillatabla>
</template>