<script setup>
import { ref } from 'vue'

const departamentoSeleccionado = ref('')
</script>

<template>
  <div class="flex items-center gap-4 transition-all duration-300">
    <label class="text-[10px] font-bold uppercase tracking-wider"
      style="color: var(--card-text-hint);">Departamento:</label>
    <select v-model="departamentoSeleccionado"
      class="text-xs rounded-lg p-2 outline-none cursor-pointer transition-colors"
      style="
        background: var(--input-bg);
        color: var(--input-text);
        border: 1px solid var(--input-border);
      ">
      <option value="">Todos los departamentos</option>
      <option value="tecnologias">Tecnologías</option>
      <option value="operaciones">Operaciones</option>
      <option value="calidad">Calidad</option>
      <option value="finanzas">Finanzas</option>
    </select>
  </div>
</template>