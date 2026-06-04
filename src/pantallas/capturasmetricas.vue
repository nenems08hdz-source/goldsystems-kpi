<script setup>
import { ref } from 'vue'
import plantillatabla from '../components/plantillatabla.vue'
import EncabezadoPantalla from '../components/EncabezadoPantalla.vue'

const vistaActual = ref('tabla')
const nuevaMetrica = ref({ nombre: '', fechaCorte: '', valor: '' })

const metricasAsignadas = ref([
  { id: 1, nombre: "Métrica de Latencia API Gateway", info: "Hace 2 días | Ing. Arantxa", estado: "RETRASADA", claseEstado: "text-red-600 bg-red-50 border-red-200", icono: "fi fi-sr-stats" },
  { id: 2, nombre: "Uso de Memoria (Production Node A)", info: "En 4 horas | Servidor-PRD", estado: "POR VENCER", claseEstado: "text-amber-600 bg-amber-50 border-amber-200", icono: "fi fi-sr-computer" },
  { id: 3, nombre: "Tasa de Error HTTP 5xx", info: "Hoy, 18:00 | Monitoring Lab", estado: "A TIEMPO", claseEstado: "text-emerald-600 bg-emerald-50 border-emerald-200", icono: "fi fi-sr-shield-check" }
])

const irAFormulario = () => vistaActual.value = 'formulario'
const regresarATabla = () => vistaActual.value = 'tabla'
const guardarMetrica = () => { console.log("Datos:", nuevaMetrica.value); regresarATabla(); }
</script>

<template>
  <div class="p-3 min-h-screen">
    
    <div class="w-full">

      <div v-if="vistaActual === 'tabla'" class="space-y-6">
        
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200/60 pb-5">
          <EncabezadoPantalla 
            titulo="Captura de Métricas" 
            descripcion="Gestión de indicadores operativos del sistema y captura de datos en tiempo real."
          />
          <button 
            @click="irAFormulario" 
            class="bg-[#3f2a52] hover:bg-[#77a9d4] text-white font-bold text-xs p-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 h-[38px] w-full sm:w-auto shadow-sm self-end"
          >
            + Registrar Nueva Métrica
          </button>
        </div>

        <plantillatabla 
          titulo="KPIs ASIGNADAS"
          :encabezados="['Indicador Operativo', 'Estado', 'Acciones']"
          :datos="metricasAsignadas"
          class="bg-white shadow-md border border-[#beaed8]/60 rounded-xl overflow-hidden mt-6 w-full"
        >
          <template #default="{ fila }">
            
            <td class="p-4 flex items-center gap-4 text-left md:w-7/12 min-w-[220px]">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50 shadow-sm flex-shrink-0">
                <i :class="[fila.icono, 'text-base text-[#3f2a52]']"></i>
              </div>
              <div>
                <div class="font-bold text-gray-800 text-xs">{{ fila.nombre }}</div>
                <div class="text-[11px] text-gray-400 mt-0.5">{{ fila.info }}</div>
              </div>
            </td>
            
            <td class="p-4 align-middle text-left md:w-3/12 min-w-[120px]">
              <span class="text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide inline-block" :class="fila.claseEstado">
                {{ fila.estado }}
              </span>
            </td>

            <td class="p-4 align-middle md:w-2/12 min-w-[100px]">
              <div class="flex items-center justify-center gap-3">
                <button 
                  @click="alert(`Editar métrica: ${fila.nombre}`)"
                  title="Editar Métrica" 
                  class="text-gray-400 hover:text-[#3f2a52] bg-gray-50 hover:bg-[#3f2a52]/5 p-1.5 rounded-lg transition-colors text-sm"
                >
                  <i class="fi fi-sr-pencil"></i>
                </button>
                <button 
                  @click="alert(`Eliminar métrica: ${fila.nombre}`)"
                  title="Eliminar Métrica" 
                  class="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-1.5 rounded-lg transition-colors text-sm"
                >
                  <i class="fi fi-sr-trash"></i>
                </button>
              </div>
            </td>
          </template>
        </plantillatabla>
      </div>

      <div v-else class="bg-white p-8 rounded-xl border border-[#beaed8]/60 shadow-md w-full mt-6">
        
        <div class="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
          <div>
            <h2 class="text-lg font-black text-gray-900">Nueva Métrica</h2>
            <p class="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-0.5">Formulario de registro operativo</p>
          </div>
          <button @click="regresarATabla" class="w-7 h-7 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors border border-gray-100">
            <i class="fi fi-sr-cross text-xs"></i>
          </button>
        </div>
        
        <form @submit.prevent="guardarMetrica" class="space-y-5">
          
          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Nombre del Indicador</label>
            <input 
              v-model="nuevaMetrica.nombre" 
              type="text" 
              class="w-full bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#77a9d4] focus:ring-2 focus:ring-[#77a9d4]/30 transition-all placeholder-gray-400" 
              placeholder="Ej. Latencia en pasarela corporativa..." 
              required 
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Fecha de Corte</label>
              <input 
                v-model="nuevaMetrica.fechaCorte" 
                type="date" 
                class="w-full bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#77a9d4] focus:ring-2 focus:ring-[#77a9d4]/30 transition-all cursor-pointer" 
                required 
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Valor Registrado</label>
              <input 
                v-model="nuevaMetrica.valor" 
                type="number" 
                step="0.01"
                class="w-full bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#77a9d4] focus:ring-2 focus:ring-[#77a9d4]/30 transition-all placeholder-gray-400" 
                placeholder="0.00" 
                required 
              />
            </div>
          </div>
          
          <div class="flex justify-end gap-3 pt-5 border-t border-gray-100 mt-8">
            <button 
              type="button" 
              @click="regresarATabla" 
              class="text-gray-500 hover:text-gray-800 text-xs font-bold px-4 py-2.5 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              class="bg-[#3f2a52] hover:bg-[#77a9d4] text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-all duration-300 shadow-sm h-[38px]"
            >
              Guardar Registro
            </button>
          </div>

        </form>
      </div>

    </div>
  </div>
</template>