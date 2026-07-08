<script setup>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'
import { useOrgStore } from '../stores/orgStore'
import EncabezadoPantalla from '@/components/EncabezadoPantalla.vue'
import AppButton          from '@/components/ui/AppButton.vue'
import AppInput           from '@/components/ui/AppInput.vue'
import AppSelect          from '@/components/ui/AppSelect.vue'
import FormField          from '@/components/ui/FormField.vue'
import FormContenedor from '@/components/ui/FormContenedor.vue'

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

const nombreModuloCRUD = {
  'companies':         'Empresas',
  'users':             'Usuarios',
  'departments':       'Departamentos',
  'teams':             'Equipos',
  'roles':             'Roles',
  'permissions':       'Permisos',
  'kpis':              'KPIs',
  'kpi-assignments':   'Asignaciones KPI',
  'kpi-records':       'Registros KPI',
  'kpi-results':       'Resultados KPI',
  'dashboards':        'Dashboards',
  'dashboard-widgets': 'Widgets',
  'notifications':     'Notificaciones',
  'audit-logs':        'Auditoría',
}

const nombreModuloVisibilidad = {
  'org':       'Control Organizacional',
  'roles':     'Roles y Permisos',
  'kpis':      'KPIs',
  'audit':     'Auditoría',
  'dashboard': 'Dashboard',
}

const nombreAccion = {
  'index':   'Ver',
  'store':   'Crear',
  'update':  'Editar',
  'destroy': 'Eliminar',
}

const accionesCRUD = ['index', 'store', 'update', 'destroy']
function esCRUD(nombre) {
  return accionesCRUD.some(a => nombre.endsWith('.' + a))
}

// Permisos CRUD agrupados por módulo
const permisosCRUD = computed(() => {
  const r = {}
  for (const [mod, perms] of Object.entries(permisosPorModulo.value)) {
    const crud = perms.filter(p => esCRUD(p.name))
    if (crud.length) r[mod] = crud
  }
  return r
})

// Permisos de visibilidad agrupados por módulo
const permisosVisibilidad = computed(() => {
  const r = {}
  for (const [mod, perms] of Object.entries(permisosPorModulo.value)) {
    const vis = perms.filter(p => !esCRUD(p.name))
    if (vis.length) r[mod] = vis
  }
  return r
})

const hayVisibilidad = computed(() => Object.keys(permisosVisibilidad.value).length > 0)

function moduloCompleto(modulo) {
  return permisosCRUD.value[modulo]?.every(p => p.from_role || p.direct) ?? false
}

function toggleModulo(modulo) {
  const todos = moduloCompleto(modulo)
  permisosCRUD.value[modulo].forEach(p => {
    if (!p.from_role) p.direct = !todos
  })
}

function buscarPermiso(modulo, accion) {
  return permisosCRUD.value[modulo]?.find(p => p.name.endsWith('.' + accion))
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

          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 px-1">
            <div class="flex items-center gap-4 text-xs" style="color: var(--subtext-general);">
              <span class="flex items-center gap-1.5">
                <span class="inline-block w-3 h-3 rounded opacity-40" style="background: var(--sidebar-active-bg);"></span>
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

          <!-- ═══════════════════════════════════════════════ -->
          <!-- SECCIÓN 1: PERMISOS DE ACCESO (CRUD)         -->
          <!-- ═══════════════════════════════════════════════ -->
          <div class="rounded-xl border overflow-hidden mb-6"
            style="background: var(--card-bg); border-color: rgba(190,174,216,0.5);">

            <div class="px-4 py-3 border-b flex items-center gap-2"
              style="background: var(--tabla-header-bg); border-color: rgba(190,174,216,0.3);">
              <i class="fi fi-sr-lock text-xs" style="color: var(--subtext-general);"></i>
              <div>
                <p class="text-xs font-black uppercase tracking-wider" style="color: var(--tabla-header-text);">Permisos de Acceso</p>
                <p class="text-[10px] mt-0.5" style="color: var(--subtext-general);">Los sombreados vienen del rol y no se pueden quitar</p>
              </div>
            </div>

            <div class="flex items-center px-4 py-2 text-[10px] font-black uppercase tracking-wider border-b"
              style="color: var(--tabla-header-text); border-color: rgba(190,174,216,0.2); opacity:0.8;">
              <div class="flex-1">Módulo</div>
              <div class="w-14 text-center">Todo</div>
              <div class="w-14 text-center" v-for="a in accionesCRUD" :key="a">{{ nombreAccion[a] }}</div>
            </div>

            <div v-for="(permisos, modulo) in permisosCRUD" :key="modulo"
              class="flex items-center px-4 py-3 border-b"
              style="border-color: rgba(190,174,216,0.12);">
              <div class="flex-1 text-xs font-semibold" style="color: var(--text-general);">
                {{ nombreModuloCRUD[modulo] ?? modulo }}
              </div>
              <div class="w-14 flex justify-center">
                <input type="checkbox" :checked="moduloCompleto(modulo)"
                  @change="toggleModulo(modulo)" class="w-4 h-4 cursor-pointer accent-[#3f2a52]" />
              </div>
              <template v-for="accion in accionesCRUD" :key="accion">
                <div class="w-14 flex justify-center">
                  <template v-if="buscarPermiso(modulo, accion)">
                    <input type="checkbox"
                      :checked="buscarPermiso(modulo, accion).from_role || buscarPermiso(modulo, accion).direct"
                      :disabled="buscarPermiso(modulo, accion).from_role"
                      @change="(e) => { const p = buscarPermiso(modulo, accion); if (p && !p.from_role) p.direct = e.target.checked }"
                      class="w-4 h-4 accent-[#3f2a52]"
                      :class="buscarPermiso(modulo, accion).from_role ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'"
                    />
                  </template>
                  <span v-else class="text-[10px]" style="color: var(--subtext-general);">—</span>
                </div>
              </template>
            </div>
          </div>

          <!-- ═══════════════════════════════════════════════ -->
          <!-- SECCIÓN 2: PERMISOS DE VISIBILIDAD             -->
          <!-- ═══════════════════════════════════════════════ -->
          <div v-if="hayVisibilidad" class="rounded-xl border overflow-hidden"
            style="background: var(--card-bg); border-color: rgba(190,174,216,0.5);">

            <div class="px-4 py-3 border-b flex items-center gap-2"
              style="background: var(--tabla-header-bg); border-color: rgba(190,174,216,0.3);">
              <i class="fi fi-sr-eye text-xs" style="color: var(--subtext-general);"></i>
              <div>
                <p class="text-xs font-black uppercase tracking-wider" style="color: var(--tabla-header-text);">Permisos de Visibilidad</p>
                <p class="text-[10px] mt-0.5" style="color: var(--subtext-general);">Permisos extras para este usuario independientes de su rol</p>
              </div>
            </div>

            <div v-for="(permisos, modulo) in permisosVisibilidad" :key="modulo"
              class="border-b last:border-0" style="border-color: rgba(190,174,216,0.15);">
              <div class="px-4 py-2" style="background: rgba(190,174,216,0.06);">
                <p class="text-[10px] font-black uppercase tracking-wider" style="color: var(--subtext-general);">
                  {{ nombreModuloVisibilidad[modulo] ?? modulo }}
                </p>
              </div>
              <div class="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-1">
                <label v-for="permiso in permisos" :key="permiso.name"
                  class="flex items-start gap-3 py-2 px-3 rounded-lg transition-colors"
                  :class="permiso.from_role || permiso.direct ? 'cursor-default' : 'cursor-pointer'"
                  :style="(permiso.from_role || permiso.direct) ? 'background: rgba(63,42,82,0.08);' : ''">
                  <input type="checkbox"
                    :checked="permiso.from_role || permiso.direct"
                    :disabled="permiso.from_role"
                    @change="(e) => { if (!permiso.from_role) permiso.direct = e.target.checked }"
                    class="mt-0.5 w-4 h-4 accent-[#3f2a52] flex-shrink-0"
                    :class="permiso.from_role ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'"
                  />
                  <div>
                    <p class="text-xs font-semibold" style="color: var(--text-general);">
                      {{ permiso.description ?? permiso.name }}
                    </p>
                    <p v-if="permiso.from_role" class="text-[10px] mt-0.5" style="color: var(--subtext-general);">
                      Viene del rol
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

        </template>
      </div>


      </FormContenedor>
    </template>
  </div>
</template>
