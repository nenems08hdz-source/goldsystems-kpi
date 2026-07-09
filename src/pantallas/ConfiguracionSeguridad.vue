<script setup>
import { ref, getCurrentInstance } from 'vue'
import plantillatabla     from '../components/PlantillaTabla.vue'
import ModalConfirmacion  from '../components/ModalConfirmacion.vue'
import EncabezadoPantalla from '../components/EncabezadoPantalla.vue'
import AppButton          from '../components/ui/AppButton.vue'
import { useAuthStore } from '../stores/authStore'

const auth = useAuthStore()
const { proxy } = getCurrentInstance()
const editandoPassword = ref(false)
const passwordForm = ref({ actual: '', nueva: '', confirmar: '' })

const verActual    = ref(false)
const verNueva     = ref(false)
const verConfirmar = ref(false)

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

const guardarPassword = async () => {
  if (!passwordForm.value.actual || !passwordForm.value.nueva) {
    proxy.$notify.error('Todos los campos son obligatorios', 'Error')
    return
  }
  if (passwordForm.value.nueva !== passwordForm.value.confirmar) {
    proxy.$notify.error('Las nuevas contraseñas no coinciden', 'Error')
    return
  }

  if (passwordForm.value.nueva === passwordForm.value.actual) {
  proxy.$notify.error('La nueva contraseña debe ser diferente a la actual', 'Error')
  return
}

  const res = await fetch('http://127.0.0.1:8000/api/me/password', {
    method:  'PUT',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${auth.token}`
    },
    body: JSON.stringify({
      actual:    passwordForm.value.actual,
      nueva:     passwordForm.value.nueva,
      confirmar: passwordForm.value.confirmar,
    })
  })

  const data = await res.json()

  if (!res.ok) {
    proxy.$notify.error(data.message || 'Error al actualizar', 'Error')
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
  <div class="w-full px-8 min-h-screen flex flex-col pb-10" style="background-color: var(--layout-bg); transition: background-color 300ms ease;">

    <header class="mb-8 mt-6">
      <EncabezadoPantalla
        titulo="Configuración de Seguridad"
        descripcion="Gestiona tu contraseña, sesiones activas y registro de actividad."
      />
    </header>

    <section class="p-6 rounded-2xl mb-6"
      style="background: var(--card-bg); border: 1px solid var(--tabla-borde); box-shadow: var(--card-shadow);">
      <h2 class="text-lg font-bold mb-4 flex items-center gap-2" style="color: var(--text-general);">
        <i class="fi fi-sr-lock"></i> Autenticación
      </h2>

      <div class="flex flex-col gap-3 p-4 rounded-xl mb-4"
        style="background: var(--tabla-header-bg); border: 1px solid var(--tabla-borde);">
        <div>
          <p class="text-sm font-bold" style="color: var(--text-general);">Contraseña</p>
          <p class="text-xs" style="color: var(--subtext-general);">Cambio de Contraseña</p>
        </div>
        <div>
          <AppButton variant="secondary" @click="editandoPassword = !editandoPassword">
            {{ editandoPassword ? 'Cancelar edición' : 'Cambiar contraseña' }}
          </AppButton>
        </div>
      </div>

      <div v-if="editandoPassword" class="space-y-4 p-6 rounded-2xl mb-6"
        style="background: var(--tabla-header-bg); border: 1px solid var(--tabla-borde);">
        <h4 class="text-xs font-bold uppercase tracking-wider" style="color: var(--tabla-header-text);">Cambiar Contraseña</h4>

        <div class="flex flex-col gap-1.5">
          <label class="text-[10px] font-bold uppercase tracking-wider" style="color: var(--subtext-general);">Contraseña Actual</label>
          <div class="relative">
            <input :type="verActual ? 'text' : 'password'" v-model="passwordForm.actual" class="app-input pr-10" />
            <span @click="verActual = !verActual" class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" style="color: var(--subtext-general);">
              <i :class="verActual ? 'fi fi-sr-eye-crossed' : 'fi fi-sr-eye'"></i>
            </span>
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-[10px] font-bold uppercase tracking-wider" style="color: var(--subtext-general);">Nueva Contraseña</label>
          <div class="relative">
            <input :type="verNueva ? 'text' : 'password'" v-model="passwordForm.nueva" class="app-input pr-10" />
            <span @click="verNueva = !verNueva" class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" style="color: var(--subtext-general);">
              <i :class="verNueva ? 'fi fi-sr-eye-crossed' : 'fi fi-sr-eye'"></i>
            </span>
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-[10px] font-bold uppercase tracking-wider" style="color: var(--subtext-general);">Confirmar Nueva Contraseña</label>
          <div class="relative">
            <input :type="verConfirmar ? 'text' : 'password'" v-model="passwordForm.confirmar" class="app-input pr-10" />
            <span @click="verConfirmar = !verConfirmar" class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" style="color: var(--subtext-general);">
              <i :class="verConfirmar ? 'fi fi-sr-eye-crossed' : 'fi fi-sr-eye'"></i>
            </span>
          </div>
        </div>

        <AppButton variant="primary" @click="guardarPassword">Actualizar Contraseña</AppButton>
      </div>
    </section>

    <section class="mb-6">
      <plantillatabla titulo="Sesiones Activas" :encabezados="encabezadosSesiones" :datos="sesiones" icon="fi-sr-computer-speaker">
        <template #default="{ fila }">
          <td class="p-4"><p class="text-sm font-bold" style="color: var(--text-general);">{{ fila.dispositivo }}</p></td>
          <td class="p-4 text-xs" style="color: var(--text-general);">{{ fila.ubicacion }}</td>
          <td class="p-4 text-xs font-bold" style="color: var(--text-general);">{{ fila.tiempo }}</td>
          <td class="p-4">
            <AppButton variant="primary" size="sm" @click="confirmarEliminacion(fila.id, 'sesion')">Cerrar</AppButton>
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
            <AppButton variant="primary" size="sm" @click="confirmarEliminacion(fila.id, 'actividad')">Eliminar</AppButton>
          </td>
        </template>
      </plantillatabla>
    </section>

    <div class="flex justify-end gap-3 mt-6 pb-6">
      <AppButton variant="secondary">Cancelar</AppButton>
      <AppButton variant="primary" @click="guardarcambios">Guardar Cambios</AppButton>
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