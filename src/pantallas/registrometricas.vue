<script setup>
import { ref } from 'vue'

const vistaActual = ref('tabla')

const metricas = ref([
  { id: 1, nombre: "Métrica de Latencia API Gateway", fecha: "2026-05-22", valor: "0.14 ms" },
  { id: 2, nombre: "Uso de Memoria (Production Node A)", fecha: "2026-05-24", valor: "78.4 GB" }
])

const nuevaMetrica = ref({ nombre: '', fechaCorte: '', valor: '' })
const irAFormulario = () => { 
  vistaActual.value = 'formulario' 
}

const regresarATabla = () => {
  vistaActual.value = 'tabla'
  nuevaMetrica.value = { nombre: '', fechaCorte: '', valor: '' }
}

const guardarMetrica = () => {
  metricas.value.push({
    id: Date.now(),
    nombre: nuevaMetrica.value.nombre,
    fecha: nuevaMetrica.value.fechaCorte,
    valor: `${nuevaMetrica.value.valor}`
  })
  regresarATabla()
}
</script>

<template>
  <div class="flex min-h-screen bg-white text-black font-sans antialiased w-full">
    
    <aside class="w-64 bg-[#3f2a52] text-white fixed h-full top-0 left-0 z-40 shadow-xl flex flex-col justify-between">
      <div class="p-5">
        <h1 class="text-xl font-bold tracking-tight mb-8 mt-2 px-2">KPI360 Enterprise</h1>
        
        <nav class="space-y-1">
          <div class="flex items-center gap-3 px-3 py-3 opacity-60 hover:opacity-100 cursor-pointer transition-all text-sm font-medium">
            <span>🎛️</span> Panel Principal
          </div>
          <div class="flex items-center gap-3 px-3 py-3 opacity-60 hover:opacity-100 cursor-pointer transition-all text-sm font-medium">
            <span>📈</span> Gestión de KPIs
          </div>
          <div @click="regresarATabla" class="flex items-center gap-3 px-4 py-3 text-sm font-bold bg-white/10 rounded-xl text-white cursor-pointer">
            <span>📄</span> Captura de Métricas
          </div>
          <div class="flex items-center gap-3 px-3 py-3 opacity-60 hover:opacity-100 cursor-pointer transition-all text-sm font-medium">
            <span>🛡️</span> Auditoría y Resumen
          </div>
        </nav>
      </div>
      <div class="p-4 border-t border-white/5 text-[10px] opacity-40 text-center">
        v1.0.0
      </div>
    </aside>

    <main class="flex-1 ml-64 p-8 bg-white min-h-screen flex flex-col relative z-10">
      
      <div v-if="vistaActual === 'tabla'" class="flex flex-col flex-1">
        <div class="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
          <div>
            <h2 class="text-2xl font-black text-gray-900 tracking-tight">Captura de Métricas</h2>
            <p class="text-gray-500 text-xs mt-0.5">Registre y administre los valores de rendimiento del sistema.</p>
          </div>
          <button 
            @click="irAFormulario"
            class="group-hover:bg-[#beaed8] transition-colors duration-150 text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-md active:scale-95"
          >
            + Nueva Métrica
          </button>
        </div>

        <div class="bg-white border border-gray-300 rounded-2xl shadow-sm overflow-hidden w-full flex-1">
          <table class="w-full text-left border-collapse bg-white">
            <thead class="bg-gray-100 border-b border-gray-200 text-black font-bold text-xs uppercase tracking-wider">
              <tr>
                <th class="p-5 w-1/2 text-black">Indicador Operativo</th>
                <th class="p-5 text-black">Fecha de Corte</th>
                <th class="p-5 text-right pr-8 text-black">Valor Registrado</th>
              </tr>
            </thead>
            <tbody class="text-black divide-y divide-gray-200 text-sm bg-white">
              <tr v-for="m in metricas" :key="m.id" class="hover:bg-gray-50 transition-colors">
                <td class="p-5">
                  <div class="font-bold text-gray-900">{{ m.nombre }}</div>
                  <div class="text-[11px] text-gray-400 mt-0.5">ID: #{{ m.id }}</div>
                </td>
                <td class="p-5 text-gray-600 font-medium">{{ m.fecha }}</td>
                <td class="p-5 font-black text-right pr-8 text-base text-gray-900">{{ m.valor }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else-if="vistaActual === 'formulario'" class="w-full flex flex-col flex-1">
        
        <div class="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
          <div>
            <h2 class="text-2xl font-black text-gray-900 tracking-tight">Nueva Métrica</h2>
            <p class="text-gray-500 text-xs mt-0.5">Rellene los campos para incorporar un nuevo indicador operativo al registro.</p>
          </div>
          <button 
            @click="regresarATabla"
            class="text-gray-500 hover:text-black text-xs font-bold py-2 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
          >
            ← Volver al Listado
          </button>
        </div>

        <div class="bg-white w-full">
          <form @submit.prevent="guardarMetrica" class="space-y-6 max-w-4xl">
            
            <div>
              <label class="block text-[10px] font-black text-black uppercase tracking-widest mb-2">Nombre del Indicador</label>
              <input 
                v-model="nuevaMetrica.nombre" 
                type="text" 
                placeholder="Ej. Latencia de Base de Datos" 
                required
                class="w-full max-w-2xl px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3f2a52] text-black bg-white text-sm font-medium transition-all"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              <div>
                <label class="block text-[10px] font-black text-black uppercase tracking-widest mb-2">Fecha de Corte</label>
                <input 
                  v-model="nuevaMetrica.fechaCorte" 
                  type="date" 
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3f2a52] text-black bg-white text-sm font-medium transition-all"
                />
              </div>

              <div>
                <label class="block text-[10px] font-black text-black uppercase tracking-widest mb-2">Valor Registrado</label>
                <input 
                  v-model="nuevaMetrica.valor" 
                  type="number" 
                  step="0.01"
                  placeholder="0.00" 
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3f2a52] text-black bg-white text-sm font-bold transition-all"
                />
              </div>
            </div>

            <div class="flex items-center space-x-3 pt-6 mt-8 border-t border-gray-100 max-w-2xl">
              <button 
                type="button" 
                @click="regresarATabla" 
                class="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-black text-xs font-bold rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                class="px-6 py-2.5group-hover:bg-[#beaed8] transition-colors duration-150 text-white text-xs font-bold rounded-xl shadow-md "
              >
                Guardar Registro
              </button>
            </div>

          </form>
        </div>
      </div>

    </main>
  </div>
</template>