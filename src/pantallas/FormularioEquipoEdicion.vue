<script setup>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'
import { useOrgStore } from '../stores/orgStore'
import EncabezadoPantalla from '@/components/EncabezadoPantalla.vue'
import AppButton          from '@/components/ui/AppButton.vue'
import AppInput           from '@/components/ui/AppInput.vue'
import AppSelect          from '@/components/ui/AppSelect.vue'
import FormField          from '@/components/ui/FormField.vue'
import FormContenedor from '@/components/ui/FormContenedor.vue'

const router = useRouter()
const route  = useRoute()
const store  = useOrgStore()
const { proxy } = getCurrentInstance()

const equipoId = route.params.id
const cargando = ref(true)
const departamentos = ref([])
const usuariosManageables = ref([])

const form = ref({
  name:          '',
  description:   '',
  leader_id:     null,
  department_id: null,
})

const departamentosDisponibles = computed(() =>
  departamentos.value.map(d => ({ value: d.id, label: d.name }))
)

const usuariosFiltrados = computed(() => {
  if (!store.usuarios || store.usuarios.length === 0) return []
  
  return store.usuarios.filter(u => {
    const roles = u.roles?.map(r => r.name || r) || []
    const rolesString = roles.map(r => String(r).toLowerCase())
    return rolesString.includes('manager') || 
           rolesString.includes('team_leader') || 
           rolesString.includes('admin')
  })
})

onMounted(async () => {
  try {
    // Cargar departamentos y usuarios que el usuario actual puede gestionar
    const [resDepts, resUsuarios] = await Promise.all([
      api.get('/departments'),
      api.get('/users/manageable'),
    ])
    departamentos.value = resDepts.data
    usuariosManageables.value = resUsuarios.data

    // Cargar equipo
    const res = await api.get(`/teams/${equipoId}`)
    const e   = res.data
    form.value = {
      name:          e.name          ?? '',
      description:   e.description   ?? '',
      leader_id:     e.leader_id     ?? null,
      department_id: e.department_id ?? null,
    }
  } catch (e) {
    console.error('Error cargando equipo:', e)
    proxy.$notify.error('No se pudo cargar el equipo', 'Error')
  } finally {
    cargando.value = false
  }
})

async function guardar() {
  try {
    const res = await api.put(`/teams/${equipoId}`, {
      name:          form.value.name,
      description:   form.value.description,
      leader_id:     form.value.leader_id     || null,
      department_id: form.value.department_id || null,
    })
    const idx = store.equipos.findIndex(e => e.id === Number(equipoId))
    if (idx !== -1) store.equipos[idx] = res.data
    proxy.$notify.success('Equipo actualizado correctamente', 'Éxito')
    router.push('/ControlOrganizacional')
  } catch {
    proxy.$notify.error('Error al actualizar el equipo', 'Error')
  }
}
</script>

<template>
  <div class="p-3 min-h-screen">

    <div class="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
      <EncabezadoPantalla
        titulo="Editar Equipo"
        descripcion="Modifica la información del equipo de trabajo."
      />
      <AppButton variant="secondary" class="flex-shrink-0" @click="router.push('/ControlOrganizacional')">
        ← Volver
      </AppButton>
    </div>

    <FormContenedor>
      <div v-if="cargando" class="text-sm" style="color: var(--subtext-general);">Cargando...</div>

      <form v-else
      @submit.prevent="guardar"
      class="w-full rounded-xl shadow-md border overflow-hidden"
      style="background: var(--card-bg); border-color: rgba(190,174,216,0.5);"
    >
      <div class="p-4 border-b" style="background: var(--tabla-header-bg); border-color: rgba(190,174,216,0.3);">
        <h2 class="text-sm font-bold uppercase tracking-wider" style="color: var(--text-general);">
          Información del Equipo
        </h2>
      </div>

      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

        <FormField label="Nombre del Equipo" required>
          <AppInput v-model="form.name" placeholder="Ej. Equipo Backend" required />
        </FormField>

        <FormField label="Líder del Equipo" hint="opcional">
          <select v-model="form.leader_id" class="app-select">
            <option :value="null">Sin líder</option>
            <option v-for="u in usuariosManageables" :key="u.id" :value="u.id">
              {{ u.name }} {{ u.paternal || '' }}
            </option>
          </select>
        </FormField>

        <FormField label="Departamento" required :col-span="2">
          <AppSelect
            v-model="form.department_id"
            :options="departamentosDisponibles"
            placeholder="Selecciona el departamento"
            required
          />
        </FormField>

        <FormField label="Descripción" hint="opcional" :col-span="2">
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="Describe las responsabilidades del equipo..."
            class="app-input resize-none"
          />
        </FormField>

      </div>

      <div class="p-4 border-t flex justify-end gap-3"
        style="background: var(--tabla-header-bg); border-color: rgba(190,174,216,0.2);">
        <AppButton variant="secondary" type="button" @click="router.push('/ControlOrganizacional')">
          Cancelar
        </AppButton>
        <AppButton type="submit">Guardar Cambios</AppButton>
      </div>
      </form>
    </FormContenedor>
  </div>
</template>
