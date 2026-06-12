<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentInstance } from 'vue'
import { useOrgStore } from "../stores/orgStore"
import EncabezadoPantalla from '@/components/EncabezadoPantalla.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput  from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import FormField from '@/components/ui/FormField.vue'

const router = useRouter()
const store  = useOrgStore()
const { proxy } = getCurrentInstance()

const nuevoEquipo = ref({
  nombre:         '',
  lider:          '',
  departamento_id: null,
  descripcion:    '',
})

const departamentosDisponibles = store.estructuraOrganizacional
  .filter(n => n.tipo === 'departamento')
  .map(d => ({ value: d.id, label: d.nombre }))

function guardarEquipo() {
  const nodoNuevo = {
    id:       store.estructuraOrganizacional.length + 10,
    nombre:   nuevoEquipo.value.nombre,
    tipo:     'equipo',
    nivel:    2,
    padre_id: nuevoEquipo.value.departamento_id
      ? Number(nuevoEquipo.value.departamento_id) : null,
    abierto: false,
    lider:   nuevoEquipo.value.lider || null,
  }

  store.estructuraOrganizacional.push(nodoNuevo)
  proxy.$notify.success('Equipo registrado correctamente', 'Éxito')
  router.push('/ControlOrganizacional')
}
</script>

<template>
  <div class="p-3 min-h-screen">

    <div class="mb-6 flex justify-between items-center">
      <EncabezadoPantalla
        titulo="Nuevo Equipo"
        descripcion="Registra un equipo de trabajo dentro de un departamento."
      />
      <AppButton variant="secondary" @click="router.push('/ControlOrganizacional')">
        ← Volver
      </AppButton>
    </div>

    <form
      @submit.prevent="guardarEquipo"
      class="w-full max-w-2xl rounded-xl shadow-md border overflow-hidden"
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
            v-model="nuevoEquipo.nombre"
            placeholder="Ej. Equipo Backend"
            required
          />
        </FormField>

        <FormField label="Líder del Equipo" hint="opcional">
          <AppInput v-model="nuevoEquipo.lider" placeholder="Ej. Carlos Méndez" />
        </FormField>

        <FormField label="Departamento" required :col-span="2">
          <AppSelect
            v-model="nuevoEquipo.departamento_id"
            :options="departamentosDisponibles"
            placeholder="Selecciona el departamento"
            required
          />
        </FormField>

        <FormField label="Descripción" hint="opcional" :col-span="2">
          <textarea
            v-model="nuevoEquipo.descripcion"
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
  </div>
</template>
