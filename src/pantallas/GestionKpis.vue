<script setup>
import { ref, computed } from 'vue'
import { getCurrentInstance } from 'vue'
import plantillatabla from '../components/PlantillaTabla.vue'
import tarjetasestado from '../components/TarjetasEstado.vue'
import EncabezadoPantalla from '../components/EncabezadoPantalla.vue'
import ModalConfirmacion from '../components/ModalConfirmacion.vue'
import StatusBadge from '../components/StatusBadge.vue'
import AppButton   from '../components/ui/AppButton.vue'
import FormField   from '../components/ui/FormField.vue'
import { useKpiStore } from '../stores/kpiStore'

const { proxy } = getCurrentInstance()
const store = useKpiStore()

const filtroDepartamento = ref('')
const filtroTipoMetrica  = ref('')
const filtroEstado       = ref('')
const filtroPeriodicidad = ref('')
const filtroBusqueda     = ref('')

const indicadoresFiltrados = computed(() =>
  store.indicadores.filter(ind => {
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

const eficienciaPlanta = computed(() => {
  const total = store.indicadores.length
  if (total === 0) return 0
  return Math.round((store.contadorEstados.saludables / total) * 100)
})

function limpiarFiltros() {
  filtroDepartamento.value = ''
  filtroTipoMetrica.value  = ''
  filtroEstado.value       = ''
  filtroPeriodicidad.value = ''
  filtroBusqueda.value     = ''
}

function unidadPorTipo(tipoMetrica) {
  const unidades = { 'Porcentaje': '%', 'Monetario': '$', 'Tiempo': 'ms', 'Puntaje': 'pts' }
  return unidades[tipoMetrica] ?? ''
}

// modal eliminar
const showModal    = ref(false)
const kpiAEliminar = ref(null)

function prepararEliminacion(kpi) {
  kpiAEliminar.value = kpi
  showModal.value = true
}

function ejecutarEliminacion() {
  store.indicadores = store.indicadores.filter(i => i.id !== kpiAEliminar.value.id)
  proxy.$notify.success('El KPI ha sido eliminado correctamente', 'Éxito')
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
      :saludables="store.contadorEstados.saludables"
      :alerta="store.contadorEstados.alerta"
      :criticos="store.contadorEstados.criticos"
      :eficiencia="eficienciaPlanta"
    />

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 p-5 rounded-xl shadow-md border border-[#beaed8]/90 mt-8"
      style="background: var(--card-bg);">

      <FormField label="Buscar" :col-span="2">
        <input v-model="filtroBusqueda" type="text" placeholder="Nombre del KPI..." class="app-input" />
      </FormField>

      <FormField label="Departamento">
        <select v-model="filtroDepartamento" class="app-select">
          <option value="">Todos</option>
          <option v-for="dep in store.departamentos" :key="dep" :value="dep">{{ dep }}</option>
        </select>
      </FormField>

      <FormField label="Tipo de Métrica">
        <select v-model="filtroTipoMetrica" class="app-select">
          <option value="">Todos</option>
          <option v-for="tipo in store.tiposMetrica" :key="tipo" :value="tipo">{{ tipo }}</option>
        </select>
      </FormField>

      <FormField label="Periodicidad">
        <select v-model="filtroPeriodicidad" class="app-select">
          <option value="">Todas</option>
          <option v-for="per in store.periodicidades" :key="per" :value="per">{{ per }}</option>
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

      <div class="flex items-end gap-2 lg:col-span-6">
        <AppButton variant="secondary" @click="limpiarFiltros">Limpiar filtros</AppButton>
        <AppButton class="ml-auto" @click="$router.push('/kpis/nuevo')">+ Nuevo KPI</AppButton>
      </div>
    </div>

    <div class="flex items-center justify-between mt-4 mb-1 px-1">
      <p class="text-xs" style="color: var(--subtext-general);">
        Mostrando <strong style="color: var(--text-general);">{{ indicadoresFiltrados.length }}</strong>
        de <strong style="color: var(--text-general);">{{ store.indicadores.length }}</strong> KPIs
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
          <div class="font-bold text-m" style="color: var(--text-general);">{{ fila.nombre }}</div>
          <div class="text-xs mt-0.5" style="color: var(--text-general);">{{ fila.formula }}</div>
        </td>

        <td class="p-4 align-middle text-center">
          <span class="table-badge">{{ fila.departamento }}</span>
        </td>

        <td class="p-4 align-middle text-center">
          <span class="table-badge">{{ fila.tipoMetrica }}</span>
        </td>

        <td class="p-4 text-xs text-left" style="color: var(--card-text-muted);">{{ fila.responsable }}</td>

        <td class="p-4 text-center">
          <span class="table-badge">{{ fila.periodicidad }}</span>
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