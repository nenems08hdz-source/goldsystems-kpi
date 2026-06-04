<script setup>
import { ref, getCurrentInstance } from 'vue'
import plantillatabla from '../components/plantillatabla.vue'
import ModalConfirmacion from '../components/ModalConfirmacion.vue'

const { proxy } = getCurrentInstance()

// Estados para contraseña
const editandoPassword = ref(false)
const passwordForm = ref({
    actual: '',
    nueva: '',
    confirmar: ''
});

// Otros estados
const is2FAEnabled = ref(false)
const toggle2FA = () => { is2FAEnabled.value = !is2FAEnabled.value }

const sesiones = ref([
    { id: 1, dispositivo: 'MacBook Pro 16', ubicacion: 'CDMX, MX', tiempo: 'Ahora' },
    { id: 2, dispositivo: 'Hp', ubicacion: 'Veracruz', tiempo: 'Hace 15 hrs' },
    { id: 3, dispositivo: 'Lenovo', ubicacion: 'Oaxaca', tiempo: 'Hace 12 hrs' },
])
const encabezadosSesiones = ['Dispositivo', 'Ubicación', 'Tiempo', 'Acción']

const cerrarSesion = (id) => { sesiones.value = sesiones.value.filter(s => s.id !== id) }

const registrosActividad = ref([
    { id: 1, accion: 'Login exitoso', detalle: 'macOS (192.168.1.45)', hora: '14:22' },
    { id: 2, accion: '2FA completada', detalle: 'SMS verificado', hora: '14:21' },
    { id: 3, accion: 'Nueva clave', detalle: 'Contraseña actualizada', hora: 'Nov 28' }
])
const encabezadosActividad = ['Acción', 'Detalle', 'Hora', 'Acción']

const eliminarRegistro = (id) => {
    registrosActividad.value = registrosActividad.value.filter(r => r.id !== id)
}

const guardarPassword = () => {
    if (!passwordForm.value.actual || !passwordForm.value.nueva) {
        proxy.$notify.error('Todos los campos son obligatorios', 'Error');
        return;
    }
    if (passwordForm.value.nueva !== passwordForm.value.confirmar) {
        proxy.$notify.error('Las nuevas contraseñas no coinciden', 'Error');
        return;
    }
    
    proxy.$notify.success('Contraseña actualizada correctamente', 'Éxito');
    passwordForm.value = { actual: '', nueva: '', confirmar: '' };
    editandoPassword.value = false;
};

const guardarcambios = () => {
    proxy.$notify.success('Los cambios han sido guardados correctamente', 'Éxito');
}
</script>

<template>
  <div class="w-full bg-white text-[#3f2a52] px-8 min-h-screen flex flex-col pb-10">
    
    <header class="mb-8 mt-6">
      <h1 class="text-3xl font-bold tracking-tight mb-1">Configuración de Seguridad</h1>
    </header>
    
    <section class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
      <h2 class="text-lg font-bold text-[#3f2a52] mb-4 flex items-center gap-2">
        <i class="fi fi-sr-lock"></i> Autenticación
      </h2>

      <div class="flex justify-between items-center bg-gray-50 p-4 rounded-xl mb-4">
        <div>
          <p class="text-sm font-bold">Doble Factor (2FA)</p>
          <p class="text-xs text-gray-500">Protección extra para tu cuenta</p>
        </div>
        <button @click="editandoPassword = !editandoPassword" 
                class="text-xs font-bold text-[#3f2a52] bg-white px-4 py-2 rounded-lg border border-gray-200 hover:bg-[#beaed8] transition-all">
          {{ editandoPassword ? 'Cancelar edición' : 'Cambiar contraseña' }}
        </button>
      </div>

      <div v-if="editandoPassword" class="space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-6">
        <h4 class="text-xs font-bold text-gray-700 uppercase tracking-wider">Cambiar Contraseña</h4>
        
        <div class="flex flex-col gap-1.5">
          <label class="text-[10px] font-bold text-gray-500">CONTRASEÑA ACTUAL</label>
          <input type="password" v-model="passwordForm.actual" class="w-full p-2.5 text-xs rounded-xl border border-gray-200 outline-none focus:border-[#77a9d4]" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-[10px] font-bold text-gray-500">NUEVA CONTRASEÑA</label>
          <input type="password" v-model="passwordForm.nueva" class="w-full p-2.5 text-xs rounded-xl border border-gray-200 outline-none focus:border-[#77a9d4]" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-[10px] font-bold text-gray-500">CONFIRMAR NUEVA CONTRASEÑA</label>
          <input type="password" v-model="passwordForm.confirmar" class="w-full p-2.5 text-xs rounded-xl border border-gray-200 outline-none focus:border-[#77a9d4]" />
        </div>

        <button @click="guardarPassword" class="w-full text-xs font-bold text-white bg-[#3f2a52] py-2.5 rounded-xl hover:bg-[#77a9d4] transition-all">
          Actualizar Contraseña
        </button>
      </div>
    </section>

    <section class="mb-6">
      <plantillatabla titulo="Sesiones Activas" :encabezados="encabezadosSesiones" :datos="sesiones" icon="fi-sr-computer-speaker">
        <template #default="{ fila }">
          <td class="p-4"><p class="text-sm font-bold text-[#3f2a52]">{{ fila.dispositivo }}</p></td>
          <td class="p-4 text-xs text-gray-500">{{ fila.ubicacion }}</td>
          <td class="p-4 text-xs font-bold text-gray-600">{{ fila.tiempo }}</td>
          <td class="p-4">
            <button @click="cerrarSesion(fila.id)" class="px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase bg-[#3f2a52] text-white hover:bg-[#beaed8]">Cerrar</button>
          </td>
        </template>
      </plantillatabla>
    </section>

    <section>
      <plantillatabla titulo="Actividad" :encabezados="encabezadosActividad" :datos="registrosActividad" icon="fi-sr-clock-three">
        <template #default="{ fila }">
          <td class="p-4"><p class="text-sm font-bold text-gray-700">{{ fila.accion }}</p></td>
          <td class="p-4 text-xs text-gray-500">{{ fila.detalle }}</td>
          <td class="p-4 text-xs font-bold text-gray-600">{{ fila.hora }}</td>
          <td class="p-4">
            <button @click="eliminarRegistro(fila.id)" class="px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase bg-[#3f2a52] text-white hover:bg-[#beaed8]">Eliminar</button>
          </td>
        </template>
      </plantillatabla>
    </section>

    <div class="p-6 border-t border-gray-100 flex justify-end gap-3 mt-6">
      <button class="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-black text-xs font-bold rounded-xl transition-colors">Cancelar</button>
      <button @click="guardarcambios" class="px-6 py-2.5 bg-[#3f2a52] hover:bg-[#beaed8] text-white text-xs font-bold rounded-xl shadow-md transition-all">Guardar Cambios</button>
    </div>
  </div>
</template>