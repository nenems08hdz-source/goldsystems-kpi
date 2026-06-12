<script setup>
import { ref, computed } from 'vue'
import { getCurrentInstance } from 'vue'
import plantillatabla from '../components/PlantillaTabla.vue'
import ModalConfirmacion from '../components/ModalConfirmacion.vue'
import EncabezadoPantalla from '../components/EncabezadoPantalla.vue'
import AppButton from '../components/ui/AppButton.vue'
import FormField from '../components/ui/FormField.vue'
import { useOrgStore } from "../stores/orgStore"
import { useKpiStore } from "../stores/kpiStore"

const store    = useOrgStore()
const kpiStore = useKpiStore()
const { proxy } = getCurrentInstance()

// árbol organizacional
const nodoSeleccionado = ref(null)

function seleccionarNodo(nodo) {
  nodoSeleccionado.value = nodoSeleccionado.value?.id === nodo.id ? null : nodo
}

// filtros
const filtroRol      = ref('')
const filtroEstado   = ref('')
const filtroBusqueda = ref('')

const usuariosFiltrados = computed(() =>
  store.usuarios.filter(u => {
    const pasaNodo = !nodoSeleccionado.value ||
      (nodoSeleccionado.value.tipo === 'departamento' && u.departamento_id === nodoSeleccionado.value.id) ||
      (nodoSeleccionado.value.tipo === 'equipo'       && u.equipo_id       === nodoSeleccionado.value.id)
    const pasaRol      = filtroRol.value      === '' || u.rol    === filtroRol.value
    const pasaEstado   = filtroEstado.value   === '' || u.estado === filtroEstado.value
    const pasaBusqueda = filtroBusqueda.value === '' ||
      store.nombreCompleto(u).toLowerCase().includes(filtroBusqueda.value.toLowerCase()) ||
      u.email.toLowerCase().includes(filtroBusqueda.value.toLowerCase())
    return pasaNodo && pasaRol && pasaEstado && pasaBusqueda
  })
)

const tituloTabla = computed(() =>
  nodoSeleccionado.value
    ? `Usuarios: ${nodoSeleccionado.value.nombre}`
    : `Todos los usuarios — ${store.empresaActiva.nombre}`
)

function limpiarFiltros() {
  filtroRol.value      = ''
  filtroEstado.value   = ''
  filtroBusqueda.value = ''
  nodoSeleccionado.value = null
}

// panel KPIs del usuario
const mostrarPanelKpis    = ref(false)
const usuarioSeleccionado = ref(null)

const kpisDelUsuario = computed(() =>
  usuarioSeleccionado.value ? kpiStore.kpisDeUsuario(usuarioSeleccionado.value.id) : []
)

function abrirPanelKpis(usuario) {
  usuarioSeleccionado.value = usuario
  mostrarPanelRol.value  = false
  mostrarPanelKpis.value = true
}

// panel modificar rol
const mostrarPanelRol = ref(false)
const rolSeleccionado = ref('')

function abrirModificarRol(usuario) {
  usuarioSeleccionado.value = usuario
  rolSeleccionado.value     = usuario.rol
  mostrarPanelKpis.value = false
  mostrarPanelRol.value  = true
}

function guardarRol() {
  const index = store.usuarios.findIndex(u => u.id === usuarioSeleccionado.value.id)
  if (index !== -1) store.usuarios[index].rol = rolSeleccionado.value
  proxy.$notify.success('Rol actualizado correctamente', 'Éxito')
  mostrarPanelRol.value = false
}

// modal eliminar usuario
const showModal        = ref(false)
const usuarioAEliminar = ref(null)

function confirmarEliminacion(usuario) {
  usuarioAEliminar.value = usuario
  showModal.value = true
}

function ejecutarEliminacion() {
  store.usuarios = store.usuarios.filter(u => u.id !== usuarioAEliminar.value.id)
  proxy.$notify.success('Usuario eliminado correctamente', 'Éxito')
  showModal.value = false
}

// helpers árbol
function contarUsuarios(nodo) {
  if (nodo.tipo === 'departamento') return store.usuarios.filter(u => u.departamento_id === nodo.id).length
  if (nodo.tipo === 'equipo')       return store.usuarios.filter(u => u.equipo_id       === nodo.id).length
  return store.usuarios.length
}

function eliminarNodo(nodo) {
  const hijosIds = store.estructuraOrganizacional
    .filter(n => n.padre_id === nodo.id)
    .map(n => n.id)
  store.estructuraOrganizacional = store.estructuraOrganizacional
    .filter(n => n.id !== nodo.id && !hijosIds.includes(n.id))
  if (nodoSeleccionado.value?.id === nodo.id) nodoSeleccionado.value = null
  proxy.$notify.success(`${nodo.nombre} eliminado correctamente`, 'Éxito')
}
</script>

<template>
  <div class="p-3 min-h-screen" style="background: transparent;">

    <EncabezadoPantalla
      titulo="Control Organizacional"
      descripcion="Estructura jerárquica de la empresa, control de acceso por roles y gestión de usuarios."
    />

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-5 rounded-xl shadow-md border border-[#beaed8]/90 mt-6"
      style="background: var(--card-bg);">

      <FormField label="Buscar usuario" :col-span="2">
        <input v-model="filtroBusqueda" type="text" placeholder="Nombre o correo..." class="app-input" />
      </FormField>

      <FormField label="Rol">
        <select v-model="filtroRol" class="app-select">
          <option value="">Todos los roles</option>
          <option v-for="rol in store.rolesDisponibles" :key="rol.id" :value="rol.codigo">
            {{ rol.nombre }}
          </option>
        </select>
      </FormField>

      <FormField label="Estado">
        <select v-model="filtroEstado" class="app-select">
          <option value="">Todos</option>
          <option value="activo">Activo</option>
          <option value="ausente">Ausente</option>
          <option value="bloqueado">Bloqueado</option>
        </select>
      </FormField>

      <div class="flex items-end gap-2">
        <AppButton variant="secondary" class="flex-1" @click="limpiarFiltros">Limpiar</AppButton>
        <AppButton class="flex-1" @click="$router.push('/organizacion/nuevo')">+ Nuevo</AppButton>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">

      <!-- árbol organizacional -->
      <div class="lg:col-span-4 rounded-xl shadow-md border border-[#beaed8]/90 mt-2 overflow-hidden flex flex-col"
        style="background: var(--card-bg);">

        <div class="p-4" style="border-bottom: 1px solid var(--tabla-borde); background: var(--tabla-header-bg);">
          <h2 class="text-sm font-bold tracking-tight" style="color: var(--text-general);">
            Estructura Organizacional
          </h2>
          <p class="text-[10px] mt-0.5" style="color: var(--card-text-hint);">
            Haz clic en un área para filtrar sus usuarios
          </p>
        </div>

        <div class="p-3 flex flex-col gap-1 max-h-[420px] overflow-y-auto">
          <div
            v-for="nodo in store.estructuraOrganizacional"
            :key="nodo.id"
            :style="{ paddingLeft: (nodo.nivel * 20) + 'px' }"
            class="group flex items-center justify-between p-2.5 rounded-xl transition-all duration-200 relative"
            :class="[
              nodo.tipo !== 'empresa' ? 'cursor-pointer' : 'cursor-default',
              nodoSeleccionado?.id === nodo.id ? 'ring-1 ring-[#3f2a52]/20' : ''
            ]"
            @click="nodo.tipo !== 'empresa' && seleccionarNodo(nodo)"
            @mouseover="nodo.tipo !== 'empresa' && $event.currentTarget.style.setProperty('background', 'var(--tabla-hover)')"
            @mouseleave="$event.currentTarget.style.setProperty('background', nodoSeleccionado?.id === nodo.id ? 'var(--tabla-hover)' : 'transparent')"
          >
            <div v-if="nodoSeleccionado?.id === nodo.id"
              class="absolute left-0 top-2 bottom-2 w-1 bg-[#3f2a52] rounded-r-md"></div>

            <div class="flex items-center gap-2.5 text-xs">
              <span v-if="nodo.nivel === 0" class="text-sm">
                <i class="fi fi-sr-globe text-[#beaed8]"></i>
              </span>
              <span v-else-if="nodo.nivel === 1" class="text-[#77a9d4]">
                <i class="fi fi-sr-bullet"></i>
              </span>
              <span v-else class="text-[10px] font-bold" style="color: var(--subtext-general);">└─</span>

              <div class="flex flex-col">
                <span class="tracking-wide"
                  :style="{
                    color: nodo.nivel === 0 ? 'var(--text-encabezado)' : nodo.nivel === 1 ? 'var(--text-general)' : 'var(--subtext-general)',
                    fontWeight: nodo.nivel === 0 ? '700' : nodo.nivel === 1 ? '600' : '500',
                    fontSize: nodo.nivel === 0 ? '14px' : '12px'
                  }">
                  {{ nodo.nombre }}
                </span>
                <span v-if="nodo.responsable || nodo.lider" class="text-[9px]" style="color: var(--subtext-general);">
                  {{ nodo.tipo === 'equipo' ? 'Líder:' : 'Resp:' }} {{ nodo.responsable ?? nodo.lider }}
                </span>
              </div>
            </div>

            <div class="flex items-center gap-1.5 flex-shrink-0">
              <span v-if="nodo.tipo !== 'empresa'"
                class="text-[9px] px-2 py-0.5 rounded-md font-black tracking-wider"
                :style="nodoSeleccionado?.id === nodo.id
                  ? 'background: var(--sidebar-bg); color: white;'
                  : 'background: var(--tabla-borde); color: var(--subtext-general);'"
              >{{ contarUsuarios(nodo) }}</span>
              <button v-if="nodo.tipo !== 'empresa'"
                @click.stop="eliminarNodo(nodo)"
                class="opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 p-1 rounded-lg transition-all text-xs"
                style="color: var(--card-text-hint);">
                <i class="fi fi-sr-trash"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="p-3 flex gap-2" style="border-top: 1px solid var(--tabla-borde);">
          <button @click="$router.push('/FormularioDepartamento')"
            class="flex-1 text-[10px] font-bold uppercase tracking-wider py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all"
            style="background: var(--card-bg); color: var(--text-general); border: 1px solid var(--input-border);"
            @mouseover="$event.currentTarget.style.background='var(--tabla-hover)'"
            @mouseleave="$event.currentTarget.style.background='var(--card-bg)'"
          ><span style="color: var(--color-kpi-morado);">+</span> Departamento</button>
          <button @click="$router.push('/FormularioEquipo')"
            class="flex-1 text-[10px] font-bold uppercase tracking-wider py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all"
            style="background: var(--card-bg); color: var(--text-general); border: 1px solid var(--input-border);"
            @mouseover="$event.currentTarget.style.background='var(--tabla-hover)'"
            @mouseleave="$event.currentTarget.style.background='var(--card-bg)'"
          ><span style="color: var(--color-kpi-morado);">+</span> Equipo</button>
        </div>
      </div>

      <!-- tabla usuarios -->
      <div class="lg:col-span-8">
        <div class="flex items-center justify-between mb-2 px-1">
          <p class="text-xs" style="color: var(--card-text-hint);">
            Mostrando <strong style="color: var(--card-text);">{{ usuariosFiltrados.length }}</strong>
            de <strong style="color: var(--card-text);">{{ store.usuarios.length }}</strong> usuarios
            <span v-if="nodoSeleccionado" class="font-semibold" style="color: var(--sidebar-bg);">
              — {{ nodoSeleccionado.nombre }}
            </span>
          </p>
        </div>

        <plantillatabla
          :titulo="tituloTabla"
          :encabezados="['Usuario', 'Rol', 'KPIs', 'Último Acceso', 'Estado']"
          :datos="usuariosFiltrados"
          :mostrarAcciones="true"
        >
          <template #default="{ fila }">

            <td class="p-4 align-middle text-left">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-[#3f2a52] text-white flex items-center justify-center text-[10px] font-bold shadow-sm flex-shrink-0">
                  {{ fila.nombre.charAt(0) }}{{ fila.apellidoPaterno.charAt(0) }}
                </div>
                <div>
                  <div class="font-bold text-xs leading-none" style="color: var(--text-general);">
                    {{ store.nombreCompleto(fila) }}
                  </div>
                  <div class="text-[11px] mt-0.5" style="color: var(--subtext-general);">{{ fila.email }}</div>
                  <div v-if="fila.telefono" class="text-[10px] mt-0.5" style="color: var(--subtext-general);">
                    {{ fila.telefono }}
                  </div>
                </div>
              </div>
            </td>

            <td class="p-4 align-middle text-center">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide"
                :class="store.colorPorRol(fila.rol)">
                {{ store.rolesDisponibles.find(r => r.codigo === fila.rol)?.nombre ?? fila.rol }}
              </span>
            </td>

            <td class="p-4 align-middle text-left">
              <div class="flex items-center gap-1.5">
                <span class="font-semibold text-sm" style="color: var(--text-general);">{{ fila.kpis }}</span>
                <span style="color: var(--card-text-hint);" class="text-xs"></span>
              </div>
            </td>

            <td class="p-4 align-middle text-left">
              <span class="text-xs" style="color: var(--subtext-general);">{{ fila.ultimoLogin ?? '—' }}</span>
            </td>

            <td class="p-4 align-middle text-center">
              <span
                class="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide inline-flex items-center gap-1.5 border"
                :class="{
                  'text-emerald-600 border-emerald-500 dark:text-emerald-400 dark:border-emerald-400': fila.estado === 'activo',
                  'text-amber-600 border-amber-500 dark:text-amber-400 dark:border-amber-400':         fila.estado === 'ausente',
                  'text-rose-600 border-rose-500 dark:text-rose-400 dark:border-rose-400':             fila.estado === 'bloqueado'
                }"
              >
                <span class="w-1.5 h-1.5 rounded-full animate-pulse"
                  :class="{
                    'bg-emerald-500': fila.estado === 'activo',
                    'bg-yellow-500':  fila.estado === 'ausente',
                    'bg-red-500':     fila.estado === 'bloqueado'
                  }"></span>
                {{ fila.estado }}
              </span>
            </td>

          </template>

          <template #iconos-acciones="{ item }">
            <button @click="abrirModificarRol(item)" title="Modificar Rol"
              class="p-2 rounded-lg transition-all text-sm"
              style="color: var(--card-text-hint); background: var(--tabla-header-bg);"
              @mouseover="$event.currentTarget.style.color='var(--sidebar-bg)'; $event.currentTarget.style.background='var(--tabla-hover)'"
              @mouseleave="$event.currentTarget.style.color='var(--card-text-hint)'; $event.currentTarget.style.background='var(--tabla-header-bg)'"
            ><i class="fi fi-sr-pencil"></i></button>
            <button @click="abrirPanelKpis(item)" title="Ver KPIs Asignados"
              class="p-2 rounded-lg transition-all text-sm"
              style="color: var(--card-text-hint); background: var(--tabla-header-bg);"
              @mouseover="$event.currentTarget.style.color='#77a9d4'; $event.currentTarget.style.background='rgba(119,169,212,0.1)'"
              @mouseleave="$event.currentTarget.style.color='var(--card-text-hint)'; $event.currentTarget.style.background='var(--tabla-header-bg)'"
            ><i class="fi fi-sr-stats"></i></button>
            <button @click="confirmarEliminacion(item)" title="Eliminar Usuario"
              class="p-2 rounded-lg transition-all text-sm"
              style="color: var(--card-text-hint); background: var(--tabla-header-bg);"
              @mouseover="$event.currentTarget.style.color='#ef4444'; $event.currentTarget.style.background='#fef2f2'"
              @mouseleave="$event.currentTarget.style.color='var(--card-text-hint)'; $event.currentTarget.style.background='var(--tabla-header-bg)'"
            ><i class="fi fi-sr-trash"></i></button>
          </template>
        </plantillatabla>
      </div>
    </div>

    <!-- panel lateral: KPIs del usuario -->
    <div v-if="mostrarPanelKpis"
      class="fixed inset-0 z-40 flex justify-end"
      style="background: rgba(0,0,0,0.4);"
      @click="mostrarPanelKpis = false">
      <div class="w-full max-w-md h-full shadow-2xl flex flex-col justify-between p-6 animate-slideLeft"
        style="background: var(--card-bg); border-left: 1px solid var(--tabla-borde);"
        @click.stop>
        <div>
          <div class="flex justify-between items-start pb-4 mb-6" style="border-bottom: 1px solid var(--card-border);">
            <div>
              <span class="text-[10px] font-black uppercase tracking-wider text-[#77a9d4]">KPIs Asignados</span>
              <h3 class="text-lg font-bold leading-tight" style="color: var(--sidebar-bg);">
                {{ store.nombreCompleto(usuarioSeleccionado) }}
              </h3>
              <p class="text-xs mt-0.5" style="color: var(--card-text-hint);">{{ usuarioSeleccionado?.email }}</p>
            </div>
            <button @click="mostrarPanelKpis = false"
              class="p-1 px-2.5 rounded-lg text-sm font-bold"
              style="color: var(--card-text-muted); background: var(--tabla-header-bg);">✕</button>
          </div>

          <div class="flex flex-col gap-3">
            <label class="text-[11px] font-bold uppercase tracking-wider block mb-1"
              style="color: var(--card-text-muted);">
              Métricas en seguimiento ({{ kpisDelUsuario.length }})
            </label>
            <div v-for="kpi in kpisDelUsuario" :key="kpi.id"
              class="flex items-center p-3 rounded-xl"
              style="border: 1px solid var(--card-border); background: var(--tabla-header-bg);">
              <span class="text-base mr-2.5">📈</span>
              <div>
                <div class="text-xs font-bold" style="color: var(--card-text);">{{ kpi.nombre }}</div>
                <div class="text-[10px]" style="color: var(--card-text-hint);">Meta: {{ kpi.meta }}</div>
              </div>
            </div>
            <div v-if="kpisDelUsuario.length === 0"
              class="text-center py-8 text-xs rounded-xl"
              style="color: var(--card-text-hint); border: 1px dashed var(--card-border);">
              Este usuario no tiene KPIs asignados.
            </div>
          </div>
        </div>

        <div class="pt-4" style="border-top: 1px solid var(--card-border);">
          <p class="text-[10px] text-center mb-3" style="color: var(--card-text-hint);">
            La asignación de KPIs se gestiona desde el módulo de Gestión de KPIs.
          </p>
          <button @click="$router.push('/kpis'); mostrarPanelKpis = false"
            class="w-full text-white font-bold text-xs py-3 rounded-lg transition-all uppercase tracking-wider"
            style="background: var(--sidebar-bg);">
            Ir a Gestión de KPIs
          </button>
        </div>
      </div>
    </div>

    <!-- panel lateral: modificar rol -->
    <div v-if="mostrarPanelRol"
      class="fixed inset-0 z-50 flex justify-end"
      style="background: rgba(0,0,0,0.4);"
      @click="mostrarPanelRol = false">
      <div class="w-full max-w-sm h-full shadow-2xl flex flex-col p-6 animate-slideLeft"
        style="background: var(--card-bg); border-left: 1px solid var(--tabla-borde);"
        @click.stop>
        <div class="flex justify-between items-start pb-4 mb-6" style="border-bottom: 1px solid var(--card-border);">
          <div>
            <h3 class="text-lg font-bold" style="color: var(--sidebar-bg);">Modificar Rol</h3>
            <p class="text-xs mt-0.5" style="color: var(--card-text-hint);">
              {{ store.nombreCompleto(usuarioSeleccionado) }}
            </p>
          </div>
          <button @click="mostrarPanelRol = false" class="text-lg" style="color: var(--card-text-muted);">✕</button>
        </div>

        <div class="flex flex-col gap-3 flex-1">
          <label class="text-[11px] font-bold uppercase tracking-wider" style="color: var(--card-text-muted);">
            Selecciona el nuevo rol
          </label>
          <div class="flex flex-col gap-2">
            <div v-for="rol in store.rolesDisponibles" :key="rol.id"
              @click="rol.eliminable && (rolSeleccionado = rol.codigo)"
              class="flex items-start gap-3 p-3 rounded-lg transition-all"
              :style="rol.codigo === rolSeleccionado
                ? 'border: 1px solid var(--sidebar-bg); background: rgba(190,174,216,0.15);'
                : 'border: 1px solid var(--card-border);'"
              :class="!rol.eliminable ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'"
            >
              <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                :style="rol.codigo === rolSeleccionado ? 'border-color: var(--sidebar-bg)' : 'border-color: var(--card-text-muted)'">
                <div v-if="rol.codigo === rolSeleccionado" class="w-2 h-2 rounded-full" style="background: var(--sidebar-bg);"></div>
              </div>
              <div>
                <p class="text-xs font-semibold" style="color: var(--card-text);">
                  {{ rol.nombre }}
                  <span v-if="!rol.eliminable" class="text-[9px] ml-1" style="color: var(--card-text-hint);">(no asignable)</span>
                </p>
                <p class="text-[10px] mt-0.5" style="color: var(--card-text-hint);">{{ rol.descripcion }}</p>
              </div>
            </div>
          </div>
        </div>

        <button @click="guardarRol"
          class="mt-6 w-full text-white font-bold text-xs py-3 rounded-lg transition-all uppercase tracking-wider"
          style="background: var(--sidebar-bg);"
          @mouseover="$event.currentTarget.style.background='var(--sidebar-active-bg)'; $event.currentTarget.style.color='var(--sidebar-active-text)'"
          @mouseleave="$event.currentTarget.style.background='var(--sidebar-bg)'; $event.currentTarget.style.color='white'"
        >Guardar Cambios</button>
      </div>
    </div>

    <ModalConfirmacion
      :isOpen="showModal"
      titulo="¿Estás seguro?"
      mensaje="Esta acción eliminará al usuario permanentemente."
      @confirmar="ejecutarEliminacion"
      @cancelar="showModal = false"
    />
  </div>
</template>

<style scoped>
@keyframes slideLeft {
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
}
.animate-slideLeft {
  animation: slideLeft 0.3s ease-out forwards;
}
</style>