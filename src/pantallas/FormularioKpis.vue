<script setup>
import { ref } from 'vue'
const nuevoKpi = ref({
  nombre: '',
  formula: '',
  departamento: '',
  responsable: '',
  valorInicial: '',
  periodicidad: 'Mensual', 
  meta: '',
  descripcion: ''
})

const guardarKpi = () => {
  console.log('Datos enviados:', nuevoKpi.value)
  alert('¡KPI Registrado con éxito en el sistema!')
}
</script>

<template>
  <div class="p-3 min-h-screen">
    
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-4xl font-bold text-[#3f2a52] tracking-tight">Nuevo Indicador</h1>
        <p class="text-xs text-gray-500 mt-1">Registra un nuevo KPI empresarial definiendo sus metas, cálculo algorítmico y líder de área.</p>
      </div>
      
      <button @click="$router.push('/kpis')"
       type="button" class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors flex items-center gap-2">
        ← Volver al Listado
      </button>
    </div>

    <form @submit.prevent="guardarKpi" class="bg-white rounded-xl shadow-md border border-[#beaed8]/50 overflow-hidden max-w-4xl">
      
      <div class="p-4 bg-gray-50/50 border-b border-[#beaed8]/30">
        <h2 class="text-sm font-bold text-gray-700 uppercase tracking-wider">Configuración General del KPI</h2>
      </div>

      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        
        <div class="flex flex-col gap-1.5">
          <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Nombre del KPI</label>
          <input 
            v-model="nuevoKpi.nombre"
            type="text" 
            placeholder="Ej. Margen de Beneficio Neto"
            required
            class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#77a9d4] focus:ring-2 focus:ring-[#77a9d4]/30 transition-colors"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Departamento Asignado</label>
          <select 
            v-model="nuevoKpi.departamento"
            required
            class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#77a9d4] focus:ring-2 focus:ring-[#77a9d4]/30 cursor-pointer transition-colors"
          >
            <option value="" disabled selected>Selecciona un departamento</option>
            <option value="Finanzas">Finanzas</option>
            <option value="Ventas">Ventas</option>
            <option value="Operaciones">Operaciones</option>
            <option value="Recursos Humanos">Recursos Humanos</option>
          </select>
        </div>

        <div class="flex flex-col gap-1.5 md:col-span-2">
          <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Fórmula matemática o Criterio de Cálculo</label>
          <input 
            v-model="nuevoKpi.formula"
            type="text" 
            placeholder="Ej. (Ingresos - Gastos) / Ingresos"
            required
            class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#77a9d4] focus:ring-2 focus:ring-[#77a9d4]/30 transition-colors"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Líder / Responsable</label>
          <input 
            v-model="nuevoKpi.responsable"
            type="text" 
            placeholder="Ej. Ing. Keila O."
            required
            class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#77a9d4] focus:ring-2 focus:ring-[#77a9d4]/30 transition-colors"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Frecuencia de Medición</label>
          <select 
            v-model="nuevoKpi.periodicidad"
            class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#77a9d4] focus:ring-2 focus:ring-[#77a9d4]/30 cursor-pointer transition-colors"
          >
            <option value="Diario">Diario</option>
            <option value="Semanal">Semanal</option>
            <option value="Mensual">Mensual</option>
            <option value="Trimestral">Trimestral</option>
            <option value="Anual">Anual</option>
          </select>
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Valor Actual Inicial</label>
          <input 
            v-model="nuevoKpi.valorInicial"
            type="text" 
            placeholder="Ej. 24.8% o 0"
            required
            class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#77a9d4] focus:ring-2 focus:ring-[#77a9d4]/30 transition-colors"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Meta Target (Objetivo Mínimo)</label>
          <input 
            v-model="nuevoKpi.meta"
            type="text" 
            placeholder="Ej. > 30%"
            required
            class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#77a9d4] focus:ring-2 focus:ring-[#77a9d4]/30 transition-colors"
          />
        </div>

        <div class="flex flex-col gap-1.5 md:col-span-2">
          <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Descripción del propósito del Indicador</label>
          <textarea 
            v-model="nuevoKpi.descripcion"
            rows="3"
            placeholder="Describe brevemente el impacto e importancia de este indicador para la planta..."
            class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#77a9d4] focus:ring-2 focus:ring-[#77a9d4]/30 resize-none transition-colors"
          ></textarea>
        </div>

      </div>

      <div class="p-4 bg-gray-50/50 border-t border-[#beaed8]/20 flex justify-end gap-3">
        <button 
        @click="$router.push('/kpis')"
          type="button"
          class="px-5 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
        >
          Cancelar
        </button>
        <button 
         @click="$router.push('/kpis')"
          type="submit"
          class="px-5 py-2 bg-[#3f2a52] text-white rounded-lg text-xs font-bold hover:bg-[#2c1d3a] shadow-sm transition-colors duration-200"
        >
          Guardar KPI
        </button>
      </div>

    </form>
  </div>
</template>