<script setup>
/**
 * Gráfica comparativa de varios KPIs.
 *
 * El problema: no se pueden poner pesos y porcentajes en el mismo eje. Un KPI
 * de 850 000 y otro de 15 % no caben juntos.
 *
 * La solución: graficar el PORCENTAJE DE CUMPLIMIENTO en vez del valor crudo.
 * Todos los KPIs quedan en escala 0–100 %, con una sola línea de meta en 100 %,
 * y cualquier par se vuelve comparable sin importar su unidad. Eso permite ver
 * si dos indicadores se comportan igual o si uno arrastra al otro.
 *
 * También existe el modo "valor real", que solo se habilita cuando todos los
 * KPIs seleccionados comparten tipo de métrica y unidad.
 *
 * @author Mariel Medina <nenem08hdz@gmail.com>
 */
import apexchart from 'vue3-apexcharts'
import { computed } from 'vue'
import { useKpiStore } from '../stores/kpiStore'

const kpiStore = useKpiStore()

const props = defineProps({
  kpis:  { type: Array,  required: true },          // KPIs a comparar
  modo:  { type: String, default: 'cumplimiento' }, // 'cumplimiento' | 'valor'
  tipo:  { type: String, default: 'linea' },        // 'linea' | 'barras' | 'area'
})

const PALETA = ['#8b5cf6', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#14b8a6']

const tipoApex = computed(() =>
  props.tipo === 'barras' ? 'bar' : props.tipo === 'area' ? 'area' : 'line'
)

/**
 * ¿Se pueden comparar por valor real?
 * Solo si todos comparten tipo de métrica y unidad; si no, el eje no significa
 * nada y la gráfica engaña.
 */
const mismaUnidad = computed(() => {
  if (props.kpis.length < 2) return true
  const primero = props.kpis[0]
  return props.kpis.every(k => k.tipo === primero.tipo && k.unit === primero.unit)
})

const modoEfectivo = computed(() =>
  props.modo === 'valor' && !mismaUnidad.value ? 'cumplimiento' : props.modo
)

/** Las etiquetas del eje X salen del KPI con historial más largo. */
const etiquetas = computed(() => {
  let mas = []
  for (const k of props.kpis) {
    const e = k.etiquetasHistorial ?? []
    if (e.length > mas.length) mas = e
  }
  return mas
})

/**
 * Convierte el historial de valores crudos a porcentaje de cumplimiento,
 * usando la misma fórmula del backend para que los números coincidan.
 */
function serieCumplimiento(kpi) {
  return (kpi.historial ?? []).map(v => {
    const pct = kpiStore.calcularCumplimiento(v, kpi.goal, kpi.initial_value)
    return pct === null ? null : Number(pct.toFixed(1))
  })
}

const series = computed(() =>
  props.kpis
    .map(k => ({
      name: k.nombre,
      data: modoEfectivo.value === 'cumplimiento'
        ? serieCumplimiento(k)
        : (k.historial ?? []).map(v => Number(v)),
    }))
    // Un KPI sin meta da una serie de puros null. En modo barras eso rompe
    // el render de ApexCharts, así que se descarta.
    .filter(s => s.data.some(v => v !== null && !isNaN(v)))
)

/** KPIs que quedaron fuera por no tener meta o datos suficientes. */
const kpisSinDatos = computed(() => {
  const dibujados = series.value.map(s => s.name)
  return props.kpis.filter(k => !dibujados.includes(k.nombre)).map(k => k.nombre)
})

/** En modo cumplimiento la meta siempre es 100 %, común a todos los KPIs. */
const anotacionMeta = computed(() => {
  if (modoEfectivo.value === 'cumplimiento') {
    return {
      yaxis: [{
        y: 100,
        borderColor: '#10b981',
        strokeDashArray: 5,
        label: {
          text: 'Meta (100%)',
          position: 'left',
          offsetX: 10,
          borderColor: '#10b981',
          style: { background: '#10b981', color: '#fff', fontSize: '10px', fontWeight: 600 },
        },
      }],
    }
  }
  // En modo valor real, todos comparten meta solo si es la misma; si no, no se dibuja
  const metas = [...new Set(props.kpis.map(k => Number(k.goal)).filter(g => !isNaN(g)))]
  if (metas.length !== 1) return {}
  return {
    yaxis: [{
      y: metas[0],
      borderColor: '#10b981',
      strokeDashArray: 5,
      label: {
        text: `Meta: ${metas[0]}`,
        position: 'left',
        offsetX: 10,
        borderColor: '#10b981',
        style: { background: '#10b981', color: '#fff', fontSize: '10px', fontWeight: 600 },
      },
    }],
  }
})

const chartOptions = computed(() => ({
  chart: {
    type: tipoApex.value,
    toolbar: { show: false },
    background: 'transparent',
    animations: { enabled: true },
  },
  colors: PALETA,
  stroke: { curve: 'smooth', width: props.tipo === 'barras' ? 0 : 2.5 },
  fill: {
    type: props.tipo === 'area' ? 'gradient' : 'solid',
    gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.05 },
  },
  plotOptions: { bar: { borderRadius: 3, columnWidth: '65%' } },
  dataLabels: { enabled: false },
  markers: { size: props.tipo === 'linea' ? 4 : 0, hover: { size: 6 } },
  annotations: anotacionMeta.value,
  xaxis: {
    categories: etiquetas.value,
    labels: {
      style: { colors: '#94a3b8', fontSize: '9px', fontWeight: 600 },
      rotate: -45,
      rotateAlways: true,
    },
  },
  yaxis: {
    min: 0,
    max: modoEfectivo.value === 'cumplimiento' ? 120 : undefined,
    labels: {
      style: { colors: '#94a3b8', fontSize: '10px' },
      formatter: v => modoEfectivo.value === 'cumplimiento'
        ? `${Math.round(v)}%`
        : Math.round(v).toLocaleString('es-MX'),
    },
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    fontSize: '11px',
    labels: { colors: '#94a3b8' },
    markers: { width: 9, height: 9, radius: 3 },
  },
  grid: { borderColor: '#334155', strokeDashArray: 3 },
  tooltip: {
    theme: 'dark',
    shared: true,
    y: {
      formatter: v => v === null
        ? 'Sin dato'
        : modoEfectivo.value === 'cumplimiento'
          ? `${v}% de su meta`
          : v.toLocaleString('es-MX'),
    },
  },
}))
</script>

<template>
  <div class="w-full flex flex-col">

    <div v-if="kpis.length === 0"
      class="flex items-center justify-center py-10 text-xs"
      style="color: var(--subtext-general);">
      Selecciona al menos dos KPIs en Personalizar panel para compararlos.
    </div>

    <template v-else>
      <div class="flex items-center justify-between gap-3 mb-1 flex-wrap">
        <p class="text-[10px] uppercase tracking-widest font-semibold" style="color: var(--color-kpi-morado);">
          {{ modoEfectivo === 'cumplimiento' ? 'Comparativa por % de cumplimiento' : 'Comparativa por valor real' }}
        </p>
        <span v-if="modo === 'valor' && !mismaUnidad"
          class="text-[10px] px-2 py-0.5 rounded-full"
          style="background: rgba(217,119,6,0.12); color: #d97706;">
          Unidades distintas — se comparó por cumplimiento
        </span>
      </div>

      <!-- El :key fuerza a Vue a recrear el componente al cambiar de tipo.
           Sin él, ApexCharts destruye la gráfica anterior y no monta la nueva. -->
      <apexchart
        v-if="series.length > 0"
        :key="`${tipoApex}-${series.length}-${modoEfectivo}`"
        :type="tipoApex"
        height="260"
        :options="chartOptions"
        :series="series"
      />

      <div v-else class="flex items-center justify-center py-10 text-xs text-center"
        style="color: var(--subtext-general);">
        Los KPIs seleccionados no tienen meta definida, así que no se puede
        calcular su porcentaje de cumplimiento.
      </div>

      <p v-if="kpisSinDatos.length > 0" class="text-[10px] mt-1" style="color: #d97706;">
        Sin datos suficientes: {{ kpisSinDatos.join(', ') }}
      </p>

      <p v-if="modoEfectivo === 'cumplimiento'" class="text-[10px] mt-1" style="color: var(--card-text-hint);">
        Cada línea es qué tan cerca está ese KPI de su propia meta. Curvas parecidas sugieren que los indicadores se mueven juntos.
      </p>
    </template>

  </div>
</template>
