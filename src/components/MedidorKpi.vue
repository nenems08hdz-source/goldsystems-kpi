<script setup>
import apexchart from 'vue3-apexcharts'

const series = [76] 

const chartOptions = {
  chart: {
    type: 'radialBar',
    sparkline: { enabled: true }
  },
  plotOptions: {
    radialBar: {
      startAngle: -90,
      endAngle: 90,
      track: {
        background: "#334155",
        strokeWidth: '97%',
      },
      dataLabels: {
        name: { show: false },
        value: {
          offsetY: -2,
          fontSize: '30px',
          color: '#ffffff',
          fontWeight: 'bold'
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
</script>

<template>
  <div class="flex justify-center">
    <apexchart 
      type="radialBar" 
      width="350"
      :options="chartOptions" 
      :series="series" 
    />
  </div>
</template>