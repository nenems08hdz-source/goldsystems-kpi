<script setup>
import { ref, onMounted, watch, getCurrentInstance } from 'vue'
import EncabezadoPantalla from '../components/EncabezadoPantalla.vue'
import AppButton from '../components/ui/AppButton.vue'
import { useAuthStore } from '../stores/authStore'
import api from '../services/api'

const auth = useAuthStore()
const { proxy } = getCurrentInstance()

const usuario = ref({
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  correo: '',
  cargo: '',
  telefono: ''
})

const fotoUrl = ref(auth.user?.profile_photo_url)

const alertasConfig = ref([
  { id: 'kpi', nombre: 'Alertas de KPI (Crítico)', email: true, push: true },
  { id: 'sistema', nombre: 'Estado del Sistema / Infraestructura', email: true, push: false },
  { id: 'resumen', nombre: 'Resúmenes Semanales', email: false, push: false },
])

onMounted(() => {
  const u = auth.user
  if (u) {
    usuario.value.nombre = u.name || ''
    usuario.value.apellidoPaterno = u.paternal || ''
    usuario.value.apellidoMaterno = u.maternal || ''
    usuario.value.correo = u.email || ''
    usuario.value.cargo = traducirRol(auth.role)
    usuario.value.telefono = u.phone || ''
  }

  const preferencias = localStorage.getItem('preferencias_notificaciones')
  if (preferencias) {
    alertasConfig.value = JSON.parse(preferencias)
  }
})

const rolesEspanol = {
  developer: 'Desarrollador',
  admin: 'Administrador',
  manager: 'Gerente',
  employee: 'Empleado',
}

function traducirRol(rol) {
  return rolesEspanol[rol] ?? rol ?? 'Sin rol asignado'
}

watch(() => auth.role, (nuevoRol) => {
  usuario.value.cargo = traducirRol(nuevoRol)
})

const guardarPerfil = async () => {
  try {
    const res = await api.put('/me', {
      name: usuario.value.nombre,
      paternal: usuario.value.apellidoPaterno,
      maternal: usuario.value.apellidoMaterno,
      email: usuario.value.correo,
      phone: usuario.value.telefono,
    })

    auth.setUserData(res.data.user, res.data.role, auth.permisos)
    proxy.$notify.success('Perfil actualizado correctamente', 'Éxito')

  } catch (e) {
    proxy.$notify.error(e.response?.data?.message || 'Error de conexión', 'Error')
  }
}

const subirFoto = async (event) => {
  const archivo = event.target.files[0]
  if (!archivo) return

  const formData = new FormData()
  formData.append('photo', archivo)

  try {
    const res = await api.post('/me/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    auth.user = res.data.user
    fotoUrl.value = res.data.user.profile_photo_url
    proxy.$notify.success('Foto actualizada correctamente', 'Éxito')

  } catch (error) {
    proxy.$notify.error(error.response?.data?.message || 'Error al subir foto', 'Error')
  }
}

const guardarPreferencias = () => {
  localStorage.setItem('preferencias_notificaciones', JSON.stringify(alertasConfig.value))
  proxy.$notify.success('Preferencias guardadas correctamente', 'Éxito')
}
</script>

<template>
  <div class="w-full px-8 min-h-screen flex flex-col" style="background-color: var(--layout-bg); transition: background-color 300ms ease;">

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
          <div class="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold relative overflow-hidden"
            style="background: var(--sidebar-active-bg); color: var(--sidebar-active-text); border: 2px solid var(--tabla-borde);">
            
            <img v-if="fotoUrl" :src="fotoUrl" class="w-full h-full object-cover" />
            <span v-else>
              {{ (auth.user?.name?.charAt(0) || '') + (auth.user?.paternal?.charAt(0) || '') }}
            </span>
          </div>

          <label class="absolute -bottom-1 -right-1 p-0.5 px-1.5 rounded-md text-[10px] font-bold cursor-pointer"
            style="background: var(--sidebar-bg); color: #fff; border: 2px solid var(--card-bg);">
            +
            <input type="file" accept="image/*" class="hidden" @change="subirFoto" />
          </label>
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
            <div class="px-3 py-2 rounded-lg text-sm font-medium"
              style="background: var(--tabla-header-bg); color: var(--text-general); border: 1px solid var(--tabla-borde);">
              {{ usuario.cargo || 'Sin rol asignado' }}
            </div>
            <p class="text-[8px]" style="color: var(--card-text-hint);">Este campo es administrado por un administrador. Cambios se reflejarán automáticamente.</p>
          </div>
          
          <div class="flex flex-col gap-1.5">
            <label class="text-[9px] font-black uppercase tracking-wider" style="color: var(--subtext-general);">Teléfono</label>
            <input v-model="usuario.telefono" type="text" placeholder="Ej. 991..." class="app-input" />
          </div>
        </div>
      </div>

      <div class="p-6 border-t flex justify-end gap-3" style="border-color: var(--tabla-borde);">
        <AppButton variant="secondary">Cancelar</AppButton>
        <AppButton variant="primary" @click="guardarPerfil">Guardar Cambios</AppButton>
      </div>
    </div>
  </div>
</template>