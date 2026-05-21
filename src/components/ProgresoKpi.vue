<script setup>
import { ref } from 'vue'
import apexchart from 'vue3-apexcharts'

const series = ref([
  {
    name: "sales",
    data: [400, 430, 448, 470, 540, 580, 690, 690]
  }
])

const chartOptions = ref({
  chart: {
    type: 'bar',
    toolbar: { show: false }
  },
  colors: ['#beaed8'], 
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: false,
    }
  },
  dataLabels: {
    enabled: false
  },
  
  xaxis: {
    type: 'category',
    categories: ['Q1 19', 'Q2 19', 'Q3 19', 'Q4 19', 'Q1 20', 'Q2 20', 'Q3 20', 'Q4 20'],
    labels: {
      style: {
        colors: '#94a3b8',
        fontSize: '10px',
        fontWeight: 600
      }
    }
  },
  yaxis: {
    labels: {
      style: { colors: '#94a3b8' }
    }
  },
  grid: {
    borderColor: '#334155'
  },
  tooltip: {
    theme: 'dark'
  }
})
</script>

<template>
  <div class="w-full text-slate-800">
    <apexchart 
      type="bar" 
      height="180" 
      :options="chartOptions" 
      :series="series"
    ></apexchart>
  </div>
</template>
