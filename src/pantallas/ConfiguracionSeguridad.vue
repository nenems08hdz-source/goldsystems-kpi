<script setup>
import { ref, getCurrentInstance } from 'vue'
import plantillatabla from '../components/PlantillaTabla.vue'
import ModalConfirmacion from '../components/ModalConfirmacion.vue'
import EncabezadoPantalla from '../components/EncabezadoPantalla.vue'

const { proxy } = getCurrentInstance()

const editandoPassword = ref(false)
const passwordForm = ref({ actual: '', nueva: '', confirmar: '' })

const sesiones = ref([
  { id: 1, dispositivo: 'MacBook Pro 16', ubicacion: 'CDMX, MX',   tiempo: 'Ahora'      },
  { id: 2, dispositivo: 'Hp',             ubicacion: 'Veracruz',    tiempo: 'Hace 15 hrs' },
  { id: 3, dispositivo: 'Lenovo',         ubicacion: 'Oaxaca',      tiempo: 'Hace 12 hrs' },
])
const encabezadosSesiones = ['Dispositivo', 'Ubicación', 'Tiempo', 'Acción']

const registrosActividad = ref([
  { id: 1, accion: 'Login exitoso',  detalle: 'macOS (192.168.1.45)',  hora: '14:22'  },
  { id: 2, accion: '2FA completada', detalle: 'SMS verificado',        hora: '14:21'  },
  { id: 3, accion: 'Nueva clave',    detalle: 'Contraseña actualizada', hora: 'Nov 28' },
])
const encabezadosActividad = ['Acción', 'Detalle', 'Hora', 'Acción']

const cerrarSesion      = (id) => { sesiones.value = sesiones.value.filter(s => s.id !== id) }
const eliminarRegistro  = (id) => { registrosActividad.value = registrosActividad.value.filter(r => r.id !== id) }

const guardarPassword = () => {
  if (!passwordForm.value.actual || !passwordForm.value.nueva) {
    proxy.$notify.error('Todos los campos son obligatorios', 'Error')
    return
  }
  if (passwordForm.value.nueva !== passwordForm.value.confirmar) {
    proxy.$notify.error('Las nuevas contraseñas no coinciden', 'Error')
    return
  }
  proxy.$notify.success('Contraseña actualizada correctamente', 'Éxito')
  passwordForm.value = { actual: '', nueva: '', confirmar: '' }
  editandoPassword.value = false
}

const guardarcambios = () => {
  proxy.$notify.success('Los cambios han sido guardados correctamente', 'Éxito')
}

const showModal    = ref(false)
const idAEliminar  = ref(null)
const tipoEliminar = ref('')

function confirmarEliminacion(id, tipo) {
  idAEliminar.value  = id
  tipoEliminar.value = tipo
  showModal.value    = true
}

function ejecutarEliminacion() {
  if (tipoEliminar.value === 'sesion') {
    const index = sesiones.value.findIndex(s => s.id === idAEliminar.value)
    if (index !== -1) {
      sesiones.value.splice(index, 1)
      proxy.$notify.success('Sesión cerrada correctamente', 'Éxito')
    }
  } else {
    const index = registrosActividad.value.findIndex(r => r.id === idAEliminar.value)
    if (index !== -1) {
      registrosActividad.value.splice(index, 1)
      proxy.$notify.success('Registro eliminado correctamente', 'Éxito')
    }
  }
  idAEliminar.value  = null
  tipoEliminar.value = ''
  showModal.value    = false
}
</script>

<template>
  <div class="w-full px-8 min-h-screen flex flex-col pb-10" style="background-color: var(--layout-bg);">

    <header class="mb-8 mt-6">
      <EncabezadoPantalla
        titulo="Configuración de Seguridad"
        descripcion="Gestiona tu contraseña, sesiones activas y registro de actividad."
      />
    </header>

    <section class="p-6 rounded-2xl mb-6"
      style="background: var(--card-bg); border: 1px solid var(--tabla-borde);">
      <h2 class="text-lg font-bold mb-4 flex items-center gap-2" style="color: var(--text-general);">
        <i class="fi fi-sr-lock"></i> Autenticación
      </h2>

      <div class="flex justify-between items-center p-4 rounded-xl mb-4"
        style="background: var(--tabla-header-bg); border: 1px solid var(--tabla-borde);">
        <div>
          <p class="text-sm font-bold" style="color: var(--text-general);">Doble Factor (2FA)</p>
          <p class="text-xs" style="color: var(--subtext-general);">Protección extra para tu cuenta</p>
        </div>
        <button @click="editandoPassword = !editandoPassword"
          class="text-xs font-bold px-4 py-2 rounded-lg transition-all"
          style="background: var(--card-bg); border: 1px solid var(--tabla-borde); color: var(--text-general);"
          @mouseover="$event.currentTarget.style.background='var(--tabla-hover)'"
          @mouseleave="$event.currentTarget.style.background='var(--card-bg)'"
        >{{ editandoPassword ? 'Cancelar edición' : 'Cambiar contraseña' }}</button>
      </div>

      <div v-if="editandoPassword" class="space-y-4 p-6 rounded-2xl mb-6"
        style="background: var(--tabla-header-bg); border: 1px solid var(--tabla-borde);">
        <h4 class="text-xs font-bold uppercase tracking-wider" style="color: var(--tabla-header-text);">Cambiar Contraseña</h4>

        <div class="flex flex-col gap-1.5">
          <label class="text-[10px] font-bold uppercase tracking-wider" style="color: var(--subtext-general);">Contraseña Actual</label>
          <input type="password" v-model="passwordForm.actual" class="app-input" />
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-[10px] font-bold uppercase tracking-wider" style="color: var(--subtext-general);">Nueva Contraseña</label>
          <input type="password" v-model="passwordForm.nueva" class="app-input" />
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-[10px] font-bold uppercase tracking-wider" style="color: var(--subtext-general);">Confirmar Nueva Contraseña</label>
          <input type="password" v-model="passwordForm.confirmar" class="app-input" />
        </div>

        <button @click="guardarPassword"
          class="px-5 py-2 text-xs font-bold rounded-lg transition-all"
          style="background: var(--sidebar-active-bg); color: var(--sidebar-active-text);"
          @mouseover="$event.currentTarget.style.opacity='0.85'"
          @mouseleave="$event.currentTarget.style.opacity='1'"
        >Actualizar Contraseña</button>
      </div>
    </section>

    <section class="mb-6">
      <plantillatabla titulo="Sesiones Activas" :encabezados="encabezadosSesiones" :datos="sesiones" icon="fi-sr-computer-speaker">
        <template #default="{ fila }">
          <td class="p-4"><p class="text-sm font-bold" style="color: var(--text-general);">{{ fila.dispositivo }}</p></td>
          <td class="p-4 text-xs" style="color: var(--text-general);">{{ fila.ubicacion }}</td>
          <td class="p-4 text-xs font-bold" style="color: var(--text-general);">{{ fila.tiempo }}</td>
          <td class="p-4">
            <button @click="confirmarEliminacion(fila.id, 'sesion')"
              class="px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all"
              style="background: var(--sidebar-active-bg); color: var(--sidebar-active-text);"
              @mouseover="$event.currentTarget.style.opacity='0.8'"
              @mouseleave="$event.currentTarget.style.opacity='1'"
            >Cerrar</button>
          </td>
        </template>
      </plantillatabla>
    </section>

    <section>
      <plantillatabla titulo="Actividad" :encabezados="encabezadosActividad" :datos="registrosActividad" icon="fi-sr-clock-three">
        <template #default="{ fila }">
          <td class="p-4"><p class="text-sm font-bold" style="color: var(--text-general);">{{ fila.accion }}</p></td>
          <td class="p-4 text-xs" style="color: var(--text-general);">{{ fila.detalle }}</td>
          <td class="p-4 text-xs font-bold" style="color: var(--text-general);">{{ fila.hora }}</td>
          <td class="p-4">
            <button @click="confirmarEliminacion(fila.id, 'actividad')"
              class="px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all"
              style="background: #dc2626; color: white;"
              @mouseover="$event.currentTarget.style.background='#b91c1c'"
              @mouseleave="$event.currentTarget.style.background='#dc2626'"
            >Eliminar</button>
          </td>
        </template>
      </plantillatabla>
    </section>

    <div class="flex justify-end gap-3 mt-6 pb-6">
      <button
        class="px-5 py-2.5 text-xs font-bold rounded-xl transition-colors"
        style="background: var(--card-bg); border: 1px solid var(--tabla-borde); color: var(--text-general);"
        @mouseover="$event.currentTarget.style.background='var(--tabla-hover)'"
        @mouseleave="$event.currentTarget.style.background='var(--card-bg)'"
      >Cancelar</button>
      <button @click="guardarcambios"
        class="px-6 py-2.5 text-xs font-bold rounded-xl transition-all"
        style="background: var(--sidebar-active-bg); color: var(--sidebar-active-text);"
        @mouseover="$event.currentTarget.style.opacity='0.85'"
        @mouseleave="$event.currentTarget.style.opacity='1'"
      >Guardar Cambios</button>
    </div>

  </div>

  <ModalConfirmacion
    :isOpen="showModal"
    titulo="¿Desea eliminar?"
    mensaje="Esta acción eliminará el dato de manera permanentemente."
    @confirmar="ejecutarEliminacion"
    @cancelar="showModal = false"
  />
</template>