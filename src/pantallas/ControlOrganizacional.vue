<script setup>
import { ref, computed } from 'vue'
import { getCurrentInstance } from 'vue'
import plantillatabla from '../components/PlantillaTabla.vue'
import ModalConfirmacion from '../components/ModalConfirmacion.vue'
import EncabezadoPantalla from '../components/EncabezadoPantalla.vue'
import { usePanelStore } from '../stores/panelStore'

const store = usePanelStore()
const { proxy } = getCurrentInstance()

// ── NODO SELECCIONADO EN EL ÁRBOL ────────────────────────────────────────
// Cuando el usuario hace clic en un nodo del árbol,
// guardamos ese nodo aquí y la tabla se filtra automáticamente.
// null = mostrar todos los usuarios
const nodoSeleccionado = ref(null)

function seleccionarNodo(nodo) {
  // Si ya estaba seleccionado, lo deseleccionamos (toggle)
  if (nodoSeleccionado.value?.id === nodo.id) {
    nodoSeleccionado.value = null
  } else {
    nodoSeleccionado.value = nodo
  }
}

// ── FILTROS DE LA TABLA ──────────────────────────────────────────────────
const filtroRol = ref('')
const filtroEstado = ref('')
const filtroBusqueda = ref('')

// ── COMPUTED: usuarios filtrados ─────────────────────────────────────────
// Aplica el nodo del árbol + los filtros del select simultáneamente
const usuariosFiltrados = computed(() => {
  return store.usuarios.filter(u => {

    // Filtro por nodo del árbol
    // Si se seleccionó un departamento → solo usuarios de ese departamento
    // Si se seleccionó un equipo → solo usuarios de ese equipo
    const pasaNodo = !nodoSeleccionado.value ||
      (nodoSeleccionado.value.tipo === 'departamento' && u.departamento_id === nodoSeleccionado.value.id) ||
      (nodoSeleccionado.value.tipo === 'equipo' && u.equipo_id === nodoSeleccionado.value.id)

    const pasaRol = filtroRol.value === '' || u.rol === filtroRol.value
    const pasaEstado = filtroEstado.value === '' || u.estado === filtroEstado.value
    const pasaBusqueda = filtroBusqueda.value === '' ||
      store.nombreCompleto(u).toLowerCase().includes(filtroBusqueda.value.toLowerCase()) ||
      u.email.toLowerCase().includes(filtroBusqueda.value.toLowerCase())

    return pasaNodo && pasaRol && pasaEstado && pasaBusqueda
  })
})

// Título dinámico de la tabla según el nodo seleccionado
const tituloTabla = computed(() => {
  if (!nodoSeleccionado.value) return `Todos los usuarios — ${store.empresaActiva.nombre}`
  return `Usuarios: ${nodoSeleccionado.value.nombre}`
})

function limpiarFiltros() {
  filtroRol.value = ''
  filtroEstado.value = ''
  filtroBusqueda.value = ''
  nodoSeleccionado.value = null
}

// ── PANEL LATERAL: KPIs del usuario ──────────────────────────────────────
const mostrarPanelKpis = ref(false)
const usuarioSeleccionado = ref(null)

const kpisSimulados = ref([
  { nombre: 'Eficiencia de Entrega (OTIF)', meta: '> 95%' },
  { nombre: 'Costo por Kilómetro Recorrido', meta: '< $12.50' },
  { nombre: 'Rotación de Inventario en Almacén', meta: '12 Veces/Año' },
])

function abrirPanelKpis(usuario) {
  usuarioSeleccionado.value = usuario
  mostrarPanelRol.value = false
  mostrarPanelKpis.value = true
}

// ── PANEL LATERAL: Modificar rol ─────────────────────────────────────────
const mostrarPanelRol = ref(false)
const rolSeleccionado = ref('')

function abrirModificarRol(usuario) {
  usuarioSeleccionado.value = usuario
  rolSeleccionado.value = usuario.rol
  mostrarPanelKpis.value = false
  mostrarPanelRol.value = true
}

function guardarRol() {
  // Actualizamos el rol en el store directamente
  // Cuando llegue el backend, aquí irá la llamada a la API
  const index = store.usuarios.findIndex(u => u.id === usuarioSeleccionado.value.id)
  if (index !== -1) {
    store.usuarios[index].rol = rolSeleccionado.value
  }
  proxy.$notify.success('Rol actualizado correctamente', 'Éxito')
  mostrarPanelRol.value = false
}

// ── MODAL DE ELIMINACIÓN ─────────────────────────────────────────────────
const showModal = ref(false)
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

// ── HELPERS ──────────────────────────────────────────────────────────────
// Ícono del árbol según el tipo de nodo
function iconoNodo(nodo) {
  if (nodo.tipo === 'empresa')      return '🏢'
  if (nodo.tipo === 'departamento') return '📁'
  if (nodo.tipo === 'equipo')       return '👥'
  return '•'
}

// Cuenta cuántos usuarios hay en un nodo (para el badge)
function contarUsuarios(nodo) {
  if (nodo.tipo === 'departamento') {
    return store.usuarios.filter(u => u.departamento_id === nodo.id).length
  }
  if (nodo.tipo === 'equipo') {
    return store.usuarios.filter(u => u.equipo_id === nodo.id).length
  }
  return store.usuarios.length
}

// Elimina un nodo del árbol (departamento o equipo)
// También elimina todos sus hijos para no dejar nodos huérfanos
function eliminarNodo(nodo) {
  // Primero recogemos los IDs de los hijos directos
  const hijosIds = store.estructuraOrganizacional
    .filter(n => n.padre_id === nodo.id)
    .map(n => n.id)

  // Eliminamos el nodo y todos sus hijos en un solo filter
  store.estructuraOrganizacional = store.estructuraOrganizacional
    .filter(n => n.id !== nodo.id && !hijosIds.includes(n.id))

  // Si el nodo eliminado era el seleccionado, limpiamos la selección
  if (nodoSeleccionado.value?.id === nodo.id) {
    nodoSeleccionado.value = null
  }

  proxy.$notify.success(`${nodo.nombre} eliminado correctamente`, 'Éxito')
}
</script>

<template>
  <div class="p-3 min-h-screen">

    <EncabezadoPantalla
      titulo="Control Organizacional"
      descripcion="Estructura jerárquica de la empresa, control de acceso por roles y gestión de usuarios."
    />

    <!-- ── FILTROS ── -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-5 bg-white rounded-xl shadow-md border border-[#beaed8]/90 mt-6">

      <!-- Búsqueda -->
      <div class="flex flex-col gap-1.5 lg:col-span-2">
        <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Buscar usuario</label>
        <input
          v-model="filtroBusqueda"
          type="text"
          placeholder="Nombre o correo..."
          class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] focus:ring-2 focus:ring-[#3f2a52]/20 transition-colors"
        />
      </div>

      <!-- Filtro por rol -->
      <div class="flex flex-col gap-1.5">
        <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Rol</label>
        <select
          v-model="filtroRol"
          class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] cursor-pointer transition-colors"
        >
          <option value="">Todos los roles</option>
          <!--
            Los roles vienen del store, igual que los departamentos
            en GestionKpis. Si el asesor agrega un rol nuevo,
            aparece solo aquí sin tocar este archivo.
          -->
          <option v-for="rol in store.rolesDisponibles" :key="rol.id" :value="rol.codigo">
            {{ rol.nombre }}
          </option>
        </select>
      </div>

      <!-- Filtro por estado -->
      <div class="flex flex-col gap-1.5">
        <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Estado</label>
        <select
          v-model="filtroEstado"
          class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] cursor-pointer transition-colors"
        >
          <option value="">Todos</option>
          <option value="activo">Activo</option>
          <option value="ausente">Ausente</option>
          <option value="bloqueado">Bloqueado</option>
        </select>
      </div>

      <!-- Botones -->
      <div class="flex items-end gap-2">
        <button
          @click="limpiarFiltros"
          class="border border-[#beaed8] text-[#3f2a52] hover:bg-[#beaed8]/20 font-bold text-xs px-3 py-2.5 rounded-lg transition-all flex-1"
        >
          Limpiar
        </button>
        <button
          @click="$router.push('/organizacion/nuevo')"
          class="bg-[#3f2a52] hover:bg-[#beaed8] text-white font-bold text-xs px-3 py-2.5 rounded-lg transition-all flex-1"
        >
          + Nuevo
        </button>
      </div>

    </div>

    <!-- ── GRID PRINCIPAL: árbol + tabla ── -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">

      <!-- ── ÁRBOL ORGANIZACIONAL ── -->
      <div class="lg:col-span-4 bg-white rounded-xl shadow-md border border-[#beaed8]/90 mt-2 overflow-hidden flex flex-col">

        <div class="p-4 border-b border-[#beaed8]/30 bg-gradient-to-r from-gray-50 to-white">
          <h2 class="text-sm font-bold text-[#3f2a52] tracking-tight">Estructura Organizacional</h2>
          <p class="text-[10px] text-gray-400 mt-0.5">
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
      nodo.tipo !== 'empresa' ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default',
      nodoSeleccionado?.id === nodo.id ? 'bg-[#3f2a52]/5 ring-1 ring-[#3f2a52]/20' : ''
    ]"
    @click="nodo.tipo !== 'empresa' && seleccionarNodo(nodo)"
  >
    <div
      v-if="nodoSeleccionado?.id === nodo.id"
      class="absolute left-0 top-2 bottom-2 w-1 bg-[#3f2a52] rounded-r-md"
    ></div>

    <div class="flex items-center gap-2.5 text-xs">
      <span v-if="nodo.nivel === 0" class="text-sm">
        <i class="fi fi-sr-globe text-[#beaed8]"></i>
      </span>
      <span v-else-if="nodo.nivel === 1" class="text-[#77a9d4]">
        <i class="fi fi-sr-bullet"></i>
      </span>
      <span v-else class="text-gray-300 text-[10px] font-bold">└─</span>

      <div class="flex flex-col">
        <span
          class="tracking-wide"
          :class="[
            nodo.nivel === 0 ? 'text-[#3f2a52] font-bold text-sm'
              : nodo.nivel === 1 ? 'text-gray-700 font-semibold'
              : 'text-gray-500 font-medium',
            nodoSeleccionado?.id === nodo.id ? 'text-[#3f2a52]' : ''
          ]"
        >
          {{ nodo.nombre }}
        </span>
        <span v-if="nodo.responsable || nodo.lider" class="text-[9px] text-gray-400">
          {{ nodo.tipo === 'equipo' ? 'Líder:' : 'Resp:' }}
          {{ nodo.responsable ?? nodo.lider }}
        </span>
      </div>
    </div>

    <div class="flex items-center gap-1.5 flex-shrink-0">
      <span
        v-if="nodo.tipo !== 'empresa'"
        class="text-[9px] px-2 py-0.5 rounded-md font-black tracking-wider"
        :class="nodoSeleccionado?.id === nodo.id
          ? 'bg-[#3f2a52] text-white'
          : 'bg-gray-100 text-gray-500'"
      >
        {{ contarUsuarios(nodo) }}
      </span>
      <button
        v-if="nodo.tipo !== 'empresa'"
        @click.stop="eliminarNodo(nodo)"
        title="Eliminar"
        class="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 hover:bg-red-50 p-1 rounded-lg transition-all text-xs"
      >
        <i class="fi fi-sr-trash"></i>
      </button>
    </div>

  </div>
</div>

       <div class="p-3 border-t border-[#beaed8]/20 flex gap-2">
  <button
    @click="$router.push('/FormularioDepartamento')"
    class="flex-1 bg-white hover:bg-gray-50 text-[#3f2a52] border border-[#beaed8]/80 text-[10px] font-bold uppercase tracking-wider py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all"
  >
    <span class="text-[#beaed8]">+</span> Departamento
  </button>
  <button
    @click="$router.push('/FormularioEquipo')"
    class="flex-1 bg-white hover:bg-gray-50 text-[#3f2a52] border border-[#beaed8]/80 text-[10px] font-bold uppercase tracking-wider py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all"
  >
    <span class="text-[#beaed8]">+</span> Equipo
  </button>
</div>

      </div>

      <!-- ── TABLA DE USUARIOS ── -->
      <div class="lg:col-span-8">

        <!-- Contador de resultados -->
        <div class="flex items-center justify-between mb-2 px-1">
          <p class="text-xs text-slate-400">
            Mostrando <strong class="text-slate-600">{{ usuariosFiltrados.length }}</strong>
            de <strong class="text-slate-600">{{ store.usuarios.length }}</strong> usuarios
            <span v-if="nodoSeleccionado" class="text-[#3f2a52] font-semibold">
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

            <!-- Usuario: avatar + nombre completo + correo -->
            <td class="p-4 align-middle text-left">
              <div class="flex items-center gap-3">
                <!--
                  Avatar generado con las iniciales del nombre.
                  Cuando llegue el backend, aquí iría un <img> con la foto.
                -->
                <div class="w-8 h-8 rounded-full bg-[#3f2a52] text-white flex items-center justify-center text-[10px] font-bold shadow-sm flex-shrink-0">
                  {{ fila.nombre.charAt(0) }}{{ fila.apellidoPaterno.charAt(0) }}
                </div>
                <div>
                  <div class="font-bold text-gray-800 text-xs leading-none">
                    {{ store.nombreCompleto(fila) }}
                  </div>
                  <div class="text-[11px] text-gray-400 mt-0.5">{{ fila.email }}</div>
                  <div v-if="fila.telefono" class="text-[10px] text-gray-300 mt-0.5">
                    {{ fila.telefono }}
                  </div>
                </div>
              </div>
            </td>

            <!-- Rol con badge de color del store -->
            <td class="p-4 align-middle text-left">
              <span
                class="text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide"
                :class="store.colorPorRol(fila.rol)"
              >
                {{ store.rolesDisponibles.find(r => r.codigo === fila.rol)?.nombre ?? fila.rol }}
              </span>
            </td>

            <!-- KPIs asignados -->
            <td class="p-4 align-middle text-left">
              <div class="flex items-center gap-1.5">
                <span class="font-semibold text-gray-800 text-sm">{{ fila.kpis }}</span>
                <span class="text-gray-400 text-xs">📋</span>
              </div>
            </td>

            <!-- Último acceso -->
            <td class="p-4 align-middle text-left">
              <span class="text-xs text-gray-500">{{ fila.ultimoLogin ?? '—' }}</span>
            </td>

            <!-- Estado con badge de color -->
            <td class="p-4 align-middle text-left">
              <span
                class="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide inline-flex items-center gap-1.5 border"
                :class="{
                  'bg-emerald-50 text-emerald-700 border-emerald-200': fila.estado === 'activo',
                  'bg-yellow-50 text-yellow-700 border-yellow-200':   fila.estado === 'ausente',
                  'bg-red-50 text-red-700 border-red-200':            fila.estado === 'bloqueado'
                }"
              >
                <span
                  class="w-1.5 h-1.5 rounded-full animate-pulse"
                  :class="{
                    'bg-emerald-500': fila.estado === 'activo',
                    'bg-yellow-500':  fila.estado === 'ausente',
                    'bg-red-500':     fila.estado === 'bloqueado'
                  }"
                ></span>
                {{ fila.estado }}
              </span>
            </td>

          </template>

          <template #iconos-acciones="{ item }">
            <!-- Modificar rol -->
            <button
              @click="abrirModificarRol(item)"
              title="Modificar Rol"
              class="text-gray-400 hover:text-[#3f2a52] bg-gray-50 hover:bg-[#3f2a52]/5 p-2 rounded-lg transition-all text-sm"
            >
              <i class="fi fi-sr-pencil"></i>
            </button>
            <!-- Ver KPIs -->
            <button
              @click="abrirPanelKpis(item)"
              title="Ver KPIs Asignados"
              class="text-gray-400 hover:text-[#77a9d4] bg-gray-50 hover:bg-[#77a9d4]/10 p-2 rounded-lg transition-all text-sm"
            >
              <i class="fi fi-sr-stats"></i>
            </button>
            <!-- Eliminar -->
            <button
              @click="confirmarEliminacion(item)"
              title="Eliminar Usuario"
              class="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-2 rounded-lg transition-all text-sm"
            >
              <i class="fi fi-sr-trash"></i>
            </button>
          </template>
        </plantillatabla>

      </div>
    </div>

    <!-- ── PANEL LATERAL: KPIs del usuario ── -->
    <div
      v-if="mostrarPanelKpis"
      class="fixed inset-0 bg-gray-900/30 z-40 flex justify-end"
      @click="mostrarPanelKpis = false"
    >
      <div
        class="bg-white w-full max-w-md h-full shadow-2xl border-l border-[#beaed8]/50 flex flex-col justify-between p-6 animate-slideLeft"
        @click.stop
      >
        <div>
          <div class="flex justify-between items-start border-b border-gray-100 pb-4 mb-6">
            <div>
              <span class="text-[10px] font-black uppercase tracking-wider text-[#77a9d4]">KPIs Asignados</span>
              <h3 class="text-lg font-bold text-[#3f2a52] leading-tight">
                {{ store.nombreCompleto(usuarioSeleccionado) }}
              </h3>
              <p class="text-xs text-gray-400 mt-0.5">{{ usuarioSeleccionado?.email }}</p>
            </div>
            <button @click="mostrarPanelKpis = false" class="text-gray-400 hover:text-gray-600 bg-gray-100 p-1 px-2.5 rounded-lg text-sm font-bold">✕</button>
          </div>

          <div class="flex flex-col gap-3">
            <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
              Métricas en seguimiento ({{ kpisSimulados.length }})
            </label>
            <div
              v-for="(kpi, index) in kpisSimulados"
              :key="index"
              class="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-center gap-2.5">
                <span class="text-base">📈</span>
                <div>
                  <div class="text-xs font-bold text-gray-700">{{ kpi.nombre }}</div>
                  <div class="text-[10px] text-gray-400">Meta: {{ kpi.meta }}</div>
                </div>
              </div>
              <button @click="kpisSimulados.splice(index, 1)" class="text-gray-400 hover:text-red-500 text-xs p-1 font-bold">✕</button>
            </div>
            <div v-if="kpisSimulados.length === 0" class="text-center py-8 text-gray-400 text-xs border border-dashed border-gray-200 rounded-xl">
              Este usuario no tiene KPIs asignados.
            </div>
          </div>
        </div>

        <div class="border-t border-gray-100 pt-4">
          <p class="text-[10px] text-gray-400 text-center mb-3">
            La asignación de KPIs se gestiona desde el módulo de Gestión de KPIs.
          </p>
          <button
            @click="$router.push('/kpis'); mostrarPanelKpis = false"
            class="w-full bg-[#3f2a52] hover:bg-[#77a9d4] text-white font-bold text-xs py-3 rounded-lg transition-all uppercase tracking-wider"
          >
            Ir a Gestión de KPIs
          </button>
        </div>
      </div>
    </div>

    <!-- ── PANEL LATERAL: Modificar rol ── -->
    <div
      v-if="mostrarPanelRol"
      class="fixed inset-0 bg-gray-900/30 z-50 flex justify-end"
      @click="mostrarPanelRol = false"
    >
      <div
        class="bg-white w-full max-w-sm h-full shadow-2xl border-l border-[#beaed8]/50 flex flex-col p-6 animate-slideLeft"
        @click.stop
      >
        <div class="flex justify-between items-start border-b border-gray-100 pb-4 mb-6">
          <div>
            <h3 class="text-lg font-bold text-[#3f2a52]">Modificar Rol</h3>
            <p class="text-xs text-gray-400 mt-0.5">
              {{ store.nombreCompleto(usuarioSeleccionado) }}
            </p>
          </div>
          <button @click="mostrarPanelRol = false" class="text-gray-400 hover:text-gray-600 text-lg">✕</button>
        </div>

        <div class="flex flex-col gap-3 flex-1">
          <!--
            Mostramos los roles como tarjetas seleccionables
            en lugar de un select simple. Así el usuario entiende
            qué hace cada rol antes de asignarlo.
            Los roles no eliminables (developer, admin) están deshabilitados
            para no poder asignarlos desde aquí.
          -->
          <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            Selecciona el nuevo rol
          </label>
          <div class="flex flex-col gap-2">
            <div
              v-for="rol in store.rolesDisponibles"
              :key="rol.id"
              @click="!(!rol.eliminable) && (rolSeleccionado = rol.codigo)"
              class="flex items-start gap-3 p-3 rounded-lg border transition-all"
              :class="[
                rol.codigo === rolSeleccionado
                  ? 'border-[#3f2a52] bg-purple-50'
                  : 'border-slate-100 hover:border-slate-300',
                !rol.eliminable
                  ? 'opacity-40 cursor-not-allowed'
                  : 'cursor-pointer'
              ]"
            >
              <div
                class="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                :class="rol.codigo === rolSeleccionado ? 'border-[#3f2a52]' : 'border-slate-300'"
              >
                <div v-if="rol.codigo === rolSeleccionado" class="w-2 h-2 rounded-full bg-[#3f2a52]"></div>
              </div>
              <div>
                <p class="text-xs font-semibold text-slate-700">
                  {{ rol.nombre }}
                  <span v-if="!rol.eliminable" class="text-[9px] text-gray-400 ml-1">(no asignable)</span>
                </p>
                <p class="text-[10px] text-slate-400 mt-0.5">{{ rol.descripcion }}</p>
              </div>
            </div>
          </div>
        </div>

        <button
          @click="guardarRol"
          class="mt-6 w-full bg-[#3f2a52] hover:bg-[#beaed8] text-white font-bold text-xs py-3 rounded-lg transition-all uppercase tracking-wider"
        >
          Guardar Cambios
        </button>
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
  to { transform: translateX(0); }
}
.animate-slideLeft {
  animation: slideLeft 0.3s ease-out forwards;
}
</style>