<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { getCurrentInstance } from 'vue'
import { useOrgStore } from "../stores/orgStore"
import plantillatabla     from '../components/PlantillaTabla.vue'
import ModalConfirmacion  from '../components/ModalConfirmacion.vue'
import EncabezadoPantalla from '../components/EncabezadoPantalla.vue'
import AppButton          from '../components/ui/AppButton.vue'
import FormField          from '../components/ui/FormField.vue'
import BotonAccion        from '../components/ui/BotonAccion.vue'
import EtiquetaBadge      from '../components/ui/EtiquetaBadge.vue'
import StatusBadge        from '../components/StatusBadge.vue'
import EmptyState         from '../components/ui/EmptyState.vue'
import { useAuthStore } from '../stores/authStore'
import { usePermissions } from '../composables/usePermissions'
import api from '../services/api'

const store    = useOrgStore()
const { proxy } = getCurrentInstance()
const auth     = useAuthStore()
const { can }  = usePermissions()

const apiBase = import.meta.env.VITE_API_URL.replace('/api', '')

// ── Datos de la API ───────────────────────────────────────────────────────────
const usuarios     = ref([])
const assignments  = ref([])  // todos los assignments para contar por usuario
const roles        = ref([])
const cargando     = ref(true)

onMounted(async () => {
  await store.cargarTodo()

  const [resUsers, resAssignments, resRoles] = await Promise.allSettled([
    api.get('/users'),
    api.get('/kpi-assignments'),
    api.get('/roles'),
  ])

  if (resUsers.status === 'fulfilled')       usuarios.value    = resUsers.value.data
  if (resAssignments.status === 'fulfilled') assignments.value = resAssignments.value.data
  if (resRoles.status === 'fulfilled')       roles.value       = resRoles.value.data
  cargando.value = false
})

function contarKpisUsuario(userId) {
  return assignments.value.filter(a => a.user_id === userId && a.status === 'active').length
}

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

const tituloTabla = computed(() => {
  if (!nodoSeleccionado.value) return `Todos los usuarios — ${store.empresaActiva?.name ?? ''}`
  const tipo = nodoSeleccionado.value.tipo === 'equipo' ? 'Equipo' : 'Departamento'
  return `Usuarios: ${tipo} ${nodoSeleccionado.value.nombre}`
})

const breadcrumbNodo = computed(() => {
  if (!nodoSeleccionado.value) return null
  if (nodoSeleccionado.value.tipo === 'departamento') return nodoSeleccionado.value.nombre
  // Si es equipo, buscar el departamento padre
  const dep = store.departamentos.find(d => d.id === nodoSeleccionado.value.padre_id)
  return dep ? `${dep.name} — ${nodoSeleccionado.value.nombre}` : nodoSeleccionado.value.nombre
})

function limpiarFiltros() {
  filtroRol.value      = ''
  filtroEstado.value   = ''
  filtroBusqueda.value = ''
  nodoSeleccionado.value = null
}

// ── Paginación ────────────────────────────────────────────────────────────────
const paginaActual = ref(1)
const porPagina    = 10

const totalPaginas = computed(() => Math.max(1, Math.ceil(usuariosFiltrados.value.length / porPagina)))

const usuariosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * porPagina
  return usuariosFiltrados.value.slice(inicio, inicio + porPagina)
})

watch([filtroRol, filtroEstado, filtroBusqueda, nodoSeleccionado],
  () => { paginaActual.value = 1 }
)

const paginasVisibles = computed(() => {
  const total  = totalPaginas.value
  const actual = paginaActual.value
  const inicio = Math.max(1, actual - 2)
  const fin    = Math.min(total, actual + 2)
  const paginas = []
  for (let i = inicio; i <= fin; i++) paginas.push(i)
  return paginas
})

// panel KPIs del usuario
const mostrarPanelKpis    = ref(false)
const usuarioSeleccionado = ref(null)
const kpisDelUsuario      = ref([])
const cargandoKpis        = ref(false)

async function abrirPanelKpis(usuario) {
  usuarioSeleccionado.value = usuario
  mostrarPanelKpis.value    = true
  kpisDelUsuario.value      = []
  cargandoKpis.value        = true
  try {
    const res = await api.get(`/kpi-assignments?user_id=${usuario.id}`)
    kpisDelUsuario.value = res.data
      .filter(a => a.status === 'active' && a.kpi)
      .map(a => ({
        id:     a.kpi.id,
        nombre: a.kpi.name,
        meta:   a.kpi.goal ? `${parseFloat(a.kpi.goal)} ${a.kpi.unit ?? ''}`.trim() : '—',
        valor:  a.kpi.latest_record ? Number(a.kpi.latest_record.value) : null,
        unit:   a.kpi.unit ?? '',
      }))
  } catch {
    proxy.$notify.error('Error al cargar KPIs del usuario', 'Error')
  } finally {
    cargandoKpis.value = false
  }
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

    <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-2">
      <EncabezadoPantalla
        titulo="Control Empresarial"
        descripcion="Estructura jerárquica de la empresa, control de acceso por roles y gestión de usuarios."
      />
      <AppButton v-if="can('roles.index')" variant="secondary" class="flex-shrink-0" @click="$router.push('/roles')">
         Roles y permisos
      </AppButton>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-5 rounded-xl shadow-md border border-[#beaed8]/90 mt-6"
      style="background: var(--card-bg);">

      <FormField label="Buscar usuario" :col-span="2">
        <input v-model="filtroBusqueda" type="text" placeholder="Nombre o correo..." class="app-input" />
      </FormField>

      <FormField label="Rol">
        <select v-model="filtroRol" class="app-select">
          <option value="">Todos los roles</option>
          <option v-for="rol in store.rolesDisponibles" :key="rol.codigo" :value="rol.codigo">
             {{ rol.nombre }}
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
        <AppButton v-if="can('users.store')" class="flex-1" @click="$router.push('/organizacion/nuevo')">+ Nuevo</AppButton>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">

      <!-- árbol organizacional — solo visible con permiso org.view_tree -->
      <div v-if="can('org.view_tree')" class="lg:col-span-4 rounded-xl shadow-md border border-[#beaed8]/90 mt-2 overflow-hidden self-start"
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

              <template v-if="nodo.tipo !== 'empresa'">
                <BotonAccion
                  v-if="can(nodo.tipo === 'departamento' ? 'org.manage_departments' : 'org.manage_teams')"
                  variante="edit"
                  titulo="Editar"
                  @click="$router.push(nodo.tipo === 'departamento' ? `/departamentos/editar/${nodo.id}` : `/equipos/editar/${nodo.id}`)"
                />
                <BotonAccion
                  v-if="can(nodo.tipo === 'departamento' ? 'org.manage_departments' : 'org.manage_teams')"
                  variante="trash"
                  titulo="Eliminar"
                  @click="confirmarEliminacionNodo(nodo)"
                />
              </template>
            </div>
          </div>
        </div>

        <div class="p-3 flex gap-2" style="border-top: 1px solid var(--tabla-borde);">
          <AppButton v-if="can('org.manage_departments')" variant="secondary" size="sm" class="flex-1 flex items-center justify-center gap-1" @click="$router.push('/FormularioDepartamento')">
            <span style="color: var(--color-kpi-morado);">+</span> Departamento
          </AppButton>
          <AppButton v-if="can('org.manage_teams')" variant="secondary" size="sm" class="flex-1 flex items-center justify-center gap-1" @click="$router.push('/FormularioEquipo')">
            <span style="color: var(--color-kpi-morado);">+</span> Equipo
          </AppButton>
        </div>
      </div>

      <!-- tabla usuarios — ocupa todo el ancho si el árbol no es visible -->
      <div v-if="can('org.view_users_table')" :class="can('org.view_tree') ? 'lg:col-span-8' : 'lg:col-span-12'">
        <div class="flex items-center justify-between mb-2 px-1">
          <p class="text-xs" style="color: var(--card-text-hint);">
            Mostrando <strong style="color: var(--card-text);">{{ usuariosPaginados.length }}</strong>
            de <strong style="color: var(--card-text);">{{ usuariosFiltrados.length }}</strong> usuarios
            <span v-if="breadcrumbNodo" class="font-semibold" style="color: var(--text-encabezado);">
              — {{ breadcrumbNodo }}
            </span>
          </p>
        </div>

        <!-- Descripción del nodo seleccionado -->
        <div v-if="nodoSeleccionado?.descripcion" class="mb-3 px-4 py-2.5 rounded-xl text-xs shadow-md"
          style="background: var(--card-bg); border: 1px solid rgba(190,174,216,0.4); color: var(--subtext-general);">
          <span class="font-semibold" style="color: var(--text-general);">Descripción: </span>{{ nodoSeleccionado.descripcion }}
        </div>

        <EmptyState
          v-if="!cargando && usuarios.length === 0"
          icono="fi-sr-users-alt"
          titulo="No hay colaboradores registrados"
          subtexto="Esta empresa aún no tiene usuarios en el sistema."
          botonTexto="Registrar Colaborador"
          botonIcono="fi-sr-user-add"
          @accion="$router.push('/organizacion/nuevo')"
        />

        <EmptyState
          v-else-if="!cargando && usuariosFiltrados.length === 0"
          icono="fi-sr-search"
          titulo="Sin resultados"
          subtexto="Ningún colaborador coincide con los filtros aplicados."
        />

        <plantillatabla
          v-else
          :titulo="tituloTabla"
          :encabezados="['Usuario', 'Rol', 'KPIs', 'Último Acceso', 'Estado']"
          :datos="usuariosPaginados"
          :mostrarAcciones="can('users.update') || can('users.destroy') || can('org.manage_departments')"
        >
          <!-- apartado donde todos los registros seran datos reales  -->
          <template #default="{ fila }"> 

            <td class="p-4 align-middle">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 shadow-sm">
                  <img
                    v-if="fila.profile_photo"
                    :src="`${apiBase}/storage/${fila.profile_photo}`"
                    :alt="`${fila.name} ${fila.paternal}`"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full bg-[#3f2a52] text-white flex items-center justify-center text-[10px] font-bold">
                    {{ fila.name?.charAt(0) }}{{ fila.paternal?.charAt(0) }}
                  </div>
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
            <td class="p-4 align-middle">
              <EtiquetaBadge
                :texto="store.rolesDisponibles.find(r => r.codigo === fila.roles?.[0]?.name)?.nombre ?? { developer: 'Desarrollador', admin: 'Administrador', manager: 'Gerente', employee: 'Empleado', auditor: 'Auditor', 'team-leader': 'Líder de Equipo' }[fila.roles?.[0]?.name] ?? fila.roles?.[0]?.name ?? 'Sin rol'"
                :clase="store.colorPorRol(fila.roles?.[0]?.name)"
              />
            </td>

            <td class="p-4 align-middle">
              <span class="font-semibold text-sm" style="color: var(--text-general);">
                {{ contarKpisUsuario(fila.id) }}
              </span>
            </td>

            <td class="p-4 align-middle">
              <span class="text-xs" style="color: var(--subtext-general);">{{ fila.last_login ? fila.last_login.slice(0, 10) : '—' }}</span>
            </td>

          <!--apartado del estado -->
            <td class="p-4 align-middle">
              <StatusBadge :tipo="fila.status" />
            </td>

          </template>

          <template #iconos-acciones="{ item }">
            <BotonAccion v-if="can('users.update')"           variante="edit"  titulo="Editar Usuario"     @click="$router.push(`/organizacion/editar/${item.id}`)" />
            <BotonAccion v-if="can('org.manage_departments')" variante="stats" titulo="Ver KPIs Asignados" @click="abrirPanelKpis(item)" />
            <BotonAccion v-if="can('users.destroy')"          variante="trash" titulo="Eliminar Usuario"   @click="confirmarEliminacion(item)" />
          </template>
        </plantillatabla>

        <!-- Paginación -->
        <div v-if="totalPaginas > 1" class="flex items-center justify-center gap-1 mt-4">
          <button @click="paginaActual--" :disabled="paginaActual === 1"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            :style="paginaActual === 1 ? 'opacity:0.35; cursor:not-allowed;' : 'cursor:pointer;'"
            style="background: var(--card-bg); border: 1px solid var(--tabla-borde); color: var(--text-general);">←</button>

          <button v-if="paginasVisibles[0] > 1" @click="paginaActual = 1"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold"
            style="background: var(--card-bg); border: 1px solid var(--tabla-borde); color: var(--text-general);">1</button>
          <span v-if="paginasVisibles[0] > 2" class="text-xs px-1" style="color: var(--subtext-general);">…</span>

          <button v-for="p in paginasVisibles" :key="p" @click="paginaActual = p"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            :style="p === paginaActual
              ? 'background: var(--sidebar-active-bg); color: var(--sidebar-active-text); border: 1px solid var(--sidebar-active-bg);'
              : 'background: var(--card-bg); border: 1px solid var(--tabla-borde); color: var(--text-general);'">{{ p }}</button>

          <span v-if="paginasVisibles[paginasVisibles.length-1] < totalPaginas - 1" class="text-xs px-1" style="color: var(--subtext-general);">…</span>
          <button v-if="paginasVisibles[paginasVisibles.length-1] < totalPaginas" @click="paginaActual = totalPaginas"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold"
            style="background: var(--card-bg); border: 1px solid var(--tabla-borde); color: var(--text-general);">{{ totalPaginas }}</button>

          <button @click="paginaActual++" :disabled="paginaActual === totalPaginas"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            :style="paginaActual === totalPaginas ? 'opacity:0.35; cursor:not-allowed;' : 'cursor:pointer;'"
            style="background: var(--card-bg); border: 1px solid var(--tabla-borde); color: var(--text-general);">→</button>
        </div>
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

            <div v-if="cargandoKpis" class="text-center py-8 text-xs" style="color: var(--subtext-general);">
              Cargando...
            </div>

            <template v-else>
              <div v-for="kpi in kpisDelUsuario" :key="kpi.id"
                class="flex items-center justify-between p-3 rounded-xl"
                style="border: 1px solid var(--tabla-borde); background: var(--tabla-hover);">
                <div class="flex items-center gap-2.5">
                  <i class="fi fi-sr-stats text-base" style="color: var(--subtext-general);"></i>
                  <div>
                    <div class="text-xs font-bold" style="color: var(--text-general);">{{ kpi.nombre }}</div>
                    <div class="text-[10px]" style="color: var(--subtext-general);">Meta: {{ kpi.meta }}</div>
                  </div>
                </div>
                <div v-if="kpi.valor !== null" class="text-xs font-bold flex-shrink-0" style="color: var(--text-general);">
                  {{ kpi.valor }} {{ kpi.unit }}
                </div>
              </div>

              <div v-if="kpisDelUsuario.length === 0"
                class="text-center py-8 text-xs rounded-xl"
                style="color: var(--subtext-general); border: 1px dashed var(--tabla-borde);">
                Este usuario no tiene KPIs asignados.
              </div>
            </template>
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