<script setup>
defineProps({
  titulo: String,
  encabezados: Array,
  datos: Array
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-md border border-[#beaed8]/80 mt-6 overflow-hidden">
    
    <div class="p-4 bg-gray-50/50 border-b border-[#beaed8]/30">
      <h2 class="text-xl font-bold text-gray-800 tracking-tight">
        {{ titulo }}
      </h2>
    </div>
    
    <div class="overflow-x-auto max-h-[450px] overflow-y-auto">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-50 border-b border-[#beaed8]/40">
          <tr class="sticky top-0 bg-gray-50 z-10">
            <th 
              v-for="header in encabezados" 
              :key="header" 
              class="p-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider"
            >
              {{ header }}
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-[#beaed8]/20">
          <tr v-for="(item, index) in datos" :key="index" class="hover:bg-gray-50/70 transition-colors">
            <slot :fila="item"></slot>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>