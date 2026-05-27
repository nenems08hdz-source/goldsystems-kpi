<script setup>
defineProps({
  titulo: String,
  valor: String,
  subtexto: String,
  icono: String,
  colorBarra: String,    
  badgeTexto: String,      
  badgeColorClass: String  
})
</script>

<template>
  <div class="bg-white p-5 rounded-xl border border-gray-200 border-l-4 shadow-sm flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-md"
       :class="colorBarra">
    
    <div class="flex justify-between items-start gap-2">
      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
        {{ titulo }}
      </p>

      <i v-if="icono && icono.startsWith('fi ')" 
         :class="[icono, 'text-base text-[#3f2a52] flex-shrink-0']">
      </i>
      <span v-else class="text-sm font-bold flex-shrink-0">
        {{ icono }}
      </span>
    </div>
    
    <div class="mt-4">
      <div class="flex items-baseline gap-2">
        <span class="text-2xl font-bold text-gray-900">
          {{ valor }}
        </span>
        
        <span v-if="badgeTexto" 
              class="text-[11px] font-bold px-1.5 py-0.5 rounded"
              :class="badgeColorClass">
          {{ badgeTexto }}
        </span>
      </div>
      
      <p class="text-xs text-gray-500 mt-1">
        {{ subtexto }}
      </p>
    </div>

  </div>
</template>