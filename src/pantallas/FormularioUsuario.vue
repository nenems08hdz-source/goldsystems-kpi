<script setup>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'
import { useOrgStore } from '../stores/orgStore'
import EncabezadoPantalla from '@/components/EncabezadoPantalla.vue'
import AppButton          from '@/components/ui/AppButton.vue'
import AppInput           from '@/components/ui/AppInput.vue'
import AppSelect          from '@/components/ui/AppSelect.vue'
import FormField          from '@/components/ui/FormField.vue'

const router = useRouter()
const store  = useOrgStore()
const { proxy } = getCurrentInstance()

const nuevoUsuario = ref({
  name:          '',
  paternal:      '',
  maternal:      '',
  email:         '',
  password:      '',
  phone:         '',
  role:          '',
  department_id: null,
  team_id:       null,
})

const departamentosDisponibles = computed(() =>
  store.departamentos.map(d => ({ value: d.id, label: d.name }))
)

const equiposDisponibles = computed(() => {
  if (!nuevoUsuario.value.department_id) return []
  return store.equipos
    .filter(e => e.department_id === Number(nuevoUsuario.value.department_id))
    .map(e => ({ value: e.id, label: e.name }))
})

const rolesAsignables = computed(() =>
  store.rolesDisponibles
    .filter(r => r.codigo !== 'developer')
    .map(r => ({ value: r.codigo, label: r.nombre }))
)

onMounted(() => {
  store.cargarTodo()
})

async function guardarUsuario() {
  try {
    const res = await api.post('/users', {
      name:          nuevoUsuario.value.name,
      paternal:      nuevoUsuario.value.paternal,
      maternal:      nuevoUsuario.value.maternal || null,
      email:         nuevoUsuario.value.email,
      password:      nuevoUsuario.value.password,
      phone:         nuevoUsuario.value.phone || null,
      company_id:    store.empresaActiva?.id,
      department_id: nuevoUsuario.value.department_id || null,
      team_id:       nuevoUsuario.value.team_id || null,
      role:          nuevoUsuario.value.role || null,
    })
    store.usuarios.push(res.data)
    proxy.$notify.success('Colaborador registrado correctamente', 'Éxito')
    router.push('/ControlOrganizacional')
  } catch {
    proxy.$notify.error('Error al registrar colaborador', 'Error')
  }
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
      <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">

        <FormField label="Nombre" required>
          <AppInput v-model="nuevoUsuario.name" placeholder="Ej. Juan" required />
        </FormField>

        <FormField label="Apellido Paterno" required>
          <AppInput v-model="nuevoUsuario.paternal" placeholder="Ej. Pérez" required />
        </FormField>

        <FormField label="Apellido Materno" hint="opcional">
          <AppInput v-model="nuevoUsuario.maternal" placeholder="Ej. García" />
        </FormField>

        <FormField label="Correo Corporativo" required>
          <AppInput v-model="nuevoUsuario.email" type="email" placeholder="juan.perez@empresa.com" required />
        </FormField>

        <FormField label="Teléfono" hint="opcional">
          <AppInput v-model="nuevoUsuario.phone" type="tel" placeholder="+52 999 000 0000" autocomplete="off" />
        </FormField>

        <FormField label="Contraseña" required>
          <AppInput v-model="nuevoUsuario.password" type="password" placeholder="Mínimo 8 caracteres" autocomplete="new-password" required />
        </FormField>

        <FormField label="Rol" required>
          <AppSelect v-model="nuevoUsuario.role" :options="rolesAsignables" placeholder="Selecciona un rol" required />
        </FormField>

        <FormField label="Departamento">
          <AppSelect
            v-model="nuevoUsuario.department_id"
            :options="[{ value: null, label: 'Sin departamento' }, ...departamentosDisponibles]"
            placeholder="Sin departamento"
            @change="nuevoUsuario.team_id = null"
          />
        </FormField>

        <FormField label="Equipo">
          <AppSelect
            v-model="nuevoUsuario.team_id"
            :options="[{ value: null, label: 'Sin equipo' }, ...equiposDisponibles]"
            :placeholder="nuevoUsuario.department_id ? 'Sin equipo' : 'Selecciona departamento primero'"
            :disabled="!nuevoUsuario.department_id"
          />
        </FormField>

      </div>

      <div
        class="px-8 py-6 border-t flex justify-end gap-3"
        style="background: var(--tabla-header-bg); border-color: rgba(190,174,216,0.2);"
      >
        <AppButton variant="secondary" type="button" @click="router.push('/ControlOrganizacional')">
          Cancelar
        </AppButton>
        <AppButton type="submit">Guardar Colaborador</AppButton>
      </div>
    </form>
  </div>
</template>
