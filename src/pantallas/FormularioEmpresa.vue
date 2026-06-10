<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentInstance } from 'vue'
import { usePanelStore } from '../stores/panelStore'

const router = useRouter()
const store  = usePanelStore()
const { proxy } = getCurrentInstance()

const nuevaEmpresa = ref({
  nombre:       '',
  razonSocial:  '',
  rfc:          '',
  email:        '',
  telefono:     '',
  plan:         'Pro',
  nombreAdmin:  '',
  emailAdmin:   '',
})

function guardarEmpresa() {
  const empresaNueva = {

    id:            Date.now(),
    nombre:        nuevaEmpresa.value.nombre,
    razonSocial:   nuevaEmpresa.value.razonSocial,
    rfc:           nuevaEmpresa.value.rfc,
    email:         nuevaEmpresa.value.email,
    telefono:      nuevaEmpresa.value.telefono,
    plan:          nuevaEmpresa.value.plan,
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

    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-4xl font-bold text-[#3f2a52] tracking-tight">Nueva Empresa</h1>
        <p class="text-xs text-gray-500 mt-1">Registra una nueva empresa en el sistema y configura su cuenta Admin.</p>
      </div>
      <button
        @click="router.push('/GestionEmpresas')"
        type="button"
        class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors flex items-center gap-2"
      >
        ← Volver
      </button>
    </div>

    <form @submit.prevent="guardarEmpresa" class="flex flex-col gap-6 max-w-4xl">

      <!-- ── Datos de la empresa ──────────── -->
      <div class="bg-white rounded-xl shadow-md border border-[#beaed8]/50 overflow-hidden">
        <div class="p-4 bg-gray-50/50 border-b border-[#beaed8]/30">
          <h2 class="text-sm font-bold text-gray-700 uppercase tracking-wider">Datos de la Empresa</h2>
        </div>
        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Nombre Comercial *</label>
            <input
              v-model="nuevaEmpresa.nombre"
              type="text"
              placeholder="Ej. TechSol SA"
              required
              class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] focus:ring-2 focus:ring-[#3f2a52]/20 transition-colors"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Razón Social *</label>
            <input
              v-model="nuevaEmpresa.razonSocial"
              type="text"
              placeholder="Ej. TechSol Soluciones S.A."
              required
              class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] focus:ring-2 focus:ring-[#3f2a52]/20 transition-colors"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">RFC *</label>
            <input
              v-model="nuevaEmpresa.rfc"
              type="text"
              placeholder="Ej. TSO2024010101"
              required
              class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] focus:ring-2 focus:ring-[#3f2a52]/20 transition-colors"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Email Corporativo *</label>
            <input
              v-model="nuevaEmpresa.email"
              type="email"
              placeholder="contacto@empresa.com"
              required
              class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] focus:ring-2 focus:ring-[#3f2a52]/20 transition-colors"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Teléfono</label>
            <input
              v-model="nuevaEmpresa.telefono"
              type="tel"
              placeholder="+52 999 000 0000"
              class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] focus:ring-2 focus:ring-[#3f2a52]/20 transition-colors"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Plan *</label>
            <select
              v-model="nuevaEmpresa.plan"
              required
              class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] cursor-pointer transition-colors"
            >
              <option value="Básico">Básico</option>
              <option value="Pro">Pro</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>

        </div>
      </div>

      <!-- ── Cuenta Admin ─────────────────── -->
      <div class="bg-white rounded-xl shadow-md border border-[#beaed8]/50 overflow-hidden">
        <div class="p-4 bg-gray-50/50 border-b border-[#beaed8]/30">
          <h2 class="text-sm font-bold text-gray-700 uppercase tracking-wider">Cuenta Admin de la Empresa</h2>
          <p class="text-[10px] text-gray-400 mt-0.5">
            Se creará automáticamente un usuario con rol Admin para gestionar esta empresa.
          </p>
        </div>
        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Nombre del Admin *</label>
            <input
              v-model="nuevaEmpresa.nombreAdmin"
              type="text"
              placeholder="Ej. Juan Pérez"
              required
              class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] focus:ring-2 focus:ring-[#3f2a52]/20 transition-colors"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Email del Admin *</label>
            <input
              v-model="nuevaEmpresa.emailAdmin"
              type="email"
              placeholder="admin@empresa.com"
              required
              class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] focus:ring-2 focus:ring-[#3f2a52]/20 transition-colors"
            />
          </div>

        </div>
      </div>

      <div class="flex justify-end gap-3">
        <button
          @click="router.push('/GestionEmpresas')"
          type="button"
          class="bg-white hover:bg-gray-100 text-gray-600 border border-gray-300 font-bold text-xs py-3 px-6 rounded-lg transition-all"
        >
          Cancelar
        </button>
        <button
          type="submit"
          class="bg-[#3f2a52] hover:bg-[#beaed8] text-white font-bold text-xs py-3 px-8 rounded-lg transition-all shadow-sm"
        >
          Registrar Empresa
        </button>
      </div>

    </form>
  </div>
</template>