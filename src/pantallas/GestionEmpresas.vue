<script setup>
import { useAuthStore } from '../stores/authStore'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentInstance } from 'vue'
import { useOrgStore } from "../stores/orgStore"
import EncabezadoPantalla from '../components/EncabezadoPantalla.vue'
import ModalConfirmacion  from '../components/ModalConfirmacion.vue'
import FormField          from '../components/ui/FormField.vue'
import StatusBadge        from '../components/StatusBadge.vue'
import BotonAccion        from '../components/ui/BotonAccion.vue'
import AppButton          from '../components/ui/AppButton.vue'


const router      = useRouter()
const store       = useOrgStore()
const { proxy }   = getCurrentInstance()

onMounted(() => {
  store.cargarEmpresas()
})

const API_URL     = import.meta.env.VITE_API_URL                  // http://localhost:8000/api
const STORAGE_URL = API_URL?.replace('/api', '/storage') ?? ''    // http://localhost:8000/storage

const filtroBusqueda = ref('')
const filtroEstado   = ref('')

const empresasFiltradas = computed(() =>
  store.empresas.filter(e => {
    const textoBusqueda = filtroBusqueda.value.toLowerCase()
    const pasaBusqueda  = textoBusqueda === '' ||
      e.name.toLowerCase().includes(textoBusqueda) ||
      e.legal_name.toLowerCase().includes(textoBusqueda)
    const pasaEstado = filtroEstado.value === '' || e.status === filtroEstado.value
    return pasaBusqueda && pasaEstado
  })
)

const showModal        = ref(false)
const empresaAEliminar = ref(null)
const auth = useAuthStore()

function confirmarEliminacion(empresa) {
  empresaAEliminar.value = empresa
  showModal.value = true
}

function ejecutarEliminacion() {
  const index = store.empresas.findIndex(e => e.id === empresaAEliminar.value.id)
  if (index !== -1) store.empresas.splice(index, 1)
  proxy.$notify.success('Empresa eliminada correctamente', 'Éxito')
  showModal.value = false
}

function colorPlan(plan) {
  if (plan === 'Enterprise') return 'bg-violet-100 text-violet-700 border-violet-200'
  if (plan === 'Pro')        return 'bg-blue-100 text-blue-700 border-blue-200'
  return 'bg-gray-100 text-gray-600 border-gray-200'
}

// subir logo//

const subirLogo = async (event, empresaId) => {
  const archivo = event.target.files[0]
  if (!archivo) return

  const formData = new FormData()
  formData.append('logo', archivo)

  const res = await fetch(`${API_URL}/companies/${empresaId}/logo`, {
    method:  'POST',
    headers: { 'Authorization': `Bearer ${auth.token}` },
    body:    formData
  })

  const data = await res.json()

  if (!res.ok) {
    proxy.$notify.error('Error al subir logo', 'Error')
    return
  }

  const empresa = store.empresas.find(e => e.id === empresaId)
  if (empresa) empresa.logo = data.logo

  proxy.$notify.success('Logo actualizado correctamente', 'Éxito')
}
onMounted(() => {
  const logos = JSON.parse(localStorage.getItem('company_logos') || '{}')
  store.empresas.forEach(e => {
    if (logos[e.id]) e.logo = logos[e.id]
  })
})
</script>

<template>
  <div class="p-3 min-h-screen" style="background: transparent;">

    <EncabezadoPantalla
      titulo="Gestión de Empresas"
      descripcion="Panel exclusivo del Developer. Administra todas las empresas registradas en el sistema."
    />

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 rounded-xl shadow-md border border-[#beaed8]/90 mt-6 mb-6" style="background: var(--card-bg);">

      <FormField label="Buscar empresa" :col-span="2">
        <input v-model="filtroBusqueda" type="text" placeholder="Nombre o razón social..." class="app-input" />
      </FormField>

      <FormField label="Estado">
        <select v-model="filtroEstado" class="app-select">
          <option value="">Todas</option>
          <option value="active">Solo activas</option>
          <option value="inactive">Solo inactivas</option>
        </select>
      </FormField>

      <div class="flex items-end pb-0.5">
        <p class="text-xs" style="color: var(--subtext-general);">
          <strong style="color: var(--text-general);">{{ empresasFiltradas.length }}</strong>
          de {{ store.empresas.length }} empresas
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div
        v-for="empresa in empresasFiltradas"
        :key="empresa.id"
        class="rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
        style="background: var(--card-bg); border: 1px solid var(--tabla-borde);"
      >

       <div class="p-4 flex justify-between items-start"
           style="border-bottom: 1px solid var(--tabla-borde);">
          <div class="flex items-center gap-3">
            <div class="relative shrink-0">
                <div class="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold overflow-hidden"
                     style="background: var(--sidebar-active-bg); color: var(--sidebar-active-text); border: 2px solid var(--tabla-borde);">
                      <img v-if="empresa.logo"
                           :src="`${STORAGE_URL}/${empresa.logo}`"
                            class="w-full h-full object-cover" />
                       <span v-else>{{ empresa.name?.charAt(0) }}</span>
                  </div>

        <label class="absolute -bottom-1 -right-1 p-0.5 px-1 rounded-md text-[9px] font-bold cursor-pointer"
            style="background: var(--sidebar-bg); color: #fff; border: 2px solid var(--card-bg);">
             +
             <input type="file" accept="image/*" class="hidden" @change="subirLogo($event, empresa.id)" />
         </label>
   </div>
      <div>
           <h3 class="text-sm font-bold" style="color: var(--text-general);">{{ empresa.name }}</h3>
            <p class="text-[10px] mt-0.5" style="color: var(--subtext-general);">{{ empresa.legal_name }}</p>
       </div>
    </div>
 <StatusBadge :tipo="empresa.status" />
</div>

        <div class="p-4 space-y-1.5 flex-grow">
          <p class="text-[11px] flex items-center gap-2" style="color: var(--subtext-general);">
            <i class="fi fi-sr-envelope text-[10px]"></i>
            {{ empresa.email }}
          </p>
          <p class="text-[11px] flex items-center gap-2" style="color: var(--subtext-general);">
            <i class="fi fi-sr-phone-call text-[10px]"></i>
            {{ empresa.phone || '—' }}
          </p>
          <p class="text-[11px] flex items-center gap-2" style="color: var(--subtext-general);">
            <i class="fi fi-sr-id-card text-[10px]"></i>
            RFC: {{ empresa.tax_id }}
          </p>
        </div>

        <div class="px-4 py-3 flex items-center gap-4"
          style="border-top: 1px solid var(--tabla-borde);">
          <div class="text-center">
            <p class="text-base font-black" style="color: var(--text-encabezado);"> - </p>
            <p class="text-[9px] uppercase tracking-wide" style="color: var(--subtext-general);">Usuarios</p>
          </div>

          <div class="text-center">
            <p class="text-base font-black" style="color: var(--text-encabezado);"> - </p>
            <p class="text-[9px] uppercase tracking-wide" style="color: var(--subtext-general);">KPIs</p>
          </div>

          <div class="text-center">
            <p class="text-[10px] font-bold" style="color: var(--text-general);">{{ empresa.created_at?.slice(0, 10)}}</p>
            <p class="text-[9px] uppercase tracking-wide" style="color: var(--subtext-general);">Registro</p>
          </div>

          <div class="ml-auto">
            <BotonAccion variante="trash" titulo="Eliminar empresa" @click="confirmarEliminacion(empresa)" />
          </div>
        </div>
      </div>

      <button
        @click="router.push('/GestionEmpresas/nueva')"
        class="rounded-xl border-2 border-dashed border-[#beaed8] hover:border-[#3f2a52] transition-all flex flex-col items-center justify-center gap-2 p-8 text-center min-h-[200px]"
        style="background: var(--card-bg);"
      >
        <span class="text-3xl text-[#beaed8]">+</span>
        <p class="text-xs font-bold text-[#3f2a52] uppercase tracking-wider" style="color: var(--text-encabezado);">Registrar Nueva Empresa</p>
        <p class="text-[10px] text-gray-400" style="color: var(--subtext-general);">Agregar al sistema</p>
      </button>

    </div>

    <div
      v-if="empresasFiltradas.length === 0 && store.empresas.length > 0"
      class="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center mb-6"
    >
      <p class="text-sm font-bold text-amber-700">Sin resultados</p>
      <p class="text-xs text-amber-600 mt-1">
        Ninguna empresa coincide con los filtros aplicados.
      </p>
    </div>

    <ModalConfirmacion
      :isOpen="showModal"
      titulo="¿Estás seguro?"
      mensaje="Esta acción eliminará la empresa permanentemente del sistema."
      @confirmar="ejecutarEliminacion"
      @cancelar="showModal = false"
    />
  </div>
</template>