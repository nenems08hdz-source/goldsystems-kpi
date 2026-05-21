<script setup>
// lógica de JavaScript más adelante
</script>

<template>
  <header class="h-16 bg-white border-b border border-gray-200 px-8 flex items-center justify-between shadow-xl">
    
    <div class="flex items-center gap-6">

      <div class="flex flex-col gap-1">
        <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          area
        </label>
        <select class="bg-white border border-gray-300 rounded-md py-1 px-3 text-sm text-gray-700 focus:outline-none">
          <option>Todas las Areas</option>
          <option>Planta Norte</option>
          <option>Planta Sur</option>
        </select>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          departamento
        </label>
        <select class="bg-white border border-gray-300 rounded-md py-1 px-3 text-sm text-gray-700 focus:outline-none">
          <option>Todas los departamentos</option>
          <option>Producción</option>
          <option>Calidad</option>
          <option>Mantenimiento</option>
        </select>
        
      </div>

    </div>

    <div class="flex items-center gap-5">
      <button class="bg-[#3f2a52] hover:bg-[#beaed8] text-white text-sm font-medium py-2 px-4 rounded-md focus:outline-none">
       Personalizar Dashboard
      </button>
      <span class="text-gray-400 text-sm">perfil</span>
     
    </div>

  </header>
</template>

