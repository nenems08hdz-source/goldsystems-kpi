<script setup>
import apexchart from 'vue3-apexcharts'
import { computed } from 'vue'
import { usePanelStore } from '../stores/panelStore'

const store = usePanelStore()

// En lugar de [76] fijo, usamos el porcentaje real de KPIs saludables.
// computed() hace que la gráfica se actualice automáticamente si los datos cambian.
const series = computed(() => [store.promedioSaludKpis])

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
        background: '#334155',
        strokeWidth: '97%',
      },
      dataLabels: {
        name: { show: false },
        value: {
          offsetY: -2,
          fontSize: '30px',
          color: '#ffffff',
          fontWeight: 'bold',
          // Añadimos el símbolo % al valor mostrado
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
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-1">
    <apexchart
      type="radialBar"
      width="280"
      :options="chartOptions"
      :series="series"
    />
    <!-- Leyenda debajo de la gráfica explicando qué significa el número -->
    <p class="text-[10px] text-[#beaed8] uppercase tracking-widest font-semibold">
      KPIs en estado saludable
    </p>
  </div>
</template>