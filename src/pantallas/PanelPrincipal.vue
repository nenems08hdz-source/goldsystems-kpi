<script setup>
import { computed, onMounted, ref } from 'vue'
import { useUiStore }      from '../stores/uiStore'
import { useKpiStore }     from '../stores/kpiStore'
import { usePermissions }  from '../composables/usePermissions'
import api from '../services/api'

const { can } = usePermissions()
import EncabezadoPantalla     from '../components/EncabezadoPantalla.vue'
import GraficaKpiEspecifica   from '../components/GraficaKpiEspecifica.vue'
import MedidorKpi             from '../components/MedidorKpi.vue'
import ProgresoKpi            from '../components/ProgresoKpi.vue'
import plantillatabla         from '../components/PlantillaTabla.vue'
import TarjetasKpi            from '../components/TarjetasKpi.vue'
import StatusBadge            from '../components/StatusBadge.vue'
import EtiquetaBadge          from '../components/ui/EtiquetaBadge.vue'
import AppButton              from '../components/ui/AppButton.vue'
import EmptyState             from '../components/ui/EmptyState.vue'

const store    = useUiStore()
const kpiStore = useKpiStore()
const kpis     = ref([])
const misKpis  = ref([])

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
  kpis.value = kpiStore.indicadores

  // Cargar historiales de TODOS los KPIs
  await kpiStore.cargarTodosLosHistoriales()

  // Si no tiene acceso avanzado, carga solo sus KPIs asignados
  if (!can('dashboard.view_advanced')) {
    const res = await api.get('/kpis/mine')
    misKpis.value = res.data.map(k => {
      const progreso = k.latest_record ? Number(k.latest_record.value) : 0
      const { traffic_light, estado, estadoTipo } = kpiStore.calcularEstado(progreso)
      return {
        id:           k.id,
        nombre:       k.name,
        subtitulo:    k.subtitle ?? '',
        tipo:         k.type,
        meta:         k.goal ? `${parseFloat(k.goal)} ${k.unit ?? ''}`.trim() : '—',
        progreso,
        estado,
        estadoTipo,
      }
    })
  }

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
          <template v-if="kpisResumen.length > 0">
            <TarjetasKpi
              v-for="item in kpisResumen"
              :key="item.id"
              :nombre="item.nombre"
              :departamento="item.departamento"
              :responsable="item.responsable"
              :valor="item.tipo === 'percentage' ? item.progreso + '%' : item.tipo === 'money' ? '$' + item.progreso : item.tipo === 'time' ? item.progreso + ' hrs' : item.progreso + ' pts'"
              :periodicidad="item.periodicidad"
              :estado="item.estadoTipo === 'success' ? 'saludable' : item.estadoTipo === 'warning' ? 'en riesgo' : 'critico'"
              :progreso="item.progreso"
            />
          </template>
          <div v-else-if="listoPararenderizar" class="lg:col-span-4">
            <EmptyState
              icono="fi-sr-chart-histogram"
              titulo="Sin indicadores activos"
              subtexto="No hay KPIs configurados para esta empresa aún."
            />
          </div>
        </div>
      </template>

      <!-- gráficas -->
      <template v-if="widgetId === 'graficas'">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          <!-- Modo General -->
          <template v-if="store.modoGrafica === 'general'">
            <div v-if="listoPararenderizar && kpisResumen.length > 0"
              class="border border-[#beaed8]/70 rounded-2xl p-5 shadow-sm h-60 flex flex-col justify-between"
              style="background: var(--grafics-bg);">
              <p class="text-[11px] font-bold text-[#beaed8] uppercase tracking-wider">Resumen de KPIs</p>
              <div class="flex-1 flex items-center justify-center">
                  <MedidorKpi :kpisData="kpisResumen" />              </div>
            </div>
            <div v-if="listoPararenderizar && kpisResumen.length > 0 "
              class="border border-[#beaed8]/70 rounded-2xl p-5 shadow-sm h-60 flex flex-col justify-between"
              style="background: var(--grafics-bg);">
              <p class="text-[11px] font-bold text-[#beaed8] uppercase tracking-wider">Progreso General</p>
              <div class="flex-1 flex items-center justify-center overflow-hidden">
                  <ProgresoKpi :kpisData="kpisResumen" />              </div>
            </div>
          </template>

          <!-- Modo Específica -->
          <template v-else-if="store.modoGrafica === 'especifica'">
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

      <!-- Tabla de KPIs asignados — solo para quien no tiene acceso avanzado -->
      <template v-if="widgetId === 'criticos' && !can('dashboard.view_advanced')">
        <div class="mb-6">
          <EmptyState
            v-if="listoPararenderizar && misKpis.length === 0"
            icono="fi-sr-list-check"
            titulo="Sin KPIs asignados"
            subtexto="Aún no tienes indicadores asignados. Cuando te asignen uno, aparecerá aquí."
          />
          <plantillatabla
            v-else
            titulo="Mis KPIs Asignados"
            :encabezados="['KPI', 'Meta', 'Progreso', 'Estado']"
            :datos="misKpis"
            :mostrarAcciones="false"
          >
            <template #default="{ fila }">
              <td class="p-4 align-middle">
                <div class="font-bold text-sm" style="color: var(--text-general);">{{ fila.nombre }}</div>
                <div class="text-xs mt-0.5" style="color: var(--subtext-general);">{{ fila.subtitulo }}</div>
              </td>
              <td class="p-4 align-middle text-center text-xs font-semibold" style="color: var(--subtext-general);">
                {{ can('kpis.view_targets') ? fila.meta : '—' }}
              </td>
              <td class="p-4 align-middle">
                <div class="flex items-center gap-3">
                  <span class="font-bold text-sm w-12 text-right" style="color: var(--text-general);">
                    {{ fila.tipo === 'percentage' ? fila.progreso + '%' : fila.tipo === 'money' ? '$' + fila.progreso : fila.tipo === 'time' ? fila.progreso + ' hrs' : fila.progreso + ' pts' }}
                  </span>
                  <div class="w-24 h-1.5 rounded-full overflow-hidden" style="background: var(--card-border);">
                    <div class="h-full rounded-full bg-[#beaed8]" :style="{ width: Math.min(fila.progreso, 100) + '%' }"></div>
                  </div>
                </div>
              </td>
              <td class="p-4 align-middle text-center">
                <StatusBadge :tipo="fila.estadoTipo" :texto="fila.estado" />
              </td>
            </template>
          </plantillatabla>
        </div>
      </template>

      <template v-if="widgetId === 'criticos' && can('dashboard.view_advanced')">
        <div class="mb-6">
          <EmptyState
            v-if="listoPararenderizar && kpisCriticas.length === 0"
            icono="fi-sr-shield-check"
            titulo="Todo en orden"
            subtexto="No hay KPIs críticos ni en riesgo en este momento."
          />
          <plantillatabla
            v-else
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
                    <span class="font-bold" style="color: var(--text-general);">
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
      <template v-if="widgetId === 'detalle' && can('dashboard.view_advanced')">
        <EmptyState
          v-if="listoPararenderizar && kpisDetalle.length === 0"
          icono="fi-sr-stats"
          titulo="Sin métricas registradas"
          subtexto="Aún no hay KPIs creados para mostrar métricas detalladas."
          class="mb-6"
        />
        <plantillatabla
          v-else
          titulo="Métricas Detalladas por Departamento"
          :encabezados="cabecerasDetalle"
          :datos="kpisDetalle"
          :mostrarAcciones="false"
          class="mb-6"
        >
          <template #default="{ fila }">

            <td class="p-4 align-middle">
              <div class="flex flex-col">
                <span class="text-sm font-bold tracking-wide" style="color: var(--text-general);">
                  {{ fila.departamento }}
                </span>
                <span class="text-xs font-normal mt-0.5" style="color: var(--subtext-general);">
                  {{ fila.subtitulo }}
                </span>
              </div>
            </td>

            <td class="p-4 align-middle">
              <EtiquetaBadge :texto="fila.periodicidad" />
            </td>

            <td class="p-4 align-middle font-bold text-sm" style="color: var(--text-general);">
              {{ fila.tipo === 'percentage' ? Number(fila.goal).toFixed(1) + '%' : fila.tipo === 'money' ? '$' + Number(fila.goal).toFixed(0) : fila.meta }}
            </td>

            <td class="p-4 align-middle">
              <div class="flex items-center gap-3">
                <span class="font-bold text-sm" style="color: var(--text-general);">
                  {{ fila.tipo === 'percentage' ? Number(fila.progreso).toFixed(1) + '%' : fila.tipo === 'money' ? '$' + Number(fila.progreso).toFixed(0) : fila.tipo === 'time' ? Number(fila.progreso).toFixed(0) + ' ms' : Number(fila.progreso).toFixed(1) + ' pts' }}
                </span>
                <div class="w-20 h-1.5 rounded-full overflow-hidden" style="background: var(--card-border);">
                  <div class="h-full rounded-full bg-[#beaed8]" :style="{ width: Math.min(fila.progreso, 100) + '%' }"></div>
                </div>
              </div>
            </td>

            <td class="p-4 align-middle">
              <StatusBadge :tipo="fila.estadoTipo" :texto="fila.estado" />
            </td>

          </template>
        </plantillatabla>
      </template>

    </template>
  </div>
</template>