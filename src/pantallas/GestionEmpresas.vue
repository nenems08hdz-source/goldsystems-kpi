<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentInstance } from 'vue'
import { usePanelStore } from '../stores/panelStore'
import EncabezadoPantalla from '../components/EncabezadoPantalla.vue'
import ModalConfirmacion from '../components/ModalConfirmacion.vue'

const router = useRouter()
const store = usePanelStore()
const { proxy } = getCurrentInstance()

// Lista simulada de empresas registradas en el sistema
// Cuando llegue el backend, esto vendrá de una llamada a la API
const empresas = ref([
  {
    id: 1,
    nombre: 'KPI360 Corp',
    razonSocial: 'KPI360 Corporation S.A. de C.V.',
    rfc: 'KPI2024010101',
    email: 'contacto@kpi360.com',
    telefono: '+52 999 000 0001',
    estado: 'activo',
    plan: 'Enterprise',
    usuarios: 8,
    kpis: 8,
    fechaRegistro: '2024-01-15',
  },
  {
    id: 2,
    nombre: 'TechSol SA',
    razonSocial: 'TechSol Soluciones S.A.',
    rfc: 'TSO2023050202',
    email: 'admin@techsol.com',
    telefono: '+52 55 000 0002',
    estado: 'activo',
    plan: 'Pro',
    usuarios: 15,
    kpis: 22,
    fechaRegistro: '2024-03-10',
  },
  {
    id: 3,
    nombre: 'Infranet',
    razonSocial: 'Infranet Servicios S.C.',
    rfc: 'INF2022080303',
    email: 'sistemas@infranet.mx',
    telefono: '+52 81 000 0003',
    estado: 'inactivo',
    plan: 'Básico',
    usuarios: 3,
    kpis: 5,
    fechaRegistro: '2023-08-22',
  },
])

// Filtros
const filtroBusqueda = ref('')
const filtroEstado = ref('')
const filtroPlan = ref('')

const empresasFiltradas = empresas.value.filter(e => {
  const pasaBusqueda = filtroBusqueda.value === '' ||
    e.nombre.toLowerCase().includes(filtroBusqueda.value.toLowerCase())
  const pasaEstado = filtroEstado.value === '' || e.estado === filtroEstado.value
  const pasaPlan = filtroPlan.value === '' || e.plan === filtroPlan.value
  return pasaBusqueda && pasaEstado && pasaPlan
})

// Modal de eliminación
const showModal = ref(false)
const empresaAEliminar = ref(null)

function confirmarEliminacion(empresa) {
  empresaAEliminar.value = empresa
  showModal.value = true
}

function ejecutarEliminacion() {
  const index = empresas.value.findIndex(e => e.id === empresaAEliminar.value.id)
  if (index !== -1) empresas.value.splice(index, 1)
  proxy.$notify.success('Empresa eliminada correctamente', 'Éxito')
  showModal.value = false
}

function colorPlan(plan) {
  if (plan === 'Enterprise') return 'bg-violet-100 text-violet-700 border-violet-200'
  if (plan === 'Pro') return 'bg-blue-100 text-blue-700 border-blue-200'
  return 'bg-gray-100 text-gray-600 border-gray-200'
}
</script>

<template>
  <div class="p-3 min-h-screen">

    <EncabezadoPantalla
      titulo="Gestión de Empresas"
      descripcion="Panel exclusivo del Developer. Administra todas las empresas registradas en el sistema."
    />

    <!-- Aviso visual de que es una vista de Developer -->
    <div class="flex items-center gap-3 bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 mt-4 mb-6">
      <span class="text-violet-500 text-lg">🛡️</span>
      <div>
        <p class="text-xs font-bold text-violet-700 uppercase tracking-wider">Vista exclusiva — Developer</p>
        <p class="text-[11px] text-violet-500 mt-0.5">Solo los usuarios con rol Developer pueden acceder a esta pantalla.</p>
      </div>
    </div>

    <!-- Filtros -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 p-5 bg-white rounded-xl shadow-md border border-[#beaed8]/90 mb-6">

      <div class="flex flex-col gap-1.5 sm:col-span-2">
        <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Buscar empresa</label>
        <input
          v-model="filtroBusqueda"
          type="text"
          placeholder="Nombre de la empresa..."
          class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] transition-colors"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Estado</label>
        <select
          v-model="filtroEstado"
          class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] cursor-pointer transition-colors"
        >
          <option value="">Todos</option>
          <option value="activo">Activa</option>
          <option value="inactivo">Inactiva</option>
        </select>
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Plan</label>
        <select
          v-model="filtroPlan"
          class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] cursor-pointer transition-colors"
        >
          <option value="">Todos</option>
          <option value="Enterprise">Enterprise</option>
          <option value="Pro">Pro</option>
          <option value="Básico">Básico</option>
        </select>
      </div>

    </div>

    <!-- Tarjetas de empresas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div
        v-for="empresa in empresas"
        :key="empresa.id"
        class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
      >
        <!-- Cabecera de la tarjeta -->
        <div class="p-4 border-b border-gray-100 flex justify-between items-start">
          <div>
            <h3 class="text-sm font-bold text-gray-800">{{ empresa.nombre }}</h3>
            <p class="text-[10px] text-gray-400 mt-0.5">{{ empresa.razonSocial }}</p>
          </div>
          <div class="flex flex-col items-end gap-1">
            <!-- Badge del plan -->
            <span
              class="text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide"
              :class="colorPlan(empresa.plan)"
            >
              {{ empresa.plan }}
            </span>
            <!-- Estado activo/inactivo -->
            <span
              class="text-[9px] font-bold uppercase tracking-wider inline-flex items-center gap-1"
              :class="empresa.estado === 'activo' ? 'text-emerald-500' : 'text-gray-400'"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="empresa.estado === 'activo' ? 'bg-emerald-500' : 'bg-gray-300'"></span>
              {{ empresa.estado }}
            </span>
          </div>
        </div>

        <!-- Datos de la empresa -->
        <div class="p-4 flex flex-col gap-2">
          <div class="flex justify-between text-[11px]">
            <span class="text-gray-400">RFC</span>
            <span class="font-semibold text-gray-700">{{ empresa.rfc }}</span>
          </div>
          <div class="flex justify-between text-[11px]">
            <span class="text-gray-400">Email</span>
            <span class="font-semibold text-gray-700">{{ empresa.email }}</span>
          </div>
          <div class="flex justify-between text-[11px]">
            <span class="text-gray-400">Usuarios</span>
            <span class="font-semibold text-gray-700">{{ empresa.usuarios }}</span>
          </div>
          <div class="flex justify-between text-[11px]">
            <span class="text-gray-400">KPIs registrados</span>
            <span class="font-semibold text-gray-700">{{ empresa.kpis }}</span>
          </div>
          <div class="flex justify-between text-[11px]">
            <span class="text-gray-400">Fecha de registro</span>
            <span class="font-semibold text-gray-700">{{ empresa.fechaRegistro }}</span>
          </div>
        </div>

        <!-- Acciones -->
        <div class="p-3 border-t border-gray-100 flex gap-2">
          <!--
            "Entrar" simula que el Developer entra a gestionar
            esa empresa específica. Lleva al ControlOrganizacional
            que muestra los datos de esa empresa.
            Cuando llegue el backend, aquí se pasaría el empresa_id
            para que el store cargue los datos correctos.
          -->
          <button
            @click="router.push('/ControlOrganizacional')"
            class="flex-1 bg-[#3f2a52] hover:bg-[#beaed8] text-white text-[10px] font-bold py-2 rounded-lg transition-all uppercase tracking-wider"
          >
            Entrar
          </button>
          <button
            @click="router.push('/GestionEmpresas/editar')"
            class="px-3 py-2 border border-gray-200 text-gray-400 hover:text-[#3f2a52] hover:border-[#3f2a52] rounded-lg transition-all text-sm"
            title="Editar empresa"
          >
            <i class="fi fi-sr-pencil"></i>
          </button>
          <button
            @click="confirmarEliminacion(empresa)"
            class="px-3 py-2 border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 rounded-lg transition-all text-sm"
            title="Eliminar empresa"
          >
            <i class="fi fi-sr-trash"></i>
          </button>
        </div>
      </div>

      <!-- Tarjeta para agregar nueva empresa -->
      <button
        @click="router.push('/GestionEmpresas/nueva')"
        class="bg-white rounded-xl border-2 border-dashed border-[#beaed8] hover:border-[#3f2a52] hover:bg-purple-50/30 transition-all flex flex-col items-center justify-center gap-2 p-8 text-center min-h-[200px]"
      >
        <span class="text-3xl text-[#beaed8]">+</span>
        <p class="text-xs font-bold text-[#3f2a52] uppercase tracking-wider">Registrar Nueva Empresa</p>
        <p class="text-[10px] text-gray-400">Añade una empresa al sistema</p>
      </button>
    </div>

    <ModalConfirmacion
      :isOpen="showModal"
      titulo="¿Eliminar empresa?"
      mensaje="Esta acción eliminará la empresa y todos sus datos permanentemente."
      @confirmar="ejecutarEliminacion"
      @cancelar="showModal = false"
    />

  </div>
</template>