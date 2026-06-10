<script setup>
defineProps({
  //PlantillaTabla
  titulo: String,
  icon: String,
  encabezados: Array,
  datos: Array,
  mostrarAcciones: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-md border border-[#beaed8]/80 mt-6 overflow-hidden">
    
    <div class="p-4 bg-gray-50/50 border-b border-[#beaed8]/30">
      <h2 class="text-xl font-bold text-gray-800 tracking-tight">
         <i v-if="icon" :class="`fi ${icon}`"></i> 
        {{ titulo }}
      </h2>
    </div>
    
    <div class="overflow-x-auto max-h-[450px] overflow-y-auto">
      <table class="w-full text-left border-collapse table-auto"> 
        <thead class="bg-gray-50 border-b border-[#beaed8]/40">
          <tr class="sticky top-0 bg-gray-50 z-10">
            <th 
              v-for="header in encabezados" 
              :key="header" 
              class="p-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider"
            >
              {{ header }}
            </th>
            <th 
              v-if="mostrarAcciones" 
              class="p-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right pr-6 w-24"
            >
              Acciones
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-[#beaed8]/20">
          <tr 
            v-for="(item, index) in datos" 
            :key="index" 
            class="hover:bg-[#3f2a52]/10 transition-colors duration-200"
          >
            <slot :fila="item"></slot>

            <td v-if="mostrarAcciones" class="p-4 text-right align-middle pr-6 w-24">
              <div class="flex items-center justify-end gap-2">
                <slot name="iconos-acciones" :item="item">
                  <button class="text-gray-400 font-bold px-1">⋮</button>
                </slot>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>