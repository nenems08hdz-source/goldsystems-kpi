<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
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

const empresaId = route.params.id
const cargando  = ref(true)

const empresa = ref({
  name:       '',
  legal_name: '',
  tax_id:     '',
  email:      '',
  phone:      '',
  address:    '',
  status:     'active',
})

const opcionesEstado = [
  { value: 'active',   label: 'Activa'   },
  { value: 'inactive', label: 'Inactiva' },
]

onMounted(async () => {
  try {
    const res = await api.get(`/companies/${empresaId}`)
    const c   = res.data
    empresa.value = {
      name:       c.name       ?? '',
      legal_name: c.legal_name ?? '',
      tax_id:     c.tax_id     ?? '',
      email:      c.email      ?? '',
      phone:      c.phone      ?? '',
      address:    c.address    ?? '',
      status:     c.status     ?? 'active',
    }
  } catch {
    proxy.$notify.error('No se pudo cargar la empresa', 'Error')
    router.push('/GestionEmpresas')
  } finally {
    cargando.value = false
  }
})

async function guardar() {
  try {
    const res = await api.put(`/companies/${empresaId}`, {
      name:       empresa.value.name,
      legal_name: empresa.value.legal_name || null,
      tax_id:     empresa.value.tax_id     || null,
      email:      empresa.value.email      || null,
      phone:      empresa.value.phone      || null,
      address:    empresa.value.address    || null,
      status:     empresa.value.status,
    })

    // Actualiza en el store local
    const idx = store.empresas.findIndex(e => e.id === Number(empresaId))
    if (idx !== -1) store.empresas[idx] = res.data

    proxy.$notify.success('Empresa actualizada correctamente', 'Éxito')
    router.push('/GestionEmpresas')
  } catch {
    proxy.$notify.error('Error al actualizar la empresa', 'Error')
  }
}
</script>

<template>
  <div class="p-6 min-h-screen">

    <div class="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
      <EncabezadoPantalla
        titulo="Editar Empresa"
        descripcion="Modifica los datos de la empresa registrada en el sistema."
      />
      <AppButton variant="secondary" class="flex-shrink-0" @click="router.push('/GestionEmpresas')">
        ← Volver
      </AppButton>
    </div>

    <FormContenedor>
      <div v-if="cargando" class="text-sm" style="color: var(--subtext-general);">Cargando...</div>

      <form
      v-else
      @submit.prevent="guardar"
      class="flex flex-col gap-6 w-full"
    >

      <div
        class="rounded-xl shadow-md border overflow-hidden"
        style="background: var(--card-bg); border-color: rgba(190,174,216,0.5);"
      >
        <div class="p-4 border-b" style="background: var(--tabla-header-bg); border-color: rgba(190,174,216,0.3);">
          <h2 class="text-sm font-bold uppercase tracking-wider" style="color: var(--text-general);">
            Datos de la Empresa
          </h2>
        </div>

        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

          <FormField label="Nombre Comercial" required>
            <AppInput v-model="empresa.name" placeholder="Ej. TechSol SA" required />
          </FormField>

          <FormField label="Razón Social">
            <AppInput v-model="empresa.legal_name" placeholder="Ej. TechSol Soluciones S.A." />
          </FormField>

          <FormField label="RFC">
            <AppInput v-model="empresa.tax_id" placeholder="Ej. TSO2024010101" />
          </FormField>

          <FormField label="Email Corporativo">
            <AppInput v-model="empresa.email" type="email" placeholder="contacto@empresa.com" />
          </FormField>

          <FormField label="Teléfono" hint="opcional">
            <AppInput v-model="empresa.phone" type="tel" placeholder="+52 999 000 0000" />
          </FormField>

          <FormField label="Dirección" hint="opcional">
            <AppInput v-model="empresa.address" placeholder="Calle, Colonia, Ciudad" />
          </FormField>

          <FormField label="Estado">
            <AppSelect v-model="empresa.status" :options="opcionesEstado" />
          </FormField>

        </div>
      </div>

      <div class="flex justify-end gap-3">
        <AppButton variant="secondary" type="button" @click="router.push('/GestionEmpresas')">
          Cancelar
        </AppButton>
        <AppButton type="submit">Guardar Cambios</AppButton>
      </div>

      </form>
    </FormContenedor>
  </div>
</template>
