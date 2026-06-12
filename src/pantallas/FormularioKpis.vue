<script setup>
//FormularioKpis
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentInstance } from 'vue'
import { usePanelStore } from '../stores/panelStore'
import Bottones from '../components/Bottones.vue'
import BotonesRegreso from '../components/BotonesRegreso.vue'

const router = useRouter()
const store = usePanelStore()
const { proxy } = getCurrentInstance()

const nuevoKpi = ref({
  nombre: '',
  formula: '',
  departamento: '',
  responsable: '',
  progreso: 0,       // valor inicial numérico para las gráficas
  periodicidad: 'Mensual',
  meta: '',
  subtitulo: '',     // descripción corta que aparece en las tarjetas
  tipoMetrica: 'Porcentaje',
})

function guardarKpi() {
  // Calculamos el estado automáticamente según el progreso inicial
  // Esto después lo hará el backend con la lógica de semáforos
  const obtenerEstado = (progreso) => {
    if (progreso >= 80) return { estado: 'saludable', estadoTipo: 'success' }
    if (progreso >= 50) return { estado: 'en riesgo', estadoTipo: 'warning' }
    return { estado: 'critico', estadoTipo: 'danger' }
  }

  const { estado, estadoTipo } = obtenerEstado(nuevoKpi.value.progreso)

  // Construimos el objeto completo compatible con el store
  // Generamos un ID temporal basado en el tamaño actual del array
  // Cuando llegue el backend, el ID lo asignará la base de datos
  const kpiNuevo = {
    id: store.indicadores.length + 1,
    nombre: nuevoKpi.value.nombre,
    formula: nuevoKpi.value.formula,
    departamento: nuevoKpi.value.departamento,
    subtitulo: nuevoKpi.value.subtitulo || nuevoKpi.value.nombre,
    responsable: nuevoKpi.value.responsable,
    progreso: Number(nuevoKpi.value.progreso),
    periodicidad: nuevoKpi.value.periodicidad,
    meta: nuevoKpi.value.meta,
    objetivo: nuevoKpi.value.meta,
    tipoMetrica: nuevoKpi.value.tipoMetrica,
    estado,
    estadoTipo,
    tendencia: 'estable',
    ultimaActualizacion: new Date().toISOString().split('T')[0],
    // Datos para gráficas — vacíos por ahora, se llenarán con capturas
    historial: [Number(nuevoKpi.value.progreso)],
    etiquetasHistorial: ['Inicio'],
    graficasCompatibles: ['linea', 'barras'],
  }

  // Agregamos al store — la tabla de GestionKpis se actualiza sola
  store.indicadores.push(kpiNuevo)

  proxy.$notify.success('KPI registrado correctamente', 'Éxito')
  router.push('/kpis')
}

</script>

<template>
  <div class="p-3 min-h-screen">

    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-4xl font-bold text-[#3f2a52] tracking-tight">Nuevo Indicador</h1>
        <p class="text-xs text-gray-500 mt-1">Registra un nuevo KPI definiendo sus metas y responsable.</p>
      </div>

      <BotonesRegreso
        @click="router.push('/kpis')"
        type="button" >
        ← Volver al Listado
      </BotonesRegreso>

    </div>

    <form @submit.prevent="guardarKpi" class="bg-white rounded-xl shadow-md border border-[#beaed8]/50 overflow-hidden max-w-4xl">

      <div class="p-4 bg-gray-50/50 border-b border-[#beaed8]/30">
        <h2 class="text-sm font-bold text-gray-700 uppercase tracking-wider">Configuración General del KPI</h2>
      </div>

      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

        <!-- Nombre -->
        <div class="flex flex-col gap-1.5">
          <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Nombre del KPI *</label>
          <input
            v-model="nuevoKpi.nombre"
            type="text"
            placeholder="Ej. Uptime de Servidores"
            required
            class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] focus:ring-2 focus:ring-[#3f2a52]/20 transition-colors"
          />
        </div>

        <!-- Departamento — opciones dinámicas del store -->
        <div class="flex flex-col gap-1.5">
          <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Departamento *</label>
          <select
            v-model="nuevoKpi.departamento"
            required
            class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] cursor-pointer transition-colors"
          >
            <option value="" disabled>Selecciona un departamento</option>
            <!--
              store.departamentos devuelve los departamentos únicos
              del store. Si agregas uno nuevo, aparece aquí solo.
            -->
            <option v-for="dep in store.departamentos" :key="dep" :value="dep">
              {{ dep }}
            </option>
          </select>
        </div>

        <!-- Fórmula -->
        <div class="flex flex-col gap-1.5 md:col-span-2">
          <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Fórmula o Criterio de Cálculo *</label>
          <input
            v-model="nuevoKpi.formula"
            type="text"
            placeholder="Ej. (Tiempo Activo / Tiempo Total) * 100"
            required
            class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] focus:ring-2 focus:ring-[#3f2a52]/20 transition-colors"
          />
        </div>

        <!-- Subtítulo -->
        <div class="flex flex-col gap-1.5 md:col-span-2">
          <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            Descripción corta
            <span class="text-gray-400 normal-case font-normal ml-1">(aparece en las tarjetas del panel)</span>
          </label>
          <input
            v-model="nuevoKpi.subtitulo"
            type="text"
            placeholder="Ej. Disponibilidad de servidores en producción"
            class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] focus:ring-2 focus:ring-[#3f2a52]/20 transition-colors"
          />
        </div>

        <!-- Responsable -->
        <div class="flex flex-col gap-1.5">
          <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Responsable *</label>
          <input
            v-model="nuevoKpi.responsable"
            type="text"
            placeholder="Ej. Carlos Méndez"
            required
            class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] focus:ring-2 focus:ring-[#3f2a52]/20 transition-colors"
          />
        </div>

        <!-- Periodicidad -->
        <div class="flex flex-col gap-1.5">
          <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Periodicidad *</label>
          <select
            v-model="nuevoKpi.periodicidad"
            class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] cursor-pointer transition-colors"
          >
            <option value="Diario">Diario</option>
            <option value="Semanal">Semanal</option>
            <option value="Mensual">Mensual</option>
            <option value="Trimestral">Trimestral</option>
            <option value="Anual">Anual</option>
          </select>
        </div>

        <!-- Tipo de métrica -->
        <div class="flex flex-col gap-1.5">
          <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tipo de Métrica *</label>
          <select
            v-model="nuevoKpi.tipoMetrica"
            class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] cursor-pointer transition-colors"
          >
            <option value="Porcentaje">Porcentaje (%)</option>
            <option value="Monetario">Monetario ($)</option>
            <option value="Tiempo">Tiempo (ms, hrs)</option>
            <option value="Puntaje">Puntaje (pts)</option>
          </select>
        </div>

        <!-- Valor inicial -->
        <div class="flex flex-col gap-1.5">
          <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            Valor Inicial (0-100) *
            <span class="text-gray-400 normal-case font-normal ml-1">— define el estado automáticamente</span>
          </label>
          <input
            v-model="nuevoKpi.progreso"
            type="number"
            min="0"
            max="100"
            placeholder="Ej. 85"
            required
            class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] focus:ring-2 focus:ring-[#3f2a52]/20 transition-colors"
          />
          <!--
            Vista previa del estado que se asignará automáticamente
            según el valor que ingrese el usuario
          -->
          <p class="text-[10px] mt-1" :class="{
            'text-emerald-600': nuevoKpi.progreso >= 80,
            'text-amber-500':   nuevoKpi.progreso >= 50 && nuevoKpi.progreso < 80,
            'text-rose-500':    nuevoKpi.progreso < 50,
          }">
            <span v-if="nuevoKpi.progreso >= 80">● Estado: Saludable</span>
            <span v-else-if="nuevoKpi.progreso >= 50">● Estado: En riesgo</span>
            <span v-else-if="nuevoKpi.progreso > 0">● Estado: Crítico</span>
          </p>
        </div>

        <!-- Meta -->
        <div class="flex flex-col gap-1.5 md:col-span-2">
          <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Meta / Objetivo *</label>
          <input
            v-model="nuevoKpi.meta"
            type="text"
            placeholder="Ej. > 95%  o  < 200ms  o  $5,000 USD"
            required
            class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] focus:ring-2 focus:ring-[#3f2a52]/20 transition-colors"
          />
        </div>

      </div>

      <div class="p-4 bg-gray-50/50 border-t border-[#beaed8]/20 flex justify-end gap-3">
        <Bottones
          @click="router.push('/kpis')"
         >
          Cancelar
        </Bottones>
        <bottones
        >
          Guardar KPI
        </bottones>
      </div>

    </form>
  </div>
</template>