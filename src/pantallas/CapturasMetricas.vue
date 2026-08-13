<script setup>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { useKpiStore }    from '../stores/kpiStore'
import { usePermissions } from '../composables/usePermissions'
import api from '../services/api'
import PlantillaTabla     from '../components/PlantillaTabla.vue'
import EncabezadoPantalla from '../components/EncabezadoPantalla.vue'
import ModalConfirmacion  from '../components/ModalConfirmacion.vue'
import RegistroMetricas   from './RegistroMetricas.vue'
import EtiquetaBadge      from '../components/ui/EtiquetaBadge.vue'
import BotonAccion        from '../components/ui/BotonAccion.vue'
import StatusBadge        from '../components/StatusBadge.vue'
import AppButton          from '../components/ui/AppButton.vue'
import { useLoading } from '@/composables/useLoading'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const router = useRouter()
const { proxy } = getCurrentInstance()
const { can }   = usePermissions()
const store     = useKpiStore()
const kpis      = ref([])
const { isLoading, cargarConDelay } = useLoading()

onMounted(async () => {
  const res = await cargarConDelay(() => api.get('/kpis/mine'))
  const data = res.data

  const tipoMap = { percentage: 'Porcentaje', money: 'Monetario', time: 'Tiempo', absolute: 'Puntaje', custom: 'Puntaje' }
  const frecuenciaMap = { daily: 'Diario', weekly: 'Semanal', monthly: 'Mensual', quarterly: 'Trimestral', annual: 'Anual' }

  // Los KPIs calculados no se capturan: su valor lo obtiene el sistema a partir
  // de su fórmula. Si aparecieran aquí, alguien registraría un valor a mano y
  // habría dos números en conflicto para el mismo indicador.
  kpis.value = data.filter(k => !k.is_calculated).map(k => ({
    id:           k.id,
    nombre:       k.name,
    formula:      k.formula ?? '—',
    is_calculated: k.is_calculated ?? false,  // ← AGREGAR
    tipoMetrica:  tipoMap[k.type]            ?? k.type,
    periodicidad: frecuenciaMap[k.frequency] ?? k.frequency,
    departamento: k.department?.name         ?? '—',
    meta:         k.goal ? `${k.goal} ${k.unit === 'ms' ? 'hrs' : k.unit ?? ''}`.trim() : '—',
    progreso: k.latest_record ? parseFloat(Number(k.latest_record.value).toFixed(2)) : 0,  }))
})

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

const misKpis = computed(() => kpis.value)

function tipoEstadoCaptura(kpi) {
  return store.estadoCaptura(kpi) ?? 'danger'
}

const showModal    = ref(false)
const kpiAEliminar = ref(null)

function prepararEliminacion(kpi) {
  kpiAEliminar.value = kpi
  showModal.value = true
}

function ejecutarEliminacion() {
  kpis.value = kpis.value.filter(i => i.id !== kpiAEliminar.value.id)
  proxy.$notify.success('El KPI ha sido eliminado correctamente', 'Éxito')
  showModal.value = false
}
</script>

<template>
  <LoadingSpinner :isActive="isLoading" text="Cargando mis KPIs..." />

  <div class="p-3 min-h-screen">
    <div class="w-full">

      <div v-if="vistaActual === 'tabla'" class="space-y-6">

        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200/60 pb-5">
          <EncabezadoPantalla
            titulo="Captura de Métricas"
            descripcion="Registra los valores de los KPIs que tienes asignados."
          />
        </div>

        <div
          v-if="misKpis.length === 0"
          class="rounded-xl p-6 text-center"
          style="background: var(--card-bg); border: 1px solid var(--tabla-borde);"
        >
          <i class="fi fi-sr-exclamation text-2xl mb-2 block" style="color: var(--color-kpi-morado);"></i>
          <p class="text-sm font-bold" style="color: var(--text-general);">No tienes KPIs asignados.</p>
          <p class="text-xs mt-1" style="color: var(--subtext-general);">Contacta a tu administrador para que te asigne indicadores.</p>
        </div>

        <PlantillaTabla
          v-else
          titulo="Mis KPIs Asignados"
          :encabezados="['Indicador', 'Periodicidad / Tipo', 'Último valor', 'Estado captura', 'Acciones']"
          :datos="misKpis"
        >
          <template #default="{ fila }">

            <td class="p-4 text-left min-w-[200px]">
              <div class="flex items-center gap-2">
              <div class="font-bold text-xs leading-snug" style="color: var(--text-general);">{{ fila.nombre }}</div>
                <span v-if="fila.is_calculated" class="px-1.5 py-0.5 rounded text-[9px] font-semibold" style="background: var(--bg-success); color: var(--text-success);">
                  (Fórmula)
                </span>
              </div>
            <div class="text-[11px] mt-0.5" style="color: var(--card-text-muted);">{{ fila.departamento }}</div>
          </td>

            <td class="p-4 text-center align-middle min-w-[140px]">
              <div class="flex flex-col items-center gap-1">
                <EtiquetaBadge :texto="fila.periodicidad" />
                <EtiquetaBadge :texto="fila.tipoMetrica" />
              </div>
            </td>

            <td class="p-4 text-left min-w-[110px]">
              <div class="text-sm font-black" style="color: var(--text-general);">{{ fila.progreso }}</div>
              <div v-if="can('kpis.view_targets')" class="text-[10px] mt-0.5" style="color: var(--card-text-muted);">Meta: {{ fila.meta }}</div>
            </td>

            <td class="p-4 text-center align-middle min-w-[130px]">
              <StatusBadge :tipo="tipoEstadoCaptura(fila)" />
            </td>

            <td class="p-4 min-w-[120px]">
              <div class="flex items-center gap-2">
                <BotonAccion variante="eye" titulo="Ver Detalles" @click="router.push(`/kpis/detalle/${fila.id}`)" />
                <AppButton v-if="can('kpi-records.store')" variant="primary" size="sm" class="flex items-center gap-1.5" @click="abrirFormulario(fila)">
                  <i class="fi fi-sr-edit text-[10px]"></i> Registrar
                </AppButton>
                <BotonAccion v-if="can('kpi-assignments.destroy')" variante="trash" titulo="Eliminar asignación" @click="prepararEliminacion(fila)" />
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