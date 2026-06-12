<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentInstance } from 'vue'
import { useOrgStore } from "../stores/orgStore"
import EncabezadoPantalla from '../components/EncabezadoPantalla.vue'
import ModalConfirmacion from '../components/ModalConfirmacion.vue'
import FormField from '../components/ui/FormField.vue'

const router = useRouter()
const store  = useOrgStore()
const { proxy } = getCurrentInstance()

const filtroBusqueda = ref('')
const filtroEstado   = ref('')

const empresasFiltradas = computed(() =>
  store.empresas.filter(e => {
    const textoBusqueda = filtroBusqueda.value.toLowerCase()
    const pasaBusqueda  = textoBusqueda === '' ||
      e.nombre.toLowerCase().includes(textoBusqueda) ||
      e.razonSocial.toLowerCase().includes(textoBusqueda)
    const pasaEstado = filtroEstado.value === '' || e.estado === filtroEstado.value
    return pasaBusqueda && pasaEstado
  })
)

const showModal        = ref(false)
const empresaAEliminar = ref(null)

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
</script>

<template>
  <div class="p-3 min-h-screen" style="background: transparent;">

    <EncabezadoPantalla
      titulo="Gestión de Empresas"
      descripcion="Panel exclusivo del Developer. Administra todas las empresas registradas en el sistema."
    />

    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 p-5 rounded-xl shadow-md border border-[#beaed8]/90 mt-6 mb-6" style="background: var(--card-bg);">

      <FormField label="Buscar empresa" :col-span="2">
        <input v-model="filtroBusqueda" type="text" placeholder="Nombre o razón social..." class="app-input" />
      </FormField>

      <FormField label="Estado">
        <select v-model="filtroEstado" class="app-select">
          <option value="">Todas</option>
          <option value="activo">Solo activas</option>
          <option value="inactivo">Solo inactivas</option>
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
        class="rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
        style="background: var(--card-bg);"
      >
        <div class="p-4 border-b border-gray-100 flex justify-between items-start"
         style="background: var(--card-bg);">
          <div>
            <!-- CAMBIO: text-gray-800 → --card-text | text-gray-400 → --card-text-hint -->
            <h3 class="text-sm font-bold" style="color: var(--card-text); color: var(--text-general)">{{ empresa.nombre }}</h3>
            <p class="text-[10px] mt-0.5" style="color: var(--card-text-hint); color: var(--text-general)">{{ empresa.razonSocial }}</p>
          </div>
          <div class="flex flex-col items-end gap-1.5">
            <span
              class="text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide"
              :class="colorPlan(empresa.plan)"
            >
              {{ empresa.plan }}
            </span>
            <span
              class="text-[9px] font-bold uppercase tracking-wider inline-flex items-center gap-1"
              :class="empresa.estado === 'activo' ? 'text-emerald-500' : 'text-gray-400'"
            >
              <span
                class="w-1.5 h-1.5 rounded-full"
                :class="empresa.estado === 'activo' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'"
              ></span>
              {{ empresa.estado }}
            </span>
          </div>
        </div>

        <!-- Cuerpo: datos de contacto -->
        <div class="p-4 space-y-1.5 flex-grow">
          <p class="text-[11px] text-gray-500 flex items-center gap-2" style="color: var(--text-general);">
            <i class="fi fi-sr-envelope  text-[10px]"></i>
            {{ empresa.email }}
          </p>
          <p class="text-[11px] text-gray-500 flex items-center gap-2" style="color: var(--text-general);">
            <i class="fi fi-sr-phone-call text-[10px]"></i>
            {{ empresa.telefono || '—' }}
          </p>
          <p class="text-[11px] text-gray-500 flex items-center gap-2" style="color: var(--text-general);">
            <i class="fi fi-sr-id-card  text-[10px]"></i>
            RFC: {{ empresa.rfc }}
          </p>
        </div>

        <div class="px-4 py-3 border-t border-gray-100 flex items-center gap-4" style="background: var(--card-bg); border: var(--card-bg);">
          <div class="text-center">
            <p class="text-base font-black" style="color: var(--text-encabezado);">{{ empresa.usuarios }}</p>
            <p class="text-[9px] text-gray-400 uppercase tracking-wide" style="color: var(--text-general);">Usuarios</p>
          </div>
          <div class="text-center">
            <p class="text-base font-black" style="color: var(--text-encabezado);">{{ empresa.kpis }}</p>
            <p class="text-[9px] text-gray-400 uppercase tracking-wide" style="color: var(--text-general);">KPIs</p>
          </div>
          <div class="text-center">
            <p class="text-[10px] font-bold" style="color: var(--text-general);">{{ empresa.fechaRegistro }}</p>
            <p class="text-[9px] uppercase tracking-wide" style="color: var(--subtext-general);">Registro</p>
          </div>
        </div>

        <div class="px-4 py-3 border-tflex items-center justify-end gap-2" style="border: var(--card-bg);">
          <button
            @click="confirmarEliminacion(empresa)"
            title="Eliminar empresa"
            class="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-1.5 rounded-lg transition-colors text-sm"
            style=" background: var(--layout-bg)"
          >
            <i class="fi fi-sr-trash"></i>
          </button>
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