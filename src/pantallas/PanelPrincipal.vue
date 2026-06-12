<script setup>
//PanelPrincipal
import { computed, onMounted, ref  } from 'vue'
import { usePanelStore } from '../stores/panelStore'
import EncabezadoPantalla from '../components/EncabezadoPantalla.vue'
import GraficaKpiEspecifica from '../components/GraficaKpiEspecifica.vue'
import MedidorKpi from '../components/MedidorKpi.vue'
import ProgresoKpi from '../components/ProgresoKpi.vue'
import plantillatabla from '../components/PlantillaTabla.vue'
import TarjetasKpi from '../components/TarjetasKpi.vue'
import Bottones from '../components/Bottones.vue'
const store = usePanelStore()

const listoPararenderizar = ref(false)
onMounted(() => {
  store.cargarOrden()
  store.cargarPreferencias()
  setTimeout(() => { listoPararenderizar.value = true }, 50)
}) 


const ordenWidgets = computed(() => store.widgets.map(w => w.id))
const kpisResumen = computed(() => store.indicadoresActivos)
const kpisDetalle = computed(() => store.indicadores)
const kpisCriticas = computed(() =>
  store.indicadores.filter(i => i.estadoTipo === 'danger' || i.estadoTipo === 'warning')
)

const cabecerasDetalle = ['Departamento', 'Periodicidad', 'Objetivo', 'Progreso', 'Estado']
const cabecerasCriticos = ['Detalle del Indicador en Alerta']
</script>

<template>
  <!-- 
    CAMBIO: bg-slate-50/50 → background transparent
    Razón: el fondo lo da --layout-bg desde App.vue,
    si ponemos bg-slate-50 encima lo tapa y en modo oscuro se ve gris claro
  -->
  <div class="p-3 min-h-screen" style="background: transparent;">

    <div class="flex justify-between items-center w-full mb-6">
      <div class="flex-none">
        <EncabezadoPantalla
          titulo="Panel Principal"
          descripcion="Visualización general de la empresa e indicadores (Kpis)."
        />
      </div>
      
      <div class="flex-none">
        <!-- CAMBIO: hover:bg-[#beaed8] → hover usa variable. 
             El color base #3f2a52 ya usa --sidebar-bg automáticamente -->
             <Bottones  @click="$router.push('/personalizar')" to="/personalizar">⚙️ Personalizar</Bottones>
      </div>
    </div>

    <template v-for="widgetId in ordenWidgets" :key="widgetId">

      <!-- BLOQUE 1: Las 4 KPIs superiores — sin cambios, TarjetasKpi ya usa variables -->
      <template v-if="widgetId === 'tarjetas'">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <TarjetasKpi
            v-for="item in kpisResumen"
            :key="item.id"
            :nombre="item.subtitulo"
            :departamento="item.departamento"
            :responsable="item.responsable"
            :valor="item.objetivo"
            :periodicidad="item.periodicidad"
            :estado="item.estado"
            :progreso="item.progreso"
          />
        </div>
      </template>

      <!-- BLOQUE 2: Gráficas — el bg-[#3f2a52] ya cambia con --sidebar-bg, sin cambios -->
      <template v-if="widgetId === 'graficas'">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          <template v-if="store.modoGrafica === 'general'">
            <div v-if="listoPararenderizar" class="border border-[#beaed8]/70 rounded-2xl p-5 shadow-sm h-60 flex flex-col justify-between"
            style="background: var(--grafics-bg);">
              <p class="text-[11px] font-bold text-[#beaed8] uppercase tracking-wider">Resumen de KPIs</p>
              <div class="flex-1 flex items-center justify-center">
                <MedidorKpi />
              </div>
            </div>
            <div v-if="listoPararenderizar"class=" border border-[#beaed8]/70 rounded-2xl p-5 shadow-sm h-60 flex flex-col justify-between"
            style="background: var(--grafics-bg);">
              <p class="text-[11px] font-bold text-[#beaed8] uppercase tracking-wider">Progreso General</p>
              <div class="flex-1 flex items-center justify-center overflow-hidden">
                <ProgresoKpi />
              </div>
            </div>
          </template>

          <template v-else>
            <div v-if="listoPararenderizar && store.kpiParaGrafica" class="bg-[#3f2a52] border border-[#beaed8]/70 rounded-2xl p-5 shadow-sm h-60 flex flex-col justify-between lg:col-span-2">
              <div class="flex-1 flex items-center justify-center overflow-hidden">
                <GraficaKpiEspecifica
                  v-if="store.kpiParaGrafica"
                  :kpi="store.kpiParaGrafica"
                  :tipo="store.tipoGraficaEspecifica"
                />
              </div>
            </div>
          </template>

          <!-- Tabla de críticos -->
          <div class="lg:col-span-2 h-full">
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
                    <div class="text-xs font-medium tracking-wide">
                      <!-- CAMBIO: text-slate-800/700/500/400 → variables -->
                      <span class="font-bold uppercase" style="color: var(--text-general);">
                        {{ fila.departamento }}
                      </span>
                      <span class="mx-2" style="color: var(--card-text-hint);">—</span>
                      <span class="font-normal" style="color: var(--subtext-general);">
                        {{ fila.subtitulo }}
                      </span>
                    </div>
                    <!-- Los badges de estado (amber/rose) NO cambian — son semánticos -->
                    <span
                      class="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border flex-shrink-0"
                      :class="{
                        'text-amber-500 bg-amber-50/60 border-amber-200/50': fila.estadoTipo === 'warning',
                        'text-rose-500 bg-rose-50/60 border-rose-200/50': fila.estadoTipo === 'danger'
                      }"
                    >
                      <span class="w-1.5 h-1.5 rounded-full"
                        :class="{
                          'bg-amber-500': fila.estadoTipo === 'warning',
                          'bg-rose-500': fila.estadoTipo === 'danger'
                        }">
                      </span>
                      {{ fila.estado }}
                    </span>
                  </div>
                </td>
              </template>
            </plantillatabla>
          </div>

        </div>
      </template>

      <!-- BLOQUE 3: Tabla detallada -->
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
                <!-- CAMBIO: text-slate-800 y text-slate-400 → variables -->
                <span class="text-m font-bold tracking-wide" style="color: var(--text-general);">
                  {{ fila.departamento }}
                </span>
                <span class="text-xs font-normal mt-0.5" style="color: var(--subtext-general);">
                  {{ fila.subtitulo }}
                </span>
              </div>
            </td>

            <td class="p-4 align-middle text-center">
              <div class="flex flex-col gap-1">
              <span class="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase tracking-wide w-fit"
               >
                {{ fila.periodicidad }}
              </span>
              </div>
            </td>

            <td class="p-4 align-middle text-center font-bold text-sm"
              style="color: var(--text-general);">
              {{ fila.objetivo }}
            </td>

            <td class="p-4 align-middle">
              <div class="flex items-center justify-center gap-3">
                <span class="font-bold text-sm w-12 text-right" style="color: var(--text-general);">
                  {{ fila.progreso }}%
                </span>
                <!-- CAMBIO: bg-slate-100 → variable -->
                <div class="w-20 h-1.5 rounded-full overflow-hidden"
                  style="background: var(--card-border);">
                  <div
                    class="h-full rounded-full bg-[#3f2a52]"
                    :style="{ width: fila.progreso + '%' }"
                  ></div>
                </div>
              </div>
            </td>

            <td class="p-4 align-middle text-center">
              <!-- Badges de estado — NO cambian, son semánticos -->
              <span
                class="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border"
                :class="{
                  'text-emerald-600 bg-emerald-50 border-emerald-200/50': fila.estadoTipo === 'success',
                  'text-amber-500 bg-amber-50 border-amber-200/50': fila.estadoTipo === 'warning',
                  'text-rose-500 bg-rose-50 border-rose-200/50': fila.estadoTipo === 'danger'
                }"
              >
                <span class="w-1.5 h-1.5 rounded-full"
                  :class="{
                    'bg-emerald-500': fila.estadoTipo === 'success',
                    'bg-amber-500': fila.estadoTipo === 'warning',
                    'bg-rose-500': fila.estadoTipo === 'danger'
                  }">
                </span>
                {{ fila.estado }}
              </span>
            </td>

          </template>
        </plantillatabla>
      </template>

    </template>
  </div>
</template>