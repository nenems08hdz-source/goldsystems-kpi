<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const departamentos = [
  { id: 1, nombre: 'Ventas' },
  { id: 2, nombre: 'Finanzas' },
  { id: 4, nombre: 'Operaciones' },
]
</script>

<template>
  <div class="p-3 min-h-screen flex flex-col items-center justify-center">
    
    <div class="bg-white w-full max-w-lg rounded-xl shadow-md border border-[#beaed8]/90 overflow-hidden text-left">
      
      <div class="p-5 bg-gradient-to-r from-gray-50 to-white border-b border-[#beaed8]/30 flex justify-between items-center">
        <div>
          <h3 class="text-xl font-bold text-[#3f2a52] tracking-tight">Registrar Nuevo Colaborador</h3>
          <p class="text-xs text-gray-400 mt-0.5">Añade un miembro a la estructura organizativa y asigna su rol.</p>
        </div>
      </div>

      <div class="p-6 flex flex-col gap-4">
        
        <div class="flex flex-col gap-1.5 text-left">
          <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Nombre Completo</label>
          <input type="text" placeholder="Ej. Juan Pérez" class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#77a9d4] focus:ring-2 focus:ring-[#77a9d4]/30 transition-all">
        </div>

        <div class="flex flex-col gap-1.5 text-left">
          <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Correo Corporativo</label>
          <input type="email" placeholder="juan.perez@kpi360.com" class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#77a9d4] focus:ring-2 focus:ring-[#77a9d4]/30 transition-all">
        </div>

        <div class="flex flex-col gap-1.5 text-left">
          <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Asignación de Rol Organizacional</label>
          <select class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#77a9d4] focus:ring-2 focus:ring-[#77a9d4]/30 cursor-pointer transition-colors">
            <option value="" disabled selected>Selecciona un rol operativo</option>
            <option>GERENTE</option>
            <option>LÍDER DE PLANTA</option>
            <option>AUDITOR</option>
          </select>
        </div>

        <div class="flex flex-col gap-1.5 text-left">
          <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Departamento / Área de Adscripción</label>
          <select class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#77a9d4] focus:ring-2 focus:ring-[#77a9d4]/30 cursor-pointer transition-colors">
            <option value="" disabled selected>Asigna un área de trabajo</option>
            <option v-for="dept in departamentos" :key="dept.id">{{ dept.nombre }}</option>
          </select>
        </div>

      </div>

      <div class="p-4 border-t border-[#beaed8]/20 bg-gray-50/50 flex justify-end gap-3">
        <button 
          @click="router.push('/control')" 
          class="bg-white hover:bg-gray-100 text-gray-600 border border-gray-300 font-bold text-xs py-2 px-4 rounded-lg transition-all"
        >
          Cancelar
        </button>
        <button 
          @click="router.push('/control')"
          class="bg-[#3f2a52] hover:bg-[#77a9d4] text-white font-bold text-xs py-2 px-5 rounded-lg transition-all shadow-sm"
        >
          Guardar Colaborador
        </button>
      </div>

    </div>

  </div>
</template>