<script setup>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import EncabezadoPantalla from '../components/EncabezadoPantalla.vue'
import AppButton          from '../components/ui/AppButton.vue'

const { proxy } = getCurrentInstance()
const router = useRouter()

const roles            = ref([])
const rolSeleccionado  = ref(null)
const permisosPorModulo = ref({})  
const guardando        = ref(false)
const cargando         = ref(false)

// Nombres legibles para cada rol
const nombreRol = {
  'developer':   'Developer',
  'admin':       'Administrador',
  'manager':     'Gerente',
  'team_leader': 'Líder de Equipo',
  'employee':    'Empleado',
  'auditor':     'Auditor',
}

// Nombres legibles para cada módulo
const nombreModulo = {
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

// Nombres legibles para cada acción
const nombreAccion = {
  'index':   'Ver',
  'store':   'Crear',
  'update':  'Editar',
  'destroy': 'Eliminar',
}

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

// Verifica si TODOS los permisos de un módulo están asignados
function moduloCompleto(modulo) {
  return permisosPorModulo.value[modulo]?.every(p => p.assigned) ?? false
}

// Activa/desactiva todos los permisos de un módulo
function toggleModulo(modulo) {
  const todos = moduloCompleto(modulo)
  permisosPorModulo.value[modulo].forEach(p => p.assigned = !todos)
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

const modulosOrdenados = computed(() => Object.keys(permisosPorModulo.value))
</script>

<template>
  <div class="p-3 min-h-screen">

    <div class="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
      <EncabezadoPantalla
        titulo="Gestión de Roles y Permisos"
        descripcion="Configura qué puede hacer cada rol dentro del sistema."
      />
      <AppButton variant="secondary" class="flex-shrink-0" @click="$router.push('/ControlOrganizacional')">
        ← Volver
      </AppButton>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">

      <!-- Lista de roles -->
      <div class="lg:col-span-3 rounded-xl border overflow-hidden"
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

      <!-- Permisos por módulo -->
      <div class="lg:col-span-9">

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
          <div class="flex items-center justify-between mb-4 px-1">
            <div>
              <p class="text-sm font-bold" style="color: var(--text-general);">{{ rolSeleccionado.name }}</p>
              <p class="text-xs" style="color: var(--subtext-general);">{{ modulosOrdenados.length }} módulos</p>
            </div>
            <AppButton @click="guardar" :disabled="guardando">
              {{ guardando ? 'Guardando...' : 'Guardar Permisos' }}
            </AppButton>
          </div>

          <div class="rounded-xl border overflow-hidden"
            style="background: var(--card-bg); border-color: rgba(190,174,216,0.5);">

            <!-- Encabezado columnas -->
            <div class="flex items-center px-4 py-2 text-[10px] font-black uppercase tracking-wider border-b"
              style="background: var(--tabla-header-bg); color: var(--tabla-header-text); border-color: rgba(190,174,216,0.3);">
              <div class="flex-1">Módulo</div>
              <div class="w-14 text-center">Todo</div>
              <div class="w-14 text-center" v-for="accion in ['index','store','update','destroy']" :key="accion">
                {{ nombreAccion[accion] }}
              </div>
            </div>

            <!-- Fila por módulo -->
            <div
              v-for="modulo in modulosOrdenados"
              :key="modulo"
              class="flex items-center px-4 py-3 border-b"
              style="border-color: rgba(190,174,216,0.15);"
            >
              <div class="flex-1 text-xs font-semibold" style="color: var(--text-general);">
                {{ nombreModulo[modulo] ?? modulo }}
              </div>

              <!-- Toggle todo el módulo -->
              <div class="w-14 flex justify-center">
                <input
                  type="checkbox"
                  :checked="moduloCompleto(modulo)"
                  @change="toggleModulo(modulo)"
                  class="w-4 h-4 cursor-pointer accent-[#3f2a52]"
                />
              </div>

              <!-- Checkbox por acción -->
              <template v-for="accion in ['index','store','update','destroy']" :key="accion">
                <div class="w-14 flex justify-center">
                  <template v-if="permisosPorModulo[modulo].find(p => p.name.endsWith('.' + accion))">
                    <input
                      type="checkbox"
                      v-model="permisosPorModulo[modulo].find(p => p.name.endsWith('.' + accion)).assigned"
                      class="w-4 h-4 cursor-pointer accent-[#3f2a52]"
                    />
                  </template>
                  <span v-else class="text-[10px]" style="color: var(--subtext-general);">—</span>
                </div>
              </template>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
