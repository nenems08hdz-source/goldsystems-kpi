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

const router = useRouter()
const store  = useOrgStore()
const { proxy } = getCurrentInstance()

const nuevaEmpresa = ref({
  name:        '',
  legal_name:  '',
  tax_id:      '',
  email:       '',
  phone:       '',

  admin_name:  '',
  admin_email: '',
})

async function guardarEmpresa() {
  try {
    const res = await api.post('/companies', {
      name:       nuevaEmpresa.value.name,
      legal_name: nuevaEmpresa.value.legal_name,
      tax_id:     nuevaEmpresa.value.tax_id,
      email:      nuevaEmpresa.value.email,
      phone:      nuevaEmpresa.value.phone,
    })
    store.empresas.push(res.data)
    proxy.$notify.success('Empresa registrada correctamente', 'Éxito')
    router.push('/GestionEmpresas')
  } catch (e) {
    proxy.$notify.error('Error al registrar empresa', 'Error')
  }
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
            <AppInput v-model="nuevaEmpresa.name" placeholder="Ej. TechSol SA" required />
          </FormField>

          <FormField label="Razón Social" required>
            <AppInput v-model="nuevaEmpresa.legal_name" placeholder="Ej. TechSol Soluciones S.A." required />
          </FormField>

          <FormField label="RFC" required>
            <AppInput v-model="nuevaEmpresa.tax_id" placeholder="Ej. TSO2024010101" required />
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
            <AppInput v-model="nuevaEmpresa.phone" type="tel" placeholder="+52 999 000 0000" />
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
            <AppInput v-model="nuevaEmpresa.admin_name" placeholder="Ej. Juan Pérez" required />
          </FormField>

          <FormField label="Email del Admin" required>
            <AppInput
              v-model="nuevaEmpresa.admin_email"
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