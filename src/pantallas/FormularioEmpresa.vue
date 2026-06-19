<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentInstance } from 'vue'
import { useOrgStore } from "../stores/orgStore"
import EncabezadoPantalla from '@/components/EncabezadoPantalla.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput  from '@/components/ui/AppInput.vue'

import FormField from '@/components/ui/FormField.vue'

const router = useRouter()
const store  = useOrgStore()
const { proxy } = getCurrentInstance()

const nuevaEmpresa = ref({
  nombre:      '',
  razonSocial: '',
  rfc:         '',
  email:       '',
  telefono:    '',

  nombreAdmin: '',
  emailAdmin:  '',
})

function guardarEmpresa() {
  const empresaNueva = {
    id:            Date.now(),
    nombre:        nuevaEmpresa.value.nombre,
    razonSocial:   nuevaEmpresa.value.razonSocial,
    rfc:           nuevaEmpresa.value.rfc,
    email:         nuevaEmpresa.value.email,
    telefono:      nuevaEmpresa.value.telefono,

    estado:        'activo',
    usuarios:      1,
    kpis:          0,
    fechaRegistro: new Date().toISOString().split('T')[0],
  }

  store.guardarEmpresa(empresaNueva)
  proxy.$notify.success('Empresa registrada correctamente', 'Éxito')
  router.push('/GestionEmpresas')
}
</script>

<template>
  <div class="p-3 min-h-screen">

    <div class="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
      <EncabezadoPantalla
        titulo="Nueva Empresa"
        descripcion="Registra una nueva empresa en el sistema y configura su cuenta Admin."
      />
      <AppButton variant="secondary" class="flex-shrink-0" @click="router.push('/GestionEmpresas')">
        ← Volver
      </AppButton>
    </div>

    <form @submit.prevent="guardarEmpresa" class="flex flex-col gap-6 max-w-4xl">

      <div
        class="rounded-xl shadow-md border overflow-hidden"
        style="background: var(--card-bg); border-color: rgba(190,174,216,0.5);"
      >
        <div
          class="p-4 border-b"
          style="background: var(--tabla-header-bg); border-color: rgba(190,174,216,0.3);"
        >
          <h2 class="text-sm font-bold uppercase tracking-wider" style="color: var(--text-general);">
            Datos de la Empresa
          </h2>
        </div>

        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

          <FormField label="Nombre Comercial" required>
            <AppInput v-model="nuevaEmpresa.nombre" placeholder="Ej. TechSol SA" required />
          </FormField>

          <FormField label="Razón Social" required>
            <AppInput v-model="nuevaEmpresa.razonSocial" placeholder="Ej. TechSol Soluciones S.A." required />
          </FormField>

          <FormField label="RFC" required>
            <AppInput v-model="nuevaEmpresa.rfc" placeholder="Ej. TSO2024010101" required />
          </FormField>

          <FormField label="Email Corporativo" required>
            <AppInput
              v-model="nuevaEmpresa.email"
              type="email"
              placeholder="contacto@empresa.com"
              required
            />
          </FormField>

          <FormField label="Teléfono" hint="opcional">
            <AppInput v-model="nuevaEmpresa.telefono" type="tel" placeholder="+52 999 000 0000" />
          </FormField>

        </div>
      </div>

      <div
        class="rounded-xl shadow-md border overflow-hidden"
        style="background: var(--card-bg); border-color: rgba(190,174,216,0.5);"
      >
        <div
          class="p-4 border-b"
          style="background: var(--tabla-header-bg); border-color: rgba(190,174,216,0.3);"
        >
          <h2 class="text-sm font-bold uppercase tracking-wider" style="color: var(--text-general);">
            Cuenta Admin de la Empresa
          </h2>
          <p class="text-[10px] mt-0.5" style="color: var(--card-text-hint);">
            Se creará automáticamente un usuario con rol Admin para gestionar esta empresa.
          </p>
        </div>

        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

          <FormField label="Nombre del Admin" required>
            <AppInput v-model="nuevaEmpresa.nombreAdmin" placeholder="Ej. Juan Pérez" required />
          </FormField>

          <FormField label="Email del Admin" required>
            <AppInput
              v-model="nuevaEmpresa.emailAdmin"
              type="email"
              placeholder="admin@empresa.com"
              required
            />
          </FormField>

        </div>
      </div>

      <!-- Botones -->
      <div class="flex justify-end gap-3">
        <AppButton variant="secondary" @click="router.push('/GestionEmpresas')">
          Cancelar
        </AppButton>
        <AppButton type="submit">
          Registrar Empresa
        </AppButton>
      </div>

    </form>
  </div>
</template>