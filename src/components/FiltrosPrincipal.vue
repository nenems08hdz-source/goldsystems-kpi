<script setup>
import { ref, onMounted, watch } from 'vue'
import { useOrgStore } from '../stores/orgStore'
import { useUiStore }  from '../stores/uiStore'

const orgStore = useOrgStore()
const uiStore  = useUiStore()

// El select usa strings (valores de HTML), el store usa Number|null
// departamentoSeleccionado es el "string local" del select
const departamentoSeleccionado = ref('')

onMounted(() => {
  // Restaurar el valor del select desde el store (que ya lo leyó de sessionStorage)
  departamentoSeleccionado.value = uiStore.departamentoActivo
    ? String(uiStore.departamentoActivo)
    : ''
})

watch(departamentoSeleccionado, async (val) => {
  uiStore.departamentoActivo = val ? Number(val) : null
  await uiStore.cargarConfig()
})
</script>

<template>
  <div class="flex items-center gap-4">
    <label class="text-xs font-bold uppercase tracking-wider"
      style="color: var(--text-general);">Departamento:</label>
    <select
      v-model="departamentoSeleccionado"
      class="text-xs rounded-lg p-2 outline-none cursor-pointer transition-colors"
      style="background: var(--input-bg); color: var(--input-text); border: 1px solid var(--input-border);">
      <option value="">Todos los departamentos</option>
      <option v-for="dep in orgStore.departamentos" :key="dep.id" :value="String(dep.id)">
        {{ dep.name }}
      </option>
    </select>
  </div>
</template>
