<script setup>
// ── Imports ───────────────────────────────────────────────────────────────────
import { ref, computed, onMounted, watch } from 'vue'
import { getCurrentInstance } from 'vue'
import { useKpiStore } from '../stores/kpiStore'
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

const { proxy } = getCurrentInstance()
const store = useKpiStore()

// ── Mapeos API → Display ──────────────────────────────────────────────────────
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

// ── Variable reactiva principal ───────────────────────────────────────────────
// Aquí se guardarán los KPIs que vengan de la API
const kpis = ref([])

// ── Carga de datos al abrir la pantalla ──────────────────────────────────────
onMounted(async () => {
  const res  = await api.get('/kpis')
  const data = res.data

  // Transformamos cada KPI de la API al formato que usa el template
  kpis.value = data.map(k => {
    // El último registro es el valor más reciente capturado para este KPI
    const ultimoRecord = k.latest_record
    const progreso     = ultimoRecord ? Number(ultimoRecord.value) : 0

    // calcularEstado() devuelve si el KPI está saludable, en riesgo o crítico
    const { traffic_light, estado, estadoTipo } = store.calcularEstado(progreso)

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
      traffic_light,
      estado,
      estadoTipo,
      ultimaActualizacion: ultimoRecord?.period_start ?? '—',
    }
  })
})

// Observa cambios en el store y actualiza la tabla
watch(() => store.indicadores, (nuevosDatos) => {
  if (nuevosDatos.length > 0) {
    kpis.value = nuevosDatos.map(k => {
      const progreso = k.progreso ?? 0
      const { traffic_light, estado, estadoTipo } = store.calcularEstado(progreso)
      return {
        id: k.id,
        nombre: k.nombre,
        subtitulo: k.subtitulo ?? k.nombre,
        formula: k.formula ?? '—',
        tipoMetrica: k.tipoMetrica,
        periodicidad: k.periodicidad,
        departamento: k.departamento ?? '—',
        responsable: k.responsable ?? '—',
        meta: k.goal ? `${parseFloat(k.goal)} ${k.unit ?? ''}`.trim() : '—',
        progreso,
        traffic_light,
        estado,
        estadoTipo,
        ultimaActualizacion: k.ultimaActualizacion ?? '—',
      }
    })
  }
}, { deep: true })

// ── Filtros ───────────────────────────────────────────────────────────────────
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
)

// ── Contadores para las tarjetas de estado ────────────────────────────────────
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
function unidadPorTipo(tipoMetrica) {
  const unidades = { 'Porcentaje': '%', 'Monetario': '$', 'Tiempo': 'ms', 'Puntaje': 'pts' }
  return unidades[tipoMetrica] ?? ''
}

// ── Eliminar KPI ──────────────────────────────────────────────────────────────
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
        <AppButton class="ml-auto flex-shrink-0" @click="$router.push('/kpis/nuevo')">+ Nuevo KPI</AppButton>
      </div>
    </div>

    <div class="flex items-center justify-between mt-4 mb-1 px-1">
      <p class="text-xs" style="color: var(--subtext-general);">
        Mostrando <strong style="color: var(--text-general);">{{ indicadoresFiltrados.length }}</strong>
        de <strong style="color: var(--text-general);">{{ kpis.length }}</strong> KPIs
      </p>
      <p v-if="indicadoresFiltrados.length === 0" class="text-xs text-amber-500 font-semibold">
        Sin resultados para los filtros aplicados
      </p>
    </div>

    <plantillatabla
      titulo="Listado Central de KPIs"
      :encabezados="['Nombre del KPI', 'Departamento', 'Tipo de Métrica', 'Responsable', 'Periodicidad', 'Valor Actual', 'Meta', 'Estado']"
      :datos="indicadoresFiltrados"
      :mostrarAcciones="true"
    >
      <template #default="{ fila }">

        <td class="p-4 text-left">
          <div class="font-bold text-sm" style="color: var(--text-general);">{{ fila.nombre }}</div>
          <div class="text-xs mt-0.5" style="color: var(--text-general);">{{ fila.formula }}</div>
        </td>

        <td class="p-4 align-middle text-center">
          <EtiquetaBadge :texto="fila.departamento" />
        </td>

        <td class="p-4 align-middle text-center">
          <EtiquetaBadge :texto="fila.tipoMetrica" />
        </td>

        <td class="p-4 text-xs text-left" style="color: var(--card-text-muted);">{{ fila.responsable }}</td>

        <td class="p-4 text-center">
          <EtiquetaBadge :texto="fila.periodicidad" />
        </td>

        <td class="p-4 text-left">
          <span class="text-sm font-bold" style="color: var(--text-general);">
            {{ fila.progreso }} {{ unidadPorTipo(fila.tipoMetrica) }}
          </span>
        </td>

        <td class="p-4 text-left">
          <span class="text-xs font-semibold" style="color: var(--card-text-muted);">{{ fila.meta }}</span>
        </td>

        <td class="p-4 text-center align-middle">
          <StatusBadge :tipo="fila.estadoTipo" :texto="fila.estado" />
        </td>

      </template>

      <template #iconos-acciones="{ item }">
        <BotonAccion variante="eye"   titulo="Ver Detalles" @click="$router.push(`/kpis/detalle/${item.id}`)" />
        <BotonAccion variante="edit"  titulo="Editar KPI" @click="$router.push(`/kpis/editar/${item.id}`)" />
        <BotonAccion variante="trash" titulo="Eliminar KPI" @click="prepararEliminacion(item)" />
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