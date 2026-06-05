<script setup>
import { ref, computed } from 'vue'
import { getCurrentInstance } from 'vue'
import plantillatabla from '../components/PlantilaTabla.vue'
import tarjetasestado from '../components/TarjetasEstado.vue'
import EncabezadoPantalla from '../components/EncabezadoPantalla.vue'
import ModalConfirmacion from '../components/ModalConfirmacion.vue'
import { usePanelStore } from '../stores/panelStore.js'

const { proxy } = getCurrentInstance()
const store = usePanelStore()

// ── FILTROS ──────────────────────────────────────────────────────────────
// Cada ref guarda el valor del filtro activo.
// '' significa sin filtro (mostrar todos).
const filtroDepartamento = ref('')
const filtroTipoMetrica = ref('')
const filtroEstado = ref('')
const filtroPeriodicidad = ref('')
const filtroBusqueda = ref('')

// ── COMPUTED: aplica todos los filtros al mismo tiempo ───────────────────
const indicadoresFiltrados = computed(() =>
  store.indicadores.filter(ind => {

    const pasaDepartamento = filtroDepartamento.value === '' ||
      ind.departamento === filtroDepartamento.value

    const pasaTipoMetrica = filtroTipoMetrica.value === '' ||
      ind.tipoMetrica === filtroTipoMetrica.value

    const pasaEstado = filtroEstado.value === '' ||
      ind.estadoTipo === filtroEstado.value

    const pasaPeriodicidad = filtroPeriodicidad.value === '' ||
      ind.periodicidad === filtroPeriodicidad.value

    const pasaBusqueda = filtroBusqueda.value === '' ||
      ind.nombre.toLowerCase().includes(filtroBusqueda.value.toLowerCase()) ||
      ind.departamento.toLowerCase().includes(filtroBusqueda.value.toLowerCase())

    return pasaDepartamento && pasaTipoMetrica && pasaEstado &&
           pasaPeriodicidad && pasaBusqueda
  })
)

// Eficiencia = % de KPIs saludables para la tarjeta de unidad
const eficienciaPlanta = computed(() => {
  const total = store.indicadores.length
  if (total === 0) return 0
  return Math.round((store.contadorEstados.saludables / total) * 100)
})

function limpiarFiltros() {
  filtroDepartamento.value = ''
  filtroTipoMetrica.value = ''
  filtroEstado.value = ''
  filtroPeriodicidad.value = ''
  filtroBusqueda.value = ''
}

// ── MODAL ────────────────────────────────────────────────────────────────
const showModal = ref(false)
const kpiAEliminar = ref(null)

function prepararEliminacion(kpi) {
  kpiAEliminar.value = kpi
  showModal.value = true
}

function ejecutarEliminacion() {
  store.indicadores = store.indicadores.filter(
    i => i.id !== kpiAEliminar.value.id
  )
  showModal.value = false
   proxy.$notify.success('El KPI ha sido eliminado correctamente', 'Éxito')
  
  showModal.value = false
}

// ── HELPERS para mostrar tendencia ───────────────────────────────────────
function iconoTendencia(t) {
  if (t === 'subiendo') return '↑'
  if (t === 'bajando') return '↓'
  return '→'
}

function colorTendencia(t) {
  if (t === 'subiendo') return 'text-emerald-500'
  if (t === 'bajando') return 'text-rose-500'
  return 'text-slate-400'
}
</script>

<template>
  <div class="p-3 min-h-screen">

    <EncabezadoPantalla
      titulo="Panel de Indicadores (KPIs)"
      descripcion="Visualización analítica, seguimiento de metas corporativas y estado actual."
    />

    <!-- Tarjetas de resumen — leen del store automáticamente -->
    <tarjetasestado
      :saludables="store.contadorEstados.saludables"
      :alerta="store.contadorEstados.alerta"
      :criticos="store.contadorEstados.criticos"
      :eficiencia="eficienciaPlanta"
    />

    <!-- ── FILTROS ── -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 p-5 bg-white rounded-xl shadow-md border border-[#beaed8]/90 mt-8">

      <!-- Búsqueda libre -->
      <div class="flex flex-col gap-1.5 lg:col-span-2">
        <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Buscar</label>
        <input
          v-model="filtroBusqueda"
          type="text"
          placeholder="Nombre del KPI..."
          class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] focus:ring-2 focus:ring-[#3f2a52]/20 transition-colors"
        />
      </div>

      <!-- Departamento — opciones dinámicas desde el store -->
      <div class="flex flex-col gap-1.5">
        <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Departamento</label>
        <select
          v-model="filtroDepartamento"
          class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] focus:ring-2 focus:ring-[#3f2a52]/20 cursor-pointer transition-colors"
        >
          <option value="">Todos</option>
          <!--
            store.departamentos devuelve solo los 4 departamentos
            únicos sin repetir: Tecnología, Operaciones, Calidad, Finanzas
          -->
          <option v-for="dep in store.departamentos" :key="dep" :value="dep">
            {{ dep }}
          </option>
        </select>
      </div>

      <!-- Tipo de métrica -->
      <div class="flex flex-col gap-1.5">
        <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tipo de Métrica</label>
        <select
          v-model="filtroTipoMetrica"
          class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] focus:ring-2 focus:ring-[#3f2a52]/20 cursor-pointer transition-colors"
        >
          <option value="">Todos</option>
          <option v-for="tipo in store.tiposMetrica" :key="tipo" :value="tipo">
            {{ tipo }}
          </option>
        </select>
      </div>

      <!-- Periodicidad -->
      <div class="flex flex-col gap-1.5">
        <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Periodicidad</label>
        <select
          v-model="filtroPeriodicidad"
          class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] focus:ring-2 focus:ring-[#3f2a52]/20 cursor-pointer transition-colors"
        >
          <option value="">Todas</option>
          <option v-for="per in store.periodicidades" :key="per" :value="per">
            {{ per }}
          </option>
        </select>
      </div>

      <!-- Estado -->
      <div class="flex flex-col gap-1.5">
        <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Estado</label>
        <select
          v-model="filtroEstado"
          class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] focus:ring-2 focus:ring-[#3f2a52]/20 cursor-pointer transition-colors"
        >
          <option value="">Todos</option>
          <option value="success">Saludable</option>
          <option value="warning">En riesgo</option>
          <option value="danger">Crítico</option>
        </select>
      </div>

      <!-- Botones -->
      <div class="flex items-end gap-2 lg:col-span-6">
        <button
          @click="limpiarFiltros"
          class="border border-[#beaed8] text-[#3f2a52] hover:bg-[#beaed8]/20 font-bold text-xs px-4 py-2.5 rounded-lg transition-all"
        >
          Limpiar filtros
        </button>
        <button
          @click="$router.push('/kpis/nuevo')"
          class="bg-[#3f2a52] hover:bg-[#beaed8] text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-all ml-auto"
        >
          + Nuevo KPI
        </button>
      </div>

    </div>

    <!-- Contador de resultados -->
    <div class="flex items-center justify-between mt-4 mb-1 px-1">
      <p class="text-xs text-slate-400">
        Mostrando <strong class="text-slate-600">{{ indicadoresFiltrados.length }}</strong>
        de <strong class="text-slate-600">{{ store.indicadores.length }}</strong> KPIs
      </p>
      <p v-if="indicadoresFiltrados.length === 0" class="text-xs text-amber-500 font-semibold">
        Sin resultados para los filtros aplicados
      </p>
    </div>

    <!-- Tabla -->
    <plantillatabla
      titulo="Listado Central de KPIs"
      :encabezados="['Nombre del KPI', 'Departamento', 'Tipo de Métrica', 'Responsable', 'Periodicidad', 'Valor Actual', 'Meta', 'Estado']"
      :datos="indicadoresFiltrados"
      :mostrarAcciones="true"
    >
      <template #default="{ fila }">

        <!-- Nombre + fórmula -->
        <td class="p-4 text-left">
          <div class="font-bold text-gray-800 text-xs">{{ fila.nombre }}</div>
          <div class="text-[11px] text-gray-400 mt-0.5">{{ fila.formula }}</div>
        </td>

        <!-- Departamento -->
        <td class="p-4 align-middle text-left">
          <span class="text-[10px] font-bold bg-[#3f2a52]/10 text-[#3f2a52] px-2 py-0.5 rounded border border-[#3f2a52]/20 uppercase tracking-wide">
            {{ fila.departamento }}
          </span>
        </td>

        <!-- Tipo de métrica -->
        <td class="p-4 align-middle text-left">
          <span class="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200 uppercase tracking-wide">
            {{ fila.tipoMetrica }}
          </span>
        </td>

        <!-- Responsable -->
        <td class="p-4 text-gray-600 text-xs text-left">
          {{ fila.responsable }}
        </td>

        <!-- Periodicidad -->
        <td class="p-4 text-left">
          <span class="text-[10px] font-bold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full uppercase tracking-wide border border-gray-200">
            {{ fila.periodicidad }}
          </span>
        </td>

        <td class="p-4 text-left">
         <span class="text-sm font-bold text-gray-800">{{ fila.progreso }}%</span>
        </td>

        <!-- Tendencia -->
        <td class="p-4 text-left">
         <span class="text-xs font-semibold text-gray-600">{{ fila.meta }}</span>
       </td>

        <!-- Estado -->
        <td class="p-4 text-left">
          <span
            class="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide inline-flex items-center gap-1.5 border"
            :class="{
              'bg-emerald-50 text-emerald-700 border-emerald-200': fila.estadoTipo === 'success',
              'bg-yellow-50 text-yellow-700 border-yellow-200':   fila.estadoTipo === 'warning',
              'bg-red-50 text-red-700 border-red-200':            fila.estadoTipo === 'danger'
            }"
          >
            <span
              class="w-1.5 h-1.5 rounded-full animate-pulse"
              :class="{
                'bg-emerald-500': fila.estadoTipo === 'success',
                'bg-yellow-500':  fila.estadoTipo === 'warning',
                'bg-red-500':     fila.estadoTipo === 'danger'
              }"
            ></span>
            {{ fila.estado }}
          </span>
        </td>

      </template>

      <template #iconos-acciones="{ item }">
        <button
          @click="$router.push(`/kpis/detalle/${item.id}`)"
          title="Ver Detalles"
          class="text-gray-400 hover:text-[#3f2a52] bg-gray-50 hover:bg-[#3f2a52]/5 p-1.5 rounded-lg transition-colors"
        >
          <i class="fi fi-sr-eye"></i>
        </button>
        <button
          @click="prepararEliminacion(item)"
          title="Eliminar KPI"
          class="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
        >
          <i class="fi fi-sr-trash"></i>
        </button>
      </template>
    </plantillatabla>

    <ModalConfirmacion
      :isOpen="showModal"
      titulo="¿Estás seguro?"
      mensaje="Esta acción borrará el registro permanentemente."
      @confirmar="ejecutarEliminacion"
      @cancelar="showModal = false"
    />

  </div>
</template>