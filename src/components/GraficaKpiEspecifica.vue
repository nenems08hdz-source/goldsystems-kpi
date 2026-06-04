<script setup>
// Este componente recibe UN kpi completo y muestra su historial
// en el tipo de gráfica que el usuario eligió.
import apexchart from 'vue3-apexcharts'
import { computed } from 'vue'

const props = defineProps({
  // El objeto KPI completo (con historial, etiquetas, etc.)
  kpi: { type: Object, required: true },
  // Qué tipo de gráfica mostrar: 'linea', 'barras', 'area', 'radial'
  tipo: { type: String, default: 'linea' }
})

// El tipo de gráfica que ApexCharts entiende según lo que eligió el usuario
const tipoApex = computed(() => {
  if (props.tipo === 'linea') return 'line'
  if (props.tipo === 'barras') return 'bar'
  if (props.tipo === 'area') return 'area'
  if (props.tipo === 'radial') return 'radialBar'
  return 'line'
})

// Para la gráfica radial, el dato es el progreso actual (un solo número)
// Para las demás, es el historial completo
const series = computed(() => {
  if (props.tipo === 'radial') {
    return [props.kpi.progreso]
  }
  return [{ name: props.kpi.subtitulo, data: props.kpi.historial }]
})

const chartOptions = computed(() => {
  // Opciones para la gráfica radial (igual que MedidorKpi pero con datos del KPI)
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

  // Opciones compartidas para línea, barras y área
  return {
    chart: {
      type: tipoApex.value,
      toolbar: { show: false },
      background: 'transparent',
    },
    // Color según el estado del KPI
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
    <!-- Título del KPI encima de la gráfica -->
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