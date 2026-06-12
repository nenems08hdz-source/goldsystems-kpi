<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentInstance } from 'vue'
import { usePanelStore } from '../stores/panelStore'
import Bottones from '../components/Bottones.vue'

const router = useRouter()
const store = usePanelStore()
const { proxy } = getCurrentInstance()

const nuevoUsuario = ref({
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  email: '',
  telefono: '',
  rol: '',
  departamento_id: null,
  equipo_id: null,
})

// Solo los departamentos del árbol (tipo === 'departamento')
const departamentosDisponibles = store.estructuraOrganizacional
  .filter(n => n.tipo === 'departamento')

// Solo los equipos del árbol (tipo === 'equipo')
const equiposDisponibles = store.estructuraOrganizacional
  .filter(n => n.tipo === 'equipo')

// Los roles asignables — excluimos developer y admin
// porque según el documento no se pueden asignar manualmente
const rolesAsignables = store.rolesDisponibles.filter(r => r.eliminable)

function guardarUsuario() {
  // Construimos el objeto completo compatible con store.usuarios
  const usuarioNuevo = {
    id: store.usuarios.length + 1,
    nombre: nuevoUsuario.value.nombre,
    apellidoPaterno: nuevoUsuario.value.apellidoPaterno,
    apellidoMaterno: nuevoUsuario.value.apellidoMaterno,
    email: nuevoUsuario.value.email,
    telefono: nuevoUsuario.value.telefono || null,
    rol: nuevoUsuario.value.rol,
    departamento_id: nuevoUsuario.value.departamento_id
      ? Number(nuevoUsuario.value.departamento_id)
      : null,
    equipo_id: nuevoUsuario.value.equipo_id
      ? Number(nuevoUsuario.value.equipo_id)
      : null,
    kpis: 0,
    estado: 'activo',
    ultimoLogin: null,
  }

  // Agregamos al store — la tabla de ControlOrganizacional
  // se actualiza automáticamente
  store.usuarios.push(usuarioNuevo)

  proxy.$notify.success('Colaborador registrado correctamente', 'Éxito')
  router.push('/ControlOrganizacional')
}
</script>

<template>
  <div class="p-6 min-h-screen bg-gray-50">

    <div class="bg-white w-full max-w-5xl mx-auto rounded-xl shadow-md border border-[#beaed8]/90 overflow-hidden text-left">

      <div class="p-8 bg-gradient-to-r from-gray-50 to-white border-b border-[#beaed8]/30">
        <h3 class="text-2xl font-bold text-[#3f2a52] tracking-tight">Registrar Nuevo Colaborador</h3>
        <p class="text-sm text-gray-400 mt-1">Añade un miembro a la estructura organizativa y asigna su rol.</p>
      </div>

      <form @submit.prevent="guardarUsuario">
        <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">

          <!-- Nombre -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Nombre *</label>
            <input
              v-model="nuevoUsuario.nombre"
              type="text"
              placeholder="Ej. Juan"
              required
              class="w-full bg-white text-gray-700 text-sm rounded-lg border border-[#beaed8]/80 p-3 outline-none focus:border-[#3f2a52] focus:ring-2 focus:ring-[#3f2a52]/20 transition-all"
            />
          </div>

          <!-- Apellido paterno -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Apellido Paterno *</label>
            <input
              v-model="nuevoUsuario.apellidoPaterno"
              type="text"
              placeholder="Ej. Pérez"
              required
              class="w-full bg-white text-gray-700 text-sm rounded-lg border border-[#beaed8]/80 p-3 outline-none focus:border-[#3f2a52] focus:ring-2 focus:ring-[#3f2a52]/20 transition-all"
            />
          </div>

          <!-- Apellido materno -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Apellido Materno</label>
            <input
              v-model="nuevoUsuario.apellidoMaterno"
              type="text"
              placeholder="Ej. García"
              class="w-full bg-white text-gray-700 text-sm rounded-lg border border-[#beaed8]/80 p-3 outline-none focus:border-[#3f2a52] focus:ring-2 focus:ring-[#3f2a52]/20 transition-all"
            />
          </div>

          <!-- Correo -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Correo Corporativo *</label>
            <input
              v-model="nuevoUsuario.email"
              type="email"
              placeholder="juan.perez@kpi360.com"
              required
              class="w-full bg-white text-gray-700 text-sm rounded-lg border border-[#beaed8]/80 p-3 outline-none focus:border-[#3f2a52] focus:ring-2 focus:ring-[#3f2a52]/20 transition-all"
            />
          </div>

          <!-- Teléfono -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Teléfono
              <span class="text-gray-400 normal-case font-normal ml-1">(opcional)</span>
            </label>
            <input
              v-model="nuevoUsuario.telefono"
              type="tel"
              placeholder="+52 999 000 0000"
              class="w-full bg-white text-gray-700 text-sm rounded-lg border border-[#beaed8]/80 p-3 outline-none focus:border-[#3f2a52] focus:ring-2 focus:ring-[#3f2a52]/20 transition-all"
            />
          </div>

          <!-- Rol — solo los asignables (sin developer ni admin) -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Rol *</label>
            <select
              v-model="nuevoUsuario.rol"
              required
              class="w-full bg-white text-gray-700 text-sm rounded-lg border border-[#beaed8]/80 p-3 outline-none focus:border-[#3f2a52] cursor-pointer transition-colors"
            >
              <option value="" disabled>Selecciona un rol</option>
              <!--
                Solo mostramos los roles que el documento marca
                como asignables (eliminable: true).
                Developer y Admin no aparecen aquí.
              -->
              <option
                v-for="rol in rolesAsignables"
                :key="rol.id"
                :value="rol.codigo"
              >
                {{ rol.nombre }} — {{ rol.descripcion }}
              </option>
            </select>
          </div>

          <!-- Departamento -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Departamento</label>
            <select
              v-model="nuevoUsuario.departamento_id"
              class="w-full bg-white text-gray-700 text-sm rounded-lg border border-[#beaed8]/80 p-3 outline-none focus:border-[#3f2a52] cursor-pointer transition-colors"
            >
              <option :value="null">Sin departamento</option>
              <option
                v-for="dept in departamentosDisponibles"
                :key="dept.id"
                :value="dept.id"
              >
                {{ dept.nombre }}
              </option>
            </select>
          </div>

          <!-- Equipo -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Equipo</label>
            <select
              v-model="nuevoUsuario.equipo_id"
              class="w-full bg-white text-gray-700 text-sm rounded-lg border border-[#beaed8]/80 p-3 outline-none focus:border-[#3f2a52] cursor-pointer transition-colors"
            >
              <option :value="null">Sin equipo</option>
              <option
                v-for="equipo in equiposDisponibles"
                :key="equipo.id"
                :value="equipo.id"
              >
                {{ equipo.nombre }}
              </option>
            </select>
          </div>

        </div>

        <div class="p-6 border-t border-[#beaed8]/20 bg-gray-50/50 flex justify-end gap-3">
          <bottones  @click="router.push('/ControlOrganizacional')" type="button" >  Cancelar </bottones>
          <bottones type="submit">Guardar Colaborador</bottones>   
        </div>
      </form>

    </div>
  </div>
</template>