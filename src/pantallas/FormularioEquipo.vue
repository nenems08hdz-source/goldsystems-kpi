<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentInstance } from 'vue'
import { usePanelStore } from '../stores/panelStore'

const router = useRouter()
const store = usePanelStore()
const { proxy } = getCurrentInstance()

const nuevoEquipo = ref({
  nombre: '',
  lider: '',
  departamento_id: null,
  descripcion: '',
})

// Solo los departamentos del árbol para elegir a cuál pertenece el equipo
const departamentosDisponibles = store.estructuraOrganizacional
  .filter(n => n.tipo === 'departamento')

function guardarEquipo() {
  const nodoNuevo = {
    id: store.estructuraOrganizacional.length + 10,
    nombre: nuevoEquipo.value.nombre,
    tipo: 'equipo',
    nivel: 2,   // nivel 2 = equipo dentro de un departamento
    padre_id: nuevoEquipo.value.departamento_id
      ? Number(nuevoEquipo.value.departamento_id)
      : null,
    abierto: false,
    lider: nuevoEquipo.value.lider || null,
  }

  store.estructuraOrganizacional.push(nodoNuevo)

  proxy.$notify.success('Equipo registrado correctamente', 'Éxito')
  router.push('/ControlOrganizacional')
}
</script>

<template>
  <div class="p-3 min-h-screen">

    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-4xl font-bold text-[#3f2a52] tracking-tight">Nuevo Equipo</h1>
        <p class="text-xs text-gray-500 mt-1">Registra un equipo de trabajo dentro de un departamento.</p>
      </div>
      <button
        @click="router.push('/ControlOrganizacional')"
        type="button"
        class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors flex items-center gap-2"
      >
        ← Volver
      </button>
    </div>

    <form
      @submit.prevent="guardarEquipo"
      class="w-full max-w-2xl bg-white rounded-xl shadow-md border border-[#beaed8]/50 overflow-hidden"
    >

      <div class="p-4 bg-gray-50/50 border-b border-[#beaed8]/30">
        <h2 class="text-sm font-bold text-gray-700 uppercase tracking-wider">Información del Equipo</h2>
      </div>

      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

        <!-- Nombre del equipo -->
        <div class="flex flex-col gap-1.5">
          <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Nombre del Equipo *</label>
          <input
            v-model="nuevoEquipo.nombre"
            type="text"
            placeholder="Ej. Equipo Backend"
            required
            class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] focus:ring-2 focus:ring-[#3f2a52]/20 transition-colors"
          />
        </div>

        <!-- Líder del equipo -->
        <div class="flex flex-col gap-1.5">
          <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Líder del Equipo</label>
          <input
            v-model="nuevoEquipo.lider"
            type="text"
            placeholder="Ej. Carlos Méndez"
            class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] focus:ring-2 focus:ring-[#3f2a52]/20 transition-colors"
          />
        </div>

        <!-- Departamento al que pertenece -->
        <div class="flex flex-col gap-1.5 md:col-span-2">
          <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Departamento *</label>
          <select
            v-model="nuevoEquipo.departamento_id"
            required
            class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] cursor-pointer transition-colors"
          >
            <option :value="null" disabled>Selecciona el departamento</option>
            <option
              v-for="dept in departamentosDisponibles"
              :key="dept.id"
              :value="dept.id"
            >
              {{ dept.nombre }}
            </option>
          </select>
        </div>

        <!-- Descripción -->
        <div class="flex flex-col gap-1.5 md:col-span-2">
          <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Descripción</label>
          <textarea
            v-model="nuevoEquipo.descripcion"
            rows="3"
            placeholder="Describe las responsabilidades del equipo..."
            class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] focus:ring-2 focus:ring-[#3f2a52]/20 resize-none transition-colors"
          ></textarea>
        </div>

      </div>

      <div class="p-6 border-t border-[#beaed8]/20 bg-gray-50/50 flex justify-end gap-3">
        <button
          @click="router.push('/ControlOrganizacional')"
          type="button"
          class="bg-white hover:bg-gray-100 text-gray-600 border border-gray-300 font-bold text-xs py-3 px-6 rounded-lg transition-all"
        >
          Cancelar
        </button>
        <button
          type="submit"
          class="bg-[#3f2a52] hover:bg-[#beaed8] text-white font-bold text-xs py-3 px-8 rounded-lg transition-all shadow-sm"
        >
          Guardar Equipo
        </button>
      </div>

    </form>
  </div>
</template>