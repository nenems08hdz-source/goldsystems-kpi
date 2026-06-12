<script setup>
import { getCurrentInstance } from 'vue'
import { ref } from 'vue'
import ModalConfirmacion from '../components/ModalConfirmacion.vue'
import Bottones from '@/components/Bottones.vue'

const usuario = ref({
  nombre: 'Alejandro',
  apellidoPaterno: 'Rivera',
  apellidoMaterno: '',
  correo: 'a.rivera@devmetrics.io',
  cargo: 'Lead Technical Architect',
  telefono:'9915784361'
})

const alertasConfig = ref([
  { 
    id: 'kpi', 
    nombre: 'Alertas de KPI (Crítico)', 
    email: true,
    push: true 
},
  { 
  id: 'sistema', 
  nombre: 'Estado del Sistema / Infraestructura', 
  email: true, 
  push: false 
},
  { 
  id: 'resumen', 
  nombre: 'Resúmenes Semanales', 
  email: false, 
  push: false 
}
])
const { proxy } = getCurrentInstance() 

const mensajeExito = ref(false) 

const guardarPerfil = async () => {
  try {
   
    proxy.$notify.success('Los cambios han sido guardados correctamente', 'Éxito');
    
  } catch (error) {
    proxy.$notify.error('Hubo un error al guardar', 'Error');
  }
}
</script>

<template>
  <div class="w-full bg-white text-[#3f2a52] px-8 min-h-screen flex flex-col" style="background-color: var(--layout-bg);">

      
    <header class="mb-8" >
        <h1 class="text-3xl font-bold tracking-tight mb-1" style="color: var(--text-general);">Configuración de Perfil</h1>
      </header>

    <div class="bg-white border border-gray-200 rounded-2xl shadow-sm w-full mb-6 overflow-hidden" style="background: var(--card-bg)";>
      <div class="bg-gray-50/70 px-6 py-4 border-b border-gray-100"style="background: var(--card-bg); background: var(--tabla-header-bg);">
        <h3 class="text-xs font-black text-[#3f2a52] uppercase tracking-wider" style="background: var(--card-bg); color: var(--text-general); background: var(--tabla-header-bg);">Perfil de Usuario</h3>
      </div>
      
      <div class="p-6 flex flex-col sm:flex-row gap-5 items-start">
        <div class="relative shrink-0 mx-auto sm:mx-0">
          <div class="w-16 h-16 rounded-full bg-[#3f2a52] text-white font-bold flex items-center justify-center text-xl relative border border-gray-200">
            AR
            <button type="button" class="absolute -bottom-1 -right-1 bg-[#3f2a52] p-0.5 px-1.5 rounded-md text-white border border-white text-[10px]">
              +
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full" style="background: var(--card-bg);">
          <div class="flex flex-col gap-1.5">
            <label class="text-[9px] font-black text-gray-500 uppercase tracking-wider" style="color: var(--text-general);">Nombre/s</label>
            <input v-model="usuario.nombre" type="text" placeholder="Ej. Alejandro" class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none text-xs shadow-sm" style="color: var(--subtext-general);" />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[9px] font-black text-gray-500 uppercase tracking-wider" style="color: var(--text-general);">Apellido Paterno</label>
            <input v-model="usuario.apellidoPaterno" type="text" placeholder="Ej. Rivera" class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none text-xs shadow-sm" style="color: var(--subtext-general);"/>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[9px] font-black text-gray-500 uppercase tracking-wider" style="color: var(--text-general);">Apellido Materno</label>
            <input v-model="usuario.apellidoMaterno" type="text" placeholder="Opcional" class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none text-xs shadow-sm" style="color: var(--subtext-general);"/>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[9px] font-black text-gray-500 uppercase tracking-wider" style="color: var(--text-general);">Correo Electrónico</label>
            <input v-model="usuario.correo" type="email" placeholder="Ej. a.rivera@devmetrics.io" class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none text-xs shadow-sm" style="color: var(--subtext-general);"/>
          </div>
          <div class="flex flex-col gap-1.5 sm:col-span-2">
            <label class="text-[9px] font-black text-gray-500 uppercase tracking-wider" style="color: var(--text-general);">Cargo / Rol</label>
            <input v-model="usuario.cargo" type="text" placeholder="Ej. Lead Technical Architect" class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none text-xs shadow-sm" style="color: var(--subtext-general);"/>
          </div>
           <div class="flex flex-col gap-1.5">
            <label class="text-[9px] font-black text-gray-500 uppercase tracking-wider" style="color: var(--text-general);">Telefono</label>
            <input v-model="usuario.telefono" type="text" placeholder="Ej. 991..." class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none text-xs  shadow-sm" style="color: var(--subtext-general);"/>
          </div>
        </div>
      </div>
      
      <div class="p-6 border-t flex justify-end gap-3" >
        <bottones type="button" >Cancelar</bottones>
        <bottones @click="guardarPerfil" type="button">Guardar Cambios</bottones>
      </div>
    </div>

    <div class="bg-white border border-gray-200 rounded-2xl shadow-sm w-full overflow-hidden mb-12">
      <div class="bg-gray-50/70 px-6 py-4 border-b border-gray-100" style="background: var(--card-bg); background: var(--tabla-header-bg); ">
        <h3 class="text-xs font-black text-[#3f2a52] uppercase tracking-wider" style="color: var(--text-general); background: var(--tabla-header-bg);">Preferencias de Notificaciones</h3>
      </div>
      <div class="overflow-x-auto w-full" style="background: var(--card-bg);">
        <table class="w-full text-left border-collapse" >
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100 text-[10px] font-black uppercase tracking-wider" style="background: var(--card-bg);">
              <th class="p-4 pl-6" style="color: var(--text-general); background: var(--tabla-header-bg);">Tipo de Alerta</th>
              <th class="p-4 text-center w-32" style="color: var(--text-general); background: var(--tabla-header-bg);">Email</th>
              <th class="p-4 text-center w-32"style="color: var(--text-general); background: var(--tabla-header-bg);">Push</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-xs">
            <tr v-for="alerta in alertasConfig" :key="alerta.id">
              <td class="p-4 pl-6 font-medium " style="color: var(--subtext-general);">{{ alerta.nombre }}</td>
              <td class="p-4 text-center"><input v-model="alerta.email" type="checkbox" class="w-4 h-4 cursor-pointer" /></td>
              <td class="p-4 text-center"><input v-model="alerta.push" type="checkbox" class="w-4 h-4 cursor-pointer" /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-6 border-t border-gray-100 flex justify-end gap-3"style="background: var(--card-bg);">
        <Bottones type="button" >Cancelar</bottones>
        <bottones  @click="guardarPerfil" type="button" >Guardar Cambios</bottones>
      </div>
    </div>

  </div> </template>