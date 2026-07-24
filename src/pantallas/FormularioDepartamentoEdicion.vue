<script setup>
import { ref, onMounted, getCurrentInstance, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'
import { useOrgStore } from '../stores/orgStore'
import EncabezadoPantalla from '@/components/EncabezadoPantalla.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import FormField from '@/components/ui/FormField.vue'
import FormContenedor from '@/components/ui/FormContenedor.vue'

const router = useRouter()
const route = useRoute()
const store = useOrgStore()
const { proxy } = getCurrentInstance()

const deptId = route.params.id
const cargando = ref(true)

const form = ref({
  name: '',
  description: '',
  manager_id: null,
})

// Filtra solo usuarios con rol manager o admin
const usuariosFiltrados = computed(() => {
  if (!store.usuarios || store.usuarios.length === 0) return []
  
  return store.usuarios.filter(u => {
    const roles = u.roles?.map(r => r.name || r) || []
    const rolesString = roles.map(r => String(r).toLowerCase())
    return rolesString.includes('manager') || rolesString.includes('admin')
  })
})

onMounted(async () => {
  try {
    await store.cargarTodo()
    const res = await api.get(`/departments/${deptId}`)
    const d = res.data
    form.value = {
      name: d.name ?? '',
      description: d.description ?? '',
      manager_id: d.manager_id ?? null,
    }
  } catch (e) {
    console.error('Error cargando departamento:', e)
    proxy.$notify.error('No se pudo cargar el departamento', 'Error')
  } finally {
    cargando.value = false
  }
})

async function guardar() {
  try {
    const res = await api.put(`/departments/${deptId}`, {
      name: form.value.name,
      description: form.value.description,
      manager_id: form.value.manager_id || null,
    })
    const idx = store.departamentos.findIndex(d => d.id === Number(deptId))
    if (idx !== -1) store.departamentos[idx] = res.data
    proxy.$notify.success('Departamento actualizado correctamente', 'Éxito')
    router.push('/ControlOrganizacional')
  } catch {
    proxy.$notify.error('Error al actualizar el departamento', 'Error')
  }
}
</script>

<template>
  <div class="p-3 min-h-screen">
    <div class="mb-6 flex justify-between items-center">
      <EncabezadoPantalla
        titulo="Editar Departamento"
        descripcion="Modifica la información del área organizativa."
      />
      <AppButton variant="secondary" @click="router.push('/ControlOrganizacional')">
        ← Volver
      </AppButton>
    </div>

    <FormContenedor>
      <div v-if="cargando" class="text-sm" style="color: var(--subtext-general);">Cargando...</div>

      <form v-else @submit.prevent="guardar" class="w-full rounded-xl shadow-md border overflow-hidden" style="background: var(--card-bg); border-color: rgba(190,174,216,0.5);">
        <div class="p-4 border-b" style="background: var(--tabla-header-bg); border-color: rgba(190,174,216,0.3);">
          <h2 class="text-sm font-bold uppercase tracking-wider" style="color: var(--text-general);">
            Información del Departamento
          </h2>
        </div>

        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Nombre del Departamento" required>
            <AppInput v-model="form.name" placeholder="Ej. Recursos Humanos" required />
          </FormField>

          <FormField label="Responsable" hint="opcional">
            <select v-model="form.manager_id" class="app-select">
              <option :value="null">Sin responsable</option>
              <option v-for="u in usuariosFiltrados" :key="u.id" :value="u.id">
                {{ u.name }} {{ u.paternal || '' }}
              </option>
            </select>
          </FormField>

          <FormField label="Descripción" hint="opcional" :col-span="2">
            <textarea v-model="form.description" rows="3" placeholder="Describe las funciones principales del área..." class="app-input resize-none" />
          </FormField>
        </div>

        <div class="p-4 border-t flex justify-end gap-3" style="background: var(--tabla-header-bg); border-color: rgba(190,174,216,0.2);">
          <AppButton variant="secondary" type="button" @click="router.push('/ControlOrganizacional')">
            Cancelar
          </AppButton>
          <AppButton type="submit">Guardar Cambios</AppButton>
        </div>
      </form>
    </FormContenedor>
  </div>
</template>