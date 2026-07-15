<script setup>
import apexchart from 'vue3-apexcharts'
import { computed } from 'vue'

const props = defineProps({
  kpis: { type: Array, required: true }
})

const contadores = computed(() => ({
  saludables: props.kpis.filter(k => k.estadoTipo === 'success').length,
  riesgo: props.kpis.filter(k => k.estadoTipo === 'warning').length,
  criticos: props.kpis.filter(k => k.estadoTipo === 'danger').length,
}))

const series = computed(() => [
  contadores.value.saludables,
  contadores.value.riesgo,
  contadores.value.criticos
])

const chartOptions = computed(() => ({
  chart: { type: 'donut', sparkline: { enabled: false } },
  labels: ['Saludables', 'En Riesgo', 'Críticos'],
  colors: ['#10b981', '#f59e0b', '#ef4444'],
  plotOptions: {
    pie: {
      donut: {
        size: '35%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total',
            fontSize: '11px',
            fontWeight: 500,
            color: 'var(--text-general)'
          }
        }
      }
    }
  },
  legend: { fontSize: '11px', markers: { size: 5 } },
  dataLabels: { enabled: false }
}))
</script>

<template>
  <div style="width: 100%; height: 100%;">
    <apexchart :options="chartOptions" :series="series" type="donut" />
  </div>
</template>