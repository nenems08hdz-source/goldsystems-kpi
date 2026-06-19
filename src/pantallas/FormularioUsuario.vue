<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentInstance } from 'vue'
import { useOrgStore } from '../stores/orgStore'
import EncabezadoPantalla from '@/components/EncabezadoPantalla.vue'
import AppButton  from '@/components/ui/AppButton.vue'
import AppInput   from '@/components/ui/AppInput.vue'
import AppSelect  from '@/components/ui/AppSelect.vue'
import FormField  from '@/components/ui/FormField.vue'

const router = useRouter()
const store  = useOrgStore()
const { proxy } = getCurrentInstance()

const nuevoUsuario = ref({
  nombre:          '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  email:           '',
  telefono:        '',
  rol:             '',
  departamento_id: null,
  equipo_id:       null,
})

const departamentosDisponibles = store.estructuraOrganizacional
  .filter(n => n.tipo === 'departamento')
  .map(d => ({ value: d.id, label: d.nombre }))

const equiposDisponibles = store.estructuraOrganizacional
  .filter(n => n.tipo === 'equipo')
  .map(e => ({ value: e.id, label: e.nombre }))

const rolesAsignables = store.rolesDisponibles
  .filter(r => r.eliminable)
  .map(r => ({ value: r.codigo, label: `${r.nombre} — ${r.descripcion}` }))

function guardarUsuario() {
  const usuarioNuevo = {
    id:              store.usuarios.length + 1,
    nombre:          nuevoUsuario.value.nombre,
    apellidoPaterno: nuevoUsuario.value.apellidoPaterno,
    apellidoMaterno: nuevoUsuario.value.apellidoMaterno,
    email:           nuevoUsuario.value.email,
    telefono:        nuevoUsuario.value.telefono || null,
    rol:             nuevoUsuario.value.rol,
    departamento_id: nuevoUsuario.value.departamento_id
      ? Number(nuevoUsuario.value.departamento_id) : null,
    equipo_id: nuevoUsuario.value.equipo_id
      ? Number(nuevoUsuario.value.equipo_id) : null,
    kpis:       0,
    estado:     'activo',
    ultimoLogin: null,
  }

  store.usuarios.push(usuarioNuevo)
  proxy.$notify.success('Colaborador registrado correctamente', 'Éxito')
  router.push('/ControlOrganizacional')
}
</script>

<template>
  <div class="p-6 min-h-screen">

    <div class="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
      <EncabezadoPantalla
        titulo="Registrar Nuevo Colaborador"
        descripcion="Añade un miembro a la estructura organizativa y asigna su rol."
      />
      <AppButton variant="secondary" class="flex-shrink-0" @click="router.push('/ControlOrganizacional')">
        ← Volver
      </AppButton>
    </div>

    <form
      @submit.prevent="guardarUsuario"
      class="w-full max-w-5xl rounded-xl shadow-md border overflow-hidden"
      style="background: var(--card-bg); border-color: rgba(190,174,216,0.9);"
    >

      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 p-8">

        <FormField label="Nombre" required>
          <AppInput v-model="nuevoUsuario.nombre" placeholder="Ej. Juan" required />
        </FormField>

        <FormField label="Apellido Paterno" required>
          <AppInput v-model="nuevoUsuario.apellidoPaterno" placeholder="Ej. Pérez" required />
        </FormField>

        <FormField label="Apellido Materno" hint="opcional">
          <AppInput v-model="nuevoUsuario.apellidoMaterno" placeholder="Ej. García" />
        </FormField>

        <FormField label="Correo Corporativo" required>
          <AppInput
            v-model="nuevoUsuario.email"
            type="email"
            placeholder="juan.perez@empresa.com"
            required
          />
        </FormField>

        <FormField label="Teléfono" hint="opcional">
          <AppInput
            v-model="nuevoUsuario.telefono"
            type="tel"
            placeholder="+52 999 000 0000"
          />
        </FormField>

        <FormField label="Rol" required>
          <AppSelect
            v-model="nuevoUsuario.rol"
            :options="rolesAsignables"
            placeholder="Selecciona un rol"
            required
          />
        </FormField>

        <FormField label="Departamento">
          <AppSelect
            v-model="nuevoUsuario.departamento_id"
            :options="[{ value: null, label: 'Sin departamento' }, ...departamentosDisponibles]"
            placeholder="Sin departamento"
          />
        </FormField>

        <FormField label="Equipo">
          <AppSelect
            v-model="nuevoUsuario.equipo_id"
            :options="[{ value: null, label: 'Sin equipo' }, ...equiposDisponibles]"
            placeholder="Sin equipo"
          />
        </FormField>

      </div>

      <div
        class="px-8 py-6 border-t flex justify-end gap-3"
        style="background: var(--tabla-header-bg); border-color: rgba(190,174,216,0.2);"
      >
        <AppButton variant="secondary" @click="router.push('/ControlOrganizacional')">
          Cancelar
        </AppButton>
        <AppButton type="submit">
          Guardar Colaborador
        </AppButton>
      </div>

    </form>
  </div>
</template>
