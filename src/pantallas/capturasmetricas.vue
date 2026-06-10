<script setup>
import { ref, computed, getCurrentInstance } from 'vue'
import { usePanelStore } from '../stores/panelStore'
import PlantillaTabla    from '../components/PlantillaTabla.vue'
import EncabezadoPantalla from '../components/EncabezadoPantalla.vue'
import ModalConfirmacion from '../components/ModalConfirmacion.vue'
import RegistroMetricas  from './RegistroMetricas.vue'

const store = usePanelStore()
const { proxy } = getCurrentInstance()
const vistaActual        = ref('tabla')      // 'tabla' | 'formulario'
const kpiPreseleccionado = ref(null)         // KPI elegido desde la tabla

/**
 * Abre el formulario con el KPI de la fila clickeada ya cargado.
 * `kpi` es el objeto completo del store, así que RegistroMetricas
 * tiene acceso a periodicidad, tipoMetrica, meta, etc.
 */
function abrirFormulario(kpi) {
  kpiPreseleccionado.value = kpi
  vistaActual.value = 'formulario'
}

function regresarATabla() {
  vistaActual.value = 'tabla'
  kpiPreseleccionado.value = null
}

const misKpis = computed(() =>
  store.kpisDeUsuario(store.usuarioActual.id)
)

const estiloEstado = {
  retrasada: { clase: 'text-red-600 bg-red-50 border-red-200',       texto: 'RETRASADA'  },
  porVencer: { clase: 'text-amber-600 bg-amber-50 border-amber-200', texto: 'POR VENCER' },
  aTiempo:   { clase: 'text-emerald-600 bg-emerald-50 border-emerald-200', texto: 'A TIEMPO' },
}

function infoEstadoCaptura(kpi) {
  const clave = store.estadoCaptura(kpi)
  return estiloEstado[clave] ?? { clase: 'text-gray-500 bg-gray-50 border-gray-200', texto: 'DESCONOCIDO' }
}

function estiloEstadoKpi(estadoTipo) {
  const m = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger:  'bg-red-50 text-red-600 border-red-200',
  }
  return m[estadoTipo] ?? 'bg-gray-50 text-gray-500 border-gray-200'
}

// ── MODAL ────────
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
              <div class="font-bold text-gray-800 text-xs leading-snug">{{ fila.nombre }}</div>
              <div class="text-[11px] text-gray-400 mt-0.5">{{ fila.departamento }}</div>
            </td>

            <td class="p-4 text-left min-w-[140px]">
              <div class="flex flex-col gap-1">
                <span class="text-[10px] font-bold bg-[#3f2a52]/8 text-[#3f2a52] px-2 py-0.5 rounded uppercase tracking-wide w-fit">
                  {{ fila.periodicidad }}
                </span>
                <span class="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase tracking-wide w-fit">
                  {{ fila.tipoMetrica }}
                </span>
              </div>
            </td>

            <td class="p-4 text-left min-w-[110px]">
              <div class="text-sm font-black text-gray-800">{{ fila.progreso }}</div>
              <div class="text-[10px] text-gray-400 mt-0.5">Meta: {{ fila.meta }}</div>
            </td>

            <td class="p-4 text-left min-w-[130px]">
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
                  class="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
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