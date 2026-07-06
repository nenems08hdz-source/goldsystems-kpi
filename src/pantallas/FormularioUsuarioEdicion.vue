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

const nombreAccion = {
  'index':   'Ver',
  'store':   'Crear',
  'update':  'Editar',
  'destroy': 'Eliminar',
}

const modulosOrdenados = computed(() => Object.keys(permisosPorModulo.value))

function moduloCompleto(modulo) {
  return permisosPorModulo.value[modulo]?.every(p => p.from_role || p.direct) ?? false
}

function toggleModulo(modulo) {
  const todos = moduloCompleto(modulo)
  permisosPorModulo.value[modulo].forEach(p => {
    if (!p.from_role) p.direct = !todos
  })
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
        class="w-full max-w-5xl rounded-xl shadow-md border overflow-hidden"
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
      <div v-else-if="tabActivo === 'permisos'" class="w-full max-w-5xl">

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

          <div class="rounded-xl border overflow-hidden"
            style="background: var(--card-bg); border-color: rgba(190,174,216,0.5);">

            <!-- Encabezado -->
            <div class="flex items-center px-4 py-2 text-[10px] font-black uppercase tracking-wider border-b"
              style="background: var(--tabla-header-bg); color: var(--tabla-header-text); border-color: rgba(190,174,216,0.3);">
              <div class="flex-1">Módulo</div>
              <div class="w-14 text-center">Todo</div>
              <div class="w-14 text-center" v-for="a in ['index','store','update','destroy']" :key="a">
                {{ nombreAccion[a] }}
              </div>
            </div>

            <!-- Filas -->
            <div
              v-for="modulo in modulosOrdenados"
              :key="modulo"
              class="flex items-center px-4 py-3 border-b"
              style="border-color: rgba(190,174,216,0.15);"
            >
              <div class="flex-1 text-xs font-semibold" style="color: var(--text-general);">
                {{ nombreModulo[modulo] ?? modulo }}
              </div>

              <div class="w-14 flex justify-center">
                <input
                  type="checkbox"
                  :checked="moduloCompleto(modulo)"
                  @change="toggleModulo(modulo)"
                  class="w-4 h-4 cursor-pointer accent-[#3f2a52]"
                />
              </div>

              <template v-for="accion in ['index','store','update','destroy']" :key="accion">
                <div class="w-14 flex justify-center">
                  <template v-if="permisosPorModulo[modulo].find(p => p.name.endsWith('.' + accion))">
                    <input
                      type="checkbox"
                      :checked="permisosPorModulo[modulo].find(p => p.name.endsWith('.' + accion)).from_role
                             || permisosPorModulo[modulo].find(p => p.name.endsWith('.' + accion)).direct"
                      :disabled="permisosPorModulo[modulo].find(p => p.name.endsWith('.' + accion)).from_role"
                      @change="(e) => {
                        const p = permisosPorModulo[modulo].find(p => p.name.endsWith('.' + accion))
                        if (p && !p.from_role) p.direct = e.target.checked
                      }"
                      class="w-4 h-4 accent-[#3f2a52]"
                      :class="permisosPorModulo[modulo].find(p => p.name.endsWith('.' + accion)).from_role
                        ? 'opacity-40 cursor-not-allowed'
                        : 'cursor-pointer'"
                    />
                  </template>
                  <span v-else class="text-[10px]" style="color: var(--subtext-general);">—</span>
                </div>
              </template>
            </div>
          </div>
        </template>
      </div>

    </template>
  </div>
</template>
