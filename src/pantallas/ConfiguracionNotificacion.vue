<script setup>
import { ref } from 'vue'
import plantillatabla from '../components/plantillatabla.vue' 

const canales = ref([
  { 
  nombre:'Correo Electrónico', 
  descripcion:'Reportes detallados y alertas críticas.', 
  activo: true 
},
  { 
  nombre: 'Notificaciones Push', 
  descripcion: 'Alertas inmediatas en tiempo real.', 
  activo: true 
},
  {
    nombre: 'Slack Integration', 
    descripcion: 'Sincroniza eventos de infraestructura.', 
    activo: false 
},
])

const encabezados = ['Métrica / KPI', 'Crítico', 'Advertencia', 'Informativo']

const kpisIniciales = [
  { 
  nombre: 'Latencia de API (p99)', 
  critico: true, advertencia: true, 
  informativo: false 
},
  { 
  nombre: 'Error Rate (%)', 
  critico: true, 
  advertencia: true, 
  informativo: true 
},
  { 
    nombre: 'Uptime de Infraestructura', 
    critico: true, 
    advertencia: false, 
    informativo: false 
},
  { 
    nombre: 'Deployments Fallidos',
    critico: true, 
    advertencia: true, 
    informativo: false 
},
]

const kpis = ref(JSON.parse(JSON.stringify(kpisIniciales)))
const frecuenciaSeleccionada = ref('Semanal')

const guardarCambios = () => {
  console.log("Datos guardados:", kpis.value)
  alert("Configuración actualizada correctamente.")
}

const descartarCambios = () => {
  kpis.value = JSON.parse(JSON.stringify(kpisIniciales))
}
</script>

<template>
  <div class="w-full bg-white text-[#3f2a52] px-8 min-h-screen flex flex-col">
    
    <div class="max-w-5xl mx-auto w-full flex-grow">
      
      <header class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight mb-1">Configuración de Notificaciones</h1>
        <p class="text-sm text-gray-500">Gestione sus preferencias de alertas y reportes de rendimiento.</p>
      </header>

      <section class="mb-8">
        <h2 class="text-sm font-bold mb-4 flex items-center gap-2">🔗 Canales de Notificación</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div v-for="canal in canales" :key="canal.nombre" 
               @click="canal.activo = !canal.activo"
               :class="['p-4 rounded-xl border cursor-pointer transition-all duration-300',
                 canal.activo ? 'bg-[#3f2a52] text-white border-[#3f2a52]' : 'bg-white text-gray-800 border-gray-200 shadow-sm']">
            <div class="flex justify-between items-start mb-2">
              <p class="font-bold text-sm">{{ canal.nombre }}</p>
              <div :class="['w-10 h-5 rounded-full relative transition-colors', canal.activo ? 'bg-white/30' : 'bg-gray-200']">
                <div :class="['absolute top-1 w-3 h-3 rounded-full transition-all', canal.activo ? 'right-1 bg-white' : 'left-1 bg-white shadow']"></div>
              </div>
            </div>
            <p :class="['text-[11px] leading-tight', canal.activo ? 'text-white/80' : 'text-gray-500']">{{ canal.descripcion }}</p>
          </div>
        </div>
      </section>

      <plantillatabla titulo="📊 Alertas de KPI" :encabezados="encabezados" :datos="kpis">
        <template #default="{ fila }">
          <td class="p-4 font-semibold text-gray-700 text-sm">{{ fila.nombre }}</td>
          <td class="p-4 text-center"><input type="checkbox" v-model="fila.critico" class="accent-[#3f2a52] w-4 h-4 cursor-pointer" /></td>
          <td class="p-4 text-center"><input type="checkbox" v-model="fila.advertencia" class="accent-[#3f2a52] w-4 h-4 cursor-pointer" /></td>
          <td class="p-4 text-center"><input type="checkbox" v-model="fila.informativo" class="accent-[#3f2a52] w-4 h-4 cursor-pointer" /></td>
        </template>
      </plantillatabla>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <section>
          <h2 class="text-sm font-bold mb-3">📄 Frecuencia de Resúmenes</h2>
          <div class="flex flex-col gap-2">
            <button v-for="opc in ['Diario', 'Semanal', 'Mensual']" :key="opc"
                    @click="frecuenciaSeleccionada = opc"
                    :class="['w-full p-3 text-left text-sm rounded-lg border transition-all', 
                    frecuenciaSeleccionada === opc ? 'border-[#3f2a52] bg-indigo-50 font-bold' : 'border-gray-200']">
              {{ opc }}
            </button>
          </div>
        </section>
        
        <section class="bg-[#3f2a52] text-white p-5 rounded-xl">
          <h2 class="text-sm font-bold mb-3">⊖ Silenciar Notificaciones</h2>
          <div class="flex gap-4 mb-3">
            <div class="flex-1">
              <label class="text-[10px] opacity-70 uppercase">Inicio</label>
              <div class="bg-white/10 p-2 mt-1 rounded-lg text-sm">10:00 p. m.</div>
            </div>
            <div class="flex-1">
              <label class="text-[10px] opacity-70 uppercase">Fin</label>
              <div class="bg-white/10 p-2 mt-1 rounded-lg text-sm">08:00 a. m.</div>
            </div>
          </div>
          <p class="text-[10px] opacity-60">Solo alertas críticas durante este periodo.</p>
        </section>
      </div>
    </div>

    <div class="max-w-5xl mx-auto w-full flex justify-end gap-3 pt-6  mt-8">
      <button @click="descartarCambios" class="px-5 py-2 text-sm font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
        Descartar
      </button>
      <button @click="guardarCambios" class="px-5 py-2 text-sm font-bold text-white bg-[#3f2a52] rounded-lg hover:bg-[#2a1d37] transition-colors shadow-sm">
        Guardar Cambios
      </button>
    </div>
  </div>
</template>