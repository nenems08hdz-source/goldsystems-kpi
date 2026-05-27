<script setup>
import { ref } from 'vue'

const areaSeleccionada = ref('')
const departamentoSeleccionado = ref('')
</script>

<template>
  <div class="flex items-center gap-4 transition-all duration-300">
    
    <div class="flex flex-col">
      <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Area</label>
      <select 
        v-model="areaSeleccionada" 
        class="bg-white text-gray-700 text-xs rounded-lg border border-slate-200 p-2 outline-none focus:border-[#77a9d4] cursor-pointer"
      >
        <option value="">Todas las Areas</option>
        <option value="planta-1">Planta Norte</option>
        <option value="planta-2">Planta Sur</option>
      </select>
    </div>

    <div class="flex flex-col">
      <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Departamento</label>
      <select 
        v-model="departamentoSeleccionado" 
        class="bg-white text-gray-700 text-xs rounded-lg border border-slate-200 p-2 outline-none focus:border-[#77a9d4] cursor-pointer"
      >
        <option value="">Todos los departamentos</option>
        <option value="finanzas">Finanzas</option>
        <option value="operaciones">Operaciones</option>
        <option value="ventas">Ventas</option>
      </select>
    </div>

  </div>
</template>