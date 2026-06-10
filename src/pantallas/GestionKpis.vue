<script setup>
import { ref, computed } from 'vue'
import { getCurrentInstance } from 'vue'
import plantillatabla from '../components/PlantillaTabla.vue'
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
  <div class="p-3 min-h-screen" style="background: transparent;">

    <EncabezadoPantalla
      titulo="Panel de Indicadores (KPIs)"
      descripcion="Visualización analítica, seguimiento de metas corporativas y estado actual."
    />

    <tarjetasestado
      :saludables="store.contadorEstados.saludables"
      :alerta="store.contadorEstados.alerta"
      :criticos="store.contadorEstados.criticos"
      :eficiencia="eficienciaPlanta"
    />

    <!-- FILTROS -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 p-5 rounded-xl shadow-md border border-[#beaed8]/90 mt-8"
      style="background: var(--card-bg); color: var(--subtext-general);">

      <div class="flex flex-col gap-1.5 lg:col-span-2">
        <label class="text-[11px] font-bold uppercase tracking-wider"
          style=" color: var(--subtext-general);">Buscar</label>
        <input
          v-model="filtroBusqueda"
          type="text"
          placeholder="Nombre del KPI..."
          class="text-[13px] rounded-lg p-2.5 outline-none transition-colors"
          style="background: var(--input-bg); border: 1px solid var(--input-border); color: var(--subtext-general);"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-[11px] font-bold uppercase tracking-wider"
          style=" color: var(--subtext-general);">Departamento</label>
        <select v-model="filtroDepartamento"
          class="text-xs rounded-lg p-2.5 outline-none cursor-pointer transition-colors"
          style="background: var(--input-bg); border: 1px solid var(--input-border); color: var(--subtext-general);">
          <option value="">Todos</option>
          <option v-for="dep in store.departamentos" :key="dep" :value="dep">{{ dep }}</option>
        </select>
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-[11px] font-bold uppercase tracking-wider"
          style=" color: var(--subtext-general);">Tipo de Métrica</label>
        <select v-model="filtroTipoMetrica"
          class="text-xs rounded-lg p-2.5 outline-none cursor-pointer transition-colors"
          style="background: var(--input-bg); color: var(--input-text); border: 1px solid var(--input-border);">
          <option value="">Todos</option>
          <option v-for="tipo in store.tiposMetrica" :key="tipo" :value="tipo">{{ tipo }}</option>
        </select>
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-[11px] font-bold uppercase tracking-wider"
          style="color: var(--subtext-general);">Periodicidad</label>
        <select v-model="filtroPeriodicidad"
          class="text-xs rounded-lg p-2.5 outline-none cursor-pointer transition-colors"
          style="background: var(--input-bg); color: var(--input-text); border: 1px solid var(--input-border);">
          <option value="">Todas</option>
          <option v-for="per in store.periodicidades" :key="per" :value="per">{{ per }}</option>
        </select>
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-[11px] font-bold uppercase tracking-wider"
          style="color: var(--subtext-general);">Estado</label>
        <select v-model="filtroEstado"
          class="text-xs rounded-lg p-2.5 outline-none cursor-pointer transition-colors"
          style="background: var(--input-bg); color: var(--input-text); border: 1px solid var(--input-border);">
          <option value="">Todos</option>
          <option value="success">Saludable</option>
          <option value="warning">En riesgo</option>
          <option value="danger">Crítico</option>
        </select>
      </div>

      <div class="flex items-end gap-2 lg:col-span-6">
        <button @click="limpiarFiltros"
          class="font-bold text-xs px-4 py-2.5 rounded-lg transition-all"
          style="background: var(--botton-n2); color: var(--text-general);"
         @mouseover="$event.currentTarget.style.background='var(--botton-on)'; $event.currentTarget.style.color='var(--botton-off)'"
          @mouseleave="$event.currentTarget.style.background='var(--sidebar-bg)'; $event.currentTarget.style.color='white'"
        >Limpiar filtros</button>
        <button @click="$router.push('/kpis/nuevo')"
          class="font-bold text-xs px-4 py-2.5 rounded-lg transition-all ml-auto"
          style="background: var(--botton-n2); color: var(--text-general); "
          @mouseover="$event.currentTarget.style.background='var(--botton-on)'; $event.currentTarget.style.color='var(--botton-off)'"
          @mouseleave="$event.currentTarget.style.background='var(--sidebar-bg)'; $event.currentTarget.style.color='white'"
        >+ Nuevo KPI</button>
      </div>
    </div>

    <!-- Contador -->
    <div class="flex items-center justify-between mt-4 mb-1 px-1">
      <p class="text-xs" style="color: var(--subtext-general);">
        Mostrando <strong style="color: var(--text-general);">{{ indicadoresFiltrados.length }}</strong>
        de <strong style="color: var(--text-general);">{{ store.indicadores.length }}</strong> KPIs
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

        <td class="p-4 text-left">
          <div class="font-bold text-m" style=" color: var(--text-general);">{{ fila.nombre }}</div>
          <div class=" text-xs mt-0.5" style=" color: var(--text-general);">{{ fila.formula }}</div>
        </td>

        <!-- Badge departamento — color de marca, se mantiene -->
        <td class="p-4 align-middle text-left">
          <span class="text-[10px] font-bold bg-[#3f2a52]/10 text-[#3f2a52] px-2 py-0.5 rounded border border-[#3f2a52]/20 uppercase tracking-wide" style= "color: var(--text-general);" >
            {{ fila.departamento }}
          </span>
        </td>

        <!-- Badge tipo métrica -->
        <td class="p-4 align-middle text-left">
          <span class="text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide"
            style="background: var(--tabla-header-bg); color: var(--card-text-muted); border-color: var(--tabla-borde); color: var(--text-general);">
            {{ fila.tipoMetrica }}
          </span>
        </td>

        <td class="p-4 text-xs text-left" style="color: var(--card-text-muted); color: var(--text-general);">
          {{ fila.responsable }}
        </td>

        <!-- Badge periodicidad -->
        <td class="p-4 text-left">
          <span class="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide border"
            style="background: var(--tabla-header-bg); color: var(--card-text-muted); border-color: var(--tabla-borde); color: var(--text-general);">
            {{ fila.periodicidad }}
          </span>
        </td>

        <td class="p-4 text-left">
          <span class="text-sm font-bold" style="color: var(--card-text); color: var(--text-general);">{{ fila.progreso }}%</span>
        </td>

        <td class="p-4 text-left">
          <span class="text-xs font-semibold" style="color: var(--card-text-muted); color: var(--text-general);">{{ fila.meta }}</span>
        </td>

        <!-- Badges de estado — semánticos, NO cambian -->
        <td class="p-4 text-left">
          <span
            class="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide inline-flex items-center gap-1.5 border"
            :class="{
              'bg-emerald-50 text-emerald-700 border-emerald-200': fila.estadoTipo === 'success',
              'bg-yellow-50 text-yellow-700 border-yellow-200':   fila.estadoTipo === 'warning',
              'bg-red-50 text-red-700 border-red-200':            fila.estadoTipo === 'danger'
            }"
          >
            <span class="w-1.5 h-1.5 rounded-full animate-pulse"
              :class="{
                'bg-emerald-500': fila.estadoTipo === 'success',
                'bg-yellow-500':  fila.estadoTipo === 'warning',
                'bg-red-500':     fila.estadoTipo === 'danger'
              }"></span>
            {{ fila.estado }}
          </span>
        </td>

      </template>

      <template #iconos-acciones="{ item }">
        <button @click="$router.push(`/kpis/detalle/${item.id}`)" title="Ver Detalles"
          class="p-1.5 rounded-lg transition-colors"
          style="color: var(--card-text-hint); background: var(--tabla-header-bg);"
          @mouseover="$event.currentTarget.style.color='var(--sidebar-bg)'; $event.currentTarget.style.background='var(--tabla-hover)'"
          @mouseleave="$event.currentTarget.style.color='var(--card-text-hint)'; $event.currentTarget.style.background='var(--tabla-header-bg)'"
        ><i class="fi fi-sr-eye"></i></button>
        <button @click="prepararEliminacion(item)" title="Eliminar KPI"
          class="p-1.5 rounded-lg transition-colors"
          style="color: var(--card-text-hint); background: var(--tabla-header-bg);"
          @mouseover="$event.currentTarget.style.color='#ef4444'; $event.currentTarget.style.background='#fef2f2'"
          @mouseleave="$event.currentTarget.style.color='var(--card-text-hint)'; $event.currentTarget.style.background='var(--tabla-header-bg)'"
        ><i class="fi fi-sr-trash"></i></button>
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