<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentInstance } from 'vue'
import { useOrgStore } from "../stores/orgStore"
import EncabezadoPantalla from '@/components/EncabezadoPantalla.vue'
import AppButton          from '@/components/ui/AppButton.vue'
import AppInput           from '@/components/ui/AppInput.vue'
import AppSelect          from '@/components/ui/AppSelect.vue'
import FormField          from '@/components/ui/FormField.vue'
import FormContenedor from '@/components/ui/FormContenedor.vue'
import api from '../services/api'

const router = useRouter()
const store  = useOrgStore()
const { proxy } = getCurrentInstance()
const usuariosApi = ref([])

onMounted(async () => {
  const res = await api.get('/users')
  usuariosApi.value = res.data
})

const usuariosDisponibles = computed(() =>
  usuariosApi.value.map(u => ({ value: u.id, label: `${u.name} ${u.paternal ?? ''}`.trim() }))
)

const departamentosDisponibles = computed(() =>
  store.departamentos.map(d => ({ value: d.id, label: d.name }))
)

const nuevoEquipo = ref({
  name:          '',
  leader_id:     null,
  department_id: null,
  description:   '',
})

async function guardarEquipo() {
  try {
    const res = await api.post('/teams', {
      name:          nuevoEquipo.value.name,
      description:   nuevoEquipo.value.description || null,
      department_id: nuevoEquipo.value.department_id,
      leader_id:     nuevoEquipo.value.leader_id || null,
    })
    store.equipos.push(res.data)
    proxy.$notify.success('Equipo registrado correctamente', 'Éxito')
    setTimeout(() => router.push('/ControlOrganizacional'), 500)
  } catch (e) {
    console.error('Error:', e)
    proxy.$notify.error('Error al registrar equipo', 'Error')
  }
}
</script>

<template>
  <div class="p-3 min-h-screen">

    <div class="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
      <EncabezadoPantalla
        titulo="Nuevo Equipo"
        descripcion="Registra un equipo de trabajo dentro de un departamento."
      />
      <AppButton variant="secondary" class="flex-shrink-0" @click="router.push('/ControlOrganizacional')">
        ← Volver
      </AppButton>
    </div>

    <FormContenedor>
      <form
      @submit.prevent="guardarEquipo"
      class="w-full rounded-xl shadow-md border overflow-hidden"
      style="background: var(--card-bg); border-color: rgba(190,174,216,0.5);"
    >

      <div
        class="p-4 border-b"
        style="background: var(--tabla-header-bg); border-color: rgba(190,174,216,0.3);"
      >
        <h2 class="text-sm font-bold uppercase tracking-wider" style="color: var(--text-general);">
          Información del Equipo
        </h2>
      </div>

      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

        <FormField label="Nombre del Equipo" required>
          <AppInput
            v-model="nuevoEquipo.name"
            placeholder="Ej. Equipo Backend"
            required
          />
        </FormField>

        <FormField label="Líder del Equipo" hint="opcional">
        <select v-model="nuevoEquipo.leader_id" class="app-select">
          <option :value="null">Sin líder</option>
          <option v-for="u in usuariosDisponibles" :key="u.value" :value="u.value">
            {{ u.label }}
          </option>
        </select>
      </FormField>

        <FormField label="Departamento" required :col-span="2">
          <AppSelect
            v-model="nuevoEquipo.department_id"
            :options="departamentosDisponibles"
            placeholder="Selecciona el departamento"
            required
          />
        </FormField>

        <FormField label="Descripción" hint="opcional" :col-span="2">
          <textarea
            v-model="nuevoEquipo.description"
            rows="3"
            placeholder="Describe las responsabilidades del equipo..."
            class="app-input resize-none"
          />
        </FormField>

      </div>

      <div
        class="p-4 border-t flex justify-end gap-3"
        style="background: var(--tabla-header-bg); border-color: rgba(190,174,216,0.2);"
      >
        <AppButton variant="secondary" @click="router.push('/ControlOrganizacional')">
          Cancelar
        </AppButton>
        <AppButton type="submit">
          Guardar Equipo
        </AppButton>
      </div>

      </form>
    </FormContenedor>
  </div>
</template>
