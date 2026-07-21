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

const nuevaEmpresa = ref({
  name:        '',
  legal_name:  '',
  tax_id:      '',
  email:       '',
  phone:       '',
  address:     '',
  admin_name:  '',
  admin_email: '',
})

const errores      = ref({})
const exito        = ref(false)
const tempPassword = ref('')
const adminEmail   = ref('')

async function guardarEmpresa() {
  errores.value = {}
  try {
    const res = await api.post('/companies', {
      name:        nuevaEmpresa.value.name,
      legal_name:  nuevaEmpresa.value.legal_name  || null,
      tax_id:      nuevaEmpresa.value.tax_id       || null,
      email:       nuevaEmpresa.value.email        || null,
      phone:       nuevaEmpresa.value.phone        || null,
      address:     nuevaEmpresa.value.address      || null,
      admin_name:  nuevaEmpresa.value.admin_name,
      admin_email: nuevaEmpresa.value.admin_email,
    })
    store.empresas.push(res.data)
    tempPassword.value = res.data.admin_temp_password
    adminEmail.value   = nuevaEmpresa.value.admin_email
    exito.value = true
  } catch (e) {
    if (e.response?.status === 422) {
      errores.value = e.response.data.errors ?? {}
      proxy.$notify.error('Revisa los campos marcados', 'Error de validación')
    } else {
      proxy.$notify.error('Error al registrar empresa', 'Error')
    }
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

    <!-- ── Pantalla de éxito con contraseña temporal ── -->
    <div v-if="exito" class="max-w-lg mx-auto mt-10 rounded-xl shadow-md border overflow-hidden"
      style="background: var(--card-bg); border-color: rgba(190,174,216,0.5);">
      <div class="p-4 border-b" style="background: var(--tabla-header-bg); border-color: rgba(190,174,216,0.3);">
        <h2 class="text-sm font-bold uppercase tracking-wider" style="color: var(--text-general);">
          ✅ Empresa registrada
        </h2>
      </div>
      <div class="p-6 flex flex-col gap-4">
        <p class="text-sm" style="color: var(--text-general);">
          La empresa fue creada correctamente. Se generó una contraseña temporal para la cuenta Admin:
        </p>
        <div class="rounded-lg p-4 text-center" style="background: var(--tabla-header-bg);">
          <p class="text-xs mb-1" style="color: var(--subtext-general);">Email</p>
          <p class="text-sm font-medium mb-3" style="color: var(--text-general);">{{ adminEmail }}</p>
          <p class="text-xs mb-1" style="color: var(--subtext-general);">Contraseña temporal</p>
          <p class="text-xl font-mono font-bold tracking-widest" style="color: var(--text-general);">{{ tempPassword }}</p>
        </div>
        <p class="text-xs" style="color: var(--subtext-general);">
          Comparte estas credenciales con el administrador de la empresa. Se recomienda cambiar la contraseña en el primer inicio de sesión.
        </p>
        <AppButton @click="router.push('/GestionEmpresas')">
          Ir a Gestión de Empresas
        </AppButton>
      </div>
    </div>

    <!-- ── Formulario ── -->
    <FormContenedor v-else>
      <form @submit.prevent="guardarEmpresa" class="flex flex-col gap-6 w-full">

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
            <p v-if="errores.name" class="text-xs text-rose-500 mt-1">{{ errores.name[0] }}</p>
          </FormField>

          <FormField label="Razón Social" hint="opcional">
            <AppInput v-model="nuevaEmpresa.legal_name" placeholder="Ej. TechSol Soluciones S.A." />
            <p v-if="errores.legal_name" class="text-xs text-rose-500 mt-1">{{ errores.legal_name[0] }}</p>
          </FormField>

          <FormField label="RFC" hint="máx. 13 caracteres, opcional">
            <AppInput v-model="nuevaEmpresa.tax_id" placeholder="Ej. TSO2024010101" maxlength="13" />
            <p v-if="errores.tax_id" class="text-xs text-rose-500 mt-1">{{ errores.tax_id[0] }}</p>
          </FormField>

          <FormField label="Email Corporativo" hint="opcional">
            <AppInput v-model="nuevaEmpresa.email" type="email" placeholder="contacto@empresa.com" />
            <p v-if="errores.email" class="text-xs text-rose-500 mt-1">{{ errores.email[0] }}</p>
          </FormField>

          <FormField label="Teléfono" hint="opcional">
            <AppInput v-model="nuevaEmpresa.phone" type="tel" placeholder="+52 999 000 0000" />
            <p v-if="errores.phone" class="text-xs text-rose-500 mt-1">{{ errores.phone[0] }}</p>
          </FormField>

          <FormField label="Dirección" hint="opcional">
            <AppInput v-model="nuevaEmpresa.address" placeholder="Calle, número, ciudad..." />
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
          <p class="text-[10px] mt-0.5" style="color: var(--subtext-general);">
            Se creará automáticamente un usuario con rol Admin. La contraseña se generará y se mostrará al guardar.
          </p>
        </div>

        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

          <FormField label="Nombre del Admin" required>
            <AppInput v-model="nuevaEmpresa.admin_name" placeholder="Ej. Juan Pérez" required />
            <p v-if="errores.admin_name" class="text-xs text-rose-500 mt-1">{{ errores.admin_name[0] }}</p>
          </FormField>

          <FormField label="Email del Admin" required>
            <AppInput v-model="nuevaEmpresa.admin_email" type="email" placeholder="admin@empresa.com" required />
            <p v-if="errores.admin_email" class="text-xs text-rose-500 mt-1">{{ errores.admin_email[0] }}</p>
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
    </FormContenedor>
  </div>
</template>