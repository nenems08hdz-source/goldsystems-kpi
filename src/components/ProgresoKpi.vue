<script setup>
import { computed } from 'vue'
import apexchart from 'vue3-apexcharts'
import { usePanelStore } from '../stores/panelStore'

const store = usePanelStore()

// computed() que toma los datos reales del store y los formatea
// para que ApexCharts los entienda.
const series = computed(() => [
  {
    name: 'Progreso',
    // datosParaGraficaBarras.valores es el array de números: [99.98, 78, 45, 88, ...]
    data: store.datosParaGraficaBarras.valores
  }
])

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    // background transparente para que se vea el fondo morado del panel
    background: 'transparent'
  },
  colors: ['#beaed8'],
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: false,
      // Cada barra tiene su propio color dependiendo del estado
      distributed: true,
      columnWidth: '60%',
    }
  },
  // Coloreamos cada barra según si el KPI está bien o en riesgo
  // El orden del array sigue el mismo orden que los indicadores en el store
  colors: store.indicadores.map(i => {
    if (i.estadoTipo === 'success') return '#10b981' // verde esmeralda
    if (i.estadoTipo === 'warning') return '#f59e0b' // ámbar
    return '#f43f5e'                                 // rojo/rosa
  }),
  dataLabels: {
    enabled: false
  },
  xaxis: {
    // datosParaGraficaBarras.categorias es ["Backend", "Frontend", "Ciberseg...", ...]
    categories: store.datosParaGraficaBarras.categorias,
    labels: {
      style: {
        colors: '#94a3b8',
        fontSize: '9px',
        fontWeight: 600
      },
      // Rotamos las etiquetas 45° para que no se encimen
      rotate: -45,
      rotateAlways: true,
    }
  },
  yaxis: {
    min: 0,
    max: 100,
    labels: {
      style: { colors: '#94a3b8', fontSize: '10px' },
      // Añadimos el símbolo % al eje Y
      formatter: (val) => val + '%'
    }
  },
  grid: {
    borderColor: '#334155',
    strokeDashArray: 3,
  },
  tooltip: {
    theme: 'dark',
    y: {
      formatter: (val) => val + '%'
    }
  },
  legend: {
    show: false
  }
}))
</script>

<template>
  <div class="w-full">
    <apexchart
      type="bar"
      height="160"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>