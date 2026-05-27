<script setup>
import { ref, onMounted} from 'vue'
import plantillatabla from '../components/plantillatabla.vue'
import tarjetaskpi from '../components/tarjetasestado.vue'
import EncabezadoPantalla from '../components/EncabezadoPantalla.vue'
const totalSaludables = ref(12)
const totalAlerta = ref(5)
const totalCriticos = ref(2)


const misIndicadores = ref([
  {
    id: 1,
    nombre: "Margen de Beneficio Neto",
    formula: "(Ingresos - Gastos) / Ingresos",
    departamento: "Finanzas",
    responsable: "Ing. Keila O.",
    valor: "24.8%",
    periodicidad: "Mensual",
    estado: "Saludable"
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
    id: 5,
    nombre: "Satisfacción de Empleados (eNPS)",
    formula: "% Promotores - % Detractores",
    departamento: "Recursos Humanos",
    responsable: "S. Arantxa",
    valor: "9.2%",
    periodicidad: "Trimestral",
    estado: "Crítico"
  },
  {
    id: 6,
    nombre: "Tiempo de Resolución de Soporte (MTTR)",
    formula: "Tiempo total de resolución / Casos totales",
    departamento: "Operaciones",
    responsable: "Ing. Carlos M.",
    valor: "1.8 hrs",
    periodicidad: "Diario",
    estado: "Saludable"
  },
  {
    id: 7,
    nombre: "Costo de Adquisición de Cliente (CAC)",
    formula: "Inversión en Marketing y Ventas / Nuevos Clientes",
    departamento: "Ventas",
    responsable: "Lic. Laura B.",
    valor: "$120.00",
    periodicidad: "Mensual",
    estado: "Alerta"
  },
  {
    id: 8,
    nombre: "Efectividad General del Equipo (OEE)",
    formula: "(Disponibilidad * Rendimiento * Calidad) * 100",
    departamento: "Calidad",
    responsable: "Ing. Andrés P.",
    valor: "72.5%",
    periodicidad: "Semanal",
    estado: "Crítico"
  }
])

onMounted(() => {
  const filas = document.querySelectorAll('.tabla-kpis table tbody tr')
  filas.forEach(tr => tr.classList.add('group'))
})
</script>

<template>
  <div class="p-3 min-h-screen">
    
    <EncabezadoPantalla 
      titulo="Panel de Indicadores (KPIs)" 
      descripcion="Visualización analítica, seguimiento de metas corporativas y estado actual de los procesos de la planta."
    />

    <tarjetaskpi 
      :saludables="totalSaludables"
      :alerta="totalAlerta"
      :criticos="totalCriticos"
      :eficiencia="eficienciaPlanta"
    />

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-white rounded-xl shadow-md border border-[#beaed8]/90 mt-8">
      
      <div class="flex flex-col gap-1.5">
        <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Departamento</label>
        <select class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#77a9d4] focus:ring-2 focus:ring-[#77a9d4]/30 cursor-pointer transition-colors">
          <option value="">Todos los departamentos</option>
          <option value="finanzas">Finanzas</option>
          <option value="ventas">Ventas</option>
          <option value="operaciones">Operaciones</option>
        </select>
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tipo de Métrica</label>
        <select class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#77a9d4] focus:ring-2 focus:ring-[#77a9d4]/30 cursor-pointer transition-colors">
          <option value="">Cualquier tipo</option>
          <option value="financiera">Financiera</option>
          <option value="proceso">Operaciones</option>
          <option value="calidad">Calidad</option>
        </select>
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Estado</label>
        <select class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/90 p-2.5 outline-none focus:border-[#77a9d4] focus:ring-2 focus:ring-[#77a9d4]/30 cursor-pointer transition-colors">
          <option value="">Todos los estados</option>
          <option value="saludable">Saludable</option>
          <option value="alerta">Alerta</option>
          <option value="critico">Crítico</option>
        </select>
      </div>

      <div class="flex items-end justify-end">
        <button 
          @click="$router.push('/kpis/nuevo')"
          class="bg-[#3f2a52] hover:bg-[#77a9d4] text-white font-bold text-xs p-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 h-[38px] w-full sm:w-auto shadow-sm"
        >
          Crear Nuevo KPI
        </button>
      </div>

    </div>

    <plantillatabla 
      titulo="Listado Central de KPIs Empresariales"
      :encabezados="['Nombre del KPI', 'Departamento', 'Responsable', 'Valor Actual', 'Periodicidad', 'Estado']"
      :datos="misIndicadores"
      :mostrarAcciones="true"
      class="tabla-kpis mt-6"
    >
      <template #default="{ fila }">
        
        <td class="p-4 text-left">
          <div class="font-bold text-gray-800 text-xs">{{ fila.nombre }}</div>
          <div class="text-[11px] text-gray-400 mt-0.5">Cálculo: {{ fila.formula }}</div>
        </td>
        
        <td class="p-4 align-middle text-left">
          <span class="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200 uppercase tracking-wide">
            {{ fila.departamento }}
          </span>
        </td>
        
        <td class="p-4 text-gray-600 text-sm text-left">{{ fila.responsable }}</td>
        
        <td class="p-4 font-semibold text-gray-800 text-sm text-left">{{ fila.valor }}</td>
        
        <td class="p-4 text-left">
          <span class="text-[10px] font-bold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full uppercase tracking-wide border border-gray-200">
            {{ fila.periodicidad }}
          </span>
        </td>
        
        <td class="p-4 text-left">
          <div class="flex items-center">
            <span class="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide flex items-center gap-1.5"
                  :class="{
                    'bg-emerald-50 text-emerald-700 border border-emerald-200': fila.estado === 'Óptimo' || fila.estado === 'Saludable',
                    'bg-yellow-50 text-yellow-700 border border-yellow-200': fila.estado === 'Alerta',
                    'bg-red-50 text-red-700 border border-red-200': fila.estado === 'Crítico'
                  }">
              <span class="w-1.5 h-1.5 rounded-full animate-pulse" 
                    :class="{
                      'bg-emerald-500': fila.estado === 'Óptimo' || fila.estado === 'Saludable',
                      'bg-yellow-500': fila.estado === 'Alerta',
                      'bg-red-500': fila.estado === 'Crítico'
                    }"></span>
              {{ fila.estado }}
            </span>
          </div>
        </td>

      </template>

      <template #iconos-acciones="{ item }">
        <button 
          @click="alert(`Editar KPI: ${item.nombre}`)"
          title="Editar KPI" 
          class="text-gray-400 hover:text-[#3f2a52] bg-gray-50 hover:bg-[#3f2a52]/5 p-1.5 rounded-lg transition-colors text-sm"
        >
          <i class="fi fi-sr-pencil"></i>
        </button>
        <button 
          @click="alert(`Eliminar KPI: ${item.nombre}`)"
          title="Eliminar KPI" 
          class="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-1.5 rounded-lg transition-colors text-sm"
        >
          <i class="fi fi-sr-trash"></i>
        </button>
      </template>

    </plantillatabla>
  
  </div>
</template>