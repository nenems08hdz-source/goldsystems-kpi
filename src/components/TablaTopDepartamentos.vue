<script setup>
import { computed } from 'vue'
import EtiquetaBadge from './ui/EtiquetaBadge.vue'

const props = defineProps({
  kpis: { type: Array, required: true }
})

const topDepartamentos = computed(() => {
  const depts = {}
  
  props.kpis.forEach(kpi => {
    const dept = kpi.departamento || 'Sin departamento'
    if (!depts[dept]) {
      depts[dept] = { nombre: dept, total: 0, saludables: 0, riesgo: 0, criticos: 0 }
    }
    depts[dept].total++
    if (kpi.estadoTipo === 'success') depts[dept].saludables++
    if (kpi.estadoTipo === 'warning') depts[dept].riesgo++
    if (kpi.estadoTipo === 'danger') depts[dept].criticos++
  })

  return Object.values(depts)
    .map(d => ({
      ...d,
      porcentaje: Math.round((d.saludables / d.total) * 100)
    }))
    .sort((a, b) => b.porcentaje - a.porcentaje)
})
</script>

<template>
  <div class="w-full rounded-xl shadow-sm overflow-hidden" style="background: var(--card-bg); border: 1px solid var(--tabla-borde);">
    <div class="p-4" style="background: var(--tabla-header-bg); border-bottom: 1px solid var(--tabla-borde);">
      <h3 class="text-xs font-bold uppercase tracking-wider" style="color: var(--tabla-header-text);">
        Desempeño por Departamento
      </h3>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead style="background: var(--tabla-header-bg); border-bottom: 1px solid var(--tabla-borde);">
          <tr>
            <th class="p-3 font-bold" style="color: var(--tabla-header-text);">Departamento</th>
            <th class="p-3 text-center font-bold" style="color: var(--tabla-header-text);">Saludables</th>
            <th class="p-3 text-center font-bold" style="color: var(--tabla-header-text);">Riesgo</th>
            <th class="p-3 text-center font-bold" style="color: var(--tabla-header-text);">Críticos</th>
            <th class="p-3 text-center font-bold" style="color: var(--tabla-header-text);">% Cumplimiento</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="dept in topDepartamentos" :key="dept.nombre" style="border-bottom: 1px solid var(--tabla-borde);">
            <td class="p-3" style="color: var(--text-general);">
              <span class="font-semibold">{{ dept.nombre }}</span>
            </td>
            <td class="p-3 text-center">
              <EtiquetaBadge :texto="`${dept.saludables}`" />
            </td>
            <td class="p-3 text-center">
              <span class="text-xs px-2 py-1 rounded" style="background: #fef3c7; color: #92400e;">{{ dept.riesgo }}</span>
            </td>
            <td class="p-3 text-center">
              <span class="text-xs px-2 py-1 rounded" style="background: #fee2e2; color: #991b1b;">{{ dept.criticos }}</span>
            </td>
            <td class="p-3 text-center">
              <span class="font-bold" :style="{ color: dept.porcentaje >= 70 ? '#10b981' : dept.porcentaje >= 50 ? '#f59e0b' : '#ef4444' }">
                {{ dept.porcentaje }}%
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>