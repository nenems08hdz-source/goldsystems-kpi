<script setup>
import { getCurrentInstance } from 'vue'
import { ref } from 'vue'
import EncabezadoPantalla from '../components/EncabezadoPantalla.vue'

const usuario = ref({
  nombre: 'Alejandro',
  apellidoPaterno: 'Rivera',
  apellidoMaterno: '',
  correo: 'a.rivera@devmetrics.io',
  cargo: 'Lead Technical Architect',
  telefono:'9915784361'
})

const alertasConfig = ref([
  { id: 'kpi',     nombre: 'Alertas de KPI (Crítico)',              email: true,  push: true  },
  { id: 'sistema', nombre: 'Estado del Sistema / Infraestructura',  email: true,  push: false },
  { id: 'resumen', nombre: 'Resúmenes Semanales',                   email: false, push: false },
])

const { proxy } = getCurrentInstance()

const guardarPerfil = async () => {
  try {
    proxy.$notify.success('Los cambios han sido guardados correctamente', 'Éxito')
  } catch (error) {
    proxy.$notify.error('Hubo un error al guardar', 'Error')
  }
}
</script>

<template>
  <div class="w-full px-8 min-h-screen flex flex-col" style="background-color: var(--layout-bg);">

    <header class="mb-8">
      <EncabezadoPantalla
        titulo="Configuración de Perfil"
        descripcion="Administra tu información personal y preferencias de notificación."
      />
    </header>

    <div class="rounded-2xl shadow-sm w-full mb-6 overflow-hidden"
      style="background: var(--card-bg); border: 1px solid var(--tabla-borde);">

      <div class="px-6 py-4 border-b" style="background: var(--tabla-header-bg); border-color: var(--tabla-borde);">
        <h3 class="text-xs font-black uppercase tracking-wider" style="color: var(--tabla-header-text);">Perfil de Usuario</h3>
      </div>

      <div class="p-6 flex flex-col sm:flex-row gap-5 items-start">
        <div class="relative shrink-0 mx-auto sm:mx-0">
          <div class="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold relative"
            style="background: var(--sidebar-active-bg); color: var(--sidebar-active-text); border: 2px solid var(--tabla-borde);">
            AR
            <button type="button"
              class="absolute -bottom-1 -right-1 p-0.5 px-1.5 rounded-md text-[10px] font-bold"
              style="background: var(--sidebar-bg); color: #fff; border: 2px solid var(--card-bg);">
              +
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <div class="flex flex-col gap-1.5">
            <label class="text-[9px] font-black uppercase tracking-wider" style="color: var(--subtext-general);">Nombre/s</label>
            <input v-model="usuario.nombre" type="text" placeholder="Ej. Alejandro" class="app-input" />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[9px] font-black uppercase tracking-wider" style="color: var(--subtext-general);">Apellido Paterno</label>
            <input v-model="usuario.apellidoPaterno" type="text" placeholder="Ej. Rivera" class="app-input" />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[9px] font-black uppercase tracking-wider" style="color: var(--subtext-general);">Apellido Materno</label>
            <input v-model="usuario.apellidoMaterno" type="text" placeholder="Opcional" class="app-input" />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[9px] font-black uppercase tracking-wider" style="color: var(--subtext-general);">Correo Electrónico</label>
            <input v-model="usuario.correo" type="email" placeholder="Ej. a.rivera@devmetrics.io" class="app-input" />
          </div>
          <div class="flex flex-col gap-1.5 sm:col-span-2">
            <label class="text-[9px] font-black uppercase tracking-wider" style="color: var(--subtext-general);">Cargo / Rol</label>
            <input v-model="usuario.cargo" type="text" placeholder="Ej. Lead Technical Architect" class="app-input" />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[9px] font-black uppercase tracking-wider" style="color: var(--subtext-general);">Teléfono</label>
            <input v-model="usuario.telefono" type="text" placeholder="Ej. 991..." class="app-input" />
          </div>
        </div>
      </div>

      <div class="p-6 border-t flex justify-end gap-3" style="border-color: var(--tabla-borde);">
        <button type="button"
          class="px-5 py-2.5 text-xs font-bold rounded-xl transition-colors"
          style="background: var(--card-bg); border: 1px solid var(--tabla-borde); color: var(--text-general);"
          @mouseover="$event.currentTarget.style.background='var(--tabla-hover)'"
          @mouseleave="$event.currentTarget.style.background='var(--card-bg)'"
        >Cancelar</button>
        <button @click="guardarPerfil" type="button"
          class="px-6 py-2.5 text-xs font-bold rounded-xl transition-all"
          style="background: var(--sidebar-active-bg); color: var(--sidebar-active-text);"
          @mouseover="$event.currentTarget.style.opacity='0.85'"
          @mouseleave="$event.currentTarget.style.opacity='1'"
        >Guardar Cambios</button>
      </div>
    </div>

    <div class="rounded-2xl shadow-sm w-full overflow-hidden mb-12"
      style="background: var(--card-bg); border: 1px solid var(--tabla-borde);">

      <div class="px-6 py-4 border-b" style="background: var(--tabla-header-bg); border-color: var(--tabla-borde);">
        <h3 class="text-xs font-black uppercase tracking-wider" style="color: var(--tabla-header-text);">Preferencias de Notificaciones</h3>
      </div>

      <div class="overflow-x-auto w-full">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-[10px] font-black uppercase tracking-wider" style="background: var(--tabla-header-bg); border-bottom: 1px solid var(--tabla-borde);">
              <th class="p-4 pl-6" style="color: var(--tabla-header-text);">Tipo de Alerta</th>
              <th class="p-4 text-center w-32" style="color: var(--tabla-header-text);">Email</th>
              <th class="p-4 text-center w-32" style="color: var(--tabla-header-text);">Push</th>
            </tr>
          </thead>
          <tbody class="text-xs" style="divide-color: var(--tabla-borde);">
            <tr v-for="alerta in alertasConfig" :key="alerta.id"
              style="border-bottom: 1px solid var(--tabla-borde);">
              <td class="p-4 pl-6 font-medium" style="color: var(--text-general);">{{ alerta.nombre }}</td>
              <td class="p-4 text-center"><input v-model="alerta.email" type="checkbox" class="w-4 h-4 cursor-pointer accent-[#3f2a52]" /></td>
              <td class="p-4 text-center"><input v-model="alerta.push"  type="checkbox" class="w-4 h-4 cursor-pointer accent-[#3f2a52]" /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="p-6 border-t flex justify-end gap-3" style="border-color: var(--tabla-borde);">
        <button type="button"
          class="px-5 py-2.5 text-xs font-bold rounded-xl transition-colors"
          style="background: var(--card-bg); border: 1px solid var(--tabla-borde); color: var(--text-general);"
          @mouseover="$event.currentTarget.style.background='var(--tabla-hover)'"
          @mouseleave="$event.currentTarget.style.background='var(--card-bg)'"
        >Cancelar</button>
        <button @click="guardarPerfil" type="button"
          class="px-6 py-2.5 text-xs font-bold rounded-xl transition-all"
          style="background: var(--sidebar-active-bg); color: var(--sidebar-active-text);"
          @mouseover="$event.currentTarget.style.opacity='0.85'"
          @mouseleave="$event.currentTarget.style.opacity='1'"
        >Guardar Cambios</button>
      </div>
    </div>

  </div>
</template>
