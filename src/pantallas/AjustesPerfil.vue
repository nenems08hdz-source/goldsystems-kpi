<script setup>
import { ref } from 'vue'

const usuario = ref({
  nombre: 'Alejandro',
  apellidoPaterno: 'Rivera',
  apellidoMaterno: '',
  correo: 'a.rivera@devmetrics.io',
  cargo: 'Lead Technical Architect',
  avatar: 'https://ui-avatars.com/api/?name=Alejandro+Rivera&background=3f2a52&color=fff'
})

const alertasConfig = ref([
  { id: 'kpi', nombre: 'Alertas de KPI (Crítico)', email: true, push: true },
  { id: 'sistema', nombre: 'Estado del Sistema / Infraestructura', email: true, push: false },
  { id: 'resumen', nombre: 'Resúmenes Semanales', email: false, push: false }
])
</script>

<template>
  <div class="flex flex-col gap-6 w-full bg-white text-black text-left">
    
    <div class="bg-white border border-gray-200 rounded-2xl shadow-sm w-full overflow-hidden">
      <div class="bg-gray-50/70 px-6 py-4 border-b border-gray-100">
        <h3 class="text-xs font-black text-[#3f2a52] uppercase tracking-wider">Perfil de Usuario</h3>
      </div>
      
      <div class="p-6 flex flex-col sm:flex-row gap-5 items-start">
        <div class="relative shrink-0 mx-auto sm:mx-0">
          <div class="w-16 h-16 rounded-xl bg-[#3f2a52] text-white font-bold flex items-center justify-center text-xl relative border border-gray-200">
            AR
            <button type="button" class="absolute -bottom-1 -right-1 bg-[#3f2a52] hover:bg-[#2d1e3b] p-0.5 px-1.5 rounded-md text-white border border-white text-[10px] transition-colors">
              +
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <div class="flex flex-col gap-1.5">
            <label class="text-[9px] font-black text-gray-500 uppercase tracking-wider">Nombre/s</label>
            <input v-model="usuario.nombre" type="text" class="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#3f2a52] text-xs font-medium text-black shadow-sm" />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[9px] font-black text-gray-500 uppercase tracking-wider">Apellido Paterno</label>
            <input v-model="usuario.apellidoPaterno" type="text" class="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#3f2a52] text-xs font-medium text-black shadow-sm" />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[9px] font-black text-gray-500 uppercase tracking-wider">Apellido Materno</label>
            <input v-model="usuario.apellidoMaterno" type="text" placeholder="Opcional" class="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#3f2a52] text-xs font-medium text-black shadow-sm" />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[9px] font-black text-gray-500 uppercase tracking-wider">Correo Electrónico</label>
            <input v-model="usuario.correo" type="email" class="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#3f2a52] text-xs font-medium text-black shadow-sm" />
          </div>

          <div class="flex flex-col gap-1.5 sm:col-span-2">
            <label class="text-[9px] font-black text-gray-500 uppercase tracking-wider">Cargo / Rol</label>
            <input v-model="usuario.cargo" type="text" class="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#3f2a52] text-xs font-medium text-black shadow-sm" />
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white border border-gray-200 rounded-2xl shadow-sm w-full overflow-hidden">
      <div class="bg-gray-50/70 px-6 py-4 border-b border-gray-100">
        <h3 class="text-xs font-black text-[#3f2a52] uppercase tracking-wider">Preferencias de Notificaciones</h3>
      </div>

      <div class="overflow-x-auto w-full">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-wider">
              <th class="p-4 pl-6">Tipo de Alerta</th>
              <th class="p-4 text-center w-32">Email</th>
              <th class="p-4 text-center w-32">Push</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-xs">
            <tr v-for="alerta in alertasConfig" :key="alerta.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="p-4 pl-6 font-medium text-gray-900">{{ alerta.nombre }}</td>
              <td class="p-4 text-center">
                <input v-model="alerta.email" type="checkbox" class="rounded border-gray-300 text-[#3f2a52] focus:ring-[#3f2a52]/30 w-4 h-4 cursor-pointer" />
              </td>
              <td class="p-4 text-center">
                <input v-model="alerta.push" type="checkbox" class="rounded border-gray-300 text-[#3f2a52] focus:ring-[#3f2a52]/30 w-4 h-4 cursor-pointer" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>