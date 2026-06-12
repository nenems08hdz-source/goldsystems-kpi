<script setup>
import { computed } from 'vue'
import apexchart from 'vue3-apexcharts'
import { useKpiStore } from "../stores/kpiStore"

const store = useKpiStore()

const series = computed(() => [
  {
    name: 'Progreso',
    data: store.datosParaGraficaBarras.valores
  }
])

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    background: 'transparent' 
  },
  colors: ['#beaed8'],
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: false,
      distributed: true,
      columnWidth: '60%',
    }
  },
  
  colors: store.indicadores.map(i => {
    if (i.estadoTipo === 'success') return '#10b981' 
    if (i.estadoTipo === 'warning') return '#f59e0b' 
    return '#f43f5e'                                
  }),
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: store.datosParaGraficaBarras.categorias,
    labels: {
      style: {
        colors: '#94a3b8',
        fontSize: '9px',
        fontWeight: 600
      },
      rotate: -45,
      rotateAlways: true,
    }
  },
  yaxis: {
    min: 0,
    max: 100,
    labels: {
      style: { colors: '#94a3b8', fontSize: '10px' },
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