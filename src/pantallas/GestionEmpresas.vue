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
  <div class="p-3 min-h-screen" style="background: transparent;">

    <EncabezadoPantalla
      titulo="Gestión de Empresas"
      descripcion="Panel exclusivo del Developer. Administra todas las empresas registradas en el sistema."
    />

    <!-- 
      CAMBIO: bg-violet-50 border-violet-200 → variables --banner-bg/border/text
      Razón: en modo oscuro el violeta claro se ve mal sobre fondo oscuro
    -->
    <div class="flex items-center gap-3 rounded-xl px-4 py-3 mt-4 mb-6"
      style="background: var(--banner-bg); border: 1px solid var(--banner-border);">
      <span class="text-lg">🛡️</span>
      <div>
        <p class="text-xs font-bold uppercase tracking-wider" style="color: var(--banner-text);">
          Vista exclusiva — Developer
        </p>
        <p class="text-[11px] mt-0.5" style="color: var(--banner-text); opacity: 0.7;">
          Solo los usuarios con rol Developer pueden acceder a esta pantalla.
        </p>
      </div>
    </div>

    <!-- 
      CAMBIO: bg-white → --card-bg | border-[#beaed8]/90 se mantiene (es de marca)
    -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 p-5 rounded-xl shadow-md border border-[#beaed8]/90 mb-6"
      style="background: var(--card-bg);">

      <div class="flex flex-col gap-1.5 sm:col-span-2">
        <!-- CAMBIO: text-gray-500 → --card-text-muted -->
        <label class="text-[11px] font-bold uppercase tracking-wider"
          style="color: var(--card-text-muted);">Buscar empresa</label>
        <!-- CAMBIO: bg-white text-gray-700 border-[#beaed8]/80 → variables input -->
        <input
          v-model="filtroBusqueda"
          type="text"
          placeholder="Nombre de la empresa..."
          class="text-xs rounded-lg p-2.5 outline-none transition-colors"
          style="background: var(--input-bg); color: var(--input-text); border: 1px solid var(--input-border);"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-[11px] font-bold uppercase tracking-wider"
          style="color: var(--card-text-muted);">Estado</label>
        <select
          v-model="filtroEstado"
          class="text-xs rounded-lg p-2.5 outline-none cursor-pointer transition-colors"
          style="background: var(--input-bg); color: var(--input-text); border: 1px solid var(--input-border);"
        >
          <option value="">Todos</option>
          <option value="activo">Activa</option>
          <option value="inactivo">Inactiva</option>
        </select>
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-[11px] font-bold uppercase tracking-wider"
          style="color: var(--card-text-muted);">Plan</label>
        <select
          v-model="filtroPlan"
          class="text-xs rounded-lg p-2.5 outline-none cursor-pointer transition-colors"
          style="background: var(--input-bg); color: var(--input-text); border: 1px solid var(--input-border);"
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
        class="rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden"
        style="background: var(--card-bg); border: 1px solid var(--tabla-borde);"
      >
        <!-- Cabecera de la tarjeta -->
        <div class="p-4 flex justify-between items-start"
          style="border-bottom: 1px solid var(--card-border);">
          <div>
            <!-- CAMBIO: text-gray-800 → --card-text | text-gray-400 → --card-text-hint -->
            <h3 class="text-sm font-bold" style="color: var(--card-text);">{{ empresa.nombre }}</h3>
            <p class="text-[10px] mt-0.5" style="color: var(--card-text-hint);">{{ empresa.razonSocial }}</p>
          </div>
          <div class="flex flex-col items-end gap-1">
            <!-- Badge del plan — colores semánticos, NO cambian -->
            <span
              class="text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide"
              :class="colorPlan(empresa.plan)"
            >{{ empresa.plan }}</span>
            <span
              class="text-[9px] font-bold uppercase tracking-wider inline-flex items-center gap-1"
              :class="empresa.estado === 'activo' ? 'text-emerald-500' : 'text-gray-400'"
            >
              <span class="w-1.5 h-1.5 rounded-full"
                :class="empresa.estado === 'activo' ? 'bg-emerald-500' : 'bg-gray-300'"></span>
              {{ empresa.estado }}
            </span>
          </div>
        </div>

        <!-- Datos de la empresa -->
        <div class="p-4 flex flex-col gap-2">
          <div class="flex justify-between text-[11px]">
            <span style="color: var(--card-text-hint);">RFC</span>
            <span class="font-semibold" style="color: var(--card-text);">{{ empresa.rfc }}</span>
          </div>
          <div class="flex justify-between text-[11px]">
            <span style="color: var(--card-text-hint);">Email</span>
            <span class="font-semibold" style="color: var(--card-text);">{{ empresa.email }}</span>
          </div>
          <div class="flex justify-between text-[11px]">
            <span style="color: var(--card-text-hint);">Usuarios</span>
            <span class="font-semibold" style="color: var(--card-text);">{{ empresa.usuarios }}</span>
          </div>
          <div class="flex justify-between text-[11px]">
            <span style="color: var(--card-text-hint);">KPIs registrados</span>
            <span class="font-semibold" style="color: var(--card-text);">{{ empresa.kpis }}</span>
          </div>
          <div class="flex justify-between text-[11px]">
            <span style="color: var(--card-text-hint);">Fecha de registro</span>
            <span class="font-semibold" style="color: var(--card-text);">{{ empresa.fechaRegistro }}</span>
          </div>
        </div>

        <!-- Acciones -->
        <div class="p-3 flex gap-2" style="border-top: 1px solid var(--card-border);">
          <button
            @click="router.push('/ControlOrganizacional')"
            class="flex-1 bg-[#3f2a52] text-white text-[10px] font-bold py-2 rounded-lg transition-all uppercase tracking-wider"
            @mouseover="$event.currentTarget.style.background='var(--sidebar-active-bg)'; $event.currentTarget.style.color='var(--sidebar-active-text)'"
            @mouseleave="$event.currentTarget.style.background='var(--sidebar-bg)'; $event.currentTarget.style.color='white'"
          >Entrar</button>
          <button
            @click="router.push('/GestionEmpresas/editar')"
            class="px-3 py-2 rounded-lg transition-all text-sm"
            style="border: 1px solid var(--tabla-borde); color: var(--card-text-hint);"
            @mouseover="$event.currentTarget.style.color='var(--sidebar-bg)'; $event.currentTarget.style.borderColor='var(--sidebar-bg)'"
            @mouseleave="$event.currentTarget.style.color='var(--card-text-hint)'; $event.currentTarget.style.borderColor='var(--tabla-borde)'"
          ><i class="fi fi-sr-pencil"></i></button>
          <button
            @click="confirmarEliminacion(empresa)"
            class="px-3 py-2 rounded-lg transition-all text-sm"
            style="border: 1px solid var(--tabla-borde); color: var(--card-text-hint);"
            @mouseover="$event.currentTarget.style.color='#ef4444'; $event.currentTarget.style.borderColor='#fca5a5'"
            @mouseleave="$event.currentTarget.style.color='var(--card-text-hint)'; $event.currentTarget.style.borderColor='var(--tabla-borde)'"
          ><i class="fi fi-sr-trash"></i></button>
        </div>
      </div>

      <!-- Tarjeta nueva empresa -->
      <button
        @click="router.push('/GestionEmpresas/nueva')"
        class="rounded-xl border-2 border-dashed border-[#beaed8] hover:border-[#3f2a52] transition-all flex flex-col items-center justify-center gap-2 p-8 text-center min-h-[200px]"
        style="background: var(--card-bg);"
      >
        <span class="text-3xl text-[#beaed8]">+</span>
        <p class="text-xs font-bold uppercase tracking-wider" style="color: var(--sidebar-bg);">
          Registrar Nueva Empresa
        </p>
        <p class="text-[10px]" style="color: var(--card-text-hint);">Añade una empresa al sistema</p>
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