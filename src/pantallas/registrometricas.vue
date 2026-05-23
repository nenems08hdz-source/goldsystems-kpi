<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// Importación estricta con llaves para evitar pantallas en blanco
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const router = useRouter()

const fechaRaw = ref(new Date().toISOString().split('T')[0])

const nuevametrica = ref({
    titulo: '',
    tiempo: '',
    valor: null,
})

const regresarACapturas = () => {
    router.push('/capturasmetricas') // 🔑 Coincide exactamente con el path del router
}

const guardarMetrica = () => {
    const opciones = { day: "numeric", month: 'short' }
    const fechaObjeto = new Date(fechaRaw.value + 'T00:00:00')
    nuevametrica.value.tiempo = fechaObjeto.toLocaleDateString('es-ES', opciones)

    console.log('Guardando en BD/Store:', nuevametrica.value)
    regresarACapturas()
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans relative overflow-hidden">
    <div class="absolute w-96 h-96 bg-[#77a9d4]/20 rounded-full -top-12 -left-12 blur-3xl pointer-events-none"></div>
    <div class="absolute w-96 h-96 bg-purple-200/30 rounded-full -bottom-12 -right-12 blur-3xl pointer-events-none"></div>

    <div class="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 p-8 z-10">
      
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-gray-700">Registrar Métrica</h2>
        <button @click="regresarACapturas" class="text-gray-400 hover:text-gray-600 text-2xl transition-colors cursor-pointer focus:outline-none">×</button>
      </div>

      <div class="space-y-6">
        <div class="flex flex-col">
          <label class="text-[10px] uppercase font-bold text-[#77a9d4] mb-2 tracking-widest">Nombre del Indicador</label>
          <input v-model="nuevametrica.titulo" type="text" placeholder="Tiempo de respuesta Api" class="bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#77a9d4]/20 transition-all text-black"/> 
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col">
            <label class="text-[10px] uppercase font-bold text-[#77a9d4] mb-2 tracking-widest">Fecha de Corte</label>
            <VueDatePicker
              v-model="fechaRaw"
              locale="es"
              model-type="yyyy-MM-dd"
              :year-range="[2020, 2040]"
              auto-apply
              :enable-time-picker="false"
              class="custom-datepicker"
            />
          </div>

          <div class="flex flex-col">
            <label class="text-[10px] uppercase font-bold text-[#77a9d4] mb-2 tracking-widest">Valor registrado</label>
            <input v-model="nuevametrica.valor" type="number" step="0.01" placeholder="0.00" class="bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#77a9d4]/20 transition-all text-black"/> 
          </div>
        </div>
      </div>

      <div class="mt-10 flex gap-3">
        <button 
          @click="regresarACapturas" 
          type="button" 
          class="flex-1 px-6 py-3 bg-[#77a9d4]/10 border border-[#77a9d4] text-[#77a9d4] font-bold text-xs rounded-xl hover:bg-[#77a9d4] hover:text-white transition-all cursor-pointer focus:outline-none"
        >
          CANCELAR
        </button>
        <button 
        @click="$router.push('/capturasmetricas')"
          type="sumbit" 
          class="flex-1 px-6 py-3 bg-[#77a9d4] text-white font-bold text-xs rounded-xl hover:bg-[#6698c3] transition-all shadow-lg shadow-[#77a9d4]/30 cursor-pointer focus:outline-none"
        >
          GUARDAR CAMBIOS
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.custom-datepicker {
  --dp-background-color: #ffffff;
  --dp-border-radius: 0.75rem;
  --dp-border-color: #e5e7eb;
  --dp-font-size: 0.875rem;
  --dp-input-padding: 11px;
  --dp-primary: #77a9d4;
  --dp-text-color: #000000;
}
:deep(.dp__menu) {
  z-index: 99999 !important;
}
</style>