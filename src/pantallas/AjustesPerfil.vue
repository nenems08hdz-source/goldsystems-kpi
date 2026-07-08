<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import EncabezadoPantalla from '../components/EncabezadoPantalla.vue'
import AppButton          from '../components/ui/AppButton.vue'
import { useAuthStore }   from '../stores/authStore'

const auth      = useAuthStore()
const { proxy } = getCurrentInstance()

const usuario = ref({
  nombre:          '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  correo:          '',
  cargo:           '',
  telefono:        ''
})

const fotoUrl = ref( //variable reactiva que guarda la URL de la foto del usuario
  auth.user?.profile_photo  //el ?. es el operador de encadenamiento opcional, 
    ? `http://127.0.0.1:8000/storage/${auth.user.profile_photo}`  //significa "si auth.user existe, dame profile_photo, si no, no explotes"
    : null
)

const alertasConfig = ref([
  { id: 'kpi',     nombre: 'Alertas de KPI (Crítico)',             email: true,  push: true  },
  { id: 'sistema', nombre: 'Estado del Sistema / Infraestructura', email: true,  push: false },
  { id: 'resumen', nombre: 'Resúmenes Semanales',                  email: false, push: false },
])

onMounted(() => {  //todo lo de adentro se ejecuta automáticamente cuando la pantalla termina de cargar
  const u = auth.user
  if (u) {
    usuario.value.nombre          = u.name     || ''
    usuario.value.apellidoPaterno = u.paternal || ''
    usuario.value.apellidoMaterno = u.maternal || ''
    usuario.value.correo          = u.email    || ''
    usuario.value.cargo           = auth.role  || ''
    usuario.value.telefono        = u.phone    || ''
  }

  const preferencias = localStorage.getItem('preferencias_notificaciones')  //recupera las preferencias de notificación que el usuario guardó anteriormente
  if (preferencias) {
    alertasConfig.value = JSON.parse(preferencias)  //convierte el texto del localStorage de vuelta a un objeto JavaScript que Vue pueda usar
  }
})

const guardarPerfil = async () => { //"async" indica que la función tiene operaciones que tardan, como llamar a la API
  try {  //intenta ejecutar el codigo si hay un error inesperado
    const res = await fetch('http://127.0.0.1:8000/api/me', {
      method:  'PUT',  //llama al endpoint que actualiza el perfil
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify({ //convierte los datos del formulario a texto JSON para enviarlos
        name:     usuario.value.nombre,
        paternal: usuario.value.apellidoPaterno,
        maternal: usuario.value.apellidoMaterno,
        email:    usuario.value.correo,
        phone:    usuario.value.telefono,
      })
    })

    const data = await res.json() //convierte la respuesta del backend a un objeto JavaScript

    if (!res.ok) {
      proxy.$notify.error(data.message || 'Error al guardar', 'Error')
      return
    }

    auth.setUserData(data.user, data.role, auth.permisos) // actualiza user/role en memoria sin tocar localStorage
    proxy.$notify.success('Perfil actualizado correctamente', 'Éxito')

  } catch (e) {
    proxy.$notify.error('Error de conexión', 'Error')
  }
}

const subirFoto = async (event) => {
  const archivo = event.target.files[0]
  if (!archivo) return //si el usuario abrió el selector pero no eligió nada, no hace nada

  const formData = new FormData() //crea un objeto especial para enviar archivos
  formData.append('photo', archivo)

  const res = await fetch('http://127.0.0.1:8000/api/me/photo', {
    method:  'POST',
    headers: { 'Authorization': `Bearer ${auth.token}` },
    body:    formData
  })

  const data = await res.json()

  if (!res.ok) {
    proxy.$notify.error(data.message || 'Error al subir foto', 'Error')
    return
  }

  auth.setAuth(auth.token, data.user, data.role) //actualiza el store con el usuario que ya tiene profile_photo guardado
  fotoUrl.value = `http://127.0.0.1:8000/storage/${data.user.profile_photo}` //actualiza la URL de la foto inmediatamente para que se refleje en pantalla sin recargar
  proxy.$notify.success('Foto actualizada correctamente', 'Éxito')
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
            <input v-model="usuario.cargo" type="text" placeholder="Ej. Lead Technical Architect" class="app-input" />
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
        <AppButton variant="secondary">Cancelar</AppButton>
        <AppButton variant="primary" @click="guardarPreferencias">Guardar Cambios</AppButton>
      </div>
    </div>

  </div>
</template>
