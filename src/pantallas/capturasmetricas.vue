<script setup>
import { ref, computed, getCurrentInstance } from 'vue'
import { useKpiStore } from '../stores/kpiStore'
import { useOrgStore } from '../stores/orgStore'
import PlantillaTabla    from '../components/PlantillaTabla.vue'
import EncabezadoPantalla from '../components/EncabezadoPantalla.vue'
import ModalConfirmacion from '../components/ModalConfirmacion.vue'
import RegistroMetricas  from './RegistroMetricas.vue'

const store    = useKpiStore()
const orgStore = useOrgStore()
const { proxy } = getCurrentInstance()
const vistaActual        = ref('tabla')     
const kpiPreseleccionado = ref(null)       

function abrirFormulario(kpi) {
  kpiPreseleccionado.value = kpi
  vistaActual.value = 'formulario'
}

function regresarATabla() {
  vistaActual.value = 'tabla'
  kpiPreseleccionado.value = null
}

const misKpis = computed(() =>
  store.kpisDeUsuario(orgStore.usuarioActual.id)
)

const estiloEstado = {
  retrasada: { clase: 'text-rose-600 border-rose-500 dark:text-rose-400 dark:border-rose-400',         texto: 'RETRASADA'  },
  porVencer: { clase: 'text-amber-600 border-amber-500 dark:text-amber-400 dark:border-amber-400',     texto: 'POR VENCER' },
  aTiempo:   { clase: 'text-emerald-600 border-emerald-500 dark:text-emerald-400 dark:border-emerald-400', texto: 'A TIEMPO' },
}

function infoEstadoCaptura(kpi) {
  const clave = store.estadoCaptura(kpi)
  return estiloEstado[clave] ?? { clase: 'text-gray-500 bg-gray-50 border-gray-200', texto: 'DESCONOCIDO' }
}

const showModal    = ref(false)
const kpiAEliminar = ref(null)

function prepararEliminacion(kpi) {
  kpiAEliminar.value = kpi
  showModal.value = true
}

function ejecutarEliminacion() {
  store.indicadores = store.indicadores.filter(
    i => i.id !== kpiAEliminar.value.id
  )
  proxy.$notify.success('El KPI ha sido eliminado correctamente', 'Éxito')
  showModal.value = false
}
</script>

<template>
  <div class="p-3 min-h-screen">
    <div class="w-full">

      <!-- VISTA TABLA -->
      <div v-if="vistaActual === 'tabla'" class="space-y-6">

        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200/60 pb-5">
          <EncabezadoPantalla
            titulo="Captura de Métricas"
            descripcion="Registra los valores de los KPIs que tienes asignados."
          />
        </div>
        <div
          v-if="misKpis.length === 0"
          class="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center"
        >
          <p class="text-sm font-bold text-amber-700">No tienes KPIs asignados.</p>
          <p class="text-xs text-amber-600 mt-1">Contacta a tu administrador para que te asigne indicadores.</p>
        </div>

        <PlantillaTabla
          v-else
          titulo="Mis KPIs Asignados"
          :encabezados="['Indicador', 'Periodicidad / Tipo', 'Último valor', 'Estado captura', 'Acciones']"
          :datos="misKpis"
        >
          <template #default="{ fila }">

            <td class="p-4 text-left min-w-[200px]">
              <div class="font-bold text-xs leading-snug" style="color: var(--text-general);">{{ fila.nombre }}</div>
              <div class="text-[11px] mt-0.5" style="color: var(--card-text-muted);">{{ fila.departamento }}</div>
            </td>

            <td class="p-4 text-center align-middle min-w-[140px]">
              <div class="flex flex-col items-center gap-1">
                <span class="table-badge">{{ fila.periodicidad }}</span>
                <span class="table-badge">{{ fila.tipoMetrica }}</span>
              </div>
            </td>

            <td class="p-4 text-left min-w-[110px]">
              <div class="text-sm font-black" style="color: var(--text-general);">{{ fila.progreso }}</div>
              <div class="text-[10px] mt-0.5" style="color: var(--card-text-muted);">Meta: {{ fila.meta }}</div>
            </td>

            <td class="p-4 text-center align-middle min-w-[130px]">
              <span
                class="text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide inline-block"
                :class="infoEstadoCaptura(fila).clase"
              >
                {{ infoEstadoCaptura(fila).texto }}
              </span>
            </td>

            <td class="p-4 min-w-[120px]">
              <div class="flex items-center gap-2">
                <button
                  @click="abrirFormulario(fila)"
                  title="Registrar métrica"
                  class="flex items-center gap-1.5 bg-[#3f2a52] hover:bg-[#77a9d4] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all duration-200 shadow-sm"
                >
                  <i class="fi fi-sr-edit text-[10px]"></i>
                  Registrar
                </button>
                <button
                  @click="prepararEliminacion(fila)"
                  title="Eliminar asignación"
                  class="p-1.5 rounded-lg transition-colors"
                  style="color: var(--card-text-hint); background: var(--tabla-header-bg);"
                  @mouseover="$event.currentTarget.style.color='#ef4444'; $event.currentTarget.style.background='rgba(239,68,68,0.1)'"
                  @mouseleave="$event.currentTarget.style.color='var(--card-text-hint)'; $event.currentTarget.style.background='var(--tabla-header-bg)'"
                >
                  <i class="fi fi-sr-trash text-xs"></i>
                </button>
              </div>
            </td>

          </template>
        </PlantillaTabla>

        <ModalConfirmacion
          :isOpen="showModal"
          titulo="¿Eliminar asignación?"
          mensaje="Se quitará este KPI de tu lista. Esta acción no puede deshacerse."
          @confirmar="ejecutarEliminacion"
          @cancelar="showModal = false"
        />
      </div>
      <div v-else>
        <RegistroMetricas
          :kpi="kpiPreseleccionado"
          @guardado="regresarATabla"
          @cancelar="regresarATabla"
        />
      </div>
    </div>
  </div>
</template>