<script setup>
import { ref } from 'vue'
import plantillatabla from '../components/plantillatabla.vue'

const vistaActual = ref('tabla')
const nuevaMetrica = ref({ nombre: '', fechaCorte: '', valor: '' })

const metricasAsignadas = ref([
  { id: 1, nombre: "Métrica de Latencia API Gateway", info: "Hace 2 días | Ing. Arantxa", estado: "RETRASADA", claseEstado: "text-red-500 bg-red-50/60 border-red-100", icono: "📊" },
  { id: 2, nombre: "Uso de Memoria (Production Node A)", info: "En 4 horas | Servidor-PRD", estado: "POR VENCER", claseEstado: "text-amber-500 bg-amber-50/60 border-amber-100", icono: "💻" },
  { id: 3, nombre: "Tasa de Error HTTP 5xx", info: "Hoy, 18:00 | Monitoring Lab", estado: "A TIEMPO", claseEstado: "text-emerald-500 bg-emerald-50/60 border-emerald-100", icono: "🛡️" }
])

const irAFormulario = () => vistaActual.value = 'formulario'
const regresarATabla = () => vistaActual.value = 'tabla'
const guardarMetrica = () => { console.log("Datos:", nuevaMetrica.value); regresarATabla(); }
</script>

<template>
  <div class="p-8 min-h-screen bg-slate-50 flex flex-col items-start">
    
    <div class="w-full max-w-4xl">

      <div v-if="vistaActual === 'tabla'" class="space-y-6">
        <div class="mb-2">
          <h1 class="text-2xl font-black text-slate-900">Captura de Métricas</h1>
          <p class="text-xs text-slate-500">Gestión de indicadores operativos del sistema.</p>
        </div>

        <plantillatabla 
          titulo="KPIs ASIGNADAS"
          :encabezados="['Indicador Operativo', 'Estado', '']"
          :datos="metricasAsignadas"
          class="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden"
        >
          <template #default="{ fila }">
            <td class="p-4 flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 border border-slate-100">{{ fila.icono }}</div>
              <div>
                <div class="font-bold text-slate-800 text-sm">{{ fila.nombre }}</div>
                <div class="text-[11px] text-slate-400">{{ fila.info }}</div>
              </div>
            </td>
            <td class="p-4">
              <span class="text-[10px] font-bold px-3 py-1 rounded-full border uppercase" :class="fila.claseEstado">{{ fila.estado }}</span>
            </td>
          </template>
        </plantillatabla>

        <button @click="irAFormulario" class="bg-[#77a9d4] hover:bg-[#beaed8] text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all">
          + Registrar Nueva Métrica
        </button>
      </div>

      <div v-else class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div class="flex justify-between items-center mb-8 border-b pb-4">
          <div>
            <h2 class="text-xl font-black">Nueva Métrica</h2>
            <p class="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Formulario de registro</p>
          </div>
          <button @click="regresarATabla" class="text-xs font-bold text-slate-500 hover:text-red-500 flex items-center gap-1 transition-colors">
            <span class="text-lg leading-none">×</span>
          </button>
        </div>
        
        <form @submit.prevent="guardarMetrica" class="space-y-6">
          <div>
            <label class="block text-[10px] font-black uppercase text-slate-500 mb-2">Nombre del Indicador</label>
            <input v-model="nuevaMetrica.nombre" type="text" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none" placeholder="Ej. Latencia..." required />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black uppercase text-slate-500 mb-2">Fecha</label>
              <input v-model="nuevaMetrica.fechaCorte" type="date" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none" required />
            </div>
            <div>
              <label class="block text-[10px] font-black uppercase text-slate-500 mb-2">Valor</label>
              <input v-model="nuevaMetrica.valor" type="number" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none" placeholder="0.00" required />
            </div>
          </div>
          
          <div class="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button type="button" @click="regresarATabla" class="px-5 py-3 text-xs font-bold text-slate-500 hover:text-slate-800 transition-all">Cancelar</button>
            <button type="submit" class="px-6 py-3 bg-[#77a9d4] hover:bg-[#beaed8] text-white text-xs font-bold rounded-xl transition-all shadow-sm">Guardar Registro</button>
          </div>
        </form>
      </div>

    </div>
</div>

</template>