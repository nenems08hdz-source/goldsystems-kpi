<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router' 

const router = useRouter() 

const nuevoDepartamento = ref({
  nombre: '',
  empresa: '',
  descripcion: ''
})

const guardarDepartamento = () => {
  console.log('Datos enviados:', nuevoDepartamento.value)
  
  alert('¡Departamento registrado con éxito!')
  
  router.push('/ControlOrganizacional')
}
</script>

<template>
  <div class="p-3 min-h-screen">
    <div class="mb-6">
      <h1 class="text-4xl font-bold text-[#3f2a52] tracking-tight">Nuevo Departamento</h1>
      <p class="text-xs text-gray-500 mt-1">Registra una nueva área organizativa vinculada a una empresa.</p>
    </div>

    <form @submit.prevent="guardarDepartamento" class="w-full bg-white rounded-xl shadow-md border border-[#beaed8]/50 overflow-hidden">
      
      <div class="p-4 bg-gray-50/50 border-b border-[#beaed8]/30">
        <h2 class="text-sm font-bold text-gray-700 uppercase tracking-wider">Información del Departamento</h2>
      </div>

      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        
        <div class="flex flex-col gap-1.5">
          <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Nombre del Departamento</label>
          <input 
            v-model="nuevoDepartamento.nombre"
            type="text" 
            placeholder="Ej. Recursos Humanos"
            required
            class="w-full bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#77a9d4] focus:ring-2 focus:ring-[#77a9d4]/30 transition-colors"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Empresa</label>
          <input 
            v-model="nuevoDepartamento.empresa"
            type="text" 
            placeholder="Ej. Golsystems"
            required
            class="w-full bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#77a9d4] focus:ring-2 focus:ring-[#77a9d4]/30 transition-colors"
          />
        </div>

        <div class="flex flex-col gap-1.5 md:col-span-2">
          <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Descripción (Opcional)</label>
          <textarea 
            v-model="nuevoDepartamento.descripcion"
            rows="3"
            placeholder="Describe las funciones principales del área..."
            class="w-full bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#77a9d4] focus:ring-2 focus:ring-[#77a9d4]/30 resize-none transition-colors"
          ></textarea>
        </div>

      </div>

      <div class="p-6 border-t border-[#beaed8]/20 bg-gray-50/50 flex justify-end gap-3">
        <button type="button" @click="router.push('/ControlOrganizacional')" class="bg-white hover:bg-gray-100 text-gray-600 border border-gray-300 font-bold text-xs py-3 px-6 rounded-lg transition-all">
          Cancelar
        </button>
        <button type="submit" class="bg-[#3f2a52] hover:bg-[#77a9d4] text-white font-bold text-xs py-3 px-8 rounded-lg transition-all shadow-sm">
          Guardar Departamento
        </button>
      </div>
    </form>
  </div>
</template>