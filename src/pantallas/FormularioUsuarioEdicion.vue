<script setup>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'
import { useOrgStore } from '../stores/orgStore'
import { usePermissions } from '../composables/usePermissions'
import EncabezadoPantalla from '@/components/EncabezadoPantalla.vue'
import AppButton          from '@/components/ui/AppButton.vue'
import AppInput           from '@/components/ui/AppInput.vue'
import AppSelect          from '@/components/ui/AppSelect.vue'
import FormField          from '@/components/ui/FormField.vue'
import FormContenedor from '@/components/ui/FormContenedor.vue'

const { can } = usePermissions()

const router = useRouter()
const route  = useRoute()
const store  = useOrgStore()
const { proxy } = getCurrentInstance()

const userId    = route.params.id
const cargando  = ref(true)
const tabActivo = ref('info')

// ── Tab Información ───────────────────────────────────────────────────────────
const usuario = ref({
  name:          '',
  paternal:      '',
  maternal:      '',
  email:         '',
  phone:         '',
  password:      '',
  role:          '',
  department_id: null,
  team_id:       null,
  status:        'active',
})

const departamentosDisponibles = computed(() =>
  store.departamentos.map(d => ({ value: d.id, label: d.name }))
)

const equiposDisponibles = computed(() => {
  if (!usuario.value.department_id) return []
  return store.equipos
    .filter(e => e.department_id === Number(usuario.value.department_id))
    .map(e => ({ value: e.id, label: e.name }))
})

const rolesAsignables = computed(() =>
  store.rolesDisponibles
    .filter(r => r.codigo !== 'developer')
    .map(r => ({ value: r.codigo, label: r.nombre }))
)

const opcionesEstado = [
  { value: 'active',   label: 'Activo'   },
  { value: 'inactive', label: 'Inactivo' },
]

// ── Tab Permisos ──────────────────────────────────────────────────────────────
const permisosPorModulo = ref({})
const cargandoPermisos  = ref(false)
const guardandoPermisos = ref(false)

// ── Estructura por pantalla ───────────────────────────────────────────────────
// crud: acciones disponibles en esa pantalla (Ver/Crear/Editar/Eliminar)
// accesoPermiso: el permiso "Ver" que desbloquea los extras
// extras: permisos de visibilidad dentro de la pantalla
const pantallas = [
  {
    nombre: 'Panel Principal',
    icono:  'fi-sr-apps',
    crud:   [],
    accesoPermiso: null,
    extras: ['dashboard.view_advanced'],
  },
  {
    nombre: 'Gestión de KPIs',
    icono:  'fi-sr-chart-histogram',
    crud: [
      { etiqueta: 'Ver',      nombre: 'kpis.index' },
      { etiqueta: 'Crear',    nombre: 'kpis.store' },
      { etiqueta: 'Editar',   nombre: 'kpis.update' },
      { etiqueta: 'Eliminar', nombre: 'kpis.destroy' },
    ],
    accesoPermiso: 'kpis.index',
    extras: ['kpis.view_all', 'kpis.view_targets', 'kpis.assign'],
  },
  {
    nombre: 'Captura de Métricas',
    icono:  'fi-sr-document-signed',
    crud: [
      { etiqueta: 'Ver',       nombre: 'kpi-records.index' },
      { etiqueta: 'Registrar', nombre: 'kpi-records.store' },
      { etiqueta: 'Editar',    nombre: 'kpi-records.update' },
      { etiqueta: 'Eliminar',  nombre: 'kpi-records.destroy' },
    ],
    accesoPermiso: 'kpi-records.index',
    extras: [],
  },
  {
    nombre: 'Auditoría',
    icono:  'fi-sr-shield-check',
    crud: [
      { etiqueta: 'Ver', nombre: 'audit-logs.index' },
    ],
    accesoPermiso: 'audit-logs.index',
    extras: ['audit.view_movements', 'audit.export'],
  },
  {
    nombre: 'Control Organizacional',
    icono:  'fi-sr-building',
    crud: [
      { etiqueta: 'Ver',      nombre: 'users.index' },
      { etiqueta: 'Crear',    nombre: 'users.store' },
      { etiqueta: 'Editar',   nombre: 'users.update' },
      { etiqueta: 'Eliminar', nombre: 'users.destroy' },
    ],
    accesoPermiso: 'users.index',
    extras: ['org.view_tree', 'org.view_users_table', 'org.manage_departments', 'org.manage_teams'],
  },
  {
    nombre: 'Roles y Permisos',
    icono:  'fi-sr-lock',
    crud: [
      { etiqueta: 'Ver', nombre: 'roles.index' },
    ],
    accesoPermiso: 'roles.index',
    extras: ['roles.manage'],
  },
  {
    nombre: 'Gestión de Empresas',
    icono:  'fi-sr-globe',
    crud: [
      { etiqueta: 'Ver',      nombre: 'companies.index' },
      { etiqueta: 'Crear',    nombre: 'companies.store' },
      { etiqueta: 'Editar',   nombre: 'companies.update' },
      { etiqueta: 'Eliminar', nombre: 'companies.destroy' },
    ],
    accesoPermiso: 'companies.index',
    extras: [],
  },
]

const etiquetaExtra = {
  'kpis.view_all':           'Ver todos los KPIs (no solo los asignados)',
  'kpis.view_targets':       'Ver metas y objetivos',
  'kpis.assign':             'Asignar KPIs a usuarios',
  'audit.view_movements':    'Ver movimientos detallados',
  'audit.export':            'Exportar datos de auditoría',
  'org.view_tree':           'Ver árbol organizacional',
  'org.view_users_table':    'Ver tabla de usuarios',
  'org.manage_departments':  'Gestionar departamentos',
  'org.manage_teams':        'Gestionar equipos',
  'roles.manage':            'Administrar roles del sistema',
  'dashboard.view_advanced': 'Vista avanzada del dashboard',
}

// Busca un permiso por nombre en el mapa plano de permisosPorModulo
function getPermiso(nombre) {
  for (const perms of Object.values(permisosPorModulo.value)) {
    const p = perms.find(p => p.name === nombre)
    if (p) return p
  }
  return null
}

// Todos los CRUD de la pantalla están marcados
function crudCompleto(pantalla) {
  if (!pantalla.crud.length) return false
  return pantalla.crud.every(c => {
    const p = getPermiso(c.nombre)
    return p && (p.from_role || p.direct)
  })
}

// Activa/desactiva todos los CRUD de la pantalla
function toggleCrud(pantalla) {
  const todos = crudCompleto(pantalla)
  pantalla.crud.forEach(c => {
    const p = getPermiso(c.nombre)
    if (p && !p.from_role) p.direct = !todos
  })
}

// Los extras se habilitan si "Ver" está activo (del rol o directo)
function extrasHabilitados(pantalla) {
  if (!pantalla.accesoPermiso) return true
  const p = getPermiso(pantalla.accesoPermiso)
  return p && (p.from_role || p.direct)
}

async function cargarPermisos() {
  cargandoPermisos.value = true
  try {
    const res = await api.get(`/users/${userId}/permissions`)
    permisosPorModulo.value = res.data.permissions
  } catch {
    proxy.$notify.error('Error al cargar permisos', 'Error')
  } finally {
    cargandoPermisos.value = false
  }
}

async function guardarPermisos() {
  guardandoPermisos.value = true
  const seleccionados = Object.values(permisosPorModulo.value)
    .flat()
    .filter(p => p.direct && !p.from_role)
    .map(p => p.name)

  try {
    await api.put(`/users/${userId}/permissions`, { permissions: seleccionados })
    proxy.$notify.success('Permisos actualizados correctamente', 'Éxito')
  } catch {
    proxy.$notify.error('Error al guardar permisos', 'Error')
  } finally {
    guardandoPermisos.value = false
  }
}

function cambiarTab(tab) {
  tabActivo.value = tab
  if (tab === 'permisos' && Object.keys(permisosPorModulo.value).length === 0) {
    cargarPermisos()
  }
}

// ── Carga inicial ─────────────────────────────────────────────────────────────
onMounted(async () => {
  try {
    await store.cargarTodo()
    const res = await api.get(`/users/${userId}`)
    const u   = res.data
    usuario.value = {
      name:          u.name          ?? '',
      paternal:      u.paternal      ?? '',
      maternal:      u.maternal      ?? '',
      email:         u.email         ?? '',
      phone:         u.phone         ?? '',
      password:      '',
      role:          u.roles?.[0]?.name ?? '',
      department_id: u.department_id ?? null,
      team_id:       u.team_id       ?? null,
      status:        u.status        ?? 'active',
    }
  } catch {
    proxy.$notify.error('No se pudo cargar el usuario', 'Error')
    router.push('/ControlOrganizacional')
  } finally {
    cargando.value = false
  }
})

async function guardar() {
  try {
    const payload = {
      name:          usuario.value.name,
      paternal:      usuario.value.paternal,
      maternal:      usuario.value.maternal || null,
      email:         usuario.value.email,
      phone:         usuario.value.phone    || null,
      department_id: usuario.value.department_id || null,
      team_id:       usuario.value.team_id       || null,
      status:        usuario.value.status,
      role:          usuario.value.role          || null,
    }
    if (usuario.value.password) payload.password = usuario.value.password

    await api.put(`/users/${userId}`, payload)
    proxy.$notify.success('Usuario actualizado correctamente', 'Éxito')
    router.push('/ControlOrganizacional')
  } catch {
    proxy.$notify.error('Error al actualizar el usuario', 'Error')
  }
}
</script>

<template>
  <div class="p-6 min-h-screen">

    <div class="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
      <EncabezadoPantalla
        titulo="Editar Colaborador"
        descripcion="Modifica la información del colaborador y su acceso al sistema."
      />
      <AppButton variant="secondary" class="flex-shrink-0" @click="router.push('/ControlOrganizacional')">
        ← Volver
      </AppButton>
    </div>

    <div v-if="cargando" class="text-sm" style="color: var(--subtext-general);">Cargando...</div>

    <template v-else>
      <FormContenedor>

      <!-- Tabs -->
      <div class="flex gap-1 mb-6 p-1 rounded-xl w-fit"
        style="background: var(--tabla-header-bg); border: 1px solid rgba(190,174,216,0.3);">
        <button
          @click="cambiarTab('info')"
          class="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
          :style="tabActivo === 'info'
            ? 'background: var(--sidebar-active-bg); color: var(--sidebar-active-text);'
            : 'color: var(--subtext-general);'"
        >
          Información
        </button>
        <button
          v-if="can('users.update')"
          @click="cambiarTab('permisos')"
          class="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
          :style="tabActivo === 'permisos'
            ? 'background: var(--sidebar-active-bg); color: var(--sidebar-active-text);'
            : 'color: var(--subtext-general);'"
        >
          Permisos
        </button>
      </div>

      <!-- ── Tab: Información ── -->
      <form
        v-if="tabActivo === 'info'"
        @submit.prevent="guardar"
        class="w-full rounded-xl shadow-md border overflow-hidden"
        style="background: var(--card-bg); border-color: rgba(190,174,216,0.9);"
      >
        <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">

          <FormField label="Nombre" required>
            <AppInput v-model="usuario.name" placeholder="Ej. Juan" required />
          </FormField>

          <FormField label="Apellido Paterno" required>
            <AppInput v-model="usuario.paternal" placeholder="Ej. Pérez" required />
          </FormField>

          <FormField label="Apellido Materno" hint="opcional">
            <AppInput v-model="usuario.maternal" placeholder="Ej. García" />
          </FormField>

          <FormField label="Correo Corporativo" required>
            <AppInput v-model="usuario.email" type="email" placeholder="juan@empresa.com" required />
          </FormField>

          <FormField label="Teléfono" hint="opcional">
            <AppInput v-model="usuario.phone" type="tel" placeholder="+52 999 000 0000" autocomplete="off" />
          </FormField>

          <FormField label="Nueva Contraseña" hint="dejar vacío para no cambiar">
            <AppInput v-model="usuario.password" type="password" placeholder="Solo si deseas cambiarla" autocomplete="new-password" />
          </FormField>

          <FormField label="Rol">
            <AppSelect v-model="usuario.role" :options="rolesAsignables" placeholder="Sin rol" />
          </FormField>

          <FormField label="Estado">
            <AppSelect v-model="usuario.status" :options="opcionesEstado" />
          </FormField>

          <FormField label="Departamento">
            <AppSelect
              v-model="usuario.department_id"
              :options="[{ value: null, label: 'Sin departamento' }, ...departamentosDisponibles]"
              placeholder="Sin departamento"
              @change="usuario.team_id = null"
            />
          </FormField>

          <FormField label="Equipo">
            <AppSelect
              v-model="usuario.team_id"
              :options="[{ value: null, label: 'Sin equipo' }, ...equiposDisponibles]"
              :placeholder="usuario.department_id ? 'Sin equipo' : 'Selecciona departamento primero'"
              :disabled="!usuario.department_id"
            />
          </FormField>

        </div>

        <div
          class="px-8 py-6 border-t flex justify-end gap-3"
          style="background: var(--tabla-header-bg); border-color: rgba(190,174,216,0.2);"
        >
          <AppButton variant="secondary" type="button" @click="router.push('/ControlOrganizacional')">
            Cancelar
          </AppButton>
          <AppButton type="submit">Guardar Cambios</AppButton>
        </div>
      </form>

      <!-- ── Tab: Permisos ── -->
      <div v-else-if="tabActivo === 'permisos'" class="w-full">

        <div v-if="cargandoPermisos"
          class="rounded-xl border flex items-center justify-center h-48"
          style="background: var(--card-bg); border-color: rgba(190,174,216,0.5);">
          <p class="text-sm" style="color: var(--subtext-general);">Cargando permisos...</p>
        </div>

        <template v-else>

          <!-- Leyenda + botón guardar -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 px-1">
            <div class="flex items-center gap-4 text-xs" style="color: var(--subtext-general);">
              <span class="flex items-center gap-1.5">
                <span class="inline-block w-3 h-3 rounded opacity-35" style="background: var(--sidebar-active-bg);"></span>
                Viene del rol (no editable)
              </span>
              <span class="flex items-center gap-1.5">
                <span class="inline-block w-3 h-3 rounded" style="background: var(--sidebar-active-bg);"></span>
                Permiso extra directo
              </span>
            </div>
            <AppButton @click="guardarPermisos" :disabled="guardandoPermisos">
              {{ guardandoPermisos ? 'Guardando...' : 'Guardar Permisos' }}
            </AppButton>
          </div>

          <!-- Tarjetas por pantalla -->
          <div class="grid grid-cols-1 gap-4">
            <div v-for="pantalla in pantallas" :key="pantalla.nombre"
              class="rounded-xl border overflow-hidden"
              style="background: var(--card-bg); border-color: rgba(190,174,216,0.4);">

              <!-- Encabezado -->
              <div class="px-4 py-3 flex items-center gap-2 border-b"
                style="background: var(--tabla-header-bg); border-color: rgba(190,174,216,0.3);">
                <i :class="['fi', pantalla.icono, 'text-sm']" style="color: var(--subtext-general);"></i>
                <p class="text-xs font-black uppercase tracking-wider" style="color: var(--tabla-header-text);">
                  {{ pantalla.nombre }}
                </p>
              </div>

              <div class="px-4 py-3 flex flex-col gap-3">

                <!-- ── Tabla CRUD ── -->
                <template v-if="pantalla.crud.length">
                  <!-- Cabecera de columnas -->
                  <div class="flex items-center gap-2">
                    <div class="flex-1 text-[10px] font-black uppercase tracking-wider" style="color: var(--subtext-general);">Acción</div>
                    <!-- "Todo" solo si hay algún permiso editable -->
                    <div v-if="pantalla.crud.some(c => { const p = getPermiso(c.nombre); return p && !p.from_role })"
                      class="w-14 text-center text-[10px] font-black uppercase tracking-wider"
                      style="color: var(--subtext-general);">Todo</div>
                    <div v-for="c in pantalla.crud" :key="c.nombre"
                      class="w-16 text-center text-[10px] font-black uppercase tracking-wider"
                      style="color: var(--subtext-general);">{{ c.etiqueta }}</div>
                  </div>

                  <!-- Fila única de checkboxes -->
                  <div class="flex items-center gap-2 py-2 px-3 rounded-lg"
                    style="background: rgba(190,174,216,0.06);">
                    <div class="flex-1 text-xs font-semibold" style="color: var(--text-general);">{{ pantalla.nombre }}</div>
                    <!-- Toggle todo -->
                    <div v-if="pantalla.crud.some(c => { const p = getPermiso(c.nombre); return p && !p.from_role })"
                      class="w-14 flex justify-center">
                      <input type="checkbox"
                        :checked="crudCompleto(pantalla)"
                        @change="toggleCrud(pantalla)"
                        class="w-4 h-4 cursor-pointer accent-[#3f2a52]"
                      />
                    </div>
                    <!-- Cada acción -->
                    <div v-for="c in pantalla.crud" :key="c.nombre" class="w-16 flex justify-center">
                      <template v-if="getPermiso(c.nombre)">
                        <input type="checkbox"
                          :checked="getPermiso(c.nombre).from_role || getPermiso(c.nombre).direct"
                          :disabled="getPermiso(c.nombre).from_role"
                          @change="(e) => { const p = getPermiso(c.nombre); if (p && !p.from_role) p.direct = e.target.checked }"
                          class="w-4 h-4 accent-[#3f2a52]"
                          :class="getPermiso(c.nombre).from_role ? 'opacity-35 cursor-not-allowed' : 'cursor-pointer'"
                          :title="getPermiso(c.nombre).from_role ? 'Viene del rol' : ''"
                        />
                      </template>
                      <span v-else class="text-[10px]" style="color: var(--subtext-general);">—</span>
                    </div>
                  </div>
                </template>
                <p v-else class="text-xs py-1" style="color: var(--subtext-general);">
                  Accesible para todos los usuarios autenticados.
                </p>

                <!-- ── Funciones extra ── -->
                <template v-if="pantalla.extras.length && pantalla.extras.some(n => getPermiso(n))">
                  <div class="border-t pt-3" style="border-color: rgba(190,174,216,0.2);">
                    <div class="flex items-center gap-2 mb-2">
                      <p class="text-[10px] font-black uppercase tracking-wider" style="color: var(--subtext-general);">
                        Funciones extra
                      </p>
                      <span v-if="!extrasHabilitados(pantalla)"
                        class="text-[10px] px-2 py-0.5 rounded-full"
                        style="background: rgba(190,174,216,0.15); color: var(--subtext-general);">
                        Requiere "Ver" activo
                      </span>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-1"
                      :class="{ 'opacity-40 pointer-events-none': !extrasHabilitados(pantalla) }">
                      <template v-for="nombre in pantalla.extras" :key="nombre">
                        <template v-if="getPermiso(nombre)">
                          <label
                            class="flex items-center gap-2.5 py-2 px-3 rounded-lg transition-colors cursor-pointer"
                            :style="(getPermiso(nombre).from_role || getPermiso(nombre).direct) ? 'background: rgba(63,42,82,0.07);' : ''">
                            <input type="checkbox"
                              :checked="getPermiso(nombre).from_role || getPermiso(nombre).direct"
                              :disabled="getPermiso(nombre).from_role"
                              @change="(e) => { const p = getPermiso(nombre); if (p && !p.from_role) p.direct = e.target.checked }"
                              class="w-4 h-4 flex-shrink-0 accent-[#3f2a52]"
                              :class="getPermiso(nombre).from_role ? 'opacity-35 cursor-not-allowed' : 'cursor-pointer'"
                            />
                            <div>
                              <p class="text-xs font-medium leading-tight" style="color: var(--text-general);">
                                {{ etiquetaExtra[nombre] ?? nombre }}
                              </p>
                              <p v-if="getPermiso(nombre).from_role" class="text-[10px]" style="color: var(--subtext-general);">
                                Viene del rol
                              </p>
                            </div>
                          </label>
                        </template>
                      </template>
                    </div>
                  </div>
                </template>

              </div>
            </div>
          </div>

        </template>
      </div>


      </FormContenedor>
    </template>
  </div>
</template>
