<script setup>
import { computed, onMounted } from 'vue'
import { usePanelStore } from '../stores/panelStore'
import EncabezadoPantalla from '../components/EncabezadoPantalla.vue'
import GraficaKpiEspecifica from '../components/GraficaKpiEspecifica.vue'
import MedidorKpi from '../components/MedidorKpi.vue'
import ProgresoKpi from '../components/ProgresoKpi.vue'
import plantillatabla from '../components/plantillatabla.vue'
import TarjetasKpi from '../components/TarjetasKpi.vue'


const store = usePanelStore()

onMounted(() => {
  store.cargarOrden()
  store.cargarPreferencias() 
})
//orden de los widgets
const ordenWidgets = computed(() => store.widgets.map(w => w.id))

//Kpis seleccionados por el usuario
const kpisResumen = computed(() => store.indicadoresActivos)

const kpisDetalle = computed(() => store.indicadores)

//resuemn de kpis criticas 
const kpisCriticas = computed(() =>
  store.indicadores.filter(i => i.estadoTipo === 'danger' || i.estadoTipo === 'warning')
)

const cabecerasDetalle = ['Departamento', 'Periodicidad', 'Objetivo', 'Progreso', 'Estado']
const cabecerasCriticos = ['Detalle del Indicador en Alerta']
</script>

<template>
  <div class="p-3 min-h-screen bg-slate-50/50">

    <div class="flex justify-between items-center w-full mb-6">
      <div class="flex-none">
        <EncabezadoPantalla
          titulo="Panel Principal"
          descripcion="Visualización general de la empresa e indicadores (Kpis)."
        />
      </div>
      <div class="flex-none">
        <button
          @click="$router.push('/personalizar')"
          class="flex items-center gap-2 bg-[#3f2a52] hover:bg-[#beaed8] text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-all"
        >
           Personalizar
        </button>
      </div>
    </div>

    <!-- Personalizacion -->
    <template v-for="widgetId in ordenWidgets" :key="widgetId">

      <!-- BLOQUE 1: Las 4 KPIs superiores -->
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

      <!-- BLOQUE 2: Las dos gráficas juntas (mefiidor circular y la de barras) -->
      <template v-if="widgetId === 'graficas'">
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

    <!-- Si el usuario eligió resumne general se muestran las gráficas de siempre -->
    <template v-if="store.modoGrafica === 'general'">
      <div class="bg-[#3f2a52] border border-[#beaed8]/70 rounded-2xl p-5 shadow-sm h-60 flex flex-col justify-between">
        <p class="text-[11px] font-bold text-[#beaed8] uppercase tracking-wider">Resumen de KPIs</p>
        <div class="flex-1 flex items-center justify-center">
          <MedidorKpi />
        </div>
      </div>
      <div class="bg-[#3f2a52] border border-[#beaed8]/70 rounded-2xl p-5 shadow-sm h-60 flex flex-col justify-between">
        <p class="text-[11px] font-bold text-[#beaed8] uppercase tracking-wider">Progreso General</p>
        <div class="flex-1 flex items-center justify-center overflow-hidden">
          <ProgresoKpi />
        </div>
      </div>
      
    </template>
     <template v-else>
      <div class="bg-[#3f2a52] border border-[#beaed8]/70 rounded-2xl p-5 shadow-sm h-60 flex flex-col justify-between lg:col-span-2">
        <div class="flex-1 flex items-center justify-center overflow-hidden">
          <GraficaKpiEspecifica
            v-if="store.kpiParaGrafica"
            :kpi="store.kpiParaGrafica"
            :tipo="store.tipoGraficaEspecifica"
          />
        </div>
      </div>
    </template>

          <!-- La tabla de críticos -->
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
                    <div class="text-xs font-medium text-slate-700 tracking-wide">
                      <span class="font-bold uppercase text-slate-800">{{ fila.departamento }}</span>
                      <span class="mx-2 text-slate-400">—</span>
                      <span class="text-slate-500 font-normal">{{ fila.subtitulo }}</span>
                    </div>
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

      <!-- BLOQUE 3: Tabla detallada de todos los KPIs -->
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
                <span class="text-sm font-bold text-slate-800 tracking-tight">{{ fila.departamento }}</span>
                <span class="text-xs font-normal text-slate-400 mt-0.5">{{ fila.subtitulo }}</span>
              </div>
            </td>

            <td class="p-4 align-middle text-center">
              <span class="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                {{ fila.periodicidad }}
              </span>
            </td>

            <td class="p-4 align-middle text-center font-bold text-sm text-slate-700">
              {{ fila.objetivo }}
            </td>

            <td class="p-4 align-middle">
              <div class="flex items-center justify-center gap-3">
                <span class="font-bold text-sm text-slate-700 w-12 text-right">{{ fila.progreso }}%</span>
                <div class="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    class="bg-[#3f2a52] h-full rounded-full"
                    :style="{ width: fila.progreso + '%' }"
                  ></div>
                </div>
              </div>
            </td>

            <td class="p-4 align-middle text-center">
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