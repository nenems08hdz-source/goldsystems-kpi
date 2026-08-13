<script setup>
import { ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const series = ref([
  {
      name: 'Income', 
      type: 'column', 
      data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6] 
  },

  { 
    name: 'Revenue', 
    type: 'line', 
    data: [20, 29, 37, 36, 44, 45, 50, 58] 
  }
])

const chartOptions = ref({
  chart: { height: 350, type: 'line', stacked: false },
  dataLabels: { enabled: false },
  stroke: { width: [0, 1] }, 
  title: { text: 'XYZ - Stock Analysis (2009 - 2016)', align: 'left', offsetX: 110 },
  xaxis: { categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016] },
  yaxis: [
    {
      seriesName: 'Income',
      axisTicks: { show: true },
      axisBorder: { show: true, color: '#008FFB' },
      labels: { style: { colors: '#008FFB' } },
      title: { text: 'Income (thousand crores)', style: { color: '#008FFB' } }
    },
    {
      seriesName: 'Revenue',
      opposite: true,
      axisTicks: { show: true },
      axisBorder: { show: true, color: '#FEB019' },
      labels: { style: { colors: '#FEB019' } },
      title: { text: 'Revenue (thousand crores)', style: { color: '#FEB019' } }
    }
  ],
  tooltip: {
    fixed: { enabled: true, position: 'topLeft', offsetY: 30, offsetX: 60 }
  },
  legend: { horizontalAlign: 'left', offsetX: 40 }
})
</script>

<template>
  <div class="w-full h-full">
    <VueApexCharts 
      width="100%" 
      height="100%" 
      :options="chartOptions" 
      :series="series" 
    />
  </div>
</template>
