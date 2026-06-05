<script setup>
import { ref } from 'vue'

const departamentoSeleccionado = ref('')
</script>

<template>
  <div class="flex items-center gap-4 transition-all duration-300">
      <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Departamento:</label>
      <select 
        v-model="departamentoSeleccionado" 
        class="bg-white text-gray-700 text-xs rounded-lg border border-slate-200 p-2 outline-none focus:border-[#77a9d4] cursor-pointer"
      >
        <option value="">Todos los departamentos</option>
        <option value="finanzas">Tecnolgias</option>
        <option value="operaciones">Operaciones</option>
        <option value="operaciones">Calidad</option>
        <option value="ventas">Finanzas</option>
      </select>
    </div>
</template>