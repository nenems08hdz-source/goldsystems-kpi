<script setup>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useKpiStore }    from '../stores/kpiStore'
import { useOrgStore }    from '../stores/orgStore'
import PlantillaTabla     from '../components/PlantillaTabla.vue'
import EncabezadoPantalla from '../components/EncabezadoPantalla.vue'
import ModalConfirmacion  from '../components/ModalConfirmacion.vue'
import RegistroMetricas   from './RegistroMetricas.vue'
import EtiquetaBadge      from '../components/ui/EtiquetaBadge.vue'
import BotonAccion        from '../components/ui/BotonAccion.vue'
import StatusBadge        from '../components/StatusBadge.vue'
import AppButton          from '../components/ui/AppButton.vue'

const store    = useKpiStore()
const orgStore = useOrgStore()
const auth  = useAuthStore()
const kpis  = ref([])

onMounted(async () => {
  const res = await fetch('http://127.0.0.1:8000/api/kpis', {
    headers: { 'Authorization': `Bearer ${auth.token}` }
  })
  const data = await res.json()

  const tipoMap = { percentage: 'Porcentaje', money: 'Monetario', time: 'Tiempo', absolute: 'Puntaje', custom: 'Puntaje' }
  const frecuenciaMap = { daily: 'Diario', weekly: 'Semanal', monthly: 'Mensual', quarterly: 'Trimestral', annual: 'Anual' }

  kpis.value = data.map(k => ({
    id:           k.id,
    nombre:       k.name,
    formula:      k.formula ?? '—',
    tipoMetrica:  tipoMap[k.type]            ?? k.type,
    periodicidad: frecuenciaMap[k.frequency] ?? k.frequency,
    departamento: k.department?.name         ?? '—',
    meta:         k.goal ? `${k.goal} ${k.unit ?? ''}`.trim() : '—',
    progreso:     k.latest_record ? Number(k.latest_record.value) : 0,
  }))
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

// Devuelve el tipo que entiende StatusBadge
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
                <EtiquetaBadge :texto="fila.periodicidad" />
                <EtiquetaBadge :texto="fila.tipoMetrica" />
              </div>
            </td>

            <td class="p-4 text-left min-w-[110px]">
              <div class="text-sm font-black" style="color: var(--text-general);">{{ fila.progreso }}</div>
              <div class="text-[10px] mt-0.5" style="color: var(--card-text-muted);">Meta: {{ fila.meta }}</div>
            </td>

            <td class="p-4 text-center align-middle min-w-[130px]">
              <StatusBadge :tipo="tipoEstadoCaptura(fila)" />
            </td>

            <td class="p-4 min-w-[120px]">
              <div class="flex items-center gap-2">
                <AppButton variant="primary" size="sm" class="flex items-center gap-1.5" @click="abrirFormulario(fila)">
                  <i class="fi fi-sr-edit text-[10px]"></i> Registrar
                </AppButton>
                <BotonAccion variante="trash" titulo="Eliminar asignación" @click="prepararEliminacion(fila)" />
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