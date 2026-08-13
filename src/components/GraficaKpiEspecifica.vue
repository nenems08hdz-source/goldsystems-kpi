<script setup>

import apexchart from 'vue3-apexcharts'
import { computed } from 'vue'

const props = defineProps({
 
  kpi: { type: Object, required: true },
  tipo: { type: String, default: 'linea' }
})

// Meta como número, o null si el KPI no tiene meta definida
const metaNumerica = computed(() => {
  const g = Number(props.kpi?.goal)
  return props.kpi?.goal === null || props.kpi?.goal === undefined || isNaN(g) ? null : g
})

// Si la meta es menor que el punto de partida, el KPI es de los de "reducir"
const menosEsMejor = computed(() => {
  if (metaNumerica.value === null) return false
  return metaNumerica.value < Number(props.kpi?.initial_value ?? 0)
})

const unidad = computed(() => {
  const u = props.kpi?.unit
  return u === '%' ? '%' : u && u !== 'time' ? ` ${u}` : ''
})

const tipoApex = computed(() => {
  if (props.tipo === 'linea') return 'line'
  if (props.tipo === 'barras') return 'bar'
  if (props.tipo === 'area') return 'area'
  if (props.tipo === 'radial') return 'radialBar'
  return 'line'
})

const series = computed(() => {
  if (props.tipo === 'radial') {
    return [props.kpi.progreso]
  }
  return [{ name: props.kpi.subtitulo, data: props.kpi.historial }]
})

const chartOptions = computed(() => {
  if (props.tipo === 'radial') {
    return {
      chart: { type: 'radialBar', sparkline: { enabled: true } },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: { background: '#334155', strokeWidth: '97%' },
          dataLabels: {
            name: { show: false },
            value: {
              offsetY: -2,
              fontSize: '24px',
              color: '#ffffff',
              fontWeight: 'bold',
              formatter: (val) => val + '%'
            }
          }
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          gradientToColors: ['#beaed8'],
          stops: [0, 100]
        }
      }
    }
  }

  return {
    chart: {
      type: tipoApex.value,
      toolbar: { show: false },
      background: 'transparent',
    },
    // Línea de meta: permite ver de un vistazo si el KPI está por encima o
    // por debajo de su objetivo. Cuando "menos es mejor" la etiqueta lo aclara,
    // porque estar arriba de la línea es malo y sin eso se lee al revés.
    annotations: metaNumerica.value === null ? {} : {
      yaxis: [{
        y: metaNumerica.value,
        borderColor: '#10b981',
        strokeDashArray: 5,
        width: '100%',
        label: {
          text: menosEsMejor.value
            ? `Meta: máx. ${metaNumerica.value}${unidad.value}`
            : `Meta: ${metaNumerica.value}${unidad.value}`,
          position: 'left',
          offsetX: 10,
          borderColor: '#10b981',
          style: {
            background: '#10b981',
            color: '#ffffff',
            fontSize: '10px',
            fontWeight: 600,
            padding: { left: 6, right: 6, top: 2, bottom: 2 },
          },
        },
      }],
    },
    colors: [
      props.kpi.estadoTipo === 'success' ? '#10b981' :
      props.kpi.estadoTipo === 'warning' ? '#f59e0b' : '#f43f5e'
    ],
    stroke: {
      curve: 'smooth',
      width: props.tipo === 'barras' ? 0 : 2,
    },
    fill: {
      type: props.tipo === 'area' ? 'gradient' : 'solid',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
      }
    },
    plotOptions: {
      bar: { borderRadius: 4, columnWidth: '60%' }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: props.kpi.etiquetasHistorial,
      labels: {
        style: { colors: '#94a3b8', fontSize: '9px', fontWeight: 600 },
        rotate: -45,
        rotateAlways: true,
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#94a3b8', fontSize: '10px' },
      }
    },
    grid: { borderColor: '#334155', strokeDashArray: 3 },
    tooltip: { theme: 'dark' },
  }
})
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <p class="text-[10px] text-[#beaed8] uppercase tracking-widest font-semibold mb-1">
      {{ kpi.departamento }} — {{ kpi.subtitulo }}
    </p>
    <apexchart
      :type="tipoApex"
      :height="tipo === 'radial' ? 200 : 160"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>