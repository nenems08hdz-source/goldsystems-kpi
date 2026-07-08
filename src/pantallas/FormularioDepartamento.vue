<script setup>
import { ref } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'
import { getCurrentInstance } from 'vue'
import { useOrgStore } from "../stores/orgStore"
import EncabezadoPantalla from '@/components/EncabezadoPantalla.vue'
import AppButton          from '@/components/ui/AppButton.vue'
import AppInput           from '@/components/ui/AppInput.vue'
import FormField          from '@/components/ui/FormField.vue'
import FormContenedor from '@/components/ui/FormContenedor.vue'

const router = useRouter()
const store  = useOrgStore()
const { proxy } = getCurrentInstance()

const nuevoDepartamento = ref({
  name:      '',
  description: '',
  manager_id: '',
})

async function guardarDepartamento() {
  try {
    const res = await api.post('/departments', {
      name:        nuevoDepartamento.value.name,
      description: nuevoDepartamento.value.description,
      company_id:  store.empresaActiva?.id,
      manager_id:  nuevoDepartamento.value.manager_id || null,
    })
    store.departamentos.push(res.data)
    proxy.$notify.success('Departamento registrado correctamente', 'Éxito')
    router.push('/ControlOrganizacional')
  } catch (e) {
    proxy.$notify.error('Error al registrar departamento', 'Error')
  }
}
</script>

<template>
  <div class="p-3 min-h-screen">

    <div class="mb-6 flex justify-between items-center">
      <EncabezadoPantalla
        titulo="Nuevo Departamento"
        descripcion="Registra una nueva área organizativa dentro de la empresa."
      />
      <AppButton variant="secondary" @click="router.push('/ControlOrganizacional')">
        ← Volver
      </AppButton>
    </div>

    <FormContenedor>
      <form
      @submit.prevent="guardarDepartamento"
      class="w-full rounded-xl shadow-md border overflow-hidden"
      style="background: var(--card-bg); border-color: rgba(190,174,216,0.5);"
    >

      <div
        class="p-4 border-b"
        style="background: var(--tabla-header-bg); border-color: rgba(190,174,216,0.3);"
      >
        <h2 class="text-sm font-bold uppercase tracking-wider" style="color: var(--text-general);">
          Información del Departamento
        </h2>
      </div>

      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

        <FormField label="Nombre del Departamento" required>
          <AppInput
            v-model="nuevoDepartamento.name"
            placeholder="Ej. Recursos Humanos"
            required
          />
        </FormField>

        <FormField label="Responsable" hint="opcional">
        <select v-model="nuevoDepartamento.manager_id" class="app-select">
          <option :value="null">Sin responsable</option>
          <option v-for="u in store.usuarios" :key="u.id" :value="u.id">
            {{ u.name }} {{ u.paternal }}
          </option>
        </select>
      </FormField>

        <FormField label="Descripción" hint="opcional" :col-span="2">
          <textarea
            v-model="nuevoDepartamento.description"
            rows="3"
            placeholder="Describe las funciones principales del área..."
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
          Guardar Departamento
        </AppButton>
      </div>

      </form>
    </FormContenedor>
  </div>
</template>
