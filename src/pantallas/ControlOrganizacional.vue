<script setup>
import { ref, computed, onMounted  } from 'vue'
import { getCurrentInstance } from 'vue'
import { useOrgStore } from "../stores/orgStore"
import { useKpiStore } from "../stores/kpiStore"
import plantillatabla     from '../components/PlantillaTabla.vue'
import ModalConfirmacion  from '../components/ModalConfirmacion.vue'
import EncabezadoPantalla from '../components/EncabezadoPantalla.vue'
import AppButton          from '../components/ui/AppButton.vue'
import FormField          from '../components/ui/FormField.vue'
import BotonAccion        from '../components/ui/BotonAccion.vue'
import EtiquetaBadge      from '../components/ui/EtiquetaBadge.vue'
import StatusBadge        from '../components/StatusBadge.vue'
import { useAuthStore } from '../stores/authStore'
import api from '../services/api'


const store    = useOrgStore()
const kpiStore = useKpiStore()
const { proxy } = getCurrentInstance()
const auth     = useAuthStore()

// ── Datos de la API ───────────────────────────────────────────────────────────
const usuarios = ref([])
const roles    = ref([])

onMounted(async () => {
  store.cargarTodo()
  const [resUsers, resRoles] = await Promise.all([
    api.get('/users'),
    api.get('/roles'),
  ])
  usuarios.value = resUsers.data
  roles.value    = resRoles.data
})

// árbol organizacional
const nodoSeleccionado = ref(null)

function seleccionarNodo(nodo) {
  // comparamos por uid para evitar colisión entre dept y equipo con mismo id numérico
  nodoSeleccionado.value = nodoSeleccionado.value?.uid === nodo.uid ? null : nodo
}

// filtros
const filtroRol      = ref('')
const filtroEstado   = ref('')
const filtroBusqueda = ref('')

const usuariosFiltrados = computed(() =>
  usuarios.value.filter(u => {
    // nodo.id tiene prefijo ("dept-1", "equipo-2") → extraemos solo el número
    // nodo.id ya es número en el orgStore actual
    const pasaNodo = !nodoSeleccionado.value ||
      (nodoSeleccionado.value.tipo === 'departamento' && u.department_id === nodoSeleccionado.value.id) ||
      (nodoSeleccionado.value.tipo === 'equipo'       && u.team_id       === nodoSeleccionado.value.id)
    const pasaRol      = filtroRol.value      === '' || u.roles?.[0]?.name === filtroRol.value
    const pasaEstado   = filtroEstado.value   === '' || u.status           === filtroEstado.value
    const pasaBusqueda = filtroBusqueda.value === '' ||
      `${u.name} ${u.paternal} ${u.maternal}`.toLowerCase().includes(filtroBusqueda.value.toLowerCase()) || // sirve para la búsqueda por nombre
      u.email.toLowerCase().includes(filtroBusqueda.value.toLowerCase())
    return pasaNodo && pasaRol && pasaEstado && pasaBusqueda
  })
)

const tituloTabla = computed(() =>
  nodoSeleccionado.value
    ? `Usuarios: ${nodoSeleccionado.value.nombre}`
    : `Todos los usuarios — ${store.empresaActiva?.name ?? ''}`
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
  rolSeleccionado.value     = usuario.roles?.[0]?.name ?? ''  // usa el rol real de la API
  mostrarPanelKpis.value = false
  mostrarPanelRol.value  = true
}

async function guardarRol() {
  try {
    await api.put(`/users/${usuarioSeleccionado.value.id}`, { role: rolSeleccionado.value })
    const u = usuarios.value.find(u => u.id === usuarioSeleccionado.value.id)
    if (u) {
      if (!u.roles) u.roles = [{}]
      u.roles[0] = { ...u.roles[0], name: rolSeleccionado.value }
    }
    proxy.$notify.success('Rol actualizado correctamente', 'Éxito')
  } catch {
    proxy.$notify.error('Error al actualizar el rol', 'Error')
  }
  mostrarPanelRol.value = false
}

// modal eliminar usuario
const showModal        = ref(false)
const usuarioAEliminar = ref(null)

function confirmarEliminacion(usuario) {
  usuarioAEliminar.value = usuario
  showModal.value = true
}

// modal eliminar nodo (departamento / equipo)
const showModalNodo  = ref(false)
const nodoAEliminar  = ref(null)

function confirmarEliminacionNodo(nodo) {
  nodoAEliminar.value = nodo
  showModalNodo.value = true
}

async function ejecutarEliminacion() {
  try {
    await api.delete(`/users/${usuarioAEliminar.value.id}`)
    usuarios.value = usuarios.value.filter(u => u.id !== usuarioAEliminar.value.id)
    proxy.$notify.success('Usuario eliminado correctamente', 'Éxito')
  } catch {
    proxy.$notify.error('Error al eliminar el usuario', 'Error')
  }
  showModal.value = false
}

// helpers árbol
function contarUsuarios(nodo) {
  // nodo.id es número directo desde el orgStore
  if (nodo.tipo === 'departamento') return usuarios.value.filter(u => u.department_id === nodo.id).length
  if (nodo.tipo === 'equipo')       return usuarios.value.filter(u => u.team_id       === nodo.id).length
  return usuarios.value.length
}

async function eliminarNodo() {
  const nodo = nodoAEliminar.value
  try {
    const endpoint = nodo.tipo === 'departamento' ? `/departments/${nodo.id}` : `/teams/${nodo.id}`
    await api.delete(endpoint)
    if (nodo.tipo === 'departamento') {
      store.departamentos = store.departamentos.filter(d => d.id !== nodo.id)
      store.equipos = store.equipos.filter(e => e.department_id !== nodo.id)
    } else {
      store.equipos = store.equipos.filter(e => e.id !== nodo.id)
    }
    if (nodoSeleccionado.value?.id === nodo.id) nodoSeleccionado.value = null
    proxy.$notify.success(`${nodo.nombre} eliminado correctamente`, 'Éxito')
  } catch {
    proxy.$notify.error(`Error al eliminar ${nodo.nombre}`, 'Error')
  }
  showModalNodo.value = false
}
</script>

<template>
  <div class="p-3 min-h-screen" style="background: transparent;">

    <EncabezadoPantalla
      titulo="Control Organizacional"
      descripcion="Estructura jerárquica de la empresa, control de acceso por roles y gestión de usuarios."
    />

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-5 rounded-xl shadow-md border border-[#beaed8]/90 mt-6"
      style="background: var(--card-bg);">

      <FormField label="Buscar usuario" :col-span="2">
        <input v-model="filtroBusqueda" type="text" placeholder="Nombre o correo..." class="app-input" />
      </FormField>

      <FormField label="Rol">
        <select v-model="filtroRol" class="app-select">
          <option value="">Todos los roles</option>
          <option v-for="rol in roles" :key="rol.id" :value="rol.name">
             {{ rol.name }}
          </option>
        </select>
      </FormField>

      <FormField label="Estado">
        <select v-model="filtroEstado" class="app-select">
          <option value="">Todos</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
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
            :key="nodo.uid"
            :style="{ paddingLeft: (nodo.nivel * 20) + 'px' }"
            class="group flex items-center justify-between p-2.5 rounded-xl transition-all duration-200 relative"
            :class="[
              nodo.tipo !== 'empresa' ? 'cursor-pointer' : 'cursor-default',
              nodoSeleccionado?.uid === nodo.uid ? 'ring-1 ring-[#3f2a52]/20' : ''
            ]"
            @click="nodo.tipo !== 'empresa' && seleccionarNodo(nodo)"
            @mouseover="nodo.tipo !== 'empresa' && $event.currentTarget.style.setProperty('background', 'var(--tabla-hover)')"
            @mouseleave="$event.currentTarget.style.setProperty('background', nodoSeleccionado?.uid === nodo.uid ? 'var(--tabla-hover)' : 'transparent')"
          >
            <div v-if="nodoSeleccionado?.uid === nodo.uid"
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
                :style="nodoSeleccionado?.uid === nodo.uid
                  ? 'background: var(--sidebar-active-bg); color: var(--sidebar-active-text);'
                  : 'background: var(--tabla-borde); color: var(--subtext-general);'"
              >{{ contarUsuarios(nodo) }}</span>

              <BotonAccion v-if="nodo.tipo !== 'empresa'"
                variante="trash"
                titulo="Eliminar"
                @click="confirmarEliminacionNodo(nodo)"
              />
            </div>
          </div>
        </div>

        <div class="p-3 flex gap-2" style="border-top: 1px solid var(--tabla-borde);">
          <AppButton variant="secondary" size="sm" class="flex-1 flex items-center justify-center gap-1" @click="$router.push('/FormularioDepartamento')">
            <span style="color: var(--color-kpi-morado);">+</span> Departamento
          </AppButton>
          <AppButton variant="secondary" size="sm" class="flex-1 flex items-center justify-center gap-1" @click="$router.push('/FormularioEquipo')">
            <span style="color: var(--color-kpi-morado);">+</span> Equipo
          </AppButton>
        </div>
      </div>

      <!-- tabla usuarios -->
      <div class="lg:col-span-8">
        <div class="flex items-center justify-between mb-2 px-1">
          <p class="text-xs" style="color: var(--card-text-hint);">
            Mostrando <strong style="color: var(--card-text);">{{ usuariosFiltrados.length }}</strong>
            de <strong style="color: var(--card-text);">{{ usuarios.length }}</strong> usuarios
            <span v-if="nodoSeleccionado" class="font-semibold" style="color: var(--text-encabezado);">
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
          <!-- apartado donde todos los registros seran datos reales  -->
          <template #default="{ fila }"> 

            <td class="p-4 align-middle text-left">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-[#3f2a52] text-white flex items-center justify-center text-[10px] font-bold shadow-sm flex-shrink-0">
                  {{ fila.name?.charAt(0) }}{{ fila.paternal?.charAt(0) }}
                </div>
                <div>
                    <div class="font-bold text-xs leading-none" style="color: var(--text-general);">
                        {{ fila.name }} {{ fila.paternal }} {{ fila.maternal }}
                     </div>
                  <div class="text-[11px] mt-0.5" style="color: var(--subtext-general);">{{ fila.email }}</div>
                  <div v-if="fila.phone" class="text-[10px] mt-0.5" style="color: var(--subtext-general);">
                    {{ fila.phone }}
                  </div>
                </div>
              </div>
            </td>

         <!--Apartado de roles -->
            <td class="p-4 align-middle text-center">
              <EtiquetaBadge
                :texto="store.rolesDisponibles.find(r => r.codigo === fila.roles?.[0]?.name)?.nombre ?? fila.roles?.[0]?.name"
                :clase="store.colorPorRol(fila.roles?.[0]?.name)"
/>
            </td>

            <td class="p-4 align-middle text-left">
              <div class="flex items-center gap-1.5">
                <span class="font-semibold text-sm" style="color: var(--text-general);">—</span>
                <span style="color: var(--card-text-hint);" class="text-xs"></span>
              </div>
            </td>

            <td class="p-4 align-middle text-left">
<span class="text-xs" style="color: var(--subtext-general);">{{ fila.last_login ? fila.last_login.slice(0, 10) : '—' }}</span>            </td>

          <!--apartado del estado -->
            <td class="p-4 align-middle text-center">
              <StatusBadge :tipo="fila.status" />
            </td>

          </template>

          <template #iconos-acciones="{ item }">
            <BotonAccion variante="edit"  titulo="Modificar Rol"      @click="abrirModificarRol(item)" />
            <BotonAccion variante="stats" titulo="Ver KPIs Asignados" @click="abrirPanelKpis(item)" />
            <BotonAccion variante="trash" titulo="Eliminar Usuario"   @click="confirmarEliminacion(item)" />
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
          <div class="flex justify-between items-start pb-4 mb-6" style="border-bottom: 1px solid var(--tabla-borde);">
            <div>
              <span class="text-[10px] font-black uppercase tracking-wider" style="color: var(--sidebar-active-bg);">KPIs Asignados</span>
              <h3 class="text-lg font-bold leading-tight" style="color: var(--text-encabezado);">
                {{ usuarioSeleccionado?.name }} {{ usuarioSeleccionado?.paternal }}
              </h3>
              <p class="text-xs mt-0.5" style="color: var(--subtext-general);">{{ usuarioSeleccionado?.email }}</p>
            </div>
            <BotonAccion variante="close" titulo="Cerrar" @click="mostrarPanelKpis = false" />
          </div>

          <div class="flex flex-col gap-3">
            <label class="text-[11px] font-bold uppercase tracking-wider block mb-1"
              style="color: var(--tabla-header-text);">
              Métricas en seguimiento ({{ kpisDelUsuario.length }})
            </label>
            <div v-for="kpi in kpisDelUsuario" :key="kpi.id"
              class="flex items-center p-3 rounded-xl"
              style="border: 1px solid var(--tabla-borde); background: var(--tabla-hover);">
              <span class="text-base mr-2.5">📈</span>
              <div>
                <div class="text-xs font-bold" style="color: var(--text-general);">{{ kpi.nombre }}</div>
                <div class="text-[10px]" style="color: var(--subtext-general);">Meta: {{ kpi.meta }}</div>
              </div>
            </div>
            <div v-if="kpisDelUsuario.length === 0"
              class="text-center py-8 text-xs rounded-xl"
              style="color: var(--subtext-general); border: 1px dashed var(--tabla-borde);">
              Este usuario no tiene KPIs asignados.
            </div>
          </div>
        </div>

        <div class="pt-4" style="border-top: 1px solid var(--tabla-borde);">
          <p class="text-[10px] text-center mb-3" style="color: var(--subtext-general);">
            La asignación de KPIs se gestiona desde el módulo de Gestión de KPIs.
          </p>
          <AppButton variant="primary" class="w-full justify-center" @click="$router.push('/kpis'); mostrarPanelKpis = false">
            Ir a Gestión de KPIs
          </AppButton>
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
        <div class="flex justify-between items-start pb-4 mb-6" style="border-bottom: 1px solid var(--tabla-borde);">
          <div>
            <h3 class="text-lg font-bold" style="color: var(--text-encabezado);">Modificar Rol</h3>
            <p class="text-xs mt-0.5" style="color: var(--subtext-general);">
              {{ usuarioSeleccionado?.name }} {{ usuarioSeleccionado?.paternal }}
            </p>
          </div>
          <BotonAccion variante="close" titulo="Cerrar" @click="mostrarPanelRol = false" />
        </div>

        <div class="flex flex-col gap-3 flex-1">
          <label class="text-[11px] font-bold uppercase tracking-wider" style="color: var(--tabla-header-text);">
            Selecciona el nuevo rol
          </label>
          <div class="flex flex-col gap-2">
            <div v-for="rol in roles" :key="rol.id"
              @click="rolSeleccionado = rol.name"
              class="flex items-start gap-3 p-3 rounded-lg transition-all cursor-pointer"
              :style="rol.name === rolSeleccionado
                ? 'border: 1px solid var(--sidebar-active-bg); background: var(--tabla-hover);'
                : 'border: 1px solid var(--tabla-borde);'"
            >
              <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                :style="rol.name === rolSeleccionado ? 'border-color: var(--sidebar-active-bg)' : 'border-color: var(--subtext-general)'">
                <div v-if="rol.name === rolSeleccionado" class="w-2 h-2 rounded-full" style="background: var(--sidebar-active-bg);"></div>
              </div>
              <div>
                <p class="text-xs font-semibold" style="color: var(--text-general);">{{ rol.name }}</p>
                <p class="text-[10px] mt-0.5" style="color: var(--subtext-general);">{{ rol.description ?? '' }}</p>
              </div>
            </div>
          </div>
        </div>

        <AppButton variant="primary" class="mt-6 w-full justify-center" @click="guardarRol">
          Guardar Cambios
        </AppButton>
      </div>
    </div>

    <ModalConfirmacion
      :isOpen="showModal"
      titulo="¿Estás seguro?"
      mensaje="Esta acción eliminará al usuario permanentemente."
      @confirmar="ejecutarEliminacion"
      @cancelar="showModal = false"
    />

    <ModalConfirmacion
      :isOpen="showModalNodo"
      titulo="¿Estás seguro?"
      :mensaje="`Esta acción eliminará el ${nodoAEliminar?.tipo === 'departamento' ? 'departamento' : 'equipo'} permanentemente.`"
      @confirmar="eliminarNodo"
      @cancelar="showModalNodo = false"
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