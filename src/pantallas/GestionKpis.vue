<script setup>
// ── Imports ────────────────────────────//
import { ref, computed, onMounted, watch } from 'vue'
import { getCurrentInstance } from 'vue'
import { useKpiStore } from '../stores/kpiStore'
import { usePermissions } from '../composables/usePermissions'
import api from '../services/api'
import plantillatabla     from '../components/PlantillaTabla.vue'
import tarjetasestado     from '../components/TarjetasEstado.vue'
import EncabezadoPantalla from '../components/EncabezadoPantalla.vue'
import ModalConfirmacion  from '../components/ModalConfirmacion.vue'
import StatusBadge        from '../components/StatusBadge.vue'
import AppButton          from '../components/ui/AppButton.vue'
import FormField          from '../components/ui/FormField.vue'
import BotonAccion        from '../components/ui/BotonAccion.vue'
import EtiquetaBadge      from '../components/ui/EtiquetaBadge.vue'
import EmptyState         from '../components/ui/EmptyState.vue'
import { useAuthStore } from '../stores/authStore'
const { proxy } = getCurrentInstance()
const store = useKpiStore()
const { can } = usePermissions()

// Encabezados de la tabla — la columna Meta solo aparece si tiene permiso
const encabezados = computed(() => {
  const cols = ['Nombre del KPI', 'Departamento', 'Tipo de Métrica', 'Responsable', 'Periodicidad', 'Valor Actual']
  if (can('kpis.view_targets')) cols.push('Meta')
  cols.push('Estado')
  return cols
})

// ── Mapeos API → Display ─────────────────────────────────────//
// La API guarda los tipos en inglés (percentage, money...)
// pero el frontend los muestra en español (Porcentaje, Monetario...)
const tipoMap = {
  percentage: 'Porcentaje',
  money:      'Monetario',
  time:       'Tiempo',
  absolute:   'Puntaje',
  custom:     'Puntaje',
}

// Lo mismo para la frecuencia/periodicidad
const frecuenciaMap = {
  daily:     'Diario',
  weekly:    'Semanal',
  monthly:   'Mensual',
  quarterly: 'Trimestral',
  annual:    'Anual',
}

// ── Variable reactiva principal ───────────────────────────────────────//
// Aquí se guardarán los KPIs que vengan de la API
const kpis     = ref([])
const cargando = ref(true)

// ── Carga de datos al abrir la pantalla ─────────────────────────────────//
onMounted(async () => {
  const auth = useAuthStore()
  
console.log('Auth data:', auth.role, auth.user?.team_id, auth.user?.department_id)
  let url = '/kpis'
  
  if (auth.role === 'team_leader' && auth.user?.team_id) {
    url = `/kpis?team_id=${auth.user.team_id}`
    console.log('✓ Filtrando por team_id:', url)
  } 
  else if ((auth.role === 'manager' || auth.role === 'admin') && auth.user?.department_id) {
    url = `/kpis?department_id=${auth.user.department_id}`
    console.log('✓ Filtrando por department_id:', url)
  } 
  else {
    console.log('⚠ Sin filtro, cargando TODOS los KPIs')
  }
  
  const res = await api.get(url)
  const data = res.data
  console.log(`✓ KPIs recibidos: ${data.length}`)

  kpis.value = data.map(k => {
    const ultimoRecord = k.latest_record
    const progreso     = ultimoRecord ? Number(ultimoRecord.value) : 0
    const calculado = store.calcularEstado(progreso)

    return {
      id:                  k.id,
      nombre:              k.name,
      subtitulo:           k.subtitle ?? k.name,
      formula:             k.formula ?? '—',
      tipoMetrica:         tipoMap[k.type]             ?? k.type,
      periodicidad:        frecuenciaMap[k.frequency]  ?? k.frequency,
      departamento:        k.department?.name          ?? '—',
      responsable:         k.creator
                            ? `${k.creator.name} ${k.creator.paternal ?? ''}`.trim()
                            : '—',
      meta:                k.goal ? `${parseFloat(k.goal)} ${k.unit ?? ''}`.trim() : '—',
      progreso,
      traffic_light: calculado.traffic_light,
      estado:        calculado.estado,
      estadoTipo:    calculado.estadoTipo,
      ultimaActualizacion: ultimoRecord?.period_start ?? '—',
    }
  })
  cargando.value = false
})


// ── Filtros ────────────────────────────────────────────────────//
const filtroDepartamento = ref('')
const filtroTipoMetrica  = ref('')
const filtroEstado       = ref('')
const filtroPeriodicidad = ref('')
const filtroBusqueda     = ref('')

// Filtra los KPIs según lo que el usuario seleccione en los dropdowns
const indicadoresFiltrados = computed(() =>
  kpis.value.filter(ind => {
    const pasaDepartamento = filtroDepartamento.value === '' || ind.departamento === filtroDepartamento.value
    const pasaTipoMetrica  = filtroTipoMetrica.value  === '' || ind.tipoMetrica  === filtroTipoMetrica.value
    const pasaEstado       = filtroEstado.value       === '' || ind.estadoTipo   === filtroEstado.value
    const pasaPeriodicidad = filtroPeriodicidad.value === '' || ind.periodicidad === filtroPeriodicidad.value
    const pasaBusqueda     = filtroBusqueda.value     === '' ||
      ind.nombre.toLowerCase().includes(filtroBusqueda.value.toLowerCase()) ||
      ind.departamento.toLowerCase().includes(filtroBusqueda.value.toLowerCase())
    return pasaDepartamento && pasaTipoMetrica && pasaEstado && pasaPeriodicidad && pasaBusqueda
  })
})

// ── Paginación ───────────────────────────────────────────────────//
const paginaActual = ref(1)
const porPagina    = 10

const totalPaginas = computed(() => Math.max(1, Math.ceil(indicadoresFiltrados.value.length / porPagina)))

const indicadoresPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * porPagina
  return indicadoresFiltrados.value.slice(inicio, inicio + porPagina)
})

// Regresa a página 1 cuando cambia cualquier filtro
watch([filtroDepartamento, filtroTipoMetrica, filtroEstado, filtroPeriodicidad, filtroBusqueda],
  () => { paginaActual.value = 1 }
)

// Genera el array de páginas visibles: siempre muestra máx 5 números alrededor de la actual
const paginasVisibles = computed(() => {
  const total   = totalPaginas.value
  const actual  = paginaActual.value
  const rango   = 2
  const inicio  = Math.max(1, actual - rango)
  const fin     = Math.min(total, actual + rango)
  const paginas = []
  for (let i = inicio; i <= fin; i++) paginas.push(i)
  return paginas
})

// ── Contadores para las tarjetas de estado ─────────────────────────────────//
const contadorEstados = computed(() => ({
  saludables: kpis.value.filter(i => i.estadoTipo === 'success').length,
  alerta:     kpis.value.filter(i => i.estadoTipo === 'warning').length,
  criticos:   kpis.value.filter(i => i.estadoTipo === 'danger').length,
}))

// Porcentaje de KPIs saludables sobre el total
const eficienciaPlanta = computed(() => {
  const total = kpis.value.length
  if (total === 0) return 0
  return Math.round((contadorEstados.value.saludables / total) * 100)
})

// Opciones únicas para los dropdowns (se generan desde los datos reales de la API)
const departamentos  = computed(() => [...new Set(kpis.value.map(i => i.departamento))])
const tiposMetrica   = computed(() => [...new Set(kpis.value.map(i => i.tipoMetrica))])
const periodicidades = computed(() => [...new Set(kpis.value.map(i => i.periodicidad))])

// Resetea todos los filtros
function limpiarFiltros() {
  filtroDepartamento.value = ''
  filtroTipoMetrica.value  = ''
  filtroEstado.value       = ''
  filtroPeriodicidad.value = ''
  filtroBusqueda.value     = ''
}

// Devuelve la unidad según el tipo de métrica
function formatearValor(valor, tipo) {
  const n = Number(valor)
  if (tipo === 'Monetario')  return '$' + n.toFixed(0)
  if (tipo === 'Porcentaje') return n.toFixed(1) + '%'
  if (tipo === 'Tiempo')     return n.toFixed(0) + ' ms'
  return n.toFixed(1) + ' pts'
}

// ── Eliminar KPI ────────────────────────────────────────────────────//
const showModal    = ref(false)
const kpiAEliminar = ref(null)

// Guarda el KPI a eliminar y abre el modal de confirmación
function prepararEliminacion(kpi) {
  kpiAEliminar.value = kpi
  showModal.value = true
}

// Llama a la API para eliminar y quita el KPI de la lista local
async function ejecutarEliminacion() {
  try {
    await api.delete(`/kpis/${kpiAEliminar.value.id}`)
    kpis.value = kpis.value.filter(i => i.id !== kpiAEliminar.value.id)
    proxy.$notify.success('El KPI ha sido eliminado correctamente', 'Éxito')
  } catch {
    proxy.$notify.error('Error al eliminar el KPI', 'Error')
  }
  showModal.value = false
}
</script>

<template>
  <div class="p-3 min-h-screen" style="background: transparent;">

    <EncabezadoPantalla
      titulo="Panel de Indicadores (KPIs)"
      descripcion="Visualización analítica, seguimiento de metas corporativas y estado actual."
    />

    <tarjetasestado
      :saludables="contadorEstados.saludables"
      :alerta="contadorEstados.alerta"
      :criticos="contadorEstados.criticos"
      :eficiencia="eficienciaPlanta"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 p-5 rounded-xl shadow-md border border-[#beaed8]/90 mt-8"
      style="background: var(--card-bg);">

      <FormField label="Buscar" :col-span="2">
        <input v-model="filtroBusqueda" type="text" placeholder="Nombre del KPI..." class="app-input" />
      </FormField>

      <FormField label="Departamento">
        <select v-model="filtroDepartamento" class="app-select">
          <option value="">Todos</option>
          <option v-for="dep in departamentos" :key="dep" :value="dep">{{ dep }}</option>
        </select>
      </FormField>

      <FormField label="Tipo de Métrica">
        <select v-model="filtroTipoMetrica" class="app-select">
          <option value="">Todos</option>
          <option v-for="tipo in tiposMetrica" :key="tipo" :value="tipo">{{ tipo }}</option>
        </select>
      </FormField>

      <FormField label="Periodicidad">
        <select v-model="filtroPeriodicidad" class="app-select">
          <option value="">Todas</option>
          <option v-for="per in periodicidades" :key="per" :value="per">{{ per }}</option>
        </select>
      </FormField>

      <FormField label="Estado">
        <select v-model="filtroEstado" class="app-select">
          <option value="">Todos</option>
          <option value="success">Saludable</option>
          <option value="warning">En riesgo</option>
          <option value="danger">Crítico</option>
        </select>
      </FormField>

      <div class="flex flex-wrap items-end gap-2 lg:col-span-6">
        <AppButton variant="secondary" @click="limpiarFiltros">Limpiar filtros</AppButton>
        <AppButton v-if="can('kpis.store')" class="ml-auto flex-shrink-0" @click="$router.push('/kpis/nuevo')">+ Nuevo KPI</AppButton>
      </div>
    </div>

    <div class="flex items-center justify-between mt-4 mb-1 px-1">
      <p class="text-xs" style="color: var(--subtext-general);">
        Mostrando
        <strong style="color: var(--text-general);">{{ indicadoresPaginados.length }}</strong>
        de
        <strong style="color: var(--text-general);">{{ indicadoresFiltrados.length }}</strong>
        KPIs
        <span v-if="indicadoresFiltrados.length !== kpis.length">
          ({{ kpis.length }} en total)
        </span>
      </p>
    </div>

    <!-- Sin KPIs en absoluto -->
    <EmptyState
      v-if="!cargando && kpis.length === 0"
      icono="fi-sr-chart-histogram"
      titulo="No hay KPIs registrados"
      subtexto="Esta empresa aún no tiene indicadores creados. Comienza registrando el primero."
      botonTexto="Crear KPI"
      botonIcono="fi-sr-plus"
      @accion="$router.push('/kpis/nuevo')"
    />

    <!-- Hay KPIs pero los filtros no muestran ninguno -->
    <EmptyState
      v-else-if="!cargando && indicadoresFiltrados.length === 0"
      icono="fi-sr-search"
      titulo="Sin resultados"
      subtexto="Ningún KPI coincide con los filtros aplicados. Intenta con otros criterios."
    />

    <plantillatabla
      v-else
      titulo="Listado Central de KPIs"
      :encabezados="encabezados"
      :datos="indicadoresPaginados"
      :mostrarAcciones="true"
    >
      <template #default="{ fila }">

        <td class="p-4 align-middle text-left">
          <div class="font-bold text-sm" style="color: var(--text-general);">{{ fila.nombre }}</div>
          <div class="text-xs mt-0.5" style="color: var(--subtext-general);">{{ fila.formula }}</div>
        </td>

        <td class="p-4 align-middle text-left">
          <EtiquetaBadge :texto="fila.departamento" />
        </td>

        <td class="p-4 align-middle text-left">
          <EtiquetaBadge :texto="fila.tipoMetrica" />
        </td>

        <td class="p-4 align-middle text-left text-xs" style="color: var(--card-text-muted);">{{ fila.responsable }}</td>

        <td class="p-4 align-middle text-left">
          <EtiquetaBadge :texto="fila.periodicidad" />
        </td>

        <td class="p-4 align-middle text-left">
          <span class="text-sm font-bold" style="color: var(--text-general);">
            {{ formatearValor(fila.progreso, fila.tipoMetrica) }}
          </span>
        </td>

        <td v-if="can('kpis.view_targets')" class="p-4 align-middle text-left">
          <span class="text-xs font-semibold" style="color: var(--card-text-muted);">{{ fila.meta }}</span>
        </td>

        <td class="p-4 align-middle text-left">
          <StatusBadge :tipo="fila.estadoTipo" />
        </td>

      </template>

      <template #iconos-acciones="{ item }">
        <BotonAccion variante="eye" titulo="Ver Detalles" @click="$router.push(`/kpis/detalle/${item.id}`)" />
        <BotonAccion v-if="can('kpis.update')"  variante="edit"  titulo="Editar KPI" @click="$router.push(`/kpis/editar/${item.id}`)" />
        <BotonAccion v-if="can('kpis.destroy')" variante="trash" titulo="Eliminar KPI" @click="prepararEliminacion(item)" />
      </template>
    </plantillatabla>

    <!-- Paginación -->
    <div v-if="totalPaginas > 1" class="flex items-center justify-center gap-1 mt-4">

      <button
        @click="paginaActual--"
        :disabled="paginaActual === 1"
        class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
        :style="paginaActual === 1
          ? 'opacity:0.35; cursor:not-allowed; color: var(--subtext-general);'
          : 'color: var(--text-general); cursor:pointer;'"
        style="background: var(--card-bg); border: 1px solid var(--tabla-borde);"
      >←</button>

      <button
        v-if="paginasVisibles[0] > 1"
        @click="paginaActual = 1"
        class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
        style="background: var(--card-bg); border: 1px solid var(--tabla-borde); color: var(--text-general);"
      >1</button>
      <span v-if="paginasVisibles[0] > 2" class="text-xs px-1" style="color: var(--subtext-general);">…</span>

      <button
        v-for="p in paginasVisibles"
        :key="p"
        @click="paginaActual = p"
        class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
        :style="p === paginaActual
          ? 'background: var(--sidebar-active-bg); color: var(--sidebar-active-text); border: 1px solid var(--sidebar-active-bg);'
          : 'background: var(--card-bg); border: 1px solid var(--tabla-borde); color: var(--text-general);'"
      >{{ p }}</button>

      <span v-if="paginasVisibles[paginasVisibles.length - 1] < totalPaginas - 1" class="text-xs px-1" style="color: var(--subtext-general);">…</span>
      <button
        v-if="paginasVisibles[paginasVisibles.length - 1] < totalPaginas"
        @click="paginaActual = totalPaginas"
        class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
        style="background: var(--card-bg); border: 1px solid var(--tabla-borde); color: var(--text-general);"
      >{{ totalPaginas }}</button>

      <button
        @click="paginaActual++"
        :disabled="paginaActual === totalPaginas"
        class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
        :style="paginaActual === totalPaginas
          ? 'opacity:0.35; cursor:not-allowed; color: var(--subtext-general);'
          : 'color: var(--text-general); cursor:pointer;'"
        style="background: var(--card-bg); border: 1px solid var(--tabla-borde);"
      >→</button>
    </div>

    <ModalConfirmacion
      :isOpen="showModal"
      titulo="¿Estás seguro?"
      mensaje="Esta acción borrará el registro permanentemente."
      @confirmar="ejecutarEliminacion"
      @cancelar="showModal = false"
    />
  </div>

  <!-- Panel lateral con gráfica -->
<div v-if="mostrarPanel"
  class="fixed inset-0 z-40 flex justify-end"
  style="background: rgba(0,0,0,0.4);"
  @click="mostrarPanel = false">
  <div class="w-full max-w-2xl h-full shadow-2xl flex flex-col p-6 animate-slideLeft"
    style="background: var(--card-bg); border-left: 1px solid var(--tabla-borde);"
    @click.stop>
    
    <div class="flex justify-between items-start pb-4 mb-6" style="border-bottom: 1px solid var(--tabla-borde);">
      <div>
        <h3 class="text-lg font-bold" style="color: var(--text-encabezado);">{{ kpiSeleccionado?.nombre }}</h3>
        <p class="text-xs mt-0.5" style="color: var(--subtext-general);">{{ kpiSeleccionado?.formula }}</p>
      </div>
      <button @click="mostrarPanel = false" class="text-2xl" style="color: var(--subtext-general);">✕</button>
    </div>

    <GraficoKpiProgreso :kpi="kpiSeleccionado" />
  </div>
</div>
</template>