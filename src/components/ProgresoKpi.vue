<script setup>
import { computed } from 'vue'
import apexchart from 'vue3-apexcharts'
import { useKpiStore } from "../stores/kpiStore"

const store = useKpiStore()

const props = defineProps({
  kpisData: { type: Array, required: true }
})

const series = computed(() => [
  {
    name: 'Progreso',
    data: props.kpisData.map(i => i.progreso)
  }
])

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    background: 'transparent'
  },
  colors: props.kpisData.map(i => {
    if (i.estadoTipo === 'success') return '#10b981'
    if (i.estadoTipo === 'warning') return '#f59e0b'
    return '#f43f5e'
  }),
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: false,
      distributed: true,
      columnWidth: '60%',
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: props.kpisData.map(i => i.departamento.split(' ')[0]),
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