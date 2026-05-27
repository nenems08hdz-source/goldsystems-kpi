<script setup>
import { ref } from 'vue'
import plantillatabla from '../components/plantillatabla.vue'

// 1. Estado para 2FA
const is2FAEnabled = ref(false)
const toggle2FA = () => { is2FAEnabled.value = !is2FAEnabled.value }

const sesiones = ref([
{ 
  id: 1, 
  dispositivo: 'MacBook Pro 16', 
  ubicacion: 'CDMX, MX', 
  tiempo: 'Ahora' 
},
  { 
    id: 2, 
    dispositivo: 'Hp', 
    ubicacion: 'Veracruz', 
    tiempo: 'Hace 15 hrs' 
},
  { 
    id: 3, 
    dispositivo: 'Lenovo', 
    ubicacion: 'Oaxaca', 
    tiempo: 'Hace 12 hrs' 
},
])
const encabezadosSesiones = ['Dispositivo', 'Ubicación', 'Tiempo', 'Acción']

const cerrarSesion = (id) => { sesiones.value = sesiones.value.filter(s => s.id !== id) }
const cerrarTodas = () => { sesiones.value = [] }

const registrosActividad = ref([
  { 
  id: 1, 
  accion: 'Login exitoso', 
  detalle: 'macOS (192.168.1.45)', 
  hora: '14:22' 
},
  { 
    id: 2, 
    accion: '2FA completada', 
    detalle: 'SMS verificado', 
    hora: '14:21' 
},
  { 
    id: 3, 
    accion: 'Nueva clave', 
    detalle: 'Contraseña actualizada', 
    hora: 'Nov 28' 
}
])
const encabezadosActividad = ['Acción', 'Detalle', 'Hora', 'Acción']

const eliminarRegistro = (id) => {
  registrosActividad.value = registrosActividad.value.filter(r => r.id !== id)
}
</script>

<template>
   <div class="w-full bg-white text-[#3f2a52] px-8 min-h-screen flex flex-col">

    <header class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight mb-1">Configuración de Seguridad</h1>
      </header>
    
    <section class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h2 class="text-lg font-bold text-[#3f2a52] mb-4 flex items-center gap-2">
        <i class="fi fi-sr-lock"></i> 
         Autenticación
      </h2>

      <div class="flex justify-between items-center bg-gray-50 p-4 rounded-xl mb-4">
        <div>
          <p class="text-sm font-bold">Doble Factor (2FA)</p>
          <p class="text-xs text-gray-500">Protección extra para tu cuenta</p>
        </div>
        <button @click="toggle2FA" :class="['w-11 h-6 rounded-full relative transition-colors duration-200', is2FAEnabled ? 'bg-green-600' : 'bg-[#3f2a52]']">
          <div :class="['absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200', is2FAEnabled ? 'left-6' : 'left-1']"></div>
        </button>
      </div>
      <button class="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-[#3f2a52] font-bold text-sm rounded-lg transition-colors">
        Cambiar Contraseña
      </button>
      <p class="text-[10px] text-gray-400 mt-3 text-center">Último cambio hace 3 meses</p>
    </section>

    <section>
      <plantillatabla titulo="Sesiones Activas" :encabezados="encabezadosSesiones" :datos="sesiones">
        <template #default="{ fila }">
          <td class="p-4"><p class="text-sm font-bold text-[#3f2a52]">{{ fila.dispositivo }}</p></td>
          <td class="p-4 text-xs text-gray-500">{{ fila.ubicacion }}</td>
          <td class="p-4 text-xs font-bold text-gray-600">{{ fila.tiempo }}</td>
          <td class="p-4">
            <button @click="cerrarSesion(fila.id)" class="px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all bg-[#3f2a52] text-white hover:bg-[#beaed8] hover:text-[#3f2a52]">Cerrar</button>
          </td>
        </template>
    </plantillatabla>
    </section>

    <section>
      
      <plantillatabla titulo="Actividad" :encabezados="encabezadosActividad" :datos="registrosActividad">
        <template #default="{ fila }">
          <td class="p-4"><p class="text-sm font-bold text-gray-700">{{ fila.accion }}</p></td>
          <td class="p-4 text-xs text-gray-500">{{ fila.detalle }}</td>
          <td class="p-4 text-xs font-bold text-gray-600">{{ fila.hora }}</td>
          <td class="p-4">
            <button @click="eliminarRegistro(fila.id)" class="px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all bg-[#3f2a52] text-white hover:bg-[#beaed8] hover:text-[#3f2a52]">Eliminar</button>
          </td>
        </template>
    </plantillatabla>
    </section>

<div class="p-6 border-t border-gray-100 flex justify-end gap-3">
        <button type="button" class="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-black text-xs font-bold rounded-xl transition-colors">Cancelar</button>
        <button @click="guardarPerfil" type="button" class="px-6 py-2.5 bg-[#3f2a52] hover:bg-[#beaed8] text-white text-xs font-bold rounded-xl shadow-md transition-all duration-300">Guardar Cambios</button>
      </div>


  </div>
</template>