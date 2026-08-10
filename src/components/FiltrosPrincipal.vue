<script setup>
import { ref, onMounted } from 'vue'
import { useOrgStore } from '../stores/orgStore'
import { useUiStore }  from '../stores/uiStore'

const orgStore = useOrgStore()
const uiStore  = useUiStore()

// String para el select, Number|null para el store
const departamentoSeleccionado = ref('')

onMounted(() => {
  // Restaurar desde el store (que ya leyó de sessionStorage)
  departamentoSeleccionado.value = uiStore.departamentoActivo
    ? String(uiStore.departamentoActivo)
    : ''
})

async function alCambiar(val) {
  uiStore.cargandoConfig         = true
  uiStore.departamentoActivo     = val ? Number(val) : null
  departamentoSeleccionado.value = val || ''
  await uiStore.cargarConfig()
}
</script>

<template>
  <div class="flex items-center gap-4">
    <label class="text-xs font-bold uppercase tracking-wider"
      style="color: var(--text-general);">Departamento:</label>
    <select
      :value="departamentoSeleccionado"
      @change="alCambiar($event.target.value)"
      class="text-xs rounded-lg p-2 outline-none cursor-pointer transition-colors"
      style="background: var(--input-bg); color: var(--input-text); border: 1px solid var(--input-border);">
      <option value="">Todos los departamentos</option>
      <option v-for="dep in orgStore.departamentos" :key="dep.id" :value="String(dep.id)">
        {{ dep.name }}
      </option>
    </select>
  </div>
</template>
