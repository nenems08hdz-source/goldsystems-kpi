<script setup>
import { ref } from 'vue'
import plantillatabla from '../components/plantillatabla.vue'

const vistaActual = ref('tabla')
const nuevaMetrica = ref({
  nombre: '',
  fechaCorte: '',
  valor: ''
})

const metricasAsignadas = ref([
  {
    id: 1,
    nombre: "Métrica de Latencia API Gateway",
    info: "Hace 2 días | Ing. Arantxa",
    estado: "RETRASADA",
    claseEstado: "text-red-500 bg-red-50/60 border-red-100",
    icono: "📊"
  },
  {
    id: 2,
    nombre: "Uso de Memoria (Production Node A)",
    info: "En 4 horas | Servidor-PRD",
    estado: "POR VENCER",
    claseEstado: "text-amber-500 bg-amber-50/60 border-amber-100",
    icono: "💻"
  },
  {
    id: 3,
    nombre: "Tasa de Error HTTP 5xx",
    info: "Hoy, 18:00 | Monitoring Lab",
    estado: "A TIEMPO",
    claseEstado: "text-emerald-500 bg-emerald-50/60 border-emerald-100",
    icono: "🛡️"
  }
])

const irAFormulario = () => {
  vistaActual.value = 'formulario'
}

const regresarATabla = () => {
  vistaActual.value = 'tabla'
  nuevaMetrica.value = { nombre: '', fechaCorte: '', valor: '' } 
}

const guardarMetrica = () => {
  console.log("Datos registrados:", nuevaMetrica.value)
  regresarATabla()
}
</script>

<template>
  <div class="p-6 min-h-screen bg-[#f8fafc] font-sans antialiased text-slate-900">
    
    <div v-if="vistaActual === 'tabla'" class="w-full flex flex-col">
      <div class="mb-6">
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight text-left">
          Captura de Métricas Operativas
        </h1>
        <p class="text-sm text-slate-500 mt-1 text-left">
          Registre los indicadores técnicos del ciclo actual y gestione las tareas de monitoreo.
        </p>
      </div>

      <div class="w-full">
        <plantillatabla 
          titulo="KPIs ASIGNADAS"
          :encabezados="['Indicador Operativo', 'Estado de Entrega', 'Acción']"
          :datos="metricasAsignadas"
          class="tabla-metricas shadow-sm border border-slate-200/80 rounded-2xl overflow-hidden"
        >
          <template #default="{ fila }">
            
            <td class="p-4 align-middle transition-colors duration-200">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg border border-slate-100 shadow-sm bg-slate-50 celda-icono transition-colors">
                  {{ fila.icono }}
                </div>
                <div class="text-left">
                  <div class="font-bold text-slate-800 text-sm tracking-tight">{{ fila.nombre }}</div>
                  <div class="text-[12px] text-slate-400 mt-0.5 font-medium texto-formato transition-colors">
                    Formato: {{ fila.info }}
                  </div>
                </div>
              </div>
            </td>
            
            <td class="p-4 align-middle transition-colors duration-200">
              <span 
                class="text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider inline-block text-center etiqueta-estado transition-colors"
                :class="fila.claseEstado"
              >
                {{ fila.estado }}
              </span>
            </td>
            
            <td class="p-4 align-middle text-right pr-6 transition-colors duration-200">
              <button class="bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-800 p-2 rounded-xl border border-slate-200 shadow-sm transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </td>

          </template>
        </plantillatabla>

        <div class="mt-4 flex justify-end">
          <button 
            @click="irAFormulario"
            class="bg-[#77a9d4] hover:bg-[#beaed8] text-white text-xs font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 shadow-sm transition-all duration-300 active:scale-95"
          >
            <span class="text-sm leading-none">+</span> Registrar Nueva Métrica
          </button>
        </div>
      </div>
    </div>

    <div v-else-if="vistaActual === 'formulario'" class="w-full flex flex-col">
      
      <div class="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
        <div>
          <h2 class="text-2xl font-black text-slate-900 tracking-tight">Nueva Métrica</h2>
          <p class="text-slate-500 text-xs mt-0.5">Rellene los campos para incorporar un nuevo indicador operativo al registro.</p>
        </div>
        <button 
          @click="regresarATabla"
          class="text-slate-500 hover:text-black text-xs font-bold py-2 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
        >
          ← Volver al Listado
        </button>
      </div>

      <div class="bg-white w-full">
        <form @submit.prevent="guardarMetrica" class="space-y-6 max-w-4xl">
          
          <div>
            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Nombre del Indicador</label>
            <input 
              v-model="nuevaMetrica.nombre" 
              type="text" 
              placeholder="Ej. Latencia de Base de Datos" 
              required
              class="w-full max-w-2xl px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-800 bg-white text-sm font-medium transition-all"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <div>
              <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Fecha de Corte</label>
              <input 
                v-model="nuevaMetrica.fechaCorte" 
                type="date" 
                required
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-800 bg-white text-sm font-medium transition-all"
              />
            </div>

            <div>
              <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Valor Registrado</label>
              <input 
                v-model="nuevaMetrica.valor" 
                type="number" 
                step="0.01"
                placeholder="0.00" 
                required
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-800 bg-white text-sm font-bold transition-all"
              />
            </div>
          </div>

          <div class="flex items-center space-x-3 pt-6 mt-8 border-t border-slate-100 max-w-2xl">
            <button 
              type="button" 
              @click="regresarATabla" 
              class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              class="px-6 py-2.5 bg-[#77a9d4] hover:bg-[#beaed8] text-white text-xs font-bold rounded-xl shadow-md transition-all duration-300 active:scale-95"
            >
              Guardar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tabla-metricas :deep(tr:hover) {
  background-color: #beaed8 !important;
  transition: background-color 0.2s ease;
}
.tabla-metricas :deep(tr:hover .texto-formato) {
  color: #475569;
}
.tabla-metricas :deep(tr:hover .celda-icono) {
  background-color: rgba(255, 255, 255, 0.7);
}
.tabla-metricas :deep(tr:hover .etiqueta-estado) {
  background-color: rgba(255, 255, 255, 0.8);
}
</style>