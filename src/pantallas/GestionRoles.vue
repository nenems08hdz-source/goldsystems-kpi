<script setup>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import api from '../services/api'
import EncabezadoPantalla from '../components/EncabezadoPantalla.vue'
import AppButton          from '../components/ui/AppButton.vue'

const { proxy } = getCurrentInstance()

const roles             = ref([])
const rolSeleccionado   = ref(null)
const permisosPorModulo = ref({})
const guardando         = ref(false)
const cargando          = ref(false)

// ── Nombres legibles ───────────────────────────────────────────────────────

const nombreRol = {
  'developer':   'Developer',
  'admin':       'Administrador',
  'manager':     'Gerente',
  'team_leader': 'Líder de Equipo',
  'employee':    'Empleado',
  'auditor':     'Auditor',
}

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
  'dashboard-widgets': 'Widgets del Dashboard',
  'notifications':     'Notificaciones',
  'audit-logs':        'Auditoría (logs)',
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

// ── Separación de permisos ─────────────────────────────────────────────────
// Los permisos CRUD siempre terminan en .index .store .update .destroy
// Todo lo demás es "visibilidad" (controla la interfaz, no el servidor)

const accionesCRUD = ['index', 'store', 'update', 'destroy']

function esCRUD(nombre) {
  return accionesCRUD.some(a => nombre.endsWith('.' + a))
}

const permisosCRUD = computed(() => {
  const resultado = {}
  for (const [modulo, permisos] of Object.entries(permisosPorModulo.value)) {
    const crud = permisos.filter(p => esCRUD(p.name))
    if (crud.length > 0) resultado[modulo] = crud
  }
  return resultado
})

const permisosVisibilidad = computed(() => {
  const resultado = {}
  for (const [modulo, permisos] of Object.entries(permisosPorModulo.value)) {
    const visib = permisos.filter(p => !esCRUD(p.name))
    if (visib.length > 0) resultado[modulo] = visib
  }
  return resultado
})

const hayVisibilidad = computed(() => Object.keys(permisosVisibilidad.value).length > 0)

// ── Acciones ───────────────────────────────────────────────────────────────

onMounted(async () => {
  const res = await api.get('/roles')
  roles.value = res.data
})

async function seleccionarRol(rol) {
  rolSeleccionado.value = rol
  cargando.value = true
  permisosPorModulo.value = {}
  try {
    const res = await api.get(`/roles/${rol.id}/permissions`)
    permisosPorModulo.value = res.data.permissions
  } catch {
    proxy.$notify.error('Error al cargar permisos', 'Error')
  } finally {
    cargando.value = false
  }
}

function moduloCRUDCompleto(modulo) {
  return permisosCRUD.value[modulo]?.every(p => p.assigned) ?? false
}

function toggleModuloCRUD(modulo) {
  const todos = moduloCRUDCompleto(modulo)
  permisosCRUD.value[modulo].forEach(p => p.assigned = !todos)
}

function buscarPermiso(modulo, accion) {
  return permisosCRUD.value[modulo]?.find(p => p.name.endsWith('.' + accion))
}

async function guardar() {
  if (!rolSeleccionado.value) return
  guardando.value = true

  const seleccionados = Object.values(permisosPorModulo.value)
    .flat()
    .filter(p => p.assigned)
    .map(p => p.name)

  try {
    await api.put(`/roles/${rolSeleccionado.value.id}/permissions`, {
      permissions: seleccionados,
    })
    proxy.$notify.success('Permisos actualizados correctamente', 'Éxito')
  } catch {
    proxy.$notify.error('Error al guardar permisos', 'Error')
  } finally {
    guardando.value = false
  }
}
</script>

<template>
  <div class="p-3 min-h-screen">

    <div class="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
      <EncabezadoPantalla
        titulo="Gestión de Roles y Permisos"
        descripcion="Configura qué puede hacer y qué puede ver cada rol dentro del sistema."
      />
      <AppButton variant="secondary" class="flex-shrink-0" @click="$router.push('/ControlOrganizacional')">
        ← Volver
      </AppButton>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">

      <!-- Lista de roles -->
      <div class="lg:col-span-3 rounded-xl border overflow-hidden self-start"
        style="background: var(--card-bg); border-color: rgba(190,174,216,0.5);">
        <div class="px-4 py-3 border-b" style="background: var(--tabla-header-bg); border-color: rgba(190,174,216,0.3);">
          <p class="text-xs font-black uppercase tracking-wider" style="color: var(--tabla-header-text);">Roles</p>
        </div>
        <div class="flex flex-col gap-1 p-2">
          <button
            v-for="rol in roles"
            :key="rol.id"
            @click="seleccionarRol(rol)"
            class="text-left px-4 py-3 rounded-lg transition-all text-sm font-medium"
            :style="rolSeleccionado?.id === rol.id
              ? 'background: var(--sidebar-active-bg); color: var(--sidebar-active-text);'
              : 'color: var(--text-general);'"
          >
            <div class="font-semibold">{{ nombreRol[rol.name] ?? rol.name }}</div>
            <div v-if="rol.description" class="text-[10px] mt-0.5 opacity-60">{{ rol.description }}</div>
          </button>
        </div>
      </div>

      <!-- Panel de permisos -->
      <div class="lg:col-span-9 flex flex-col gap-6">

        <div v-if="!rolSeleccionado"
          class="rounded-xl border flex items-center justify-center h-48"
          style="background: var(--card-bg); border-color: rgba(190,174,216,0.5); border-style: dashed;">
          <p class="text-sm" style="color: var(--subtext-general);">Selecciona un rol para ver sus permisos</p>
        </div>

        <div v-else-if="cargando"
          class="rounded-xl border flex items-center justify-center h-48"
          style="background: var(--card-bg); border-color: rgba(190,174,216,0.5);">
          <p class="text-sm" style="color: var(--subtext-general);">Cargando permisos...</p>
        </div>

        <template v-else>

          <!-- Encabezado con botón guardar -->
          <div class="flex items-center justify-between px-1">
            <div>
              <p class="text-sm font-bold" style="color: var(--text-general);">
                {{ nombreRol[rolSeleccionado.name] ?? rolSeleccionado.name }}
              </p>
              <p class="text-xs" style="color: var(--subtext-general);">
                Configura los permisos de acceso y visibilidad para este rol
              </p>
            </div>
            <AppButton @click="guardar" :disabled="guardando">
              {{ guardando ? 'Guardando...' : 'Guardar Permisos' }}
            </AppButton>
          </div>

          <!-- ═══════════════════════════════════════════════════ -->
          <!-- SECCIÓN 1: PERMISOS DE ACCESO (CRUD)               -->
          <!-- Controlan qué endpoints del servidor puede llamar  -->
          <!-- ═══════════════════════════════════════════════════ -->
          <div class="rounded-xl border overflow-hidden"
            style="background: var(--card-bg); border-color: rgba(190,174,216,0.5);">

            <div class="px-4 py-3 border-b flex items-center gap-2"
              style="background: var(--tabla-header-bg); border-color: rgba(190,174,216,0.3);">
              <i class="fi fi-sr-lock text-xs" style="color: var(--subtext-general);"></i>
              <div>
                <p class="text-xs font-black uppercase tracking-wider" style="color: var(--tabla-header-text);">
                  Permisos de Acceso
                </p>
                <p class="text-[10px] mt-0.5" style="color: var(--subtext-general);">
                  Controlan qué operaciones puede realizar el rol en el servidor (API)
                </p>
              </div>
            </div>

            <div class="flex items-center px-4 py-2 text-[10px] font-black uppercase tracking-wider border-b"
              style="color: var(--tabla-header-text); border-color: rgba(190,174,216,0.2); opacity: 0.8;">
              <div class="flex-1">Módulo</div>
              <div class="w-14 text-center">Todo</div>
              <div class="w-14 text-center" v-for="accion in accionesCRUD" :key="accion">
                {{ nombreAccion[accion] }}
              </div>
            </div>

            <div
              v-for="(permisos, modulo) in permisosCRUD"
              :key="modulo"
              class="flex items-center px-4 py-3 border-b"
              style="border-color: rgba(190,174,216,0.12);"
            >
              <div class="flex-1 text-xs font-semibold" style="color: var(--text-general);">
                {{ nombreModuloCRUD[modulo] ?? modulo }}
              </div>
              <div class="w-14 flex justify-center">
                <input type="checkbox"
                  :checked="moduloCRUDCompleto(modulo)"
                  @change="toggleModuloCRUD(modulo)"
                  class="w-4 h-4 cursor-pointer accent-[#3f2a52]"
                />
              </div>
              <template v-for="accion in accionesCRUD" :key="accion">
                <div class="w-14 flex justify-center">
                  <template v-if="buscarPermiso(modulo, accion)">
                    <input type="checkbox"
                      v-model="buscarPermiso(modulo, accion).assigned"
                      class="w-4 h-4 cursor-pointer accent-[#3f2a52]"
                    />
                  </template>
                  <span v-else class="text-[10px]" style="color: var(--subtext-general);">—</span>
                </div>
              </template>
            </div>
          </div>

          <!-- ═══════════════════════════════════════════════════ -->
          <!-- SECCIÓN 2: PERMISOS DE VISIBILIDAD                 -->
          <!-- Controlan qué secciones/botones aparecen en la UI  -->
          <!-- ═══════════════════════════════════════════════════ -->
          <div v-if="hayVisibilidad" class="rounded-xl border overflow-hidden"
            style="background: var(--card-bg); border-color: rgba(190,174,216,0.5);">

            <div class="px-4 py-3 border-b flex items-center gap-2"
              style="background: var(--tabla-header-bg); border-color: rgba(190,174,216,0.3);">
              <i class="fi fi-sr-eye text-xs" style="color: var(--subtext-general);"></i>
              <div>
                <p class="text-xs font-black uppercase tracking-wider" style="color: var(--tabla-header-text);">
                  Permisos de Visibilidad
                </p>
                <p class="text-[10px] mt-0.5" style="color: var(--subtext-general);">
                  Controlan qué secciones, botones o columnas puede ver el rol en la aplicación
                </p>
              </div>
            </div>

            <div
              v-for="(permisos, modulo) in permisosVisibilidad"
              :key="modulo"
              class="border-b last:border-0"
              style="border-color: rgba(190,174,216,0.15);"
            >
              <!-- Nombre del grupo -->
              <div class="px-4 py-2" style="background: rgba(190,174,216,0.06);">
                <p class="text-[10px] font-black uppercase tracking-wider" style="color: var(--subtext-general);">
                  {{ nombreModuloVisibilidad[modulo] ?? modulo }}
                </p>
              </div>

              <!-- Lista de permisos del grupo -->
              <div class="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-1">
                <label
                  v-for="permiso in permisos"
                  :key="permiso.name"
                  class="flex items-start gap-3 py-2 px-3 cursor-pointer rounded-lg transition-colors"
                  :style="permiso.assigned ? 'background: rgba(63,42,82,0.08);' : ''"
                >
                  <input
                    type="checkbox"
                    v-model="permiso.assigned"
                    class="mt-0.5 w-4 h-4 cursor-pointer accent-[#3f2a52] flex-shrink-0"
                  />
                  <div>
                    <p class="text-xs font-semibold" style="color: var(--text-general);">
                      {{ permiso.description ?? permiso.name }}
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

        </template>
      </div>
    </div>
  </div>
</template>
