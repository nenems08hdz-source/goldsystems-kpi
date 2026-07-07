<script setup>
import { computed, onMounted, ref } from 'vue'
import { useUiStore }    from '../stores/uiStore'
import { useKpiStore }   from '../stores/kpiStore'
import { useAuthStore }  from '../stores/authStore'
import api from '../services/api'
import EncabezadoPantalla     from '../components/EncabezadoPantalla.vue'
import GraficaKpiEspecifica   from '../components/GraficaKpiEspecifica.vue'
import MedidorKpi             from '../components/MedidorKpi.vue'
import ProgresoKpi            from '../components/ProgresoKpi.vue'
import plantillatabla         from '../components/PlantillaTabla.vue'
import TarjetasKpi            from '../components/TarjetasKpi.vue'
import StatusBadge            from '../components/StatusBadge.vue'
import EtiquetaBadge          from '../components/ui/EtiquetaBadge.vue'
import AppButton              from '../components/ui/AppButton.vue'

const store    = useUiStore()
const kpiStore = useKpiStore()
const auth = useAuthStore()
const kpis = ref([])

const listoPararenderizar = ref(false)
const IDS_ESPERADOS = ['tarjetas', 'graficas', 'criticos', 'detalle']

onMounted(async () => {
  store.cargarOrden()
  const idsGuardados = store.widgets.map(w => w.id)
  const ordenValido  = IDS_ESPERADOS.every(id => idsGuardados.includes(id))
  if (!ordenValido) {
    localStorage.removeItem('panelWidgetsOrden')
    store.cargarOrden()
  }
  store.cargarPreferencias()

  // Cargar todos los KPIs desde la API al store
  await kpiStore.cargarIndicadores()

  // Usar los KPIs del store directamente
  kpis.value = kpiStore.indicadores

  setTimeout(() => { listoPararenderizar.value = true }, 50)
})

const ordenWidgets  = computed(() => store.widgets.map(w => w.id))
const kpisResumen  = computed(() =>
  store.kpisActivos.length > 0
    ? kpis.value.filter(k => store.kpisActivos.includes(k.id))
    : kpis.value.slice(0, 4)
)
const kpisDetalle  = computed(() => kpis.value)
const kpisCriticas = computed(() =>
  kpis.value.filter(i => i.estadoTipo === 'danger' || i.estadoTipo === 'warning')
)

const cabecerasDetalle  = ['Departamento', 'Periodicidad', 'Objetivo', 'Progreso', 'Estado']
const cabecerasCriticos = ['Detalle del Indicador en Alerta']
</script>

<template>
  <div class="p-3 min-h-screen" style="background: transparent;">

    <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
      <EncabezadoPantalla
        titulo="Panel Principal"
        descripcion="Visualización general de la empresa e indicadores (Kpis)."
      />
      <div class="flex-shrink-0">
        <AppButton variant="primary" class="flex items-center gap-2" @click="$router.push('/personalizar')">
          Personalizar
        </AppButton>
      </div>
    </div>

    <template v-for="widgetId in ordenWidgets" :key="widgetId">

      <!-- tarjetas KPI -->
      <template v-if="widgetId === 'tarjetas'">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <TarjetasKpi
            v-for="item in kpisResumen"
            :key="item.id"
            :nombre="item.subtitulo"
            :departamento="item.departamento"
            :responsable="item.responsable"
            :valor="`${item.progreso}%`"
            :periodicidad="item.periodicidad"
            :estado="item.estadoTipo === 'success' ? 'saludable' : item.estadoTipo === 'warning' ? 'en riesgo' : 'critico'"
            :progreso="item.progreso"
          />
        </div>
      </template>

      <!-- gráficas -->
      <template v-if="widgetId === 'graficas'">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          <template v-if="store.modoGrafica === 'general'">
            <div v-if="listoPararenderizar && kpisResumen.length > 0"
              class="border border-[#beaed8]/70 rounded-2xl p-5 shadow-sm h-60 flex flex-col justify-between"
              style="background: var(--grafics-bg);">
              <p class="text-[11px] font-bold text-[#beaed8] uppercase tracking-wider">Resumen de KPIs</p>
              <div class="flex-1 flex items-center justify-center">
                <MedidorKpi :kpis="kpisResumen" />
              </div>
            </div>
            <div v-if="listoPararenderizar && kpisResumen.length > 0 "
              class="border border-[#beaed8]/70 rounded-2xl p-5 shadow-sm h-60 flex flex-col justify-between"
              style="background: var(--grafics-bg);">
              <p class="text-[11px] font-bold text-[#beaed8] uppercase tracking-wider">Progreso General</p>
              <div class="flex-1 flex items-center justify-center overflow-hidden">
                 <ProgresoKpi :kpis="kpisResumen" />
              </div>
            </div>
          </template>

          <template v-else>
            <div v-if="listoPararenderizar && store.kpiParaGrafica"
              class="bg-[#3f2a52] border border-[#beaed8]/70 rounded-2xl p-5 shadow-sm h-60 flex flex-col justify-between lg:col-span-2">
              <div class="flex-1 flex items-center justify-center overflow-hidden">
                <GraficaKpiEspecifica
                  v-if="store.kpiParaGrafica"
                  :kpi="store.kpiParaGrafica"
                  :tipo="store.tipoGraficaEspecifica"
                />
              </div>
            </div>
          </template>

        </div>
      </template>

      <template v-if="widgetId === 'criticos'">
        <div class="mb-6">
          <plantillatabla
            titulo="Resumen de KPIs Críticos y en Riesgo"
            :encabezados="cabecerasCriticos"
            :datos="kpisCriticas"
            :mostrarAcciones="false"
            class="!mt-0 min-h-[504px] [&_thead]:hidden"
          >
            <template #default="{ fila }">
              <td class="p-4 align-middle w-full">
                <div class="flex justify-between items-center w-full">
                  <div class="text-sm font-medium tracking-wide">
                    <span class="font-bold " style="color: var(--text-general);">
                      {{ fila.departamento }}
                    </span>
                    <span class="mx-2" style="color: var(--card-text-hint);">—</span>
                    <span class="font-normal text-xs" style="color: var(--subtext-general);">
                      {{ fila.subtitulo }}
                    </span>
                  </div>
                  <StatusBadge :tipo="fila.estadoTipo" :texto="fila.estado" class="flex-shrink-0" />
                </div>
              </td>
            </template>
          </plantillatabla>
        </div>
      </template>

      <!-- métricas detalladas -->
      <template v-if="widgetId === 'detalle'">
        <plantillatabla
          titulo="Métricas Detalladas por Departamento"
          :encabezados="cabecerasDetalle"
          :datos="kpisDetalle"
          :mostrarAcciones="true"
          class="mb-6"
        >
          <template #default="{ fila }">

            <td class="p-4 align-middle w-2/5">
              <div class="flex flex-col">
                <span class="text-sm font-bold tracking-wide" style="color: var(--text-general);">
                  {{ fila.departamento }}
                </span>
                <span class="text-xs font-normal mt-0.5" style="color: var(--subtext-general);">
                  {{ fila.subtitulo }}
                </span>
              </div>
            </td>

            <td class="p-4 align-middle text-center">
              <EtiquetaBadge :texto="fila.periodicidad" />
            </td>

            <td class="p-4 align-middle text-center font-bold text-sm" style="color: var(--text-general);">
              {{ fila.objetivo }}
            </td>

            <td class="p-4 align-middle">
              <div class="flex items-center justify-center gap-3">
                <span class="font-bold text-sm w-12 text-right" style="color: var(--text-general);">
                  {{ fila.progreso }}%
                </span>
                <div class="w-20 h-1.5 rounded-full overflow-hidden" style="background: var(--card-border);">
                  <div class="h-full rounded-full bg-[#3f2a52]" :style="{ width: fila.progreso + '%' }"></div>
                </div>
              </div>
            </td>

            <td class="p-4 align-middle text-center">
              <StatusBadge :tipo="fila.estadoTipo" :texto="fila.estado" />
            </td>

          </template>
        </plantillatabla>
      </template>

    </template>
  </div>
</template>
